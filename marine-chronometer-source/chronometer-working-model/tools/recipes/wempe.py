"""The Wempe's recipes (from 29 October 2026; PLAN-recipes.md). Their numbers come from the page's own dims.js (WD) and escapement.js (WESC), run in Node
by wempe_load.js: a size frame.js drew as a literal beside its part is moved into dims.js (WD.FRAME, WD.RING, WD.CORK...) before a recipe reads it, the page's
meshes hashed before and after (recipes_pagehash.py) so the move changes nothing."""
import functools,json,math,pathlib,subprocess
import build123d as bd
from . import (Op,RadialDrill,Blank,TurnProfile,CutLeaves,Recipe,Setup,S,iso,page_matrix,Bar,Ring,TurnOD,TurnCone,TurnAway,FaceGroove,Bore,Countersink,ThreadOD,SlotHead,Plate,Hole,Cone,Pocket,InnerCone,Drill,Cut,Bought)
TOOLS=pathlib.Path(__file__).resolve().parents[1]

@functools.lru_cache()
def W():
    """WD and WESC.HOLES as the page has them (functions left out)"""
    js="const W=require(%r)();process.stdout.write(JSON.stringify({WD:W.WD,HOLES:W.WESC.HOLES,FAprof:W.WD.FA.prof(),BARprof:W.WD.BAR.prof()}))"%str(TOOLS/'wempe_load.js')
    return json.loads(subprocess.run(['node','-e',js],capture_output=True,text=True,check=True).stdout)

@functools.lru_cache()
def WT():
    """the train's arbors as train.js has them (A: each arbor's turned profile, its pinion and wheel) and each pinion's leaves' outline from its teeth()"""
    js=("const W=require(%r)({train:true}),A=W.WTRAIN.A,o={};for(const k of['cw','tw','sw']){const a=A[k],p=a.pin;"
        "const w=a.wheel;o[k]={at:a.at,ys:a.ys,prof:a.prof,pin:p,xy:W.WTRAIN.teeth(p.z,p.m,p.D,p.dg).xy,wheel:w,wxy:W.WTRAIN.teeth(w.z,w.m,w.D,w.dg,w.mate,w.l).xy};}"
        "const E=W.WESC.EARB,e=W.WESC.earProf();o.small=o.small||{};o.ewcol=e.col;o.ew={prof:e.ar,pin:{z:E.z,m:E.m,D:E.D,dg:E.dg,u0:e.yP0,u1:e.yP1},xy:W.WTRAIN.teeth(E.z,E.m,E.D,E.dg).xy};"
        "o.small=W.WTRAIN.smallProfs();o.staff=W.WESC.staffProf();o.ewg=W.WESC.ewGeo(true);o.Y=W.WESC.Y;process.stdout.write(JSON.stringify(o))")%str(TOOLS/'wempe_load.js')
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
def screw(key,hn,title,r,h,ln,rs,material,src,notes=(),shoulder=None):
    """a slotted cheese-head screw as the page's screw() draws it (KIT headGeo, threadGeo): head r x h with its 45° chamfer and slot, shank ln long, thread rs;
    shoulder (d, l): a plain shoulder l long under the head and the thread below it (the click's screw, WN-22), ln then the thread's length"""
    th=iso(2*rs);c=min(0.35,r*0.14);w=max(0.35,r*0.2);s_=max(min(0.55,h*0.45),c+0.05);sd,sl=shoulder or (0,0);L=ln+sl
    crest=2*rs-th['es'];ch=min(th['H1'],ln*0.3);root=crest/2-th['H1'];rt=max(root-th['H1']/2,root*0.6)
    sh=[TurnOD(sd,ln,L,'Turn the shoulder under the head',[S('shoulder',f'Ø {sd:.2f} × {sl:.2f}','a close running fit in the part it carries',src)],src)] if shoulder else []
    ln0=ln;ln=L
    return Recipe(key,hn,title,f'{hn} (Wempe standard part; its sheet is not in the set)',material,'none',[
      Setup('1','bar in the collet, the tip end out',[
        Bar(2*r,h+ln,'Part off and face to the overall length',[S('overall',f'{h+ln:.2f}',None,src)],src),*sh,
        TurnOD(crest,0,ln0,"Turn the shank to the thread's major diameter",[S('shank',f'Ø {crest:.3f}','6g (es %.3f)'%th['es'],'ISO 965')],src),
        TurnCone(rt,0,crest/2,min(th['H1'],ln0*0.3),'Chamfer the tip',[S('tip',f'Ø {2*rt:.2f}',None,'KIT threadGeo')],src),
        ThreadOD(th,0,ln0,f'Cut the thread M{2*rs:g} (die or single point)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src)]),
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
            Bought('stellstift203uc','WN-203.uc','Steady pins, upper balance cock (holes 6, 9, 50)','dowel pin, hardened','Ø 1.6 m6 × 3, 1.3 proud','ISO 8734, or silver steel Ø 1.6','steel','frame.js pinM; 127-556.04 U30 (sure for that cock)'),
            Bought('stellstift203lc','WN-203.lc','Steady pins, lower balance cock (holes 22, 37)','dowel pin, hardened','Ø 1.6 m6 × 3, 1.3 proud','ISO 8734, or silver steel Ø 1.6','steel','frame.js pinM (estimated)'),
            Bought('stellstift203zb','WN-203.zb','Steady pins, intermediate bridge (holes 29, 44)','dowel pin, hardened','Ø 1.6 m6 × 3, 1.3 proud','ISO 8734, or silver steel Ø 1.6','steel','frame.js pinM (estimated)'),
            Bought("jewel35","050504-1","Seconds arbor's lower jewel (Lagerstein f. Sek.)","hole jewel, synthetic ruby, olived hole, an oil sink in its dial face","Ø 3.6 × 1.1, hole Ø 0.78 (olive) for the pivot's 0.75","a watch jewel to size (Seitz-type stock, or ground to fit)","synthetic corundum (ruby)","train.js: scaled on the coloured section (estimated); its form traced on the section's red (±0.1)"),
            Bought('hairspringStrip','050302-1','Hairspring strip (Spiralfaden)','hairspring strip, polished, to be wound in 13 turns and its terminal curves formed (05 03 10)','0.52 × 0.285 (Bandstahl), about 13 turns at Ø 12.8 outside less 3.5 mm as fitted',"balance-spring strip to size (the 1950s build's Nivarox: deviations, the part's card)",'spring steel (Bandstahl), as 05 03 02-1; Nivarox in the 1950s build','05 03 02-1 (Spiralfaden, Bandstahl 0,52 × 0,285); WESC.HSP (HB 0.52, HT 0.285)'),
            Bought('mainspringStrip','050700-6','Mainspring strip (Zugfeder)','mainspring strip, its ends to be formed for the barrel hook and the arbor hook',"15 × 0.37, about 1.24 m long (fitted to 05 06_20's measured pull; no sheet draws its length)",'carbon mainspring strip as drawn; the 1950s build: Nivaflex 45/5, 0.393 (deviations)','spring steel; Nivaflex 45/5 in the 1950s build','05 06_20: “Zugfeder 15 × 0,37”; the length fitted (wempe_mainspring.py, estimated)'),
            Bought('stellstift202','WN-202','Case pin (Stellstift WN-202)','dowel pin, pressed','Ø 1.6 m6 × 9.45','ISO 8734, or silver steel Ø 1.6','steel','frame.js: Ø 1.61 pressed, 9.45 long, 1.78 out of the flange (05 08 00-3)')]

# ---------------- the barrel bridge (Federhausbrücke, 05 08 05-1) ----------------
def barrelBridge():
    D=W()['WD'];H={int(k):v for k,v in D['H'].items()};B=D['BB'];FR=D['FRAME'];R=D['PLATE_R'];t=B['t'];TT=-D['INNER']-D['TOP_T'];src='05 08 05-1'
    pl=lambda q:(-q[0],-q[1]);dt=lambda p,q:p[0]*q[0]+p[1]*q[1];sc=lambda p,k:(p[0]*k,p[1]*k)
    # its outline as frame.js works it from the sheet's figures: the chord 7 from 45 and 7.7 from 42, the short edge at 150° to it 5 beyond 48, the rim between
    v=(H[45][0]-H[42][0],H[45][1]-H[42][1]);l=math.hypot(*v);u=sc(v,1/l);ca=B['dc']/l
    n=[q for q in (add(sc(u,ca),(-u[1],u[0]),sg*math.sqrt(1-ca*ca)) for sg in (-1,1)) if dt(q,H[45])>0][0];c=dt(n,H[45])-B['c45']
    t_=(n[1],-n[0]);t_=t_ if t_[1]<0 else (-t_[0],-t_[1]);c30=math.cos(math.radians(B['a']))
    e=add(sc(t_,c30),n,0.5);m=add(sc(t_,-0.5),n,c30);kE=dt(m,H[48])-B['e48']*math.copysign(1,dt(m,H[45])-dt(m,H[48]))
    Bp=add(sc(n,c),t_,-math.sqrt(R*R-c*c));Tp=max((add(sc(m,kE),e,sg*math.sqrt(R*R-kE*kE)) for sg in (1,-1)),key=lambda q:dt(q,n));Cp=add(sc(n,c),t_,2*(c30*c-kE))
    aB=math.atan2(Bp[1],Bp[0]);aT=math.atan2(Tp[1],Tp[0]);an=math.atan2(n[1],n[0]);TAU=2*math.pi;da=((aT-aB)%TAU+TAU)%TAU
    if abs(((an-aB)%TAU+TAU)%TAU)>da:da-=TAU
    Mid=(R*math.cos(aB+da/2),R*math.sin(aB+da/2))
    P=[pl(q) for q in (Bp,Mid,Tp,Cp)]
    face=bd.Face(bd.Wire([bd.Edge.make_three_point_arc(bd.Vector(*P[0]),bd.Vector(*P[1]),bd.Vector(*P[2])),bd.Edge.make_line(bd.Vector(*P[2]),bd.Vector(*P[3])),bd.Edge.make_line(bd.Vector(*P[3]),bd.Vector(*P[0]))]))
    ops=[];hl=lambda k,q,d,text,sz,face='in',dp=None,thd=None,s=src:ops.append(Hole(pl(q),d,face,t,dp,text,sz,s,thread=thd,key=k))
    stock=Plate(face,t,'Cut the blank from Messingblech 3,5 Ms 58, face to thickness; its outer edge turned with the top plate ("mit der Oberplatte überdrehen"), the chord and the short edge milled',
      [S('thickness',f'{t:.2f}','3.32 -0.04, at the middle',src),S('chord','7 from hole 45, 7.7 from hole 42',None,src),S('short edge','150° to the chord, 5 beyond hole 48',None,src+'; Wempe 3955 (likely)'),S('rim','with the top plate, Ø 85',None,src)],src)
    hl(45,H[45],B['d45'],'Hole 45 (barrel arbor): ream',[S('','Ø 3.9','±0.01',src)])
    i=iso(2.6);hl(46,H[46],i['D1'],"Hole 46 (the click's screw): drill and tap M2.6",[S('','M2.6',None,src)],thd=i)
    for k in (42,48):hl(k,H[k],2*FR['rCl26'],f'Hole {k}: drill clear for M2.6',[S('','Ø 2.8',None,src)])
    for k in (41,47):
        hl(k,H[k],2*FR['rPinQ'],f'Hole {k} (steady pin): drill and ream blind from the underside, pressed',[S('',f'Ø 1.585 -0.005 × {B["pinD"]}',None,src)],dp=B['pinD'])
        ops.append(Cone(pl(H[k]),FR['rPinQ']+B['cs'],FR['rPinQ'],'in',t,B['cs'],f'Hole {k}: countersink 90°',[S('',f'{B["cs"]} × 90°',None,'05 08_13')]))
    return Recipe('barrelBridge','050805-1','Barrel bridge (Federhausbrücke)','05 08 05-1 (kompl. 05 08 05)','Messingblech 3,5 Ms 58 (05 08 05-1)','gilt (Wempe 3955)',[
        Setup('1','blank on the top plate, its rim turned with it',[stock]),Setup('2','on the mill, underside up',ops,view='bottom')],
      page_matrix([[-1,0,0],[0,0,-1],[0,-1,0]],(0,TT,0)),faces=('underside','top face'),fits=['steady pins pressed in 1.585 -0.005; hole 45 3.9 ±0.01 on the barrel arbor'])

# ---------------- the click (Sperrkegel, 05 08 05-2, revised 25.5.48) and its screw (WN-22) ----------------
def click():
    D=W()['WD'];H={int(k):v for k,v in D['H'].items()};K=D['CLICK'];TT=-D['INNER']-D['TOP_T'];y1=TT-D['BB']['t'];src='05 08 05-2'
    yb=-K['d']/2;c6=K['c6'];cn=(math.sqrt(K['ln']**2-(yb+K['rn'])**2),yb+K['rn']);tB=(c6[0]-math.sqrt(K['r6']**2-(yb-c6[1])**2),yb);tC=(tB[0]+K['beak']/math.tan(math.radians(K['ang'])),yb+K['beak'])
    d=math.hypot(cn[0]-tC[0],cn[1]-tC[1]);uu=((cn[0]-tC[0])/d,(cn[1]-tC[1])/d);a=(K['rb']**2-K['rb2']**2+d*d)/(2*d);h=math.sqrt(K['rb']**2-a*a);c12=(tC[0]+a*uu[0]+h*uu[1],tC[1]+a*uu[1]-h*uu[0])
    H1=(c6[0]+math.sqrt(K['r6']**2-(yb-c6[1])**2),yb);dn=(cn[0]-c12[0],cn[1]-c12[1]);ld=math.hypot(*dn);Tn=(c12[0]+K['rb']*dn[0]/ld,c12[1]+K['rb']*dn[1]/ld)
    at=lambda c,p:math.atan2(p[1]-c[1],p[0]-c[0]);mid=lambda c,r,a0,a1:(c[0]+r*math.cos((a0+a1)/2),c[1]+r*math.sin((a0+a1)/2))
    ex=brg(K['brg']);ey=brg(K['brg']-90);sg=1 if ex[0]*ey[1]-ey[0]*ex[1]>0 else -1   # the click's frame on the page; Y = sg × its y, so the map is a rotation
    V=lambda q:bd.Vector(q[0],sg*q[1])
    A=lambda c,r,p0,p1:bd.Edge.make_three_point_arc(V(p0),V(mid(c,r,at(c,p0),at(c,p1))),V(p1))
    pE=(cn[0],yb)
    w=bd.Wire([bd.Edge.make_line(V(pE),V(H1)),A(c6,K['r6'],H1,tB),bd.Edge.make_line(V(tB),V(tC)),A(c12,K['rb'],tC,Tn),
               bd.Edge.make_three_point_arc(V(Tn),V(mid(cn,K['rn'],at(cn,Tn),-math.pi/2)),V(pE))])
    stock=Plate(bd.Face(w),K['t'],'Cut the click from Messingblech 3 Ms 58 federhart, face to thickness, and mill its outline',
      [S('thickness',f'{K["t"]:.2f}','2.6 -0.03/-0.05, at the middle',src),S('nose','r 1 at 7.5 from the hole',None,src),S('beak','3.5 high, its face at 85°, its tip 9.7 from the hole',None,src),
       S('hollow','r 6 about (-5.142, -7.212) from the hole',None,src),S('back','r 12.5, through the beak\'s corner, tangent to the nose',None,src+' (traced at 5:1)')],src)
    hole=Hole((0,0),K['hole'],'in',K['t'],None,'Drill and ream the pivot hole',[S('',f'Ø {K["hole"]:.3f}','3.2 +0.03 (revision a, 25.5.48), at the middle',src)],src,key='46')
    q=H[46];M=page_matrix([[ex[0],sg*ey[0],0],[0,0,-1],[ex[1],sg*ey[1],0]],(q[0],y1,q[1]))
    return Recipe('click','050805-2','Click (Sperrkegel)','05 08 05-2 (revised 25.5.48)','Messingblech 3 Ms 58 federhart (05 08 05-2): its own spring','none',[
        Setup('1','strip on the mill',[stock,hole],view='top')],M,faces=('bridge side','top face'),fits=['its hole 3.2 +0.03 on the screw WN-22\'s shoulder Ø 3.19: a close running fit'],
      notes=['Its outline is placed in its own frame: x from the hole toward the nose, y away from the base line; on the bridge its base line runs 23.3° from N toward O (Wempe 3955, ±3°).'])
def clickScrew():
    Q=W()['WD']['CLICK']['scr'];return screw('clickScrew','WN-22','Click screw, shouldered (WN-22)',Q['r'],Q['h'],Q['len'],1.3,'steel (no drawing gives it)',
      'dims.js CLICK.scr (the coloured section, Wempe 3955: estimated)',shoulder=(Q['sd'],Q['sl']))
def bridgeScrew():
    Q=W()['WD']['BB']['scr'];return screw('bridgeScrew','WN-55','Barrel bridge screw (WN-55)',Q[0],Q[1],Q[2],1.3,"brass (Wempe 3955's)",'dims.js BB.scr (the coloured section: estimated)')

# ---------------- the fusee bush (Schneckenfutter, 05 08 01-2) and its screws (WN-34) ----------------
def fuseeBush():
    D=W()['WD'];Q=D['FB'];TT=-D['INNER']-D['TOP_T'];src='05 08 01-2';z1=Q['lo'];z2=z1+Q['flT'];z3=Q['lo']+Q['top'];rT=Q['upD']/2-Q['up']/Q['taper']
    ops2=[]
    for b in (0,120,240):
        q=brg(b);x,y=q[0]*Q['pcd'],q[1]*Q['pcd']
        ops2.append(Drill((x,y,z1),(0,0,1),Q['holeD'],Q['flT'],f'The flange\'s hole at {b}°: drill',[S('',f'Ø {Q["holeD"]} on Ø {2*Q["pcd"]}','+0.1; ±0.05 on the circle',src)],key=f'f{b}'))
        ops2.append(Drill((x,y,z2-Q['sinkH']),(0,0,1),Q['sinkD'],Q['sinkH'],'and sink it for the screw\'s head',[S('',f'Ø 2.2 × {Q["sinkH"]}','H8; +0.05 deep',src)],key=f'f{b}'))
    return Recipe('fuseeBush','050801-2','Fusee bush (Schneckenfutter)','05 08 01-2','Rundmessing 13,5 Ms 58 (05 08 01-2)','none',[
      Setup('1','bar Ø 13.5 in the collet, the spigot end out',[
        Bar(13.5,z3,'Part off and face to length',[S('overall',f'{z3:.2f}','7.1 -0.2 (the body below the flange 2.6, not 2.7: the fusee arbor\'s endshake, README Unresolved)',src)],src),
        TurnOD(2*Q['fl'],0,z3,'Turn the flange\'s diameter',[S('flange',f'Ø {2*Q["fl"]:.1f}','13.2 -0.2, at the middle',src)],src),
        TurnOD(Q['spD'],0,z1,'Turn the spigot (into the plate\'s hole 10)',[S('spigot',f'Ø {Q["spD"]:.4f} × {z1}','8 g6 (-0.005/-0.014), at the middle',src)],src),
        Bore(2*Q['r'],0,z3,'Bore through, reamed to the fusee arbor\'s journal',[S('bore',f'Ø {2*Q["r"]:.2f}','the sheet\'s 4.1 +0.2 opened to the arbor\'s 4.5 (README, Unresolved)',src)],src)]),
      Setup('2','reversed in a soft collet on the spigot',[
        TurnOD(Q['upD'],z2,z3,'Turn the top above the flange (the dust bush\'s seat)',[S('top',f'Ø {Q["upD"]:.4f} × {Q["up"]}','8 r6 (+0.019/+0.028), at the middle; 2.9 +0.2',src)],src),
        TurnCone(Q['upD']/2,z2,rT,z3,'and taper it 1:70',[S('taper','1:70 on the diameter',None,src)],src),
        InnerCone(Q['r'],z3-(Q['cs']-Q['r']),Q['cs'],z3,'Sink the bore\'s top 45°',[S('',f'Ø {2*Q["cs"]:.0f} at the face','±0.1',src)],src)]),
      Setup('3','on the dividing head, flange face up',ops2,view='top')],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,TT+Q['lo'],0)),fits=['spigot 8 g6 in the plate\'s 8.0 +0.015 (a slide)','top 8 r6, 1:70, pressed into the dust bush\'s 8 H7'])
def fuseeBushScrew():
    Q=W()['WD']['FB']['scr'];return screw('fuseeBushScrew','WN-34','Fusee bush screw (WN-34)',Q[0],Q[1],Q[2],Q[3],'steel (no drawing gives it)','dims.js FB.scr (the coloured section, scaled: likely)')

# ---------------- the dust bush (Staubfutter, 05 08 01-3, as last revised on 05 08 01) ----------------
def dustBush():
    D=W()['WD'];Q=D['DB'];TT=-D['INNER']-D['TOP_T'];Yb=TT-D['FB']['flT'];src='05 08 01-3';L=Q['L']
    rr=lambda z:Q['bore']/2-z/Q['taper'];zm=L-Q['mouth'];rT=rr(zm)+Q['mouth']*math.tan(math.radians(Q['mAng']));zd=(Q['ring'][1]-rr(0))*math.tan(math.radians(Q['dish']))
    s5,w5,rW,c13=Q['last']
    nf=brg(Q['flatBrg'])
    def flat():
        return bd.Box(20,20,Q['nkY']-c13+0.02,align=(bd.Align.MIN,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,c13-0.01))).moved(bd.Location((0,0,0),(0,0,math.degrees(math.atan2(nf[1],nf[0]))))).moved(bd.Location((Q['body']*nf[0],Q['body']*nf[1],0)))
    return Recipe('dustBush','050801-3','Dust bush (Staubfutter)','05 08 01-3 (2.7.42), waisted as the assembly 05 08 01 (2.11.46) draws it','Rundmessing 15 Ms 58 (05 08 01-3)','none',[
      Setup('1','bar in the collet, the bottom end out',[
        Bar(Q['col'],L,'Part off from Rundmessing Ø 15 and face to length',[S('overall',f'{L}','-0.2',src),S('collar',f'Ø {Q["col"]:.1f}','15.1 -0.2, at the middle: the bar diameter',src)],src),
        TurnOD(2*Q['body'],0,c13,'Turn the body',[S('body',f'Ø {2*Q["body"]:.1f}','13.1 -0.2, at the middle',src)],src),
        TurnAway([(Q['body'],s5),(rW,w5),(rW,c13),(1000,c13),(1000,s5)],'Turn the waist under the collar, its shoulder 45°',[S('waist',f'Ø {2*rW} from {w5} to {c13}, the shoulder from {s5}',None,'05 08 01 (2.11.46), scaled at 20.6 px/mm (likely)')],src),
        TurnCone(Q['ring'][0],0,Q['body'],Q['ch'],'Chamfer the bottom\'s outer corner',[S('',f'{Q["ch"]} × 45°',None,'scaled, not figured (estimated)')],src),
        InnerCone(rr(-0.01),-0.01,rr(zm),zm,'Bore and ream the 1:70 taper (pressed on the fusee bush)',[S('bore',f'Ø {Q["bore"]:.4f} at the bottom, 1:70','8 H7, at the middle',src)],src),
        TurnAway([(0,-0.01),(Q['ring'][1],-0.01),(Q['ring'][1],0),(rr(zd),zd),(0,zd)],'Dish the bottom face 5° up to the bore, inside its 0.5 flat ring',[S('',f'5°, the ring {Q["ring"][0]-Q["ring"][1]:.1f} wide',None,src)],src)]),
      Setup('2','reversed in a soft collet on the body',[
        TurnOD(2*Q['neck'],Q['nkY'],L,'Turn the neck',[S('neck',f'Ø {2*Q["neck"]:.1f}','9.7 -0.2, at the middle',src)],src),
        InnerCone(rr(zm),zm,rT+0.01*math.tan(math.radians(Q['mAng'])),L+0.01,'Turn the mouth 20°',[S('mouth',f'{Q["mouth"]} deep, 20°','+0.2',src)],src)]),
      Setup('3','on the mill, the collar\'s flat',[Cut(flat,'Mill the flat on the collar, toward the upper balance cock',[S('flat',f'{Q["body"]} from the axis','14.1 from the far side, so flush with the body',src)],src)],view='top')],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,Yb,0)),fits=['bore 8 H7, 1:70, pressed on the fusee bush\'s 8 r6'],
      notes=["The collar, body and neck at their tolerances' middles (since 29 October 2026, the owner's choice): the collar's Ø 15.0 is the Rundmessing 15's own diameter."])

