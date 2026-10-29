"""The Wempe's recipes (the pilot, 29 October 2026): the cork ring, a pillar, a pillar screw and the top plate. Their numbers come from the page's own
dims.js (WD) and escapement.js (WESC), run in Node by wempe_load.js; the few the page keeps as literals in frame.js beside the part (the cork ring's
sizes, the plates' tapped and reamed radii) are restated here with the line they come from, until they move into dims.js (PLAN-recipes.md)."""
import functools,json,math,pathlib,subprocess
import build123d as bd
from . import (Recipe,Setup,S,iso,page_matrix,Bar,Ring,TurnOD,TurnCone,FaceGroove,Bore,Countersink,ThreadOD,SlotHead,Plate,Hole,Cone,Pocket)
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
    D=W()['WD'];TT=-D['INNER']-D['TOP_T'];yb=TT-1.5-15.1   # frame.js: the ring's underside on the dust bush's collar, TT-1.5-15.1
    ro,ri,h=8.05,4.86,3.70   # frame.js corkRing: Ø 16.1 × 3.86 scaled on the coloured section at 9.32 px/mm, the bore the dust bush's neck Ø 9.7 + 0.02, drawn 3.70 squeezed
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

# ---------------- a pillar screw, top plate (WN-57) ----------------
def pillarScrew():
    D=W()['WD'];Q=D['PSCR'];r,h,ln=Q['r'],Q['h'],Q['len'];th=iso(2*Q['rs']);c=min(0.35,r*0.14);w=max(0.35,r*0.2);s=max(min(0.55,h*0.45),c+0.05)
    crest=2*Q['rs']-th['es'];ch=min(th['H1'],ln*0.3);root=crest/2-th['H1'];rt=max(root-th['H1']/2,root*0.6)
    src='dims.js PSCR (the coloured section, Wempe 3955; WN sheet not in the set: estimated)'
    return Recipe('pillarScrew','WN-57','Pillar screw, top plate (WN-57)','WN-57 (Wempe standard part; its sheet is not in the set)','brass (Wempe 3955\'s; no drawing gives it)','none',[
      Setup('1','bar in the collet, the tip end out',[
        Bar(2*r,h+ln,'Part off and face to the overall length',[S('overall',f'{h+ln:.2f}',None,src)],src),
        TurnOD(crest,0,ln,'Turn the shank to the thread\'s major diameter',[S('shank',f'Ø {crest:.3f}','6g (es 0.010)','ISO 965')],src),
        TurnCone(rt,0,crest/2,ch,'Chamfer the tip',[S('tip',f'Ø {2*rt:.2f}',None,'KIT threadGeo')],src),
        ThreadOD(th,0,ln,'Cut the thread M2.6 (die or single point)',[S('thread',f'M2.6 × {th["p"]}','6g','dims.js PSCR.rs; ISO 261')],src)]),
      Setup('2','reversed, held on the thread in a split bush',[
        TurnCone(r-c,h+ln,r,h+ln-c,'Chamfer the head\'s top 45°',[S('head',f'Ø {2*r:.2f} × {h:.2f}','±0.2 (estimated)',src),S('chamfer',f'{c:.2f} × 45°',None,'KIT headGeo')],src),
        SlotHead(h+ln,w,s,'Mill the slot across the head',[S('slot',f'{w:.2f} wide × {s:.2f} deep',None,'KIT headGeo')],src)])],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,ln,0)),notes=['Its head and shank are read off the coloured section and Wempe 3955 (estimated ±0.2); the slot is the model\'s convention.'])

# ---------------- the top plate (Oberplatte, 05 09 01) ----------------
def topPlate():
    X=W();D=X['WD'];H={int(k):v for k,v in D['H'].items()};t=D['TOP_T']
    pl=lambda q:(-q[0],-q[1])   # page plan [x, z] to the sheet's (O, N)
    rM={2.6:1.32,2.0:1.02,1.7:0.87,1.4:0.72,1.2:0.62}   # frame.js: tapped holes drawn at the thread's size + 0.02 (the page); the recipe drills them at D1
    rPinP=1.6025/2;rJ=4.596/2;rH35=3.506/2   # frame.js: steady pins' holes reamed 1.6025, the settings 4.59 +0.012, the Hilfslöcher 3.50 +0.012, each drawn at its fit's middle
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

RECIPES={'corkRing':corkRing,'pillars':pillar,'pillarScrew':pillarScrew,'topPlate':topPlate}
