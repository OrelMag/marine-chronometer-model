"""The Wempe's recipes (from 29 October 2026; PLAN-recipes.md). Their numbers come from the page's own dims.js (WD) and escapement.js (WESC), run in Node
by wempe_load.js: a size frame.js drew as a literal beside its part is moved into dims.js (WD.FRAME, WD.RING, WD.CORK...) before a recipe reads it, the page's
meshes hashed before and after (recipes_pagehash.py) so the move changes nothing."""
import functools,json,math,pathlib,subprocess
import build123d as bd
from . import (Blank,TurnProfile,CutLeaves,Recipe,Setup,S,iso,page_matrix,Bar,Ring,TurnOD,TurnCone,TurnAway,FaceGroove,Bore,Countersink,ThreadOD,SlotHead,Plate,Hole,Cone,Pocket,InnerCone,Drill,Cut,Bought)
TOOLS=pathlib.Path(__file__).resolve().parents[1]

@functools.lru_cache()
def W():
    """WD and WESC.HOLES as the page has them (functions left out)"""
    js="const W=require(%r)();process.stdout.write(JSON.stringify({WD:W.WD,HOLES:W.WESC.HOLES}))"%str(TOOLS/'wempe_load.js')
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
def secondsArbor():return trainArbor('sw','secondsArbor','050501-2','Seconds pinion and arbor (Sekundentrieb)','05 05 01-2 (kompl. 05 05 01, revised 24.3.48)',3.5,'Präz. Rundstahl 3,5','not given on the sheet',"z 10 from the centre distance (confirmed); tip and root by 05 04_8's proportions (likely)")

RECIPES={'corkRing':corkRing,'pillars':pillar,'pillarScrew':pillarScrew,'pillarScrew56':pillarScrew56,'topPlate':topPlate,'pillarPlate':pillarPlate,'ring':ring,'ringScrew':ringScrew,
  'barrelBridge':barrelBridge,'click':click,'clickScrew':clickScrew,'bridgeScrew':bridgeScrew,'fuseeBush':fuseeBush,'fuseeBushScrew':fuseeBushScrew,'dustBush':dustBush,
  'upperCock':upperCock,'upperCockScrew':upperCockScrew,'lowerCock':lowerCock,'lowerCockScrew':lowerCockScrew,'intermediateBridge':intermediateBridge,'intermediateBridgeScrew':intermediateBridgeScrew,
  'centreArbor':centreArbor,'intermediateArbor':intermediateArbor,'secondsArbor':secondsArbor,'escapeArbor':escapeArbor,'staff':staff,'centreWheel':centreWheel,'intermediateWheel':intermediateWheel,'secondsWheel':secondsWheel,'escapeWheel':escapeWheel}
for _h,_k,*_r in SMALL:RECIPES[_k]=(lambda h=_h,k=_k,r=tuple(_r):smallTurned(h,k,*r))
for _b in pinsBought():RECIPES[_b.key]=(lambda b=_b:b)