# ---------------- the upper balance cock (Unruhkloben oben, 05 08 03-1; kompl. 127-556.04 U30) ----------------
def upperCock():
    X=W();D=X['WD'];H={int(k):v for k,v in D['H'].items()};U=D['UC'];FR=D['FRAME'];TT=-D['INNER']-D['TOP_T'];src='05 08 03-1'
    c=H[23];ax=brg(U['ax']);vo=brg(U['vo']);sg=1 if ax[0]*vo[1]-vo[0]*ax[1]>0 else -1   # its own frame: u along the axis, v toward 75° (Y = sg v, so the map is a rotation)
    loc=lambda q:((q[0]-c[0])*ax[0]+(q[1]-c[1])*ax[1],sg*((q[0]-c[0])*vo[0]+(q[1]-c[1])*vo[1]))
    V=lambda u,v:bd.Vector(u,sg*v)
    F0,F1=U['foot'];r6=U['r6'];ph=math.atan2(F1,F0)+math.acos(r6/math.hypot(F0,F1));Tp=(r6*math.cos(ph),r6*math.sin(ph))
    w=bd.Wire([bd.Edge.make_line(V(*Tp),V(F0,F1)),bd.Edge.make_line(V(F0,F1),V(F0,-F1)),bd.Edge.make_line(V(F0,-F1),V(Tp[0],-Tp[1])),bd.Edge.make_three_point_arc(V(Tp[0],-Tp[1]),V(-r6,0),V(*Tp))])
    top,arm,full,ft=U['top'],U['arm'],U['armFull'],U['footT'];TN=math.tan(math.radians(U['lean']));SW=U['slotIn']-U['armT']*TN;SH=U['slot']/2
    def overFoot():return bd.Box(60,60,top-ft+0.1,align=(bd.Align.MIN,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((U['web'],0,ft)))
    def underArm():return bd.Cylinder(U['r22'],full+0.1,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,-0.1)))
    def relief():
        from . import _rev
        r0,r1=U['step'];rl=U['relief'];R0,R1=U['boss'][0]/2,U['boss'][1]/2
        return _rev([(0,full-0.01),(r1+0.01,full-0.01),(r0,arm),(0,arm)])-_rev([(0,full),(R0,full),(R1,full+rl),(0,full+rl)])
    def slot():
        vw=lambda z:SW+(z-arm)*TN;z0,z1=full-0.1,top+0.1
        f=bd.Face(bd.Wire.make_polygon([V(-SH,vw(z0))+bd.Vector(0,0,z0),V(-SH,20)+bd.Vector(0,0,z0),V(-SH,20)+bd.Vector(0,0,z1),V(-SH,vw(z1))+bd.Vector(0,0,z1)],close=True))
        return bd.extrude(f,2*SH,dir=(1,0,0))
    ops1=[Plate(bd.Face(w),top,'Cut the blank from Profilmessing Ms 58 and mill the outline: tapering from 17 wide at the foot to r 6 round the setting at 23',
            [S('length','49 from the arm\'s end to the foot\'s',None,src),S('foot end','17 wide',None,src),S('end','r 6 about 23',None,src),S('height',f'{top}','15 -0.1 over the foot\'s underside',src)],src),
          Cut(overFoot,'Mill the foot down to its thickness, from the web\'s outer face out',[S('foot',f'{ft} thick',None,src),S('web\'s outer face',f'{U["web"]} from 23',None,src)],src,at=(35,0))]
    ops2=[Cut(underArm,'Mill under the arm: the web\'s inner face an arc about 23',[S('web\'s inner face',f'r {U["r22"]} about 23','±0.1',src),S('arm',f'{top-full:.1f} thick',None,src)],src,at=(-U['r22'],0)),
          Cut(relief,'On the faceplate about 23: turn the relief under the thin end, its 45° step, leaving the boss',[S('relief',f'{U["relief"]} deep, the step from r {U["step"][1]} to r {U["step"][0]}, 45°',None,src+' ("0,8", "45°", "12ʳ")'),S('boss',f'face Ø {U["boss"][0]}, flank 45° to Ø {U["boss"][1]}','3.2 ±0.02 to its face',src+'; U30')],src,at=(0,0))]
    sq=loc(X['HOLES']['studScrew']);h20=loc(H[20]);i12=iso(1.2);i14=iso(1.4)
    ops3=[Cut(slot,'Mill the stud\'s slot across the arm, its inner wall at 82°',[S('slot',f'{U["slot"]:.4f} wide','1.8 H7, at the middle',src+' C-D'),S('inner wall',f'{U["slotIn"]} from the axis on the top, 82° to the faces',None,src+' C-D')],src,at=(0,4.5*sg)),
          Hole((0,0),U['seat'],'out',top,top-U['seatY'],'Bore the settings\' seat from the top (a piloted counterbore)',[S('seat',f'Ø {U["seat"]:.3f}, {top-U["seatY"]:.1f} deep','5.2 H7, at the middle',src)],src,key='23'),
          Drill((0,0,full-0.01),(0,0,1),U['floor'],U['seatY']-full+0.01,'and ream the floor\'s hole',[S('floor',f'Ø {U["floor"]:.3f}, the floor 0.5 thick','4.59 +0.012, at the middle; 0.5 +0.03',src)],key='23f'),
          *[Drill((sx*U['scr'],0,full-0.01),(0,0,1),i12['D1'],top-full+0.02,'The setting\'s screw: drill and tap M1.2 through the boss',[S('',f'M1.2, {U["scr"]} from 23 along the axis','3.5 +0.05, at the middle',src)],thread=i12,key='s12') for sx in (1,-1)],
          Drill((sq[0],sq[1],arm-0.01),(0,0,1),i14['D1'],top-arm+0.02,'The hairspring stud\'s screw: drill and tap M1.4',[S('','M1.4 at the stud\'s hole',None,'127-556.04 U30 (escapement.js; not on 05 08 03-1)')],thread=i14,key='stud'),
          Drill((h20[0],h20[1],full-0.3),(0,0,1),U['h20'],top-full+0.4,'Hole 20 (auxiliary): drill',[S('',f'Ø {U["h20"]} at 10 from 23',None,src)],key='20')]
    ops4=[Hole(loc(H[8]),2*FR['rCl26'],'in',top,ft,'Hole 8 (its screw): drill clear for M2.6',[S('','Ø 2.8',None,src)],src,key='8')]
    for k in (6,50,9):
        ops4.append(Hole(loc(H[k]),2*FR['rPinQ'],'in',top,U['pinD'],f'Hole {k} (steady pin): drill and ream, pressed',[S('',f'Ø 1.585 -0.005 × {U["pinD"]}',None,src)],src,key=str(k)))
        ops4.append(Cone(loc(H[k]),FR['rPinQ']+U['pinCs'],FR['rPinQ'],'in',top,U['pinCs'],'and sink it 90°',[S('',f'{U["pinCs"]} × 90°',None,'05 08_05')]))
    r=Recipe('upperCock','050803-1','Upper balance cock (Unruhkloben oben)','05 08 03-1 (kompl. 127-556.04 U30)','Profilmessing Ms 58 (05 08 03-1)','gilt (Wempe 3955)',[
        Setup('1','profile bar on the mill, top up',ops1,view='top'),Setup('2','underside up, on the mill and the faceplate',ops2,view='bottom'),
        Setup('3','top up',ops3,view='top'),Setup('4','underside up: the foot\'s holes',ops4,view='bottom')],
      page_matrix([[ax[0],sg*vo[0],0],[0,0,-1],[ax[1],sg*vo[1],0]],(c[0],TT,c[1])),faces=('underside','top'),
      expect=[{'at':(0,3.0*sg),'r':1.2,'max':0.14,'why':"the page's boss (frame.js, bo's corner at SN) has the slot's end wall upright at 0.02 inside its place at the boss's face, where the arm's wall leans 8° (C-D's 82°); one milled slot is one plane through arm and boss, so at the boss's top the page's wall stands 0.13 inside it: the old mesh"}],
      fits=['seat 5.2 H7 for the endstone\'s and the jewel\'s settings, both from the top','steady pins pressed in 1.585 -0.005'])
    r.flat=True;return r
def upperCockScrew():
    Q=W()['WD']['UC']['scrH'];return screw('upperCockScrew','WN-ucs','Upper balance cock screw (hole 8; WN-55 by the coloured section)',Q[0],Q[1],Q[2],1.3,'steel, blued (Wempe 3955)','dims.js UC.scrH (the coloured section, scaled: estimated)')

# ---------------- the lower balance cock (Unruhkloben unten, 05 08 00-2, revised 2.12.46) ----------------
def lowerCock():
    X=W();D=X['WD'];H={int(k):v for k,v in D['H'].items()};Q=D['LC'];FR=D['FRAME'];TI=-D['INNER'];src='05 08 00-2'
    o=H[36];bu=(H[37][0]-H[22][0],H[37][1]-H[22][1]);l=math.hypot(*bu);bu=(bu[0]/l,bu[1]/l);nv=(-bu[1],bu[0])
    if nv[0]*(H[23][0]-o[0])+nv[1]*(H[23][1]-o[1])<0:nv=(-nv[0],-nv[1])
    sg=-1 if bu[0]*nv[1]-nv[0]*bu[1]>0 else 1   # page = o + bu u + nv w, y = TI + Z: Y = sg w makes it a rotation
    loc=lambda q:((q[0]-o[0])*bu[0]+(q[1]-o[1])*bu[1],sg*((q[0]-o[0])*nv[0]+(q[1]-o[1])*nv[1]))
    V=lambda u,w_:bd.Vector(u,sg*w_)
    bl,bw,bd_=Q['bar'];lw,lt=Q['lug'];cx,cy=Q['ctr'];r5=Q['r5'];t=bd_
    assert abs(lw-bl/2)<1e-12,"the lug flush with the bar's end"
    out=bd.Wire([bd.Edge.make_line(V(-bl/2,-bw/2),V(bl/2,-bw/2)),bd.Edge.make_line(V(bl/2,-bw/2),V(bl/2,bw/2)),bd.Edge.make_line(V(bl/2,bw/2),V(0,bw/2)),
       bd.Edge.make_line(V(0,bw/2),V(0,cy)),bd.Edge.make_three_point_arc(V(0,cy),V(cx,cy+r5),V(-lw,cy)),bd.Edge.make_line(V(-lw,cy),V(-bl/2,-bw/2))])   # the lug flush with the bar's end at 22 (lw = bl/2)
    lugF=bd.Face(bd.Wire([bd.Edge.make_line(V(-lw,bw/2),V(0,bw/2)),bd.Edge.make_line(V(0,bw/2),V(0,cy)),bd.Edge.make_three_point_arc(V(0,cy),V(cx,cy+r5),V(-lw,cy)),bd.Edge.make_line(V(-lw,cy),V(-lw,bw/2))]))
    i26=iso(2.6);i12=iso(1.2);c23=loc(H[23]);nvl=(0,sg)
    ops=[Plate(bd.Face(out),t,'Cut the blank from Profilmessing 20×10×8×3,3 Ms 58 to length',[S('bar',f'{bl} × {bw} × {bd_}','10 -0.1 deep',src),S('lug',f'{lw} wide, r {r5} round 23, {lt} thick at the far face','3.22 -0.04 (drawn at its top)',src)],src),
         Pocket(lugF,'in',t,t-lt,'Mill the lug down to its thickness from the plate side',[S('lug',f'{lt} thick',None,src)]),
         Hole(loc(o),i26['D1'],'in',t,None,'Hole 36: drill and tap M2.6 through (the screw from the top plate)',[S('','M2.6',None,src+' G-H')],src,thread=i26,key='36')]
    for k in (22,37):ops.append(Hole(loc(H[k]),2*FR['rPinQ'],'in',t,Q['pinD'],f'Hole {k} (steady pin): drill and ream, pressed',[S('',f'Ø 1.585 -0.005 × {Q["pinD"]}',None,src)],src,key=str(k)))
    ops2=[Hole(c23,2*FR['rJ'],'out',t,lt,'Hole 23: ream through the lug',[S('','Ø 4.59','+0.012',src)],src,key='23'),
          Hole(c23,Q['seat'],'out',t,lt-Q['floor'],'Bore the setting\'s seat from the far face',[S('',f'Ø {Q["seat"]:.3f} to {Q["floor"]} from the near face','5.2 H7; 0.5 +0.03',src)],src,key='23')]
    for sx in (1,-1):ops2.append(Hole((c23[0]+nvl[0]*Q['scr']*sx,c23[1]+nvl[1]*Q['scr']*sx),i12['D1'],'out',t,lt,'Its screw: drill and tap M1.2',[S('',f'M1.2, {Q["scr"]} from 23 across the axis','3.5 +0.1 (revision a), at the middle',src)],src,thread=i12,key='s12'))
    r=Recipe('lowerCock','050800-2','Lower balance cock (Unruhkloben unten)','05 08 00-2 (revised 2.12.46)','Profilmessing 20×10×8×3,3 Ms 58 (05 08 00-2)','gilt',[
        Setup('1','bar on the mill, the plate side up',ops,view='bottom'),Setup('2','far face up',ops2,view='top')],
      page_matrix([[bu[0],sg*nv[0],0],[0,0,1],[bu[1],sg*nv[1],0]],(o[0],TI,o[1])),faces=('plate side','far face'),fits=['seat 5.2 H7','steady pins pressed in 1.585 -0.005'])
    r.flat=True;return r
def lowerCockScrew():
    Q=W()['WD']['LC']['scrH'];return screw('lowerCockScrew','WN-53','Lower balance cock screw (WN-53)',Q[0],Q[1],Q[2],1.3,"brass (Wempe 3955's)",'dims.js LC.scrH (the coloured section, scaled: estimated)')

# ---------------- the intermediate bridge (Zwischenbrücke, 05 08 04; its 05 08 04-1 not in the set) ----------------
def intermediateBridge():
    X=W();D=X['WD'];H={int(k):v for k,v in D['H'].items()};Z=D['ZB'];FR=D['FRAME'];PPT=D['PP_T'];t=Z['t'];src='05 08 04'
    pl=lambda q:(q[0],-q[1]);a,b=pl(H[43]),pl(H[28]);m=((a[0]+b[0])/2,(a[1]+b[1])/2);dd=(b[0]-a[0],b[1]-a[1]);l=math.hypot(*dd);dd=(dd[0]/l,dd[1]/l)
    ang=math.degrees(math.atan2(dd[1],dd[0]))
    with bd.BuildSketch() as sk:
        with bd.Locations(bd.Location((m[0],m[1],0),(0,0,ang))):bd.SlotCenterToCenter(2*Z['half'],Z['w'])
    ops=[Plate(sk.sketch.faces()[0],t,'Cut the bridge from brass sheet, face to thickness, mill the outline with round ends',[S('outline',f'{2*Z["half"]+Z["w"]:.1f} × {Z["w"]}, round ends','scaled on 05 08 04 at 2:1; Wempe 3955 45.7 × 9.75 (likely)',src),S('thickness',f'{t}',None,src)],src)]
    for k in (28,43):
        ops.append(Hole(pl(H[k]),2*FR['rCl26'],'in',t,None,f'Hole {k}: drill clear for M2.6',[S('','Ø 2.8',None,src)],src,key=str(k)))
        ops.append(Hole(pl(H[k]),2*Z['sink'][0],'out',t,Z['sink'][1],'and sink it for the screw\'s head',[S('',f'Ø {2*Z["sink"][0]} × {Z["sink"][1]}',None,'Wempe 3955 (likely); depth estimated')],src,key=str(k)))
    for k in (29,44):ops.append(Hole(pl(H[k]),2*FR['rPinQ'],'in',t,Z['pinD'],f'Hole {k} (steady pin): drill and ream, pressed',[S('',f'Ø 1.585 -0.005 × {Z["pinD"]}',None,src)],src,key=str(k)))
    ops.append(Hole(pl(H[38]),Z['bush'],'in',t,None,'Hole 38: bore for the bush WN-300',[S('',f'Ø {Z["bush"]}',None,src)],src,key='38'))
    ops.append(Cone(pl(H[38]),Z['mouth'][0],Z['bush']/2,'in',t,Z['mouth'][1],'and its 45° mouth on the plate side',[S('','Ø 5.7 at the face, 45°',None,src+' section (likely)')]))
    ops.append(Hole(pl(H[35]),Z['set'],'in',t,None,'Hole 35: bore for the seconds jewel\'s setting',[S('',f'Ø {Z["set"]}',None,src)],src,key='35'))
    r=Recipe('intermediateBridge','050804-1','Intermediate bridge (Zwischenbrücke)','05 08 04 (05 08 04-1 not in the set)','brass (not given: estimated)','gilt (Wempe 3955)',[
        Setup('1','sheet on the mill, the plate side up',ops,view='bottom')],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,PPT,0)),faces=('plate side','dial side'),fits=['steady pins pressed in 1.585 -0.005; the bush WN-300 pressed in 38'])
    r.flat=True;return r
def intermediateBridgeScrew():
    Q=W()['WD']['ZB']['scr'];return screw('intermediateBridgeScrew','WN-52','Intermediate bridge screw (WN-52)',Q[0],Q[1],Q[2],1.3,"brass (Wempe 3955's)",'dims.js ZB.scr (estimated)')

# ---------------- the train's arbors: pinion and arbor in one piece (train.js A) ----------------
def trainArbor(k,key,hn,title,dwg,stock,material,treat,leaves,notes=()):
    a=WT()[k];P=a['prof'];p=a['pin'];src=dwg;z0=min(u for _,u in P);z1=max(u for _,u in P)
    # the profile with the pinion's head left at its tip over the leaves' length (the page draws the arbor under the leaves and the leaves as their own piece)
    rh=p['D']/2;Q=[];u0,u1=p['u0'],p['u1']
    for i,(r,u) in enumerate(P):
        Q.append((r,u))
        if i+1<len(P):
            r2,u2=P[i+1]
            if u<=u0<u2 and r<rh:Q+=[(r,u0),(rh,u0)]
            if u<u1<=u2 and r2<rh:Q+=[(rh,u1),(r2,u1)]
    runs=[];j=0
    while j<len(P)-1:   # the sheet's sizes: each length turned to one diameter (0.05 or longer), from the dial side's end
        r,u=P[j];e=j
        while e+1<len(P) and abs(P[e+1][0]-r)<1e-9:e+=1
        if e>j and P[e][1]-u>=0.05 and r>0:runs.append(S('',f'Ø {2*r:.3f} from {u-z0:.2f} to {P[e][1]-z0:.2f}',None,src))
        j=e+1 if e>j else j+1
    ops=[Blank(stock,z0,z1,f'Cut the blank from Präz. Rundstahl {stock:g} between centres',[S('length',f'{z1-z0:.2f} overall',None,src)],src),
         TurnProfile(Q,'Turn the arbor: pivots (1:90, their ends rounded), shoulders (the train side one 30° cone), seats and collars, the head of the pinion',runs+[S('pinion head',f'Ø {p["D"]:.3f} from {u0-z0:.2f} to {u1-z0:.2f}','the tip circle',src)],src),
         CutLeaves(a['xy'],rh+0.05,u0,u1,f'Cut the {p["z"]} leaves',[S('leaves',f'z {p["z"]}, m {p["m"]:.4f}, tip Ø {p["D"]:.3f}, root Ø {p["dg"]:.3f}',None,leaves)],src,z=p['z'])]
    return Recipe(key,hn,title,dwg,material,treat,[Setup('1','bar between centres, then each pivot finished in a pivot polisher (Jacot)',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),notes=list(notes)+["Pivot ends, the crown and the cone are turned to the page's profile point by point (its quarter-ellipse ends and 30° cone sampled as the page samples them)."],
      fits=['pivots in their jewels or bushes: a close running fit ("Enger Laufsitz", 05 05_1)',"the wheel's seat n6 in its H7 hole, riveted"])
def centreArbor():return trainArbor('cw','centreArbor','050503-2','Centre pinion and arbor (Minutentrieb)','05 05 03-2 (kompl. 05 05 03, 22.7.43)',7.2,'Präz. Rundstahl 7,2','hardened, tempered at 295 °C (05 05 03-2)','05 05 03-2: z 14')
def intermediateArbor():return trainArbor('tw','intermediateArbor','050502-2','Intermediate pinion and arbor (Zwischentrieb)','05 05 02-2 (kompl. 05 05 02, redrawn 6.46)',5.2,'Präz. Rundstahl 5,2','not given on the sheet',"z 12 from the centre distance (the transcription's inference, confirmed); tip and root by 05 04_8's cutter proportions (likely)")
def escapeArbor():return trainArbor('ew','escapeArbor','050405-2','Escape pinion and arbor (Gangtrieb)','05 04 05-2 (Hz 7.6.40; 05 04_7.2)',3.4,'Präz. Rundstahl 3,4','not given on the sheet','05 04_8: z 10, m 0.263, tips Ø 2.97, roots 1.6 (sure)',
    notes=["Its shoulders are concave arcs r 3 from each pivot's root (05 04_7.2 draws the Ø 6 circle tangent at the root), turned as the page samples them (escapement.js earProf)."])
def staff():
    P=WT()['staff'];z0=min(u for _,u in P);z1=max(u for _,u in P);rmax=max(r for r,_ in P);src='05 04 02-1 (kompl. 05 04 02, 29.5.46)'
    runs=[];j=0
    while j<len(P)-1:
        r,u=P[j];e=j
        while e+1<len(P) and abs(P[e+1][0]-r)<1e-9:e+=1
        if e>j and P[e][1]-u>=0.05 and r>0:runs.append(S('',f'Ø {2*r:.4f} from {u-z0:.2f} to {P[e][1]-z0:.2f}',None,src))
        j=e+1 if e>j else j+1
    ops=[Blank(2*rmax+0.4,z0,z1,'Cut the blank between centres',[S('length',f'{z1-z0:.2f} overall (05 03_3.2: 25.6 -0.02 for the later staff)',None,src),S('bar',f'Ø {2*rmax+0.4:.1f}','not given (estimated: the arm seat Ø 2 h6 and 0.4)',src)],src),
         TurnProfile(P,"Turn the staff: the arms 1:30 above and 1:70 below, the collet's seat 1:70, the arm's seat, the hub's seat, the rollers' seats, the pivots' cones hollow on R 6",
           runs+[S('arm seat','Ø 2 h6, 1.1 high',None,src),S('impulse roller seat','Ø 1.65 s6 (at the middle, 1.6685)',None,src),S('discharge roller seat','Ø 1.2 r6 (at the middle, 1.2155)',None,src),S('pivots','Ø 0.21 × 0.4, "in Lagerstein einpassen"',None,'05 03_3.2')],src)]
    r=Recipe('staff','050402-1','Balance staff (Unruhwelle)',src,'steel (not given)','hardened, tempered at 240 °C (05 04 02-1)',[Setup('1','between centres; the pivots finished in a Jacot tool',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),fits=['the hub pressed on its 1:70','the rollers pressed on their s6 and r6 seats','the collet gripping its 1:70 seat by its slit'],
      notes=["The pivots' cones are concave (05 03_3.2's R 6), turned to the page's profile point by point."])
    return r
def trainWheel(k,key,hn,title,dwg,sheet,stock,mate_note):
    a=WT()[k];w=a['wheel'];th=w['rim'][1]-w['rim'][0];src=dwg;n,sw,R0,R1=w['spokes'];ro=w['D']/2
    with bd.BuildSketch() as sk:bd.Circle(ro+0.1)
    def spokes():   # each window between the hub (R0) and the rim's inside (R1), its sides the spokes' straight edges, as train.js's gear() cuts them
        d1=math.asin(sw/2/R1);d0=math.asin(sw/2/R0);sol=None
        for j in range(n):
            a0=j/n*2*math.pi;a1=(j+1)/n*2*math.pi;P=lambda r,t:bd.Vector(r*math.cos(t),r*math.sin(t),-0.01)
            e=[bd.Edge.make_three_point_arc(P(R1,a0+d1),P(R1,(a0+a1)/2),P(R1,a1-d1)),bd.Edge.make_line(P(R1,a1-d1),P(R0,a1-d0)),
               bd.Edge.make_three_point_arc(P(R0,a1-d0),P(R0,(a0+a1)/2),P(R0,a0+d0)),bd.Edge.make_line(P(R0,a0+d0),P(R1,a0+d1))]
            x=bd.extrude(bd.Face(bd.Wire(e)),th+0.02,dir=(0,0,1));sol=x if sol is None else sol+x
        return sol
    ops=[Plate(sk.sketch.faces()[0],th,f'Cut the blank from {stock}',[S('thickness',f'{th:.2f}',"at the fit's middle",sheet)],sheet),
         CutLeaves(a['wxy'],ro+0.2,0,th,f"Cut the {w['z']} teeth (a wheel cutter of the sheet's form)",[S('teeth',f'z {w["z"]}, m {w["m"]:.5f}, tip Ø {w["D"]}, root Ø {w["dg"]}, tooth {w["l"]} on the pitch circle',None,sheet),S('form',mate_note,None,"train.js teeth(): the sheets' rounded ogives")],sheet,z=w['z']),
         Cut(spokes,f'Cross it out: {n} spokes',[S('spokes',f'{n}, {sw} wide',None,sheet),S('hub',f'Ø {2*R0:.2f}',None,sheet),S("rim's inside",f'Ø {2*R1:.2f}',None,sheet)],sheet,at=(0,0)),
         Hole((0,0),2*w['bore'],'in',th,None,"Bore the hole for the pinion's seat",[S('',f'Ø {2*w["bore"]:.2f}','H7',sheet)],sheet,key='bore')]
    r=Recipe(key,hn,title,dwg,stock,'none',[Setup('1','on the wheel-cutting engine, then crossed out',ops,view='top')],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,-th/2,0)),faces=('train side','dial side'),fits=["riveted on its pinion's seat, n6 in its H7 hole"])
    r.flat=True;r.spin=True;return r
def centreWheel():return trainWheel('cw','centreWheel','050503-1','Centre wheel (Minutenrad)','05 05 03-1','05 05 03-1','Messingblech 1,5 Ms 58 federhart','cycloidal for the intermediate pinion of 12')
def intermediateWheel():return trainWheel('tw','intermediateWheel','050502-1','Intermediate wheel (Zwischenrad)','05 05 02-1','05 05 02-1','Messingblech 1,2 Ms 58 federhart','cycloidal for the seconds pinion of 10')
def secondsWheel():return trainWheel('sw','secondsWheel','050501-1','Seconds wheel (Sekundenrad)','05 05 01-1','05 05 01-1','Messingblech 1,2 Ms 58 federhart','cycloidal for the escape pinion of 10')
def escapeWheel():
    D=WT();G=D['ewg'];Y=D['Y'];t=Y['ew1']-Y['ew0'];web=Y['ew1']-Y['ewWeb'];src='05 04 05-1 (05 04_23, 02 04 08a, 20.1.42; 05 04_7.2)'
    P=lambda q:(q[0],-q[1])   # the page's plan [x, z] to the part's frame (Y = -z)
    def poly(L):
        Q=[P(q) for i,q in enumerate(L) if i==0 or abs(q[0]-L[i-1][0])+abs(q[1]-L[i-1][1])>1e-9]
        return bd.Face(bd.Wire.make_polygon([bd.Vector(x,y,0) for x,y in Q],close=True))
    ops=[Plate(poly(G['o']),t,"Cut the blank from Messingblech 1,6 Ms 63 federhart and cut the 15 teeth (a fly cutter of the tooth's form, the back hollowed by the Ø 6 cutter)",
           [S('tips','Ø 14','+0.03',src),S('teeth','15; the locking face straight, leaning 25° back from the radius; the tip flat 0.1834 (1½°); the back hollow to Ø 12.1, stepped 0.2 to the floor; 1 wide at the root',None,src),
            S('floor','Ø 11.7',None,'02 04 08a'),S('thickness',f'{t:.1f} at the teeth',None,'05 04_1')],src),
         Pocket(poly(G['IN']),'in',t,t-web,"Turn the recess on the top plate's side inside the teeth's floor",[S('recess',f'{t-web:.1f} deep over the floor, the web {web:.1f}','"0,8" struck for "0,7"','05 04_7.1')]),
         Cut(lambda:sum((bd.extrude(poly(L).moved(bd.Location((0,0,-0.01))),t+0.02,dir=(0,0,1)) for L in G['OP'][1:]),bd.extrude(poly(G['OP'][0]).moved(bd.Location((0,0,-0.01))),t+0.02,dir=(0,0,1))),
             "Cross it out: three openings, each the rim's inside and one arc",[S('openings',"the rim inside Ø 10.9; each arc r 7.9 from a centre 9.43 out; the crossings 0.6 wide at the rim, 17.7° behind a tooth's tip",None,'05 04_23 (traced: sure)')],src,at=(0,0)),
         Hole((0,0),1.8+0.008,'in',t,None,"Bore the hole for the collet's spigot",[S('','Ø 1.8','H7',src+'; 05 04_1')],src,key='bore')]
    ops[-1].mz=t-web/2   # the bore measured in the web, below the recess's floor
    r=Recipe('escapeWheel','050405-1','Escape wheel (Gangrad)',src,'Messingblech 1,6 Ms 63 federhart','gilt (Wempe 3955)',[Setup('1','on the wheel-cutting engine, then crossed out and recessed',ops,view='bottom')],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,Y['ew0'],0)),faces=("top plate's side","the pinion's side"),fits=["the collet's spigot 1.8 h6 in its 1.8 H7"])
    r.flat=True;return r
SMALL=[
  ('050405-3', 'escapeCollet', 'Escape wheel collet (Gangradbutzen)', '05 04 05-3 (05 04 10 on 05 04_7.2)', 'brass (Messing)', "its spigot 1.8 h6 in the wheel's 1.8 H7, the wheel riveted on it; on the arbor's Ø 1.2", "Ø 2.8 for 1.6 over the wheel, then Ø 1.7, each step's top edge chamfered 0.15; 4.7 long (05 04_7.2, scaled ±0.03)"),
  ('WN-301', 'bush301', 'Brass bush WN-301 (the centre arbor, top plate)', 'WN-301 (Messinglager; its sheet not in the set)', 'brass (Messing)', 'pressed in hole 1 (4.59 +0.012) 0.01 over on the diameter, flush both faces; the oil sink a cup to its rim', 'bored 1.21, 0.02 over the pivot\'s 1.19 ("Enger Laufsitz", 05 05_1)'),
  ('WN-300.t38', 'bush300t38', 'Brass bush WN-300 (the intermediate arbor, top plate)', 'WN-300 (Messinglager)', 'brass (Messing)', 'pressed in hole 38, flush both faces, the oil sink a cup', "bored 0.845, 0.02 over the pivot's 0.825"),
  ('WN-300.t35', 'bush300t35', 'Brass bush WN-300 (the seconds arbor, top plate)', 'WN-300 (Messinglager)', 'brass (Messing)', 'pressed in hole 35, flush both faces, the oil sink a cup', "bored 0.83, 0.02 over the pivot's 0.81"),
  ('WN-302', 'bush302', "Brass bush WN-302 (the centre arbor's journal, pillar plate)", 'WN-302 (05 08 02 Schnitt A-B)', 'brass (Messing)', "pressed in hole 1, its inner face 0.1 +0.02 under the plate's, flush with the dial face; its cup Ø 3.8 × 0.55 (estimated)", "bored to the journal's 1:30 (e8 middle + 0.026, H7: estimated)"),
  ('WN-300.zb', 'bush300zb', 'Brass bush WN-300 (the intermediate arbor, intermediate bridge)', 'WN-300 (05 08 04)', 'brass (Messing)', "pressed in the bridge's Ø 4.3, its face 0.7 +0.02 in from the plate side; its cup Ø 3.7 × 0.9 (estimated)", 'bored 0.845, 0.02 over the pivot'),
  ('050504-2', 'setting35', "Seconds jewel's setting (Fassung)", "05 05 04-2 (its sheet not in the set; 05 08 04's section)", 'brass (Messing)', "pressed in the bridge's Ø 5.2, its top 0.2 under the plate side's face; the jewel 05 05 04-1 burnished into its seat Ø 3.6", 'the seat Ø 3.6 × 1.1 for the jewel, its face 1.75 in'),
  ('050802-2', 'studBush', 'Stud bush (Futter)', '05 08 02-2', 'brass (Messing)', 'pressed into hole 2 (and 19) from the inner face ("Futter an dieser Seite eindrücken"), through the plate', "bored 1.49 for the stud's 1.5, a press"),
  ('050200-6', 'studLong', 'Long stud (Anrichtstift lg)', '05 02 00-6', 'steel (not given)', "pressed in its bush in hole 2, 12.3 from the plate's inner face", 'Ø 1.5, both ends domed 0.3 (05 02_1)'),
  ('050200-7', 'studShort', 'Short stud (Anrichtstift kurz)', '05 02 00-7', 'steel (not given)', 'pressed in its bush in hole 19, 6.8 out of the dial face', 'Ø 1.5, both ends domed 0.3 (05 02_1)'),
  ('WN-hs', 'bushHs', "Hand-setting pinion's bush (hole 18)", '05 08 02 (unnamed; Wempe 3955 has it)', 'brass (Messing)', 'pressed in hole 18, flush both faces; empty, as on Wempe 3955', 'bored 1.3, its sink a 90° cone to Ø 1.64')]
def smallTurned(hn,key,title,dwg,mat,fit,bore):
    P=WT()['ewcol'] if hn=='050405-3' else WT()['small'][hn]['prof'];z0=min(z for _,z in P);z1=max(z for _,z in P);ro=max(r for r,_ in P);src=dwg
    ops=[Blank(2*ro+0.3,z0-0.05,z1+0.05,'Cut the blank from bar',[S('length',f'{z1-z0:.2f}',None,src),S('outside',f'Ø {2*ro:.3f}','0.01 over its hole (a press, estimated)' if mat.startswith('brass') else None,src)],src),
         TurnProfile(P,'Turn, bore and sink it to its profile',[S('',bore,None,src),S('length',f'{z1-z0:.2f}',None,src)],src)]
    return Recipe(key,hn,title,dwg,mat,'none',[Setup('1','bar in the collet, parted off',ops)],page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),fits=[fit])

# ---------------- the fusee arbor (Schneckenwelle, 05 06 04-1) and the barrel arbor (Federkern, 05 07 02-1): WD.FA, WD.BAR ----------------
def _square(c,z):
    """a square across the corners 2c at height z, its corners on X and Y (as the page's 4-segment cylinders put them)"""
    return bd.Wire.make_polygon([bd.Vector(c,0,z),bd.Vector(0,c,z),bd.Vector(-c,0,z),bd.Vector(0,-c,z)],close=True)
def fuseeArbor():
    X=W();F=X['WD']['FA'];P=X['FAprof'];yT=F['yD']-F['len'];yP=yT-F['LS'];R0=F['SQ0']/math.sqrt(2)+0.01;tA=math.tan(math.radians(F['ang']));src='05 06 04-1'
    side=lambda y:F['SQ0']-(yT-8-y)/100   # across the flats, 1:100 from 3.12 at its root
    Q=[(0,yP),(R0,yP),(R0,P[0][1])]+[tuple(q) for q in P[1:]]
    def sq():
        loft=bd.Solid.make_loft([_square(side(yP-0.01)/math.sqrt(2),yP-0.01),_square(side(yT-8)/math.sqrt(2),yT-8)])
        return bd.Cylinder(R0+0.2,yT-8-yP+0.01,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,yP-0.01)))-loft
    a=F['hole']['a'];u=(math.cos(a),math.sin(a),0);o=(F['hole']['from']*u[0],F['hole']['from']*u[1],F['yD']-F['hole']['dy'])
    ops=[Blank(7.5,yP-0.05,P[-1][1]+0.05,'Cut the blank from Präz. Rundstahl 7,5 between centres',[S('length',f'{P[-1][1]-yP:.2f} from the point to the stub\'s end (the sheet\'s 60.6 counts the centres)',None,src)],src),
         TurnProfile(Q,'Turn the arbor: the journal 1:70 in the fusee bush, the step for the cover plate, the collar for the body, the Vorreiber\'s seat 1:70, the dial-side pivot 1:70, the stub for the up-and-down pinion',
           [S('journal','Ø 4.5 ±0.02 at the shoulder to 4.39 (1:70), 8 long',None,src),S('step','Ø 6.1 -0.05 × 3.1 +0.05',None,src),S('collar','Ø 7.04 -0.01 × 7.9, pressed into the body',None,src),
            S('Vorreiber seat','Ø 4.5 ±0.02 to 4.38 (1:70), 8.7',None,src),S('pivot','Ø 2.8 ±0.02 to 2.7 (1:70), 6.5 +0.1',None,src),S('stub','Ø 1.6 +0.1/+0.05, 1:70, drawn 1.675 at its middle',None,src),S('shoulders',f'{F["len"]} apart',None,src)],src),
         Cut(sq,'Mill the winding square, 1:100',[S('square','3,1 r6 across the flats at its root (3.12), 1:100 to its point',None,src),S('length',f'{F["LS"]} to the tip',None,src)],src,at=(0,0)),
         TurnAway([(0,yP-0.2),(R0+0.3,yP-0.2),(R0+0.3,yP+(R0+0.3)/tA),(0,yP)],'Turn the point through the square',[S('point',f'a cone of half-angle {F["ang"]}° (scaled on 05 06_15 at 7.0 px/mm: likely)',None,src)],src),
         Drill(o,u,2*F['VPR'],6,'Drill the cross hole and ream it taper with the Vorreiber\'s pin, at assembly',[S('',f'Ø 1.1, reamed taper (drawn straight Ø {2*F["VPR"]:.2f}), 2 from the dial-side shoulder (17.7 -0.05 from the far one)',None,src)],key='vp')]
    return Recipe('fuseeArbor','050604-1','Fusee arbor (Schneckenwelle)',src,'Präz. Rundstahl 7,5 (05 06 04-1), polished where marked','hardened (as an arbor; the sheet marks the polished faces)',
      [Setup('1','between centres; the square and point on the mill, the cross hole at assembly',ops)],page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),
      fits=['the collar Ø 7.04 -0.01 pressed into the fusee body\'s bore','the journal running in the fusee bush, reamed to it'])
def barrelArbor():
    X=W();B=X['WD']['BAR'];P=X['BARprof'];q=B['sqr'];BSQ=P[0][1];yL=BSQ-q['L'];yE=yL-q['tl'];R0=q['a']/math.sqrt(2)+0.01;src='05 07 02-1 (020704-1, the first sheet)'
    Q=[(0,yE),(R0,yE),(R0,BSQ)]+[tuple(p) for p in P[1:]]
    def sq():
        body=bd.Solid.make_loft([_square(q['b']/math.sqrt(2),yL),_square(q['a']/math.sqrt(2),BSQ)])+bd.Solid.make_loft([_square(q['tip'],yE),_square(q['b']/math.sqrt(2),yL)])
        return bd.Cylinder(R0+0.2,BSQ-yE+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,yE-0.01)))-body
    ops=[Blank(14,yE-0.05,P[-1][1]+0.05,'Cut the blank from Präz. Rundstahl 14 between centres',[S('length',f'{P[-1][1]-yE:.2f}',None,src)],src),
         TurnProfile(Q,'Turn the core and its journals: the core Ø 13.3 with its chamfered ends, the journals, the shoulders 22.29 apart, the dial end domed',
           [S('core','Ø 13.3',None,src),S('journals','Ø 4.48 (r 2.24) and Ø 3.88 at the square\'s end (r 1.94)',None,src),S('shoulders',f'{B["BA0"]-B["BA1"]:.2f} apart','22.2 +0.1',src)],src),
         Cut(sq,'Mill the winding square and its point',[S('square',f'{q["a"]} tapering to {q["b"]} across the flats over {q["L"]}',None,src),S('point',f'to {q["tip"]} over {q["tl"]}',None,src)],src,at=(0,0)),
         RadialDrill((P[4][1]+P[8][1])/2,0.65,6.65,2.0,"Drill the hook's hole radially into the core's middle",[S('',"Ø 2, 6 deep to r 0.65 (0207's section: the drill's point at r 0.65; the page bores it flat)",None,src+'; fusee.js hookSet')],key='hook')]
    return Recipe('barrelArbor','050702-1','Barrel arbor (Federkern)',src,'Präz. Rundstahl 14 (05 07 02-1)','hardened (05 07 02-1)',[Setup('1','between centres; the square on the mill',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),expect=[{'at':(0,0),'r':7,'max':0.03,'why':"tessellation, not a fault: the page's hook hole is a 24-sided bore cut at the hook's turn into its 48-sided lathe; the check fits the hole's free angle to the page's walls"}],fits=['its journals running in the barrel\'s bosses','the hook 05 07 02-2 in the core'])

# ---------------- batch 9b: the fusee's and barrel's other made parts, from WD.FU (dims.js; fusee.js reads the same) ----------------
@functools.lru_cache()
def WF():
    """WD.FU (the fusee's stack and its parts' tables), its profiles and the fusee wheel's teeth (train.js's teeth(), the same function as fusee.js's copy), WD.FA, WD.BAR"""
    js=("const W=require(%r)({train:true}),F=W.WD.FU;process.stdout.write(JSON.stringify({FU:F,VRprof:F.VR.prof(),FWprof:F.FW.prof(),FWxy:W.WTRAIN.teeth(...F.FW.teeth).xy,"
        "FA:W.WD.FA,BAR:W.WD.BAR,BARprof:W.WD.BAR.prof(),DRUMprof:W.WD.BAR.drum(),LIDprof:W.WD.BAR.lidP(),INNER:W.WD.INNER,TOP_T:W.WD.TOP_T,H:W.WD.H}))")%str(TOOLS/'wempe_load.js')
    return json.loads(subprocess.run(['node','-e',js],capture_output=True,text=True,check=True).stdout)
UP=lambda:page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0))   # the part's (X, Y, Z) onto the page's (X, Z, -Y): a shape's (x, y) is the part's, its height the page's y
def _poly(L,z=0):
    """a closed polygon's face at height z from a list of points (repeats dropped)"""
    Q=[q for i,q in enumerate(L) if i==0 or abs(q[0]-L[i-1][0])+abs(q[1]-L[i-1][1])>1e-9]
    if math.dist(Q[0],Q[-1])<1e-9:Q=Q[:-1]
    return bd.Face(bd.Wire.make_polygon([bd.Vector(x,y,z) for x,y in Q],close=True))
def _disc(r,z0,z1):return bd.Cylinder(r,z1-z0,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,z0)))
def _rev_at(at,pts):
    from . import _rev
    return _rev(pts).moved(bd.Location((at[0],at[1],0)))
def _sink(at,r0,z0,r1,z1):
    """a cone on its own axis at (x, y): r0 at z0 (the face it is cut from) to r1 at z1, run on 0.01 past z0 along its own slope"""
    s=(r1-r0)/(z1-z0);e=-0.01 if z1>z0 else 0.01;return _rev_at(at,[(0,z0+e),(r0+s*e,z0+e),(r1,z1),(0,z1)])
class Solid(Op):
    """stock already formed to a solid made by make() (a blank turned and cut at once: a cup with its toothed plate)"""
    kind='stock'
    def __init__(self,make,text,sizes=(),src=''):super().__init__(text,sizes,src);self.make=make
    def apply(self,p):return self.make()

def coverPlate():
    X=WF();U=X['FU'];D=U['DP'];y0,y1=U['DP0'],U['S'];src='05 06 00-4';at=tuple(D['at']);c=D['cl']*math.tan(math.radians(D['ca']))
    prof=[(D['hb'],y1),(D['R'],y1),(D['R'],y0+D['ch']),(D['R']-D['ch'],y0),(D['hb']+c,y0),(D['hb'],y0+D['cl'])]
    ops=[Blank(2*D['R']+0.5,y0-0.05,y1+0.05,'Cut the blank from Bandstahl 24 × 1 and face it to 0.8',[S('thickness',f"{D['t']}",'-0.1, drawn 0.8',src)],src),
         TurnProfile(prof,"Turn the outside, break its outer edge, bore the hole for the arbor's step and open it 60°",
           [S('outside',f"Ø {2*D['R']:.2f}",'21.1 -0.1, at the middle',src),S('edge',f"{D['ch']} × 45° on the outer face",'scaled 0.6-0.7 (likely)',src),
            S('hole',f"Ø {2*D['hb']:.3f}",'6.1 H8, at the middle',src),S('land',f"straight {D['t']-D['cl']:.1f} from the face on the body, then 60° from the axis to Ø {2*(D['hb']+c):.2f} at the outer face",'0.4 -0.1',src)],src),
         Drill((at[0],at[1],y0-0.01),(0,0,1),2*D['sp'],D['t']+0.02,'Drill the screw hole',[S('',f"Ø {2*D['sp']:.2f}",'1.85 -0.1, at the middle',src),S('place',f"{D['scr']['r']} from the centre, {D['scr']['off']} off the line along the stop bar's slot, away from the bar",'±0.05',src+'; 05 06 04-2')],src,key='scr'),
         Cut(lambda:_sink(at,D['sk'],y0,D['sp'],y0+D['skd']),'Sink it 90° from the outer face',[S('sink',f"Ø {2*D['sk']:.2f}",'3.1 +0.1, at the middle',src)],src,at=at)]
    ops[2].mz=y0+D['skd']+0.05   # measured under the sink
    return Recipe('coverPlate','050600-4','Cover plate (Deckplatte)',src,'Bandstahl 24 × 1 (05 06 00-4)','none (05 06 00-4 gives none)',[Setup('1','strip in the chuck, turned and bored; the screw hole on the drill',ops)],UP(),
      fits=["its hole 6.1 H8 on the arbor's step Ø 6.1 -0.05","held by one countersunk screw M1.7 (WN-20) in the fusee body"])

def dustPlate():
    X=WF();U=X['FU'];D=U['SP'];F=X['FA'];yT=F['yD']-F['len'];y1=yT-8-D['gap'];y0=y1-D['t'];src='05 06 00-1';yf=y0+D['recd']
    sq=lambda d:(F['SQ0']-d/100)/math.sqrt(2)-D['cl']   # half the hole's diagonal d from the square's root: line to line with the square, 0.002 on its half-diagonal
    prof=[(D['rec'],y0),(D['R'],y0),(D['R'],y1-D['ch']),(D['R']-D['ch'],y1),(0,y1),(0,yf),(D['rec'],yf)]
    dF=(y1-yf)+D['gap']   # the recess's floor from the square's root (3): the drawing's 1:100 runs the hole from there
    def hole():
        e=0.02;return bd.Solid.make_loft([_square(sq(dF+e),yf-e),_square(sq(D['gap']-e),y1+e)])
    ops=[Blank(8,y0-0.05,y1+0.05,'Cut the blank from Rundmessing 8',[S('length',f"{D['t']:.1f}",'3.1 -0.2, drawn 3.0',src)],src),
         TurnProfile(prof,'Turn the outside, break the edge on the face toward the plates, turn the recess in the face toward the key',
           [S('outside',f"Ø {2*D['R']:.2f}",'7.6 -0.1, at the middle',src),S('edge',f"{D['ch']} × 45°",'0.5 +0.2',src),S('recess',f"Ø {2*D['rec']:.2f} × {D['recd']}",'6.2 +0.1, at the middle',src)],src),
         Cut(hole,'Broach the square hole, tapered 1:100 as the square',[S('square',f"3.1 □ H7 +0.012, Kegel 1:100: line to line with the square, {2*sq(D['gap']):.3f} across the corners at its face toward the plates ({D['gap']} from the square's root)",None,src+'; 05 06_1 ("1")')],src,at=(0,0))]
    return Recipe('dustPlate','050600-1','Dust plate (Staubplatte)',src,'Rundmessing 8 (05 06 00-1)','none',[Setup('1','bar in the collet, turned and parted off; the square broached',ops)],UP(),
      fits=["pressed down the square's 1:100 taper until it holds, its face 1 from the square's root"],
      expect=[{'at':(0,0),'r':2.3,'max':0.006,'why':"the page's hole tapers from the square's size 3 from its root at the recess's mouth to 1 at the face (over 3 mm, 1:150), where the drawing's 1:100 runs from the recess's floor: 0.005 larger at the floor (a page fault, reported)"}])

def vorreiber():
    X=WF();U=X['FU'];V=U['VR'];F=X['FA'];P=[tuple(q) for q in X['VRprof']];src='05 06 00-2';a=U['PHI0']+V['hole']['a'];u=(math.cos(a),math.sin(a),0);y=U['VHF']-V['hole']['dy']
    ops=[Blank(14,P[3][1]-0.05,P[-1][1]+0.05,'Cut the blank from Präz. Rundstahl 14',[S('length',f"{P[-1][1]-P[3][1]:.2f}","3.1 -0.2: face a re-turned at the fusee's assembly",src)],src),
         TurnProfile(P,'Turn the flange, hub and bore; the recess in face a after it is re-turned at assembly',
           [S('flange',f"Ø {2*V['rf']:.3f}",'14 d11, at the middle',src),S('hub',f"Ø {2*V['rh']:.2f}",'7.6 -0.2',src),S('bore',f"Ø {2*(V['rb0']-V['fit']):.3f} at the hub face, 1:70",'4.4 H7, fitted to the arbor\'s seat at assembly',src),
            S('recess',f"Ø {2*V['r1']:.2f} × {V['rel']}",'9.9 +0.2 × 0.4 +0.05',src),S('chamfer',f"{V['ch']} × 45° on the flange's edge, the hub's side",'0.3 +0.1',src)],src),
         Drill((-5*u[0],-5*u[1],y),u,2*F['VPR'],10,"Drill the pin's hole across the hub 0.8, then ream it taper with the arbor's at assembly",
           [S('',f"Ø 0.8 drilled; reamed with the arbor to about Ø {2*F['VPR']:.2f} (a 1:50 reamer)",None,src+'; 05 06 04-1; 05 06_1'),S('place',f"{V['hole']['dy']} from the hub face",'±0.1',src)],src,key='pin')]
    return Recipe('vorreiber','050600-2','Vorreiber',src,'Präz. Rundstahl 14 (05 06 00-2)','none',[Setup('1','bar in the chuck, turned and parted off; the hole on the drill, reamed at assembly',ops)],UP(),
      fits=["its bore fitted to the arbor's 1:70 seat at assembly and pinned with the taper pin 05 06 00-5"])

def clickWheel():
    X=WF();U=X['FU'];C=U['CW'];z0=U['CW0'];t=U['CW1']-C['fl']-z0;src='05 06 04-3 (6.8.47)';rb=C['bore']/2
    ops=[Plate(_poly(C['o']),t,'Cut the blank from Messingblech 2 (Ms 58 federhart), face it to 1.95 and cut the 35 teeth',
           [S('thickness',f'{t:.2f}','2 -0.1',src),S('teeth',f"35; tips Ø {C['D']}, roots Ø {C['dg']}",'16.0 -0.05 and 14.5 -0.2, as drawn',src),S('faces',f"undercut {C['ang']}°, the tip overhanging its root",'scaled about 10° (sure)',src)],src),
         Hole((0,0),C['bore'],'in',t,None,'Bore it',[S('',f"Ø {C['bore']}",'7.5 +0.05, at the middle',src)],src,key='bore'),
         Cut(lambda:_sink((0,0),rb+C['ch'],0,rb,C['ch']),'Chamfer the bore on the face that lies on the recess floor',[S('chamfer',f"{C['ch']} × 45°",'0.3 +0.2, at the middle',src)],src,at=(0,0))]
    for i,h in enumerate(C['holes']):
        h=tuple(h);ops.append(Hole(h,2*C['h0'],'in',t,None,f'Drill screw hole {i+1}',[S('',f"Ø {2*C['h0']:.1f}",None,src),S('place',f"on Ø {2*C['pc']} at 120°, {C['a0']}° from the chain's pin",'Ø 11.5 ±0.05; the angle ±2° (05 06 04-2 C-D)',src)],src,key=f'h{i+1}'))
        ops[-1].mz=0.02   # measured at the face on the recess floor, where the 1:8 opening is the drill's Ø 2
        ops.append(Cut((lambda h=h:_sink(h,C['h1'],t,C['h0'],0)),f'Open hole {i+1} 1:8 toward the free face',[S('',f"to Ø {2*C['h1']:.2f} at the free face",None,src)],src,at=h))
    return Recipe('clickWheel','050604-3','Click wheel (Schneckensperrrad)',src,'Messingblech 2, Ms 58 federhart (05 06 04-3)','none',[Setup('1','on the wheel-cutting engine; the holes on the drill',ops,view='top')],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,z0,0)),faces=('face on the recess floor','free face'),fits=["screwed to the fusee body's recess floor by three M2 (WN-19), their heads in the 1:8 openings"])

def fuseeWheel():
    X=WF();U=X['FU'];F=U['FW'];P=[tuple(q) for q in X['FWprof']];W_,WT,WL,WW,WTB=U['W'],U['WT'],U['WL'],U['WW'],U['WTB'];src='05 06 00-3';ro=F['teeth'][2]/2
    env=[P[0],P[1],P[2],P[3],P[4],(F['web'],WW),(F['web'],WT),(F['lip'],WT),(F['lip'],WL),(ro+0.05,WL),(ro+0.05,W_),P[7],P[8],P[9],P[10]]
    a=-math.pi/2-math.radians(F['pin']['a']);pw=(F['pin']['r']*math.cos(a),F['pin']['r']*math.sin(a))
    ops=[Blank(2*ro+0.5,WTB-0.05,W_+0.05,'Cut the blank from Messingblech 5,5 (Ms 58 federhart)',[S('thickness',f'{W_-WTB:.1f} over the tube',None,src)],src),
         TurnProfile(env,"Turn the hub, its tube, the web, the lip, the ledge and the rim; bore it; turn the underside's recess and its 60° mouth",
           [S('tube',f"Ø {2*F['tube']:.2f}, {W_-WTB:.1f} from the underside",'6.5 g6 (05 06_1), 5 +0.2',src),S('bore',f"Ø {2*F['bore']:.2f}","estimated (README, Estimated): 0.04-0.06 clear on the arbor's 1:70 seat",src),
            S('hub',f"Ø {2*F['hubD']:.1f} at the web, its face {WW-(W_-2.22):.2f} under the web's top, a 45° flank",'16.6 -0.2',src),S('web',f"{W_-WW:.2f} thick out to Ø {2*F['web']:.1f}",'1.22 -0.04; the recess 32.3 +0.05',src),
            S('lip',f"Ø {2*F['web']:.1f} to {2*F['lip']:.1f}, {W_-WT:.2f} thick",'2.62 -0.04; 33.8 -0.2',src),S('rim and ledge',f"{W_-WL:.2f} thick",'0.2 +0.02 under the lip',src),
            S('recess',f"Ø {2*F['rec']:.1f} × 1.3, its mouth 60° from the axis from Ø {2*F['RM']:.1f}",'14 +0.1 × 1.3 -0.1; 17 +0.2',src)],src),
         CutLeaves(X['FWxy'],ro+0.2,WL,W_,"Cut the 90 teeth (a wheel cutter of the sheet's cycloidal form)",[S('teeth',f"z {F['teeth'][0]}, m {F['teeth'][1]}, tip Ø {F['teeth'][2]} (hobbed), root Ø {F['teeth'][3]}, tooth {F['teeth'][5]} on the pitch circle",None,src),S('form','cycloidal for the centre pinion of 14',None,'train.js teeth()')],src,z=F['teeth'][0]),
         Drill((pw[0],pw[1],WW-0.01),(0,0,1),2*F['pin']['d'],W_-WW+0.02,"Drill and ream the maintaining spring's pin hole through the web",[S('',f"Ø {2*F['pin']['d']:.3f}",'1.2 H8, at the middle',src),S('place',f"r {F['pin']['r']} at {F['pin']['a']}° (05 06 01-1's angle)",'14.2 -0.02',src)],src,key='pin')]
    return Recipe('fuseeWheel','050600-3','Fusee wheel (Schneckenrad)',src,'Messingblech 5,5 Ms 58 federhart (05 06 00-3)','gilt (Wempe 3955)',[Setup('1','in the chuck, turned and bored; the teeth on the wheel-cutting engine; the pin hole on the drill',ops)],UP(),
      fits=["its tube 6.5 g6 in the maintaining ratchet's 6.5 H7","turning on the arbor's 1:70 seat, held from below by the Vorreiber"])

def maintRatchet():
    X=WF();U=X['FU'];R=U['MR'];G,GT,GP,GC=U['G'],U['GT'],U['GP'],U['GC'];src='05 06 02-1 (revised 11.3.48)';c0,c1,c2=R['cup']
    bk=lambda ab:-math.pi/2-math.radians(ab)   # fusee.js's bk(ab, 0): an angle in a sheet seen from the back
    sh=lambda r,a:(r*math.cos(a),r*math.sin(a))
    ph=sh(R['pin']['r'],bk(0));ck=[sh(R['ck']['r'],bk(a)) for a in R['ck']['a']];spy=GP-R['rv']['dy'];th=iso(1.7)
    def body():   # the teeth's plate GT..G, the cup's wall GC..G out to r c1 (its chamfer to c2), the floor GP..G inside the cup: one solid
        from . import _rev
        plate=bd.extrude(_poly(R['o'],GT),G-GT,dir=(0,0,1))
        cup=_rev([(0,GC),(c1,GC),(c2,GC+(c2-c1)),(c2,G),(0,G)])
        return plate+cup-_rev([(0,GC-0.1),(c0,GC-0.1),(c0,GP),(0,GP)])
    ops=[Solid(body,'Turn the blank from Messingblech 3,5 (Ms 58 federhart): the plate, the cup and its floor; cut the 120 teeth',
        [S('teeth',f"120; tips Ø {R['D']}, {R['dp']} deep, the steep faces toward the detent",'37.25 -0.1 (revised from 37.5), 0.7 +0.05',src),S('plate',f'{G-GT:.2f} at the teeth','1.02 -0.02',src),
         S('cup',f"Ø {2*c1:.1f} outside, {2*c0:.2f} inside, {G-GC:.1f} over all, its floor {G-GP:.2f}",'26.1 -0.2, 24.45 +0.1, 3.1 -0.2, 1.3 -0.1',src),S('chamfer',f"{c2-c1:.1f} × 45° on the cup's outer top edge",'0.3 +0.15 (revision a)',src)],src),
         Drill((0,0,GP-0.01),(0,0,1),2*R['bore'],G-GP+0.02,'Bore it',[S('',f"Ø {2*R['bore']:.4f}",'6.5 H7, at the middle',src)],src,key='bore'),
         Drill((ph[0],ph[1],GP-0.01),(0,0,1),2*R['pin']['d'],G-GP+0.02,"Drill and ream the maintaining spring's eye pin hole",[S('',f"Ø {2*R['pin']['d']:.3f}",'1.2 H8',src),S('place',f"r {R['pin']['r']}, at 6 o'clock between the clicks",None,src)],src,key='pin')]
    for i,c in enumerate(ck):ops.append(Drill((c[0],c[1],GP-0.01),(0,0,1),th['D1'],G-GP+0.02,f"Drill and tap M1.7 for click screw {i+1}",[S('',f"M1.7, tap drill Ø {th['D1']:.3f}",None,src),S('place',f"{2*R['ck']['r']:.3f} apart at 9 and 3 o'clock",'19.5 +0.05',src)],src,thread=th,key=f'ck{i+1}'))
    for k,a in enumerate(R['rv']['a'][:2]):
        aa=bk(a);u=(-math.cos(aa),-math.sin(aa),0);o=(R['rv']['at']*math.cos(aa),R['rv']['at']*math.sin(aa),spy)
        ops.append(Drill(o,u,2*R['rv']['r'],2*R['rv']['at'],f"Drill the click springs' rivet holes across the cup ({a}° and {(a+180)%360}°)",[S('',f"Ø {2*R['rv']['r']:.1f}",None,src),S('place',f"{R['rv']['dy']} over the cup's floor, at {a}° and {(a+180)%360}° from 6 o'clock",None,src)],src,key=f'rv{k}'))
    return Recipe('maintRatchet','050602-1','Maintaining ratchet (Gegensperrrad)',src,'Messingblech 3,5 Ms 58 federhart (05 06 02-1)','gilt (Wempe 3955)',[Setup('1','in the chuck: turned, bored, the teeth on the wheel-cutting engine; the holes on the drill',ops)],UP(),
      fits=["its bore 6.5 H7 on the fusee wheel's tube 6.5 g6, turning","the clicks' screws M1.7 from under the plate"])

def setupRatchet():
    X=WF();U=X['FU'];R=U['SR'];B=X['BAR'];TT=-X['INNER']-X['TOP_T'];RS0=TT-R['BB']-R['gap'];RS1=RS0-R['t'];BSQ=B['BA1']-B['sq'];src='05 07 00-3 (revised 24.11.47)'
    sq=lambda y:(R['sq']-(BSQ-y)*R['tp']+R['cl'])/math.sqrt(2)
    def hole():
        e=0.02;return bd.Solid.make_loft([_square(sq(RS1-e),RS1-e),_square(sq(RS0+e),RS0+e)])
    ops=[Plate(_poly(R['o'],RS1),R['t'],'Cut the blank from Messingblech 3 (Ms 58), face it to 2.65 and cut the 16 teeth',
           [S('thickness',f"{R['t']}",'2.65 -0.1, drawn 2.6',src),S('teeth',f"16; tips Ø {2*R['rt']:.1f}, roots Ø {2*R['rr']:.1f}; each face on a line {R['off']} off the radius; each back an arc r {R['RBK']} whose centre lies on the Ø 6.4 circle",'14.1 -0.2, 11.1 -0.2 (drawn 14.0, 11.0)',src)],src,spin=True),
         Cut(hole,"Broach the square hole, tapered 1:100 as the arbor's square",[S('square',"2.7 H7, Kegel 1:100: line to line with the square, 0.002 over it across",None,src)],src,at=(0,0))]
    r=Recipe('setupRatchet','050700-3','Set-up ratchet (Sperrad)',src,'Messingblech 3 Ms 58 (05 07 00-3)','gilt (Wempe 3955)',[Setup('1','on the wheel-cutting engine; the square broached',ops,view='top')],UP(),
      fits=["pressed down the arbor's 1:100 square to 0.05 off the barrel bridge"],notes=["Turned on its square to where the click's beak lies against a face: the check fits that turn (the page's search against the frame's click)."])
    r.free_spin=(2*math.pi/R['z'],2*R['sq']/math.sqrt(2));return r   # the teeth's period; the square hole (inside its own diagonal) stays on the arbor's square

# ---------------- the barrel as last revised (05 07 01, 20.4.48): WD.BAR ----------------
def _rect(a,r0,r1,w):
    """fusee.js's rect() (a slot's outline along the plan angle a, from r0 to r1, w wide) in the part's (x, y): the page's plan [x, z] is (x, -y)"""
    u=(math.cos(a),math.sin(a));v=(math.sin(a),-math.cos(a))
    return [(u[0]*r+v[0]*t,u[1]*r+v[1]*t) for r,t in ((r0,w/2),(r1,w/2),(r1,-w/2),(r0,-w/2))]
def _prism(L,z0,z1):return bd.extrude(_poly(L,z0),z1-z0,dir=(0,0,1))
def _barrel():
    X=WF();B=X['BAR'];BB=B['BB'];BR=BB-B['h'];BLT=BR;BLU=BLT+B['lu'];return X,B,B['dr'],BB,BLT,BLU,B['BLK']-math.pi/4
def drum():
    X,B,D,BB,BLT,BLU,LS=_barrel();P=[tuple(q) for q in X['DRUMprof']];src='05 07 01-1 (revised 11.3.48 and 20.4.48)';BLK=B['BLK'];yr=BB-D['rv']['y'];th=iso(2.6);C=D['cs']
    u=(math.cos(BLK),math.sin(BLK),0);sl=_rect(LS,D['sl']['r0'],D['sl']['r1'],D['sl']['w'])
    cs={'a':BLK-5*math.pi/4,'y':(BB-B['bi']+BLU)/2,'sb':1}   # the chain's slot: 225° behind the rivet hole (0207); its height and lean's sense where the laid chain's hook comes (the page's, set by page_params; the STEP's at the drum's middle)
    def slot():
        a,y,sb=cs['a'],cs['y'],cs['sb'];rh=(math.cos(a),math.sin(a));th_=(-math.sin(a),math.cos(a));d=((rh[0]-sb*th_[0])*math.sqrt(0.5),(rh[1]-sb*th_[1])*math.sqrt(0.5))
        o=(C['rm']*rh[0]+C['from']*d[0],C['rm']*rh[1]+C['from']*d[1]);sw=C['w']*math.sqrt(0.5)
        return bd.Box(8,2*sw,2*C['h'],align=(bd.Align.MIN,bd.Align.CENTER,bd.Align.CENTER)).moved(bd.Location((o[0],o[1],y),(0,0,1),math.degrees(math.atan2(d[1],d[0]))))
    BR=BLT;ops=[Blank(2*D['R']+0.5,BR-0.05,BB+0.05,'Draw the cup from brass (Ms) and turn it',[S('','drawn from a deep-drawn cup (R 05 07 01-1)',None,src)],src),
         TurnProfile(P,"Turn the outside, the bottom with its boss, the bore and the lid's seat",
           [S('outside',f"Ø {2*D['R']}",'41.6 -0.1, as drawn',src),S('inside',f"Ø {2*D['ri']}",'38.5 +0.1',src),S('height',f"{BB-BR:.2f}",'18.1 -0.15, drawn 18.08',src),
            S('bottom',f"{B['bi']}, its boss's face {B['bf']} from the outside: the land Ø {2*D['land']}, 45° to the face Ø {2*D['boss']}",'1.25 -0.1; 3.1 -0.1',src),S('bore',f"Ø {2*D['bore']}",'4.5 +0.1, drawn 4.55',src),
            S("lid's seat",f"{B['lu']} deep, Ø {2*D['seat']} at the rim to {2*D['seatU']} at its floor (5°)",'Ø 39.2 s6; 1.2 (bracketed by revision a)',src+'; 05 07 01-2'),S('edge',f"the bottom's outer edge broken {D['chY']}",None,src)],src),
         Cut(lambda:_prism(sl,BB-D['sl']['d'],BB+0.01),"Mill the Steg's slot through the bottom at the wall",[S('slot',f"{D['sl']['w']} wide, from r {D['sl']['r0']} to {D['sl']['r1']}",'2 +0.05; 0.95 +0.15 from the bore; 0.8 +0.05 across (revision b)',src)],src,at=(0,0)),
         Drill((D['rv']['from']*u[0],D['rv']['from']*u[1],yr),u,th['D1'],3,'Drill and tap M2.6 through the wall for the hook block',[S('',f"M2.6 at {D['rv']['y']} from the bottom's face, 45° from 9 o'clock",'9.05 ±0.05',src)],src,thread=th,key='rv'),
         Cut(slot,"Cut the slot for the chain's hook through the wall, at the fusee's assembly where the laid chain's hook comes, 45° to the radius",
           [S('slot',f"{2*C['w']} round the drum at the rim ({2*C['w']*math.sqrt(0.5):.2f} across), {2*C['h']} along the axis",'0207: 2,5 and 45°',"0207 (127-556.04 U24)"),S('place',"225° behind the hook block's rivet hole (0207), at the hook's height",None,'0207')],src)]
    def pp(ud):
        s=ud.get('slot_chain')
        if s and len(s)>=5:cs.update(a=s[3],y=s[4],sb=s[2])
    r=Recipe('drum','050701-1','Barrel drum (Federhaustrommel)',src,'Ms (brass), deep-drawn (05 07 01-1)','gilt (Wempe 3955)',[Setup('1','the drawn cup in the chuck, turned and bored; the slots and hole on the mill',ops)],UP(),
      fits=['the lid sprung into its seat (Ø 39.2 s6)','its bosses running on the arbor\'s journals'],notes=["The chain's slot is cut at the fusee's assembly where the laid chain's hook comes to the drum (0207: 225° behind the hook block's hole, 45° to the radius); the STEP file puts it at the middle of the drum's inside, the page near the lid, where the chain's hook lies."],
      expect=[{'at':(20.0*u[0],20.0*u[1]),'r':1.5,'max':0.3,'vol':math.pi*(1.32**2-(th['D1']/2)**2)*(D['R']-D['ri']),'why':"the hook block's M2.6 hole: the page draws it plain at the thread's size and 0.02 (Ø 2.64), the recipe at the tap drill (the threads' convention)"},
              {'at':tuple((q1+q2)/2 for q1,q2 in zip(sl[0],sl[2])),'r':1.2,'max':0.36,'why':"the Steg's slot: the page's pocket runs 1.6 deep, through the bottom's 1.25 into the drum's hollow, and leaves its floor there as a stray face 0.35 under the bottom (facePocket; a page fault, reported)"}])
    r.page_params=pp;return r
def lid():
    X,B,D,BB,BLT,BLU,LS=_barrel();P=[tuple(q) for q in X['LIDprof']];L=B['lid'];src='05 07 01-2 (revised 20.4.48)';e=0.01
    ops=[Blank(2*D['seatU']+0.5,BLT-0.05,BLT+B['lf']+0.05,'Cut the blank from Ms 58 and turn it',[S('','',None,src)],src),
         TurnProfile(P,"Turn the edge to the seat's 5°, the boss and the bore",
           [S('thickness',f"{B['lu']:.1f}",'1.3 -0.1 at its least, its face flush with the rim',src+'; 05 07 01'),S('edge',f"5°: Ø {2*D['seat']} at its face to Ø {2*D['seatU']} at its underside",'sprung into the seat Ø 39.2 s6',src),
            S('boss',f"{B['lf']} from its face: the face Ø {2*D['boss']}, 45° to Ø {2*D['land']}",'3.3 -0.1',src),S('bore',f"Ø {2*D['bore']}",None,src)],src),
         Cut(lambda:_prism(_rect(LS,L['no']['r0'],23,L['no']['w']),BLT-e,BLU+e),"Mill the Steg's notch at 9 o'clock",[S('notch',f"{L['no']['w']} wide to r {L['no']['r0']}",'2 +0.05; 18.3 ±0.02',src)],src,at=(0,0)),
         Cut(lambda:_prism(_rect(LS+math.pi,D['seatU']-L['pr']['dr'],23,L['pr']['w']),BLT-e,BLU+e),'Mill the prising notch at 3 o\'clock',[S('notch',f"{L['pr']['w']} wide, {L['pr']['dr']} deep from its Ø {2*D['seatU']}",'2.7 +0.1 × 2 +0.2',src)],src,at=(0,0))]
    return Recipe('lid','050701-2','Barrel lid (Federhausdeckel)',src,'Ms 58 (05 07 01-2)','gilt (Wempe 3955)',[Setup('1','in the chuck, turned and bored; the notches on the mill',ops)],UP(),fits=['sprung into the drum\'s seat ("eingesprengt")'])
def steg():
    X,B,D,BB,BLT,BLU,LS=_barrel();G=B['steg'];src="05 07 00-1 (0207's part 106; 05 07 01-1's slot, 05 07 01-2's notch)"
    ops=[Plate(_poly(_rect(LS,G['r0'],G['r1'],2*G['w']),BLT),BB-BLT,'Cut the strip to length',[S('section',f"{2*G['w']:.0f} × {G['r1']-G['r0']:.1f}",'0207: 2 and 0,5',src),S('length',f"{BB-BLT:.2f}, its ends flush with the bottom's and the lid's outer faces",'0207 (likely)',src)],src)]
    return Recipe('steg','050700-1','Steg (spring brace)',src,'steel strip (0207 colours it steel)','none given',[Setup('1','strip cut to length',ops,view='top')],UP(),
      fits=["its ends in the bottom's slot and the lid's 9 o'clock notch, its inner face on the notch's bottom"])
def hookBlock():
    X,B,D,BB,BLT,BLU,LS=_barrel();K=B['hook'];src='05 07 01-3 (05 07 01-1, 0207)';BLK=B['BLK'];yb=BB-D['rv']['y'];th=iso(2.6);ri=D['ri'];ro=ri-K['d']
    a0=BLK-K['b0']/ri;a1=BLK+K['b1']/ri;u=(math.cos(BLK),math.sin(BLK),0);V=lambda r,a:bd.Vector(r*math.cos(a),r*math.sin(a),yb-K['h'])
    w=bd.Wire([bd.Edge.make_three_point_arc(V(ri,a0),V(ri,(a0+a1)/2),V(ri,a1)),bd.Edge.make_line(V(ri,a1),V(ro,a1)),bd.Edge.make_three_point_arc(V(ro,a1),V(ro,(a0+a1)/2),V(ro,a0)),bd.Edge.make_line(V(ro,a0),V(ri,a0))])
    ops=[Plate(bd.Face(w),2*K['h'],'Cut the block from steel and turn its outer face to the bore\'s radius, its inner face concentric',
           [S('size',f"{K['b0']+K['b1']:.0f} round the bore, {K['d']} deep, {2*K['h']:.2f} high",'0207: "6"; 05 07 01: 0.5; 3.05 -0.1',src),S('place',f"its middle {D['rv']['y']} from the bottom's face; the hole {K['b1']} from its far end",'0207 (likely ±0.5)',src)],src),
         Drill((K['from']*u[0],K['from']*u[1],yb),u,th['D1'],4,'Drill and tap M2.6 through it',[S('','M2.6, on the drum\'s hole',None,'05 07 01-1')],src,thread=th,key='rv')]
    r=Recipe('hookBlock','050701-3','Hook block (Federhaushaken)',src,'steel (0207)','none given',[Setup('1','on the mill',ops,view='top')],UP(),
      fits=["screwed (riveted on the first drawing) inside the drum's wall by an M2.6 through it, its face concentric with the bore"],
      expect=[{'at':(19.0*u[0],19.0*u[1]),'r':1.5,'max':0.3,'vol':math.pi*(1.32**2-(th['D1']/2)**2)*K['d'],'why':"its M2.6 hole: the page draws it plain at the thread's size and 0.02 (Ø 2.64), the recipe at the tap drill (the threads' convention)"}])
    r.root_only=True;return r

# ---------------- batch 9c: the clicks, the stop bar, the maintaining detent (WD.FU.CK, SB, DT); the springs' strip and wire bought ----------------
def _arc3(c,r,a0,a1,P,p0=None,p1=None):
    """an exact arc about c from angle a0 to a1 (the sheet's frame), each point put through P into the part's frame; p0, p1 its ends where the page's construction
    puts them a few µm off the circle (the shared corner with the next edge: the arc then through them and its own middle)"""
    q=lambda a:P((c[0]+r*math.cos(a),c[1]+r*math.sin(a)));A=P(p0) if p0 else q(a0);B=P(p1) if p1 else q(a1)
    return bd.Edge.make_three_point_arc(bd.Vector(*A,0),bd.Vector(*q((a0+a1)/2),0),bd.Vector(*B,0))
def _line(p,q,P):return bd.Edge.make_line(bd.Vector(*P(p),0),bd.Vector(*P(q),0))
def _ang(c,p):return math.atan2(p[1]-c[1],p[0]-c[0])
def _chain(E):
    """a closed wire from edges in order, a straight bridge where one ends a few µm from the next's start (the page's arcs drawn from points a hair off their circles: the click's boss, 0.004; the detent's, 0.005)"""
    o=[]
    for i,e in enumerate(E):
        o.append(e);f=E[(i+1)%len(E)];a,b=e.position_at(1),f.position_at(0)
        if (a-b).length>1e-7:o.append(bd.Edge.make_line(a,b))
    return bd.Wire(o)
def clicks():
    X=WF();U=X['FU'];C=U['CK'];GP=U['GP'];t=C['t'];H=C['hole'];src='05 06 02-3';P=lambda q:(q[0],-q[1])   # the sheet's (x, y) mirrored (seen from the back)
    N,T,TC,T1,BB,q8=C['N'],C['T'],C['TC'],C['T1'],C['BB'],C['q8'];b0=(TC[0],C['B'])
    w=_chain([_line(b0,C['h0'],P),_arc3(C['C3'],C['r3'],_ang(C['C3'],C['h0']),_ang(C['C3'],N),P),_line(N,T,P),_arc3(q8,C['r8'],_ang(q8,T),_ang(q8,BB),P),
               _arc3((0,0),C['rb'],_ang((0,0),BB),C['TB'],P,p0=BB),_line((C['rb']*math.cos(C['TB']),C['rb']*math.sin(C['TB'])),T1,P),_arc3(TC,C['rt'],C['TB'],-math.pi/2,P)])
    ops=[Plate(bd.Face(w).moved(bd.Location((0,0,GP-t))),t,'Cut the click from Bandstahl 11 × 2 and grind it to 1.82; mill its outline',
           [S('thickness',f'{t}','1.82 -0.04',src),S('length',"10.01 over all",'10.05 -0.1',src),S('nose',f"2 high, its face at 85° to the base line, its foot 5.2 from the hole",'5.2 -0.1',src),
            S('base line',f"{-C['B']} under the hole, tangent to the boss Ø {2*C['rb']}",None,src),S('hollow',f"r {C['r3']} about ({C['C3'][0]}, {C['C3'][1]}) from the hole",None,src),S('back',f"r {C['r8']}",None,src),S('tail',f"its top edge tangent to the boss, rounded r {C['rt']}",'scaled',src)],src),
         Drill((0,0,GP-t-0.01),(0,0,1),2*H['r'],t+0.02,'Drill and ream the pivot hole',[S('',f"Ø {2*H['r']:.3f}",'1.2 H7',src)],src,key='pivot'),
         Cut(lambda:_sink((0,0),H['cr'],GP-t,H['r'],GP-t+H['cd']),'Open it to Ø 2.2 on the face on the cup\'s floor',[S('',f"Ø {2*H['cr']:.1f}, {H['cd']} deep",'scaled on the edge view (likely)',src)],src,at=(0,0)),
         Cut(lambda:_sink((0,0),H['sr'],GP,H['r'],GP-H['sd']),'Sink it 45° to Ø 1.7 on the free face',[S('',f"Ø {2*H['sr']:.1f}, {H['sd']} deep",'scaled (likely)',src)],src,at=(0,0))]
    ops[1].mz=GP-t+H['cd']+0.3
    return Recipe('clicks','050602-3','Maintaining click (Sperrkegel), two alike',src,'Bandstahl 11 × 2 (05 06 02-3)','hardened, blued at 295° (05 06 02-3)',[Setup('1','strip on the mill, then ground; hardened and blued',ops,view='top')],UP(),
      fits=["its hole 1.2 H7 turning on its screw's shoulder Ø 1.19 (WN-21)"],notes=['Two are made alike; on the ratchet each lies mirrored from its sheet (the sheet is seen from the fusee\'s small end).'])
def stopBar():
    X=WF();U=X['FU'];B=U['SB'];S0=U['S'];src='05 06 03-1 (no sheet: 05 06_4 Schnitt C-D, traced, and the coloured section)';P=lambda q:(q[0],-q[1])   # the bar's (u, v) mirrored, as fusee.js has it
    c=(B['lo']+B['rt'],B['N']+B['rt']);cu=(B['ru'],B['N']+B['rr']);e=math.asin((B['N']+B['rr']-B['F'])/B['rr']);d=math.radians
    pA=(c[0]+B['rt']*math.cos(d(150)),c[1]+B['rt']*math.sin(d(150)));pB=(c[0],c[1]-B['rt']);pE=(cu[0]+B['rr']*math.cos(-e),B['F'])
    w=bd.Wire([_arc3(c,B['rt'],d(150),d(270),P),_line(pB,(B['ru'],B['N']),P),_arc3(cu,B['rr'],-math.pi/2,-e,P),_line(pE,(B['lf'],B['F']),P),_line((B['lf'],B['F']),pA,P)])
    ops=[Plate(bd.Face(w).moved(bd.Location((0,0,S0))),B['t'],'Cut the bar from steel strip 1.45 thick and mill its outline',
           [S('thickness',f"{B['t']}",'the coloured section',src),S('width',f"{B['F']-B['N']:.2f}, a sliding fit in the slot's 2 H8",'estimated (g6 class)',src),S('length',f"{B['hi']-B['lo']:.2f}",'22.5, scaled',src),
            S('ends',f"the lower end's point rounded r {B['rt']}, its upper end's near side rounded r {B['rr']}",'traced on 05 06_4 C-D (12.2 px/mm, scaled 0.989)',src)],src),
         Cut(lambda:bd.Box(30,30,1,align=(bd.Align.MIN,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((B['ub'],0,S0+B['tt']))),'Mill its upper end thinner',[S('',f"{B['tt']} thick from {B['ub']} toward its upper end",'the coloured section 0.70 of its middle (estimated)',src)],src),
         Drill((B['sp'],-B['pin']['z'],S0+B['pin']['dy']),(0,-1,0),2*B['pin']['r'],4,"Drill its pin's hole across it",[S('',f"Ø {2*B['pin']['r']}",'for the pin 05 06 03-2, pressed',src),S('place',f"{-B['sp']} from the foot of the axis's perpendicular, {B['pin']['dy']} off its face",'05 06_4 C-D (likely ±0.1)',src)],src,key='pin')]
    return Recipe('stopBar','050603-1','Stop bar (Stellungssteg)',src,'steel (the coloured section)','hardened (as a stop: estimated)',[Setup('1','strip on the mill',ops,view='top')],UP(),
      fits=["sliding in the fusee's slot 2 H8, its spring 05 06 03-3 holding it out"])
def maintDetent():
    X=WF();U=X['FU'];D=U['DT'];DTU,DTL,DTT=U['DTU'],U['DTL'],U['DTT'];src='05 05 05-1 (05 05_12)';A=D['A'];h=D['hole']
    def P(q):x,y=-q[0],q[1];return (x*math.cos(A)-y*math.sin(A),x*math.sin(A)+y*math.cos(A))   # mirrored and turned onto the fusee, as fusee.js's DTX
    E,E1,C9,C18,h0=D['E'],D['E1'],D['C9'],D['C18'],D['h0']
    w=_chain([_arc3(C9,D['r9'],_ang(C9,h0),_ang(C9,E),P,p0=h0,p1=E),_line(E,E1,P),_arc3(C18,D['r18'],_ang(C18,E1),_ang(C18,(0,2.5)),P),_arc3((0,0),D['rb'],math.pi/2,2*math.pi+math.atan2(h0[1],h0[0]),P,p1=h0)])
    SA=D['SA'];SD=(-math.cos(math.radians(D['sa'])),-math.sin(math.radians(D['sa'])));Sq=(SA[0]-C9[0],SA[1]-C9[1]);Sb=Sq[0]*SD[0]+Sq[1]*SD[1];St=-Sb-math.sqrt(Sb*Sb-(Sq[0]**2+Sq[1]**2-D['r9']**2))
    S1=P(SA);S2=P((SA[0]+St*SD[0],SA[1]+St*SD[1]))
    def thin():   # the half-plane beyond the step line, away from the hole, from the tip's lower face DTT to the lower face
        dx,dy=S2[0]-S1[0],S2[1]-S1[1];L=math.hypot(dx,dy);n=(-dy/L,dx/L);sg=1 if n[0]*(0-S1[0])+n[1]*(0-S1[1])<0 else -1;n=(sg*n[0],sg*n[1])   # n away from the hole
        m=((S1[0]+S2[0])/2,(S1[1]+S2[1])/2)
        return bd.Box(60,60,DTL-DTT+0.02,align=(bd.Align.CENTER,bd.Align.MIN,bd.Align.MIN)).moved(bd.Location((m[0],m[1],DTT),(0,0,1),math.degrees(math.atan2(n[1],n[0]))-90))
    ops=[Plate(bd.Face(w).moved(bd.Location((0,0,DTU))),DTL-DTU,'Cut the click from Bandstahl 2,25 × 18, face it to 2 and mill its outline',
           [S('thickness',f'{DTL-DTU:.0f}',None,src),S('back',f"r {D['r18']}",None,src),S('hollow',f"r {D['r9']} about ({C9[0]}, {C9[1]}) from the hole, tangent to the boss Ø {2*D['rb']}",None,src),
            S('tip',"its lower corner on r 12 about the hole, its end 2.6 tall at 80°, leaning back",'r 12 ±0.1; "2,6", "80°" (sure)',src)],src),
         Cut(thin,'Mill the tip thin from the step: 1 thick at the upper face',[S('tip','1 -0.03 thick',None,src),S('step',f"from the back {SA[0]} from the hole at {D['sa']}° to the line through the boss's underside, down to the hollow",'"8,6", "150°"',src)],src),
         Cut(lambda:_rev_at((0,0),[(0,DTU-0.01),(h['r']-0.01/h['tp'],DTU-0.01),(h['r']+(DTL-DTU+0.01)/h['tp'],DTL+0.01),(0,DTL+0.01)]),'Drill and ream the hole 1:70',[S('',f"Ø {2*h['r']} at its upper face, opening 1:70 toward the arbor's lower shoulder",'2.25 H7, Kegel 1:70',src)],src,at=(0,0))]
    return Recipe('maintDetent','050505-1','Maintaining detent (Gegensperrkegel)',src,'Bandstahl 2,25 × 18 (05 05 05-1)','hardened in oil, light blue at 310°, round the hole 400° (05 05 05-1)',[Setup('1','strip on the mill; hardened and blued',ops,view='top')],UP(),
      fits=["staked on its arbor 05 05 05-2's 1:70 seat, 6.3 ±0.1 from the arbor's lower shoulder to its upper face"])
# ---------------- the detent (Gangfeder 05 04 01-1 = 1436), the gold spring (Goldfeder 05 04 01-2), the locking stone (Ruhestein 05 04 01-3): WESC.DET ----------------
# The page draws the detent in its own frame, t along the blade from the stone toward the foot and n across toward the wheel (escapement.js's D(t, n), TD), each piece a prism
# in plan between two heights under the top plate's inner face (yd(d) = TI + d): the recipes' frame is that one, X = t, Y = s n (s so the frame is a proper turn), Z = d.
# Checked in recipes.py's frozen pose (lift 0, psDef 0: the detent's turning half on its fixed half's line, the gold spring unbent).
@functools.lru_cache()
def WDET():
    """WESC.DET (the detent's literals DETK, each version's options DETV, its frame), the horn's face and back sampled finely from WESC.HORN.line, and the gold spring's
    traced points (WESC.GOLD) for the version as last revised"""
    js=("const W=require(%r)(),E=W.WESC,D=E.DET,o=D.V.last,HL=E.HORN.line(o.th),N=400,ts=[];for(let i=0;i<=N;i++)ts.push(D.K.hb-(D.HORN_L+D.K.hb)*i/N);ts.push(-D.HORN_L+D.K.bev);ts.sort((a,b)=>b-a);"
        "const g1=E.GB[1]+o.gs;process.stdout.write(JSON.stringify({...D,o,GB:E.GB,FOOT0:E.FOOT0,SPR0:E.SPR0,SMID:E.SMID,hw:ts.map(t=>[t,HL.w(t),HL.b(t)]),gold:E.GOLD(g1),g1}))")%str(TOOLS/'wempe_load.js')
    return json.loads(subprocess.run(['node','-e',js],capture_output=True,text=True,check=True).stdout)
def _detFrame():
    X=WDET();t,n=X['TD']['t'],X['TD']['n'];s=1 if n[0]*t[1]-t[0]*n[1]>0 else -1;P=X['P']
    return s,page_matrix([[t[0],s*n[0],0],[0,0,1],[t[1],s*n[1],0]],(P[0],X['TI'],P[1]))
def _tn(L,s):return [(t,s*n) for t,n in L]
def _box(t0,t1,n0,n1,z0,z1,s):return _prism(_tn([(t0,n0),(t1,n0),(t1,n1),(t0,n1)],s),z0,z1)
def _crom(Q):
    """escapement.js dv's cr: Catmull-Rom through the points, six steps a span"""
    o=[list(Q[0])]
    for i in range(len(Q)-1):
        p0,p1,p2,p3=Q[max(0,i-1)],Q[i],Q[i+1],Q[min(len(Q)-1,i+2)]
        for k in range(1,7):
            u=k/6;u2=u*u;u3=u2*u;o.append([0.5*(2*p1[j]+(-p0[j]+p2[j])*u+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*u2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*u3) for j in (0,1)])
    return o
def _offs(pts,w):
    """dv's offs: each point moved w/2 either side along the normal of its neighbours' chord"""
    L,R=[],[]
    for i in range(len(pts)):
        a,b=pts[max(0,i-1)],pts[min(len(pts)-1,i+1)];d=math.hypot(b[0]-a[0],b[1]-a[1]);u=((b[0]-a[0])/d,(b[1]-a[1])/d);nn=(-u[1],u[0])
        L.append((pts[i][0]+nn[0]*w/2,pts[i][1]+nn[1]*w/2));R.append((pts[i][0]-nn[0]*w/2,pts[i][1]-nn[1]*w/2))
    return L,R
def _sp(P,z=0):return bd.Edge.make_spline([bd.Vector(x,y,z) for x,y in P])
def _ln(a,b,z=0):return bd.Edge.make_line(bd.Vector(a[0],a[1],z),bd.Vector(b[0],b[1],z))
def detent():
    X=WDET();K=X['K'];o=X['o'];s,M=_detFrame();src='05 04 01-1 (1436, Rud. Grießbach 17.2.43, "Stahl"; 05 04_1)'
    ROW,DOFF,FOOT0,SPR0,SQ0,SMID,TP,HL=X['ROW'],X['DOFF'],X['FOOT0'],X['SPR0'],X['SQ0'],X['SMID'],X['TP'],X['HORN_L'];f=DOFF
    c=(2-o['w'])/2;z0F,z1F=o['d0']+c,o['d0']+2-c;b1=o['d0']+2-c;z0b=b1-o['wb'];zc=o['d0']+1;fh=o['tf']/2
    sp=K['sp'];hT=sp[0]+sp[1]*abs(TP-SMID)/sp[2]
    spring=[(SPR0,f-sp[3]),(TP,f-hT),(SMID,f-sp[0]),(FOOT0,f-sp[3]),(FOOT0,f+sp[3]),(SMID,f+sp[0]),(TP,f+hT),(SPR0,f+sp[3])]
    # the horn: its face toward the wheel HL.w, its back HL.b ground in toward the face over its last bev to tip at the end (dv's HB)
    hw=X['hw'];kink=-HL+K['bev']
    def HB(t,w,b):fr=max(0,min(1,(t+HL)/K['bev']));return w-(w-b)*(K['tip']/o['th']+(1-K['tip']/o['th'])*fr)
    face=[(t,w) for t,w,b in hw];back=[(t,HB(t,w,b)) for t,w,b in hw];ik=[i for i,(t,_,_) in enumerate(hw) if abs(t-kink)<1e-12][0]
    def horn():
        F=_tn(face,s);B=_tn(back,s);E=[_sp(F),_ln(F[-1],B[-1]),_sp(B[ik:][::-1]),_sp(B[:ik+1][::-1]),_ln(B[0],F[0])]
        return bd.extrude(bd.Face(bd.Wire(E)).moved(bd.Location((0,0,b1-o['wh']))),o['wh'],dir=(0,0,1))
    pipe=lambda:_disc(K['pR'],o['pp'],o['pp']+o['pl'])
    def body():
        return (_box(FOOT0,FOOT0+K['foot'],f-fh,f+fh,z0F,z1F,s)+_prism(_tn(spring,s),z0F,z1F)+_box(SQ0,SPR0,f-o['tq']/2,f+o['tq']/2,z0F,z1F,s)
                +_box(SQ0-K['thk'],SQ0,f-o['tq']/2,f+o['tq']/2,z0b,b1,s)+_box(K['b0'],SQ0-K['thk'],-o['tb']/2,o['tb']/2,z0b,b1,s)+pipe()+horn())
    u=(0,s,0)
    ops=[Solid(body,"Mill the detent from a steel block in one piece: the foot, the spring and the square at full height, the blade and its thicker part on their lower edge, the pipe on the blade's end, the horn on past it",
           [S('foot',f"{K['foot']} long, {o['tf']:.2f} thick, {o['w']} high",'1436: 0,65 (0,60), 2 (1,9); the bracketed figures as finished (inferred)',src),
            S('spring',f"{FOOT0-SPR0:.0f} long, {2*sp[3]:.2f} thick at its ends, {2*sp[0]:.2f} at its middle, straight between; {2*hT:.3f} at the bending point {TP-SPR0:.2f} from the square","1436's left view 0,09 / 0,07 (sure); the bending point 05 04_1 (12.52 from the stone)",src),
            S('square',f"{SPR0-SQ0:.0f} long, {o['tq']:.2f} thick, {o['w']} high",'1436: Viereck 2; 0,55 (0,50)',src),
            S("blade's thicker part",f"{K['thk']} long, {o['tq']:.2f} thick, {o['wb']} high, flush with the square toward the block",'1436, scaled',src),
            S('blade',f"{o['tb']:.2f} thick, {o['wb']} high, its line {DOFF} from the spring's (flush toward the block), to the pipe",'1436: 0,33 (0,28), 1 (0,9)',src),
            S('pipe',f"Ø {2*K['pR']:.2f}, {o['pl']} long, its top {o['pp']:.2f} under the plate",'1436: 2 (1,9); Ø likely',src),
            S('horn',f"{o['th']:.2f} thick, {o['wh']} high, {HL} from the stone, bent toward the block as traced; its back ground in over its last {K['bev']} to {K['tip']} at the tip",'1436: 0,25 (0,22), 0,8 (0,75), 4,4; the bend traced on Wempe 3955 (likely)',src)],src),
         Drill((ROW,s*(f-fh-K['bo']),zc),u,2*K['fhR'],o['tf']+0.15,"Drill the foot for its screw (M1 clearance)",[S('',f"Ø {2*K['fhR']:.1f} across the foot, {ROW-FOOT0:.2f} from its end, at its middle",'1436 (scaled)',src)],src,key='screw'),
         *[Drill((ROW+q,s*(f-fh-K['bo']),zc),u,2*K['pinR'],o['tf']+0.15,"Drill a steady pin's hole across the foot",[S('',f"Ø {2*K['pinR']:.2f}, {K['pinT']} {'beyond' if q>0 else 'before'} the screw",'1436 (scaled); drilled with the block at assembly',src)],src,key='pin') for q in (-K['pinT'],K['pinT'])],
         Drill((SQ0+K['sqT'],s*(f+o['tq']/2-K['sqD']),zc),u,2*K['sqR'],K['sqD']+0.05,"Drill and tap the square for the gold spring's screw (M0.7, drawn at its size)",[S('',f"M0.7, {K['sqD']} deep from the face toward the wheel, {K['sqT']} from the square's end",'05 04_1 draws the screw; place and depth estimated',src)],src,key='WN-14'),
         Cut(lambda:_disc(X['RS']+0.002,o['pp']-0.01,o['pp']+o['pl']+0.01),'Bore the pipe for the locking stone',[S('',f"Ø {2*(X['RS']+0.002):.3f} through",'the stone Ø 0,75 (05 04_1: sure), set in shellac',src)],src,at=(0,0))]
    return Recipe('detent','050401-1','Detent (Gangfeder)',src,'steel (1436: "Stahl")','hardened and tempered spring hard (not given on the sheet: estimated)',[Setup('1','steel block on the mill; the spring ground to its taper last',ops,view='top')],M,
      faces=("the plate's side","the dial's side"),fits=["the foot clamped to the block's end by the M1 screw WN-gf and its two steady pins","the locking stone Ø 0.75 in the pipe's Ø 0.754"],
      expect=[{'at':(ROW,s*f),'r':0.75,'max':0.03,'why':"the page's bore across a thin strip (fusee.js's bore, its n-gon cut through by holeCut and closed by capFix) joins its two mouths' vertices with wall triangles that skip round the hole, chords up to 0.025 inside the circle at the foot's screw hole (a triangle from (−0.19, 37°) to (0.41, −10°)): the page's mesh, not the size"}],
      notes=["Drawn in its own frame: X along the blade from the stone toward the foot, Y across it, Z its height under the top plate's inner face; the stone's centre at the origin.",
             "1436 gives each size twice, the bracketed always the smaller: read as the size to grind it to (the model's inference; README)."])
def goldSpring():
    X=WDET();K=X['K'];o=X['o'];s,M=_detFrame();src='05 04 01-2 (16.9.42: Goldblech 333 federhart); 05 04_1'
    SQ0,GB,GW,g1=X['SQ0'],X['GB'],X['GW'],X['g1'];c=(2-o['w'])/2;b1=o['d0']+2-c;zc=o['d0']+1;head=SQ0+K['gHd'];h0=head-K['gL'];n0,n1=g1-GW/2,g1+GW/2
    free=_crom(X['gold']);L,R=_offs(free,GW)
    def bow():
        A,B=_tn(L,s),_tn(R,s);E=[_sp(A),_ln(A[-1],B[-1]),_sp(B[::-1]),_ln(B[0],A[0])]
        return bd.extrude(bd.Face(bd.Wire(E)).moved(bd.Location((0,0,b1-K['gA']))),K['gA'],dir=(0,0,1))
    def body():return _box(GB[0],h0,n0,n1,b1-K['gA'],b1,s)+_box(h0,head,n0,n1,b1-K['gH'],b1,s)+bow()
    ops=[Solid(body,"Cut the blank from gold sheet 0.15 (the head 2 wide, the arm 1), then form the free arm's bow round the pipe to rest on the horn, to the template of its traced line",
           [S('thickness',f'{GW}',None,src),S('head',f"{K['gL']} long, {K['gH']} wide",None,src),S('arm',f"{K['gA']} wide, flush with the head's edge; its bending point {GB[0]} from the stone",'05 04_1 "Biegungspunkt der Goldfeder" (6.10-6.23)',src),
            S('overall','15.4',None,src),S('bow','one smooth bow from the bending point round the pipe to the tip, which alone rests on the horn','traced on Wempe 3955 (10_Vergleich_CWW-6MX), pinned at the bending point and the tip (likely ±0.05)',src)],src),
         Drill((head-K['gHo'],s*(n0-K['bo']),zc),(0,s,0),2*K['gR'],GW+0.1,"Drill the head's hole for its screw WN-14",[S('',f"Ø {2*K['gR']:.1f}, {K['gHo']} from the head's end",'+0.05',src)],src,key='WN-14')]
    return Recipe('goldSpring','050401-2','Gold spring (Goldfeder)',src,'Goldblech 333 federhart (05 04 01-2)','none (spring hard as rolled)',[Setup('1','sheet on a backing plate, cut; formed at the bench',ops,view='top')],M,
      faces=("the plate's side","the dial's side"),fits=["screwed to the square's face toward the wheel by WN-14 (M0.7)"],
      expect=[{'at':(head-K['gHo'],s*g1),'r':0.55,'max':0.06,'why':"the page's bore across a thin strip (fusee.js's bore, its n-gon cut through by holeCut and closed by capFix) joins its two mouths' vertices with wall triangles that skip round the hole, chords up to 0.048 inside the circle at the head's hole (one triangle across 64° of it): the page's mesh, not the size"}],notes=["Drawn in the detent's frame (its recipe's), as it lies on the detent unbent."])
def detentBought():
    return [Bought('lockingStone','050401-3','Locking stone (Ruhestein)',"a ruby pin, ground half away to a flat that faces the oncoming tooth along the line from the wheel's centre, set in the detent's pipe in shellac",
              "Ø 0.75, standing out of the pipe's lower end to 0.06 under the wheel's lower face",'jewel pin (synthetic ruby)','ruby','05 04 01-3; 05 04_1 ("Ruhestein Ø 0,75": sure; its hatched half the ground flat)')]
def springsBought():
    return [Bought('clickSpringStrip','050602-2',"Click springs' strip (Sperrfeder), two",'phosphor-bronze spring strip, cut 27.0 long, two holes Ø 0.6 +0.02 (the end\'s 5 from the next), formed round two Ø 2.2 formers into its S (05 06 02-2)',
              '1.5 × 0.4, 27.0 stretched ("gestreckt 27,0")','bronze spring strip (Bronzeband federhart)','bronze, spring hard','05 06 02-2',
              notes=["Bought as strip and formed at the bench: its sprung shape follows its click on the page, so it has no recipe of its own (as the detent, step 7b, a frozen pose would be needed to check one)."]),
            Bought('stopBarSpringStrip','050603-3',"Stop bar's spring strip (Stegfeder)",'hardened steel spring strip, a hole Ø 0.54 for its pin, formed to the recess\'s wall and round the bar (05 06_4 C-D)',
              '1.0 × 0.10, about 31 long (05 06_4 C-D draws it 30.8-32.1)','hardened strip steel','spring steel, blued','fusee.js (no sheet: the coloured section names it; its section a design value)',
              notes=["Its sprung shape follows the bar's slide on the page, so it has no recipe of its own."]),
            Bought('detentWire','050506-1',"Maintaining detent's wire spring (Feder)",'steel spring wire, cut to length, its end held in its stud\'s axial hole 1.5 deep',
              'Ø 0.25, about 18.3 long (from 1.5 in the stud to 1.8 over the pillar plate)','music wire (DIN EN 10270-1)','spring steel','fusee.js (no sheet: scaled on the photographs and the coloured section, likely)',
              notes=["Bent by the detent on the page as it rides, so it has no recipe of its own."]),
            Bought('vorreiberPin','050600-5','Vorreiber pin (Vorreiberstift)','taper pin, driven home in the hole reamed through the Vorreiber\'s hub and the arbor together','Ø 1.16 at its middle, 8.3 long, its ends rounded r 0.25','DIN 1 (ISO 2339) taper pin 1:50, cut and rounded','steel','fusee.js (05 06 00-2, 05 06 04-1, 05 06_1: estimated)'),
            Bought('chainPin','050600-6',"Chain's pin (Kettenstift)",'pin, pressed across the flange\'s two ribs','Ø 0.567 (a press in the 0.55 +0.01 hole)','silver steel Ø 0.57, ground','steel','fusee.js (the hole 05 06 04-2; the pin\'s figure not in the set: estimated)'),
            Bought('maintSpringPins','050600-8',"Maintaining spring's pins (Stellstift f. Gegenfeder), two",'pins, pressed in the spring\'s holes, standing 1.2 out','Ø 1.2 (020605: 1.25)','dowel pin ISO 8734, or silver steel Ø 1.2','steel','020605; 05 06_4 A-B'),
            Bought('clickSpringRivets','050602-4',"Click springs' rivets (Niet), four",'rivets through the spring and the cup\'s wall, a domed head each side','Ø 0.6 shank, heads Ø 1.0 × 0.2','brass rivet wire Ø 0.6, headed at the bench','brass','05 06 02 (heads not sized: estimated)'),
            Bought('stopBarPin','050603-2',"Stop bar's pin (Stift)",'pin, pressed across the bar, standing 0.9 out of its near side','Ø 0.5 × 2.9','silver steel Ø 0.5, or a dowel pin ISO 8734','steel','05 06_4 C-D (12.2 px/mm, likely)'),
            Bought('stopSpringPin','050604-4',"Stop bar spring's pin (Stift)",'pin, pressed in the small end\'s 0,5 H7 hole, through the spring','Ø 0.5 +0.022/+0.015','silver steel Ø 0.52, ground, or a dowel pin','steel','05 06 04 (item 5), 05 06 04-2'),
            Bought('stopPin','050801-5','Stop pin (Anschlagstift)','pin, pressed in the top plate\'s hole 7, flush with its outer face, its inner end domed','Ø 1.615 × 1.85 (1.6 straight, a 0.25 dome)','silver steel Ø 1.6, ground; or a dowel pin ISO 8734 Ø 1.6 m6','steel','05 08 01 (hole reamed 1,6 +0,009); the coloured section (scaled)')]

def secondsArbor():return trainArbor('sw','secondsArbor','050501-2','Seconds pinion and arbor (Sekundentrieb)','05 05 01-2 (kompl. 05 05 01, revised 24.3.48)',3.5,'Präz. Rundstahl 3,5','not given on the sheet',"z 10 from the centre distance (confirmed); tip and root by 05 04_8's proportions (likely)")

RECIPES={'corkRing':corkRing,'pillars':pillar,'pillarScrew':pillarScrew,'pillarScrew56':pillarScrew56,'topPlate':topPlate,'pillarPlate':pillarPlate,'ring':ring,'ringScrew':ringScrew,
  'barrelBridge':barrelBridge,'click':click,'clickScrew':clickScrew,'bridgeScrew':bridgeScrew,'fuseeBush':fuseeBush,'fuseeBushScrew':fuseeBushScrew,'dustBush':dustBush,
  'upperCock':upperCock,'upperCockScrew':upperCockScrew,'lowerCock':lowerCock,'lowerCockScrew':lowerCockScrew,'intermediateBridge':intermediateBridge,'intermediateBridgeScrew':intermediateBridgeScrew,
  'centreArbor':centreArbor,'intermediateArbor':intermediateArbor,'secondsArbor':secondsArbor,'escapeArbor':escapeArbor,'staff':staff,'centreWheel':centreWheel,'intermediateWheel':intermediateWheel,'secondsWheel':secondsWheel,'escapeWheel':escapeWheel,'fuseeArbor':fuseeArbor,'barrelArbor':barrelArbor,
  'coverPlate':coverPlate,'dustPlate':dustPlate,'vorreiber':vorreiber,'clickWheel':clickWheel,'fuseeWheel':fuseeWheel,'maintRatchet':maintRatchet,'setupRatchet':setupRatchet,
  'drum':drum,'lid':lid,'steg':steg,'hookBlock':hookBlock,
  'clicks':clicks,'stopBar':stopBar,'maintDetent':maintDetent,'detent':detent,'goldSpring':goldSpring}
for _h,_k,*_r in SMALL:RECIPES[_k]=(lambda h=_h,k=_k,r=tuple(_r):smallTurned(h,k,*r))
for _b in pinsBought()+springsBought()+detentBought():RECIPES[_b.key]=(lambda b=_b:b)
