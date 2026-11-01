"""The Wempe's remaining recipes of batch 12 (1 November 2026; PLAN-recipes.md): the winding keys (1943's, 51 00 11, and 1940's, 127-556.02), the transit lock's pieces,
the barrel arbor's hook, the maintaining detent's wire stud, the band's hooks, and the bought and not-made lines that finish the parts list's coverage. Imported into
wempe.py's RECIPES by one line at its end. Sizes from dims.js (WD.KEYQ ...), never restated."""
import functools,math
import build123d as bd
from . import Cone,Op,Recipe,Setup,S,iso,page_matrix,Bar,Ring,Plate,Hole,Drill,Cut,Bought,TurnOD,TurnCone,TurnProfile,Bore,InnerCone,Blank,Countersink,ThreadOD,SlotHead,_rev
from .wempe import W
from .ops_case import Note

def KQ():return W()['WD']['KEYQ']
def circ(r):return bd.Face(bd.Wire.make_circle(r))

class Add(Op):
    """join a solid to the part (a brazed or let-in piece): make() builds it in the part's frame"""
    kind='mill'
    def __init__(self,make,text,sizes=(),src='',at=None):super().__init__(text,sizes,src);self.make=make;self.at=at
    def apply(self,p):return p+self.make()
class Square(Op):
    """a square socket broached or filed from the end z0 into z1: s across the flats, turned 45° (its corners on the part's axes), its mouth sunk by a cone of half-angle sa that reaches the flats at
    the depth sink (the cone's radius at the end face: s/2 + sink tan sa)"""
    kind='mill'
    def __init__(self,s,z0,z1,sink,sa,text,sizes=(),src=''):super().__init__(text,sizes,src);self.s=s;self.z0=z0;self.z1=z1;self.sink=sink;self.sa=sa
    def apply(self,p):
        b=bd.Box(self.s,self.s,self.z1-self.z0+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,self.z0-0.01))).rotate(bd.Axis.Z,45)
        rc=self.s/2+self.sink*math.tan(math.radians(self.sa));h=(rc+0.01*math.tan(math.radians(self.sa))-self.s/2)/math.tan(math.radians(self.sa))
        c=_rev([(0,self.z0-0.01),(rc+0.01*math.tan(math.radians(self.sa)),self.z0-0.01),(self.s/2,self.z0+self.sink),(0,self.z0+self.sink)]);return p-b-c

# ---------------- the 1943 key (Chronometerschlüssel 51 00 11, 16.7.43) ----------------
def keyTube():
    k=KQ()['K43']['tube'];T=k['T'];src='05 01 02-3 (rev. a 29.9.47)';rs=k['rs'];th=k['rn']
    prof=[(0,0),(k['r2'],0),(k['R'],k['rel']),(k['R'],T-k['nk']),(th,T-k['hl']),(k['H'],T-k['hl']),(k['H'],T),(0,T)]
    ops=[Bar(2*k['H'],T,'Part off Ms 58 bar Ø 8 to length and face',[S('overall',f'{T}','-0,2',src),S('head',f'Ø {2*k["H"]:g} × {k["hl"]}','-0,05',src)],src),
         TurnProfile(prof,'Turn the head, the shank Ø 5.95 with its chamfer under the head and the end relieved over 2.5 to Ø 4.6',[S('shank',f'Ø {2*k["R"]:g}','-0,05',src),S('relief',f'Ø {2*k["r2"]:g} at the end over {k["rel"]}',None,src+', estimated 4.6'),S('head',f'Ø {2*k["H"]:g}, {k["hl"]} long','-0,05',src)],src),
         Bore(2*k['dr'],k['sD']-0.5,k['d1'],'Drill Ø 2.9 from the square\'s end to 22.2, its 118° point to 23',[S('hole',f'Ø {2*k["dr"]:g}, drilled 23 deep',None,src)],src),
         InnerCone(k['dr'],k['d1'],0,k['d2'],"Drill point",[S('point',f'to {k["d2"]} from the mouth',None,src)],src),
         Square(2*rs,0,k['sD'],k['sink'],k['sa'],'Broach the square 3.1 +0,05 (drawn 3.15), 19 +2 deep, its mouth sunk 60° to the flats 1 deep',[S('square',f'{2*rs:g} across the flats, 19 deep','+0,05; 19 +2',src),S('sink',f'60°, {k["sink"]} deep on the flats',None,src)],src)]
    return Recipe('keyTube','050102-3','Key tube (Schlüsselrohr)',src,'Ms 58','none',[Setup('1','Ø 8 bar in the collet, turned; the square broached on the drill press or mill',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),notes=['The square is drawn 3.15 across the flats (3,1 +0,05 on the sheet); the page and the recipe cut it at the drawn figure.'],
      expect=[{'at':(0,0),'r':2.6,'z':(0,1.5),'max':0.03,'why':'the page builds the sink'+chr(39)+'s cone from strips along the radii of 1.5'+chr(176)+' sectors: 0.02 off the cone at the end face'}])

def keyBody():
    k=KQ()['K43']['body'];BL=k['BL'];src='05 01 02-2 (rev. a 15.7.48)';BT=BL;RO=k['RO'];YC=BT-k['fd']+math.sqrt(k['fr']**2-RO**2);YD=BT-k['dd']
    prof=[(0,0),(k['r0'],0),(RO,k['cl']),(RO,BT-k['ch']),(k['rt'],BT),(0,BT)]
    def slot():
        d=bd.Cylinder(k['fr'],2*k['sw'],align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.CENTER));return d.rotate(bd.Axis.X,90).moved(bd.Location((0,0,YC)))
    ops=[Bar(2*RO,BL,'Cut the blank from St. Az DIN 668 bar and face to length',[S('overall',f'{BL}','-0,2',src),S('outside',f'Ø {2*RO}','-0,2',src)],src),
         TurnProfile(prof,'Turn the 15° cone from 15.1 down to the foot and the 1.5 × 45° chamfer at the top',[S('cone',f'15°, {k["cl"]} long from Ø {2*k["r0"]:g}',None,src),S('chamfer','1.5 × 45°',None,src)],src),
         Bore(2*k['rh'],-0.1,YD-0.0,'Drill and ream Ø 6 +0,1 through the foot',[S('hole',f'Ø {2*k["rh"]:g}','+0,1 (drawn at 6.1)',src)],src),
         Bore(2*k['RB'],YD+k['pt'],BL+0.1,'Bore Ø 8 +0,1, 22 deep, with its 120° point',[S('bore',f'Ø {2*k["RB"]:g}, 22 deep','+0,1 (drawn at 8.1)',src)],src),
         InnerCone(k['rh'],YD,k['RB'],YD+k['pt'],'The bore\'s 120° point',[S('point','120°',None,src)],src),
         Cut(slot,f'Mill the slot {2*k["sw"]:g} wide with a Ø 35 cutter, 6.3 deep at the outside',[S('slot',f'{2*k["sw"]:g} wide','3 H11 (drawn 3.03)',src),S('floor',f'Ø {2*k["fr"]:g}, {k["fd"]} under the top at the outside','+0,1',src)],src),
         Drill((0,-10,BT-k['yh']),(0,1,0),2*k['RH'],20,'Drill and ream the cross hole Ø 2.5 for the grooved pin across both jaws, 4 under the top',[S('hole',f'Ø {2*k["RH"]:g}','+0,05 (drawn 2.525)',src),S('place',f'{k["yh"]} under the top',None,src)],src),
         Drill((0,-k['hz']-0.5*math.tan(math.radians(k['ha'])),-0.5),(0,math.sin(math.radians(k['ha'])),math.cos(math.radians(k['ha']))),2*k['hr'],YD+1.5,'Drill Ø 0.9 at 5° from the foot into the bore for the spring\'s end',[S('hole',f'Ø {2*k["hr"]:g}, {k["hz"]} off the axis at the foot, 5° toward it',None,src)],src)]
    return Recipe('keyBody','050102-2','Key body (Schlüsselmittelteil)',src,'St. Az DIN 668','sand-blasted, phosphated, sprayed black',[Setup('1','chucked and turned; the slot and holes on the mill',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,KQ()['K43']['tube']['T']+KQ()['K43']['tube']['hd']-k['BL'],0)),notes=['The key stands in the page in its own frame (its tube mouth at 0, the body\'s foot 17.0 higher).'],
      expect=[{'at':(0,-k['hz']),'r':0.9,'z':(2.0,3.8),'max':0.06,'why':'the page cuts the spring'+chr(39)+'s hole slanted to the drill point'+chr(39)+'s foot and upright above it, to come out in the cone; the recipe drills it slanted the whole way'},
              {'at':(0,0),'r':8,'z':(BT-1.6,BT),'max':0.04,'why':'the page builds the top chamfer'+chr(39)+'s cone in four steps up the jaws'+chr(39)+' columns: up to 0.03 off the true cone'}])

def keyPaddle():
    K=KQ()['K43'];k=K['paddle'];b=K['body'];BL=b['BL'];RO=b['RO'];t=K['tube'];B0=t['T']+t['hd']-BL;BT=B0+BL;src='51 00 11-1 (scaled on the key\'s assembly)'
    RB=b['RB'];YC=BT-b['fd']+math.sqrt(b['fr']**2-RO**2);PY=BT+k['u']+math.sqrt(k['R']**2-RB**2)-(math.sqrt(b['fr']**2-RB**2)-(YC-BT));YH=BT-b['yh']
    ops=[Plate(circ(k['R']),k['t'],'Blank the round paddle Ø 34.5 from 3 mm plate',[S('diameter',f'Ø {2*k["R"]:g}',None,src+', scaled'),S('thickness',f'{k["t"]}','3 H11 slot (the body\'s)',src)],src),
         Hole((0,YH-PY),2*b['RH'],'in',k['t'],None,'Drill and ream the pin\'s hole Ø 2.5 through, 4 under the body\'s top',[S('hole',f'Ø {2*b["RH"]:g}','+0,05 (drawn 2.525)',src),S('place',f'{PY-YH:.2f} from the centre toward the body',None,src)],src)]
    return Recipe('keyPaddle','510011-1','Key handle (Schlüsselgriff)',src,'steel (black, as the body: not given)','none',[Setup('1','plate on the mill',ops,view='top')],page_matrix([[1,0,0],[0,1,0],[0,0,1]],(0,PY,-k['t']/2)),
      notes=['The paddle\'s centre is where its rim rests on the slot\'s floor at the bore\'s edge (the page\'s PY), 9.4 over the body\'s top.'])

def keyBought():
    K=KQ()['K43'];p=K['pin'];sp=K['spring'];return [
      Bought('keyPin','510011-6','Grooved pin K.S. 1 (Kerbstift)','grooved pin, full-length taper grooves or parallel grooves, its end turned to a round of r 0.45',f'Ø {2*p["r"]:g} × {p["L"]}','Wempe 51 00 11-6 "K.S. 1" (ISO 8744 / DIN 1471 Ø 2.5 × 16, cut to length)','steel','51 00 11-6, scaled on the key\'s assembly'),
      Bought('keySpring','510011-4','Coil spring (Wendelfeder)',f'wound spring wire, a close-wound coil round the tube, one end bent out and down into the body\'s Ø 0.9 hole at 5°',f'wire Ø {sp["w"]:g}, coils on r 3.285 (inside Ø 5.95 + 0.62), pitch {sp["p"]}, about 12 coils','spring steel wire (DIN 17223-1 patented steel wire), wound by hand or on a coiling machine','spring steel','51 00 11-4, scaled on the key\'s assembly (the wire, the pitch and the coil count scaled, not figured)')]


# ---------------- the 1940 key (Aufzugschlüssel 127-556.02 U 01 = 51 00 11, 12.12.40; the page's version as first drawn) ----------------
UPK=lambda y0:page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,y0,0))   # recipe Z = page y from y0, recipe Y = -page z
def key40Pipe():
    K=KQ()['K40'];p=K['pipe'];SQ=K['SQ'];YJ=K['YJ'];src='127-556.02-03 (Schaft; 05 01_6)'
    top=YJ-0.1;prof=[(0,0),(p['r2'],0),(p['R'],p['R']-p['r2']),(p['R'],p['yh']),(p['Rh'],p['yh']),(p['Rh'],top),(0,top)]
    ops=[Bar(2*p['Rh'],top,'Part off brass bar Ø 7 to length and face',[S('overall',f'{top:g}',None,src+', 84 overall and 32 out of the body: sure')],src),
         TurnProfile(prof,"Turn the pipe Ø 6.0 with its head Ø 6.78 for the click spring and the end's 0.7 × 45° chamfer",[S('pipe',f'Ø {2*p["R"]:g}',"6.0 in the body's 6.05 bore",src),S('head',f'Ø {2*p["Rh"]:g} from {p["yh"]}',None,src+', estimated'),S('chamfer',f'{p["R"]-p["r2"]:g} × 45°',None,src+', estimated 0.7')],src),
         Square(2*p['rs'],0,SQ,p['sink'],p['sa'],'Broach the square socket 3.15 across, 29.2 deep, its mouth sunk 60°',[S('square',f'{2*p["rs"]:g} across the flats, {SQ} deep',None,src+", section ±0.4; round or square not told: square as the 1943 tube's")],src),
         InnerCone(p['dr'],SQ,0,SQ+p['dr']/math.tan(math.radians(p['pa'])),"The drilled point (118°) at the socket's end",[S('point','118°',None,src)],src)]
    r=Recipe('key40Pipe','127556.02-03','Key pipe, 1940 (Schaft)',src,"brass (estimated: Wempe 6161's key not seen)",'none',[Setup('1','bar in the collet, turned; the square broached',ops)],UPK(0),notes=["As first drawn only (the page's Variants)."])
    r.rev='first';return r
def key40Body():
    K=KQ()['K40'];b=K['body'];YC=K['YC'];f=b['f'];src='127-556.02-02 (Körper; 05 01_6)';z=lambda y:y-f;H=iso(2.0)
    prof=[(b['r1'],0),(b['r2'],0),(b['r3'],z(YC)),(b['rb'],z(YC)),(b['rb'],z(b['yb'])),(b['r1'],z(b['yb']))]
    ops=[Bar(2*b['r3'],z(YC),'Part off brass bar Ø 18 to length and face',[S('overall',f'{z(YC):g}',None,src+', traced')],src),
         TurnProfile(prof,"Turn the cone Ø 10.44 to 17.9 over 19, bore Ø 6.05 for the pipe up to a step at 41.4 and Ø 8.3 above it for the spring and the pipe's head",[S('cone',f'Ø {2*b["r2"]:.2f} to {2*b["r3"]:g}, {z(YC):g} long',None,src+', traced'),S('bore',f'Ø {2*b["r1"]:g}, then Ø {2*b["rb"]:g} from {z(b["yb"]):.1f}',None,src+', scaled on the section')],src)]
    for x,zz in K['SC']:ops.append(Drill((x,-zz,z(YC)-4.2),(0,0,1),H['D1'],4.3,"Drill and tap M2 in the top for the cap's screw",[S('thread','M2, 4.2 deep',None,'127-556.02 section, estimated')],src,thread=H))
    r=Recipe('key40Body','127556.02-02','Key body, 1940 (Körper)',src,'brass (estimated)','none',[Setup('1',"bar in the chuck, turned; the screws' holes drilled and tapped",ops)],UPK(f),notes=["As first drawn only. The page draws the M2 holes plain at the thread's size (estimated)."])
    r.rev='first';return r
def key40Cap():
    K=KQ()['K40'];c=K['cap'];YJ=K['YJ'];YC=K['YC'];YT=K['YT'];src='127-556.02-01 (Griff with its cap; 05 01_6)';z=lambda y:y-YJ;PR=K['PR']
    prof=[(0,0),(c['sp'],0),(c['sp'],z(YC)),(c['R'],z(YC)),(c['R'],z(YT)),(0,z(YT))];sl=c['sl']
    def slot():return bd.Box(sl[0],sl[1],sl[2]+0.01,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,z(YT)-sl[2])))
    def plate():
        pts=[(r,z(y)) for y,r in PR]+[(-r,z(y)) for y,r in reversed(PR)]
        f=bd.Face(bd.Wire.make_polygon([bd.Vector(x,0,w) for x,w in pts],close=True));return bd.extrude(f,K['pt'],dir=(0,1,0)).moved(bd.Location((0,-K['pt']/2,0)))
    ops=[Bar(2*c['R'],z(YT),'Part off brass bar Ø 21 to length and face',[S('collar',f'Ø {2*c["R"]:g} × {YT-YC:g}',None,src+', traced')],src),
         TurnProfile(prof,"Turn the collar Ø 20.5 × 3.0 over the spigot Ø 8.29 that goes 2.2 into the body's bore",[S('collar',f'Ø {2*c["R"]:g}, {YT-YC:g} thick',None,src),S('spigot',f'Ø {2*c["sp"]:g}, {YC-YJ:g} long',"0.005 inside the bore",src+', estimated')],src),
         Cut(slot,"Mill the slot across the collar for the handle's blade, 18.0 × 3.2, 1.5 deep",[S('slot',f'{sl[0]:g} × {sl[1]:g}, {sl[2]:g} deep',None,src+", estimated: how the blade is held isn't drawn")],src)]
    for x,zz in K['SC']:
        ops.append(Drill((x,-zz,z(YC)-0.1),(0,0,1),2*c['h'],z(YT)-z(YC)+0.2,"Drill the screw's clearance hole Ø 2.2 through the collar",[S('hole',f'Ø {2*c["h"]:g}',None,src+', estimated')],src))
        ops.append(Cone((x,-zz),c['cs'],c['h'],'out',z(YT),c['sk'],'Sink it 90° to Ø 4.0 for the countersunk head',[S('sink',f'90°, Ø {2*c["cs"]:g}',None,src+", heads flush with the cap's top")],src))
    ops.append(Add(plate,"Let the handle's blade into the slot (a plate 3.2 thick cut to the pear-shaped outline) and solder it",[S('plate',f'{K["pt"]} thick, 84 overall from the pipe\'s end',None,src+', traced on the sheet at 6.79 px/mm'),S('widest',f'Ø {2*max(r for _,r in PR):.1f} about 9 from its top',None,src)],src))
    r=Recipe('key40Cap','127556.02-01','Key handle with its cap, 1940 (Griff)',src,"brass (Wempe 6161's handle and collar brass)",'none',[Setup('1','the cap turned from bar; the plate cut on the mill; the two soldered',ops)],UPK(YJ),
      notes=["As first drawn only. The page lumps the cap and the handle's plate in one parts-list line; here the cap is turned and the plate soldered into its slot. The plate's outline is the traced points of the sheet joined by straight lines (a polyline, as traced)."])
    r.rev='first';return r
def key40Bought():
    K=KQ()['K40'];s=K['spring'];c=K['scr'];return [
      Bought('key40Spring','127556.02-04','Click spring, 1940 (Feder)','wound spring wire, five turns round the pipe\'s head, gripping it one way',f'wire Ø {s["w"]:g}, coils on r {s["r"]:g}, {s["n"]} turns from {s["y0"]:g} to {s["y1"]:g}','spring steel wire (DIN 17223-1), wound by hand or on a coiling machine','spring steel','127-556.02-04, scaled on the section (the wire 0.6-0.8, its hand and ends not read: estimated)'),
      Bought('key40Screw','127556.02-05','Countersunk screws, 1940 (Schraube), two',f'countersunk machine screws, M2, head Ø {2*c["R"]:g}, 90°',f'M2 × {c["L"]:g} (standard M2 × 7 trimmed)','DIN 963 / ISO 2009 M2, cut to length','steel','127-556.02-05, scaled on the section')]


# ---------------- the transit lock (Feststeller 05 01 01; no sheet of its own: case.js, all of it estimated), six pieces ----------------
def LQ():return W()['WD']['LOCKQ']
def YPL(six):
    q=W()['WD']['CASEQ'];yp=q['Y']['YB']-q['Y']['YSEAT'];return yp+LQ()['dy6'] if six else yp-q['RG']['lk']['dy']   # the lever's underside
SRC_L="case.js (the case's assembly 05 01 Schnitt A-B, Romanov 1975 for the 6MX; no sheet of its own), estimated"
def _arc3(a,m,b):return bd.Edge.make_three_point_arc(bd.Vector(*a),bd.Vector(*m),bd.Vector(*b))
def _ln(a,b):return bd.Edge.make_line(bd.Vector(*a),bd.Vector(*b))
def lockBracket(six):
    q=LQ();b=q['br'];c=q['c'];Wx=q['W'][1 if six else 0];ly=YPL(six);tw,ts,h=b['tw'],b['ts'],b['h'];W0,W1=b['W0'],b['W1'];sr=b['sr'];rc=b['rc'];src=SRC_L
    X0=Wx-tw
    seat=bd.Face(bd.Wire([_ln((X0,-W0,0),(c[0],-W0,0)),_arc3((c[0],-W0,0),(c[0]-sr,-c[1],0),(c[0],-W1,0)),_ln((c[0],-W1,0),(X0,-W1,0)),_ln((X0,-W1,0),(X0,-W0,0))]))
    def leg():
        lo,hi=-W1,-W0;z0=-(h-ts);k=math.cos(math.pi/4)
        w=bd.Wire([_ln((X0,lo,ts),(X0,hi,ts)),_ln((X0,hi,ts),(X0,hi,z0+rc)),_arc3((X0,hi,z0+rc),(X0,hi-rc+rc*k,z0+rc-rc*k),(X0,hi-rc,z0)),_ln((X0,hi-rc,z0),(X0,lo+rc,z0)),_arc3((X0,lo+rc,z0),(X0,lo+rc-rc*k,z0+rc-rc*k),(X0,lo,z0+rc)),_ln((X0,lo,z0+rc),(X0,lo,ts))])
        return bd.extrude(bd.Face(w),tw,dir=(1,0,0))
    ops=[Plate(seat,ts,"Cut the seat from 4 mm brass plate: 12 wide, its end round r 6 about the arbor",[S('seat',f'{2*sr:g} wide, {ts:g} thick, round end r {sr:g} about the arbor',None,src)],src),
         Hole((c[0],-c[1]),2*b['hr'],'in',ts,None,"Drill the arbor's hole Ø 4.1 through the seat",[S('hole',f'Ø {2*b["hr"]:g}',None,src)],src),
         Add(leg,f"Add the wall leg: {tw:g} thick, {2*sr:g} wide, {h:g} high, its lower corners rounded r {rc:g}, soldered or screwed to the seat's edge",[S('leg',f'{tw:g} × {W1-W0:g} × {h:g}',None,src),S('corners',f'r {rc:g}',None,src)],src)]
    r=Recipe('lockBr6' if six else 'lockBr','050101.F.b','Lock bracket (Feststellerwinkel)'+(", the 6MX's" if six else ''),src,'steel' if six else "brass (Ms; black on Wempe 3044's)",'none',[Setup('1','plate on the mill',ops,view='top')],page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,ly-ts,0)),
      expect=[{'at':(c[0],-c[1]),'r':6.4,'max':0.035,'why':'the page draws the seat'+chr(39)+'s round end as 16 chords of a semicircle: up to 0.029 inside the arc'}],
      notes=["Two wood screws DIN 96 3 × 15 (7 and 16 under the seat's top) hold the leg to the box's right wall; the page draws them, not their holes in the leg (a maker drills them)."] )
    if six:r.rev='6mx'
    return r
def lockLever(six):
    q=LQ();c=q['c'];e=q['e6'] if six else q['e'];lw=q['lw'];t=q['lt'];ly=YPL(six);L=math.hypot(e[0]-c[0],e[1]-c[1]);ux,uz=(e[0]-c[0])/L,(e[1]-c[1])/L;wx,wz=uz,-ux;src=SRC_L;r_=lw/2
    f=bd.Face(bd.Wire([_ln((0,-r_,0),(L,-r_,0)),_arc3((L,-r_,0),(L+r_,0,0),(L,r_,0)),_ln((L,r_,0),(0,r_,0)),_arc3((0,r_,0),(-r_,0,0),(0,-r_,0))]))
    ops=[Plate(f,t,"Cut the lever from 2.5 mm plate: a bar 8 wide, both ends round, from the arbor's centre to the grip end",[S('width',f'{lw:g}',None,src),S('length',f'{L:.2f} between the round ends\' centres',None,src),S('thickness',f'{t:g}',None,src)],src)]
    M=page_matrix([[ux,wx,0],[0,0,1],[uz,wz,0]],(c[0],ly,c[1]))
    r=Recipe('lockLever6' if six else 'lockLever','050101.F.l','Lock lever (Feststellerhebel)'+(", the 6MX's" if six else ''),src,'steel' if six else 'brass (Ms)','none',[Setup('1','plate on the mill',ops,view='top')],M,
      notes=["The hub's and the grip's holes are not drawn on the page (the lever is solid there); a maker bores them to the hub's and the grip's fit.","Its X runs from the arbor's axis to the grip end; the page turns it about the knob's axis to lock (69.7°)."])
    if six:r.rev='6mx'
    return r
UPC=lambda h:page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,-h/2,0))   # a cylinder the page draws centred on its axis (cylBetween): Z from its end
def lockArbor():
    q=LQ();a=q['ar'];h=a['y0']+q['lt']+a['y1'];src=SRC_L
    ops=[Bar(2*a['r'],h,'Part off Ø 4 steel rod and face to length',[S('diameter',f'Ø {2*a["r"]:g}',None,src),S('length',f'{h:g}',None,src)],src)]
    return Recipe('lockArbor','050101.F.a','Lock arbor (Feststellerachse)',src,'steel','none',[Setup('1','rod in the collet',ops)],UPC(h),notes=["Through the bracket's seat; its lower end is riveted under it (estimated: flush) and the hub and lever turn on it."],
      expect=[{'at':(0,0),'r':3,'max':0.03,'vol':1.7,'why':'the page draws the arbor as a 20-sided prism (cylBetween): up to 0.025 inside the circle'}])
def lockHub():
    q=LQ();a=q['hub'];h=a['y0']+a['y1'];src=SRC_L
    ops=[Bar(2*a['r'],h,'Part off Ø 9.8 rod and face to length',[S('diameter',f'Ø {2*a["r"]:g}',None,src),S('length',f'{h:g}',None,src)],src)]
    return Recipe('lockHub','050101.F.h','Lock hub (Feststellernabe)',src,'brass (Ms); steel on the 6MX','none',[Setup('1','rod in the collet',ops)],UPC(h),notes=["Its bore for the arbor is not drawn on the page (a solid cylinder); a maker bores it."],
      expect=[{'at':(0,0),'r':6,'max':0.03,'vol':5.8,'why':'the page draws the hub as a 32-sided prism (cylBetween): up to 0.024 inside the circle'}])
def lockPin(six):
    q=LQ();p=q['pin'];hd=q['hd'];t=q['lt'];h=t+p['t'][1 if six else 0]-p['y0'];src=SRC_L
    if six:
        ops=[Bar(2*p['r'],h,'Part off Ø 4 rod and face to length',[S('diameter',f'Ø {2*p["r"]:g}',None,src),S('length',f'{h:g}',None,src)],src)]
    else:
        z0=t+hd['y']-p['y0'];prof=[(0,0),(p['r'],0),(p['r'],z0),(hd['r'],z0),(hd['r'],z0+hd['h']),(hd['r']-hd['c'],z0+hd['h']+hd['c']),(0,z0+hd['h']+hd['c'])]
        ops=[Bar(2*hd['r'],z0+hd['h']+hd['c'],'Part off Ø 8.7 rod and face',[S('overall',f'{z0+hd["h"]+hd["c"]:g}',None,src)],src),
             TurnProfile(prof,'Turn the grip Ø 4 with its round head Ø 8.7 × 2.0, its top edge chamfered 0.5',[S('grip',f'Ø {2*p["r"]:g}',None,src),S('head',f'Ø {2*hd["r"]:g} × {hd["h"]:g} + {hd["c"]:g} chamfer',None,src+", Wempe 3044's photograph")],src)]
    r=Recipe('lockPin6' if six else 'lockPin','050101.F.p','Lever grip (Hebelzapfen)'+(", the 6MX's plain" if six else ''),src,'steel' if six else 'brass (Ms)','none',[Setup('1','rod in the collet',ops)],UPC(h),notes=["Its seat in the lever is not drawn on the page; the head's slot is not drawn either."],
      expect=[{'at':(0,0),'r':6,'max':0.045,'vol':6.1,'why':'the page draws the grip as a 16-sided prism (cylBetween): up to 0.038 inside the circle'}])
    if six:r.rev='6mx'
    return r
def lockKnob():
    q=LQ();k=q['kn'];h=k['y2'];src=SRC_L;prof=[(0,0),(k['r'],0),(k['r1'],k['t0']),(k['rk'],k['t0']),(k['rk'],k['top']),(k['r1'],k['top']),(k['r'],k['y2']),(0,k['y2'])]
    ops=[Bar(2*k['rk'],h,'Part off Ø 19.6 brass rod and face',[S('overall',f'{h:g}',None,src)],src),
         TurnProfile(prof,'Turn the knob: a flared foot r 9.3 to 9.45 over 0.5, the band Ø 19.6, the top edge chamfered',[S('foot',f'r {k["r"]:g} to {k["r1"]:g} over {k["t0"]:g}',None,src),S('band',f'Ø {2*k["rk"]:g}, {k["top"]-k["t0"]:g} high',None,src),S('top',f'{k["y2"]-k["top"]:g} high, r {k["r1"]:g} to {k["r"]:g}',None,src)],src),
         Note('turn',(k['rk']-k['d']-0.05,k['rk']+0.05,k['t0'],k['top']),f'Knurl the band straight, DIN 82, {k["n"]} teeth {k["d"]:g} deep',[S('knurl',f'{k["n"]} teeth, {k["d"]:g} deep',None,'DIN 82 (the page draws straight teeth)')],src)]
    return Recipe('lockKnob','050101.F.k','Lock knob (Feststellerknopf)',src,'brass (Ms); black on the 6MX','none',[Setup('1','rod in the collet, then knurled',ops)],page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),notes=["Its bore for the hub is not drawn on the page; a maker bores and pins it to the hub."],
      expect=[{'at':(0,0),'r':11,'max':0.035,'why':'the page turns the knob on 40 sides: up to 0.03 inside the circle'}])
LOCKR={'lockBr':lambda:lockBracket(False),'lockBr6':lambda:lockBracket(True),'lockLever':lambda:lockLever(False),'lockLever6':lambda:lockLever(True),'lockArbor':lockArbor,'lockHub':lockHub,'lockPin':lambda:lockPin(False),'lockPin6':lambda:lockPin(True),'lockKnob':lockKnob}


# ---------------- the barrel arbor's hook (Federhaken 05 07 02-2) and the maintaining detent's wire stud (WN-27) ----------------
def FQ():return W()['WD']['FU']
class FaceTo(Op):
    """face the pin's end to the core's round: everything outside a cylinder of radius R about the X axis removed (filed or milled flush with the core)"""
    kind='mill'
    def __init__(self,R,text,sizes=(),src=''):super().__init__(text,sizes,src);self.R=R
    def apply(self,p):return p&bd.Cylinder(self.R,40,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.CENTER)).rotate(bd.Axis.Y,90)
def hook(first):
    k=FQ()['HK'];t=k['t'][1 if first else 0];fa,ft=math.radians(k['fa']),math.radians(k['ft']);src='05 07 02-2 (Federhaken), 0207\'s section; its head as revised'+(', 3 long as first drawn' if first else '')
    pt=lambda r,f:(0,-r*math.sin(f),r*math.cos(f))   # (X, Y, Z) in the hook's frame: Z outward from the arbor, Y the page's -z, the head across the arbor's axis (X)
    def head():
        n=20;ramp=[pt(k['Rc']+k['rise']*i/n,ft+(fa-ft)*i/n) for i in range(n+1)]
        mid=pt(k['ru'],(fa+ft)/2)
        w=bd.Wire([bd.Edge.make_spline([bd.Vector(*q) for q in ramp]),bd.Edge.make_line(bd.Vector(*ramp[-1]),bd.Vector(*pt(k['ru'],fa))),bd.Edge.make_three_point_arc(bd.Vector(*pt(k['ru'],fa)),bd.Vector(*mid),bd.Vector(*pt(k['ru'],ft))),bd.Edge.make_line(bd.Vector(*pt(k['ru'],ft)),bd.Vector(*ramp[0]))])
        return bd.extrude(bd.Face(w),t,dir=(1,0,0)).moved(bd.Location((-t/2,0,0)))
    z1=k['Rc']+0.3
    ops=[Blank(2*k['r'],k['z0'],z1,'Part off Ø 2 steel rod and face to length',[S('pin',f'Ø {2*k["r"]:g}',None,src+': "Ø 2, 6 deep"')],src),
         FaceTo(k['Rc'],f'Face the pin\'s end to the core\'s round, radius {k["Rc"]:g} about the arbor\'s axis',[S('end',f'R {k["Rc"]:g} about the arbor\'s axis',None,src)],src),
         Add(head,f'Add the head: {t:g} along the arbor, its ramp rising {k["rise"]:g} over the core\'s round from {k["ft"]:g}° to {k["fa"]:g}° about the arbor, its face radial at {k["fa"]:g}°, its underside R {k["ru"]:g}',
             [S('head length',f'{t:g} along the arbor',None,src+(' (0207\'s "3")' if first else ' (2 as revised)')),S('rise',f'{k["rise"]:g} over the pin',None,src+', "0,5 high" over Ø 2'),S('ramp',f'{k["ft"]:g}° to {k["fa"]:g}° about the arbor',None,src+", 05 07 02's end view")],src)]
    r=Recipe('hook41' if first else 'hook','050702-2','Arbor hook (Federhaken)'+(' as first drawn' if first else ''),src,'steel','none',[Setup('1','rod in the collet; the head let on and soldered',ops)],page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),
      notes=["The page turns the hook onto the core's free angle (hookSet); here it is drawn in its own frame, Z outward from the arbor's axis, X along it. The hook is one piece on the sheet: made here as a pin with its head let on."],
      expect=[{'at':(0,0),'r':3.0,'max':0.05,'why':"the page builds the pin as a 24-gon cylinder and the head's underside and ramp as 20 chords"}])
    if first:r.rev='first'
    return r

class TurnArcs(Op):
    """turn a profile with arcs (r, z items as ops_case.prof_face): everything outside it removed"""
    kind='turn'
    def __init__(self,items,text,sizes=(),src=''):super().__init__(text,sizes,src);self.items=items
    def apply(self,p):
        from .ops_case import rev_items
        return p&rev_items(self.items)
def wireStud():
    q=FQ()['WS'];H=iso(2*q['rs']);src='the maintaining detent\'s wire stud (WN-27 by the coloured section\'s label, likely; 05 08_1a, 05 05_1)';TT=W()['WD']['TOP_T']
    es=H['es'];crest=q['rs']-es;rd=q['rd']
    # Z=0 at the shank's end, the plate's outer face at Z=TT+out (the shank is TT+out long under the head), the head from there up q['h']
    ZP=TT+q['out'];ZT=ZP+q['h'];items=[(0,0),(crest-rd,0),('arc',(crest-rd+rd*math.sin(math.pi/4),rd-rd*math.cos(math.pi/4)),(crest,rd)),(crest,ZP),(q['r'],ZP),(q['r'],ZT),(0,ZT)]
    ang=math.degrees(math.atan2(-math.cos(math.radians(q['rot'])),math.sin(math.radians(q['rot']))))
    def slot():return bd.Box(2*q['r']+1,2*q['w'],q['h']-q['sd']+0.01,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,ZT-(q['h']-q['sd'])))).rotate(bd.Axis.Z,ang)
    ops=[Bar(2*q['r'],ZT,'Part off steel rod Ø 3 and face to length',[S('overall',f'{ZT:.2f}',None,src+', estimated')],src),
         TurnArcs(items,"Turn the head Ø 3.0 × 1.9 and the shank to the thread's major diameter with its end rounded",[S('head',f'Ø {2*q["r"]:g} × {q["h"]:g}',None,src+', likely ±0.3 and ±0.15'),S('shank',f'Ø {2*crest:.3f}',f'6g (es {es:.3f})','ISO 965'),S('end',f'rounded r {rd:g}',None,src+', scaled')],src),
         ThreadOD(H,0,ZP,f'Cut the thread M{2*q["rs"]:g} (die or single point)',[S('thread',f'M{2*q["rs"]:g} × {H["p"]}','6g','ISO 261')],src),
         Bore(2*q['wr'],-0.1,q['wh'],'Drill the hole for the wire in the shank\'s end, 1.5 deep',[S('hole',f'Ø {2*q["wr"]:g} × {q["wh"]:g} deep',None,src+', estimated: the section draws the wire leaving the end\'s middle')],src),
         Cut(slot,'Mill the slot across the head',[S('slot',f'{2*q["w"]:g} wide, {q["h"]-q["sd"]:g} deep, turned {q["rot"]:g}° off the plate\'s N-S line toward 3 o\'clock',None,src+', Wempe 3955\'s (Kirov 247\'s N-S, Lange 5177\'s E-W: set by hand)')],src)]
    r=Recipe('wireStud','wireStud','Wire stud (Schraube WN-27, likely)',src,'steel (brass on Wempe 3955\'s)','none',[Setup('1','rod in the collet, turned and threaded; the slot milled; the wire\'s hole drilled',ops)],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,q['out']-W()['WD']['INNER'],0)),
      notes=["The wire (the detent's spring, 05 05 06-1) is pressed or soldered 1.5 into the shank's end and hangs straight down past the detent."],
      expect=[{'at':(0,0),'r':3.0,'max':0.4,'why':"the page draws the slot as the head's two halves with the slot's floor between them (a stepped head), and its thread on its helix"}])
    return r


# ---------------- the band's two hooks (Bandhaken rund 05 07 03-2, Bandhaken f. Trommel 05 07 03-3): fusee.js's BHK as exact arcs and lines ----------------
class Prof:
    """a profile walked round as arcs and lines: arc(c, r, a0, a1, ccw) exact, pt(p) a corner; edges() the closed wire, each point put through f"""
    def __init__(s):s.it=[]
    def arc(s,c,r,a0,a1,ccw):
        d=a1-a0
        if ccw:
            while d<=0:d+=2*math.pi
        else:
            while d>=0:d-=2*math.pi
        P=lambda a:(c[0]+r*math.cos(a),c[1]+r*math.sin(a));s.it.append(('A',P(a0),P(a0+d/2),P(a0+d)))
    def pt(s,p):s.it.append(('P',p))
    def edges(s,f):
        E=[];cur=None;first=None
        def go(p):
            nonlocal cur,first
            if cur is not None and math.dist(cur,p)>1e-4:E.append(bd.Edge.make_line(bd.Vector(*cur,0),bd.Vector(*p,0)))
            if cur is None:first=p
            cur=p
        for it in s.it:
            if it[0]=='P':go(f(it[1]))
            else:
                a,m,b=[f(q) for q in it[1:]];go(a);E.append(bd.Edge.make_three_point_arc(bd.Vector(*a,0),bd.Vector(*m,0),bd.Vector(*b,0)));cur=b
        if math.dist(cur,first)>1e-4:E.append(bd.Edge.make_line(bd.Vector(*cur,0),bd.Vector(*first,0)))
        return bd.Wire(E)
def _bhk():
    V=lambda a,b:(a[0]-b[0],a[1]-b[1]);dot=lambda a,b:a[0]*b[0]+a[1]*b[1];ang=lambda c,p:math.atan2(p[1]-c[1],p[0]-c[0]);ptc=lambda c,r,a:(c[0]+r*math.cos(a),c[1]+r*math.sin(a))
    def tg(c1,r1,s1,c2,r2,s2):
        D=V(c2,c1);L=math.hypot(*D);th=math.atan2(D[1],D[0])-math.asin((s2*r2-s1*r1)/L);n=(-math.sin(th),math.cos(th))
        return [(c1[0]-s1*r1*n[0],c1[1]-s1*r1*n[1]),(c2[0]-s2*r2*n[0],c2[1]-s2*r2*n[1])]
    def cc(c1,r1,c2,r2):
        D=V(c2,c1);L=math.hypot(*D);a=(r1*r1-r2*r2+L*L)/(2*L);h=math.sqrt(max(0,r1*r1-a*a));m=(c1[0]+D[0]*a/L,c1[1]+D[1]*a/L)
        return [(m[0]-D[1]*h/L,m[1]+D[0]*h/L),(m[0]+D[1]*h/L,m[1]-D[0]*h/L)]
    def lc(p,d,c,r):
        w=V(p,c);b=dot(w,d);q=b*b-(dot(w,w)-r*r);return [(p[0]+d[0]*t,p[1]+d[1]*t) for t in (-b-math.sqrt(q),-b+math.sqrt(q))]
    slot=FQ()['BHK']['slot'];brk=FQ()['BHK']['brk']
    def notch(B,p,d,w,yt):
        nl=(-d[1],d[0]);e=(slot-w)/2;off=lambda q,k:(q[0]+nl[0]*k,q[1]+nl[1]*k);pR=off(p,e);pL=off(p,-w-e);xR=lc(pR,d,B,1)[1];xL=lc(pL,d,B,1)[1]
        def up(q,y):t=(y-q[1])/-d[1];return (q[0]-d[0]*t,q[1]-d[1]*t)
        tR=up(pR,yt);tL=off(tR,-slot);bR=lc(p,d,B,1)[1];bL=lc(off(p,-w),d,B,1)[1];tM=off(up(p,yt),-w/2)
        def put(o):
            for q in [(xL[0]-d[0]*brk,xL[1]-d[1]*brk),tL,tR,(xR[0]-d[0]*brk,xR[1]-d[1]*brk)]:o.pt(q)
        return {'aL':ang(B,xL),'aR':ang(B,xR),'put':put,'mouth':((bL[0]+bR[0])/2,(bL[1]+bR[1])/2),'top':(tM[0]+d[0]*0.01,tM[1]+d[1]*0.01)}
    D2R=math.pi/180;Q_=FQ()['BHK'];slot=Q_['slot'];brk=Q_['brk']
    S,N,B,K,RK,F=[tuple(Q_['T'][k]) if isinstance(Q_['T'][k],list) else Q_['T'][k] for k in ('S','N','B','K','RK','F')];RF=math.hypot(*V(B,F))+1;b5=Q_['T']['b5']*D2R;dB=(math.sin(b5),-math.cos(b5));rn=Q_['T']['rn']
    nb=notch(B,B,dB,Q_['T']['w'],0);lw0,lw1=tg(N,rn,1,S,rn,-1);b7=Q_['T']['b7']*D2R;dk=(-math.sin(b7),-math.cos(b7));nk=(-dk[1],dk[0]);pN=(N[0]-rn*nk[0],N[1]-rn*nk[1])
    X1=sorted(cc(F,RF,K,RK),key=lambda q:-q[1])[0];X2=lc(pN,dk,K,RK)[0]
    T=Prof();T.arc(B,1,math.pi,nb['aL']-brk,True);nb['put'](T);T.arc(B,1,nb['aR']+brk,ang(F,B),True);T.arc(F,RF,ang(F,B),ang(F,X1),True);T.arc(K,RK,ang(K,X1),ang(K,X2),True)
    T.arc(N,rn,ang(N,pN),ang(N,lw0),True);T.arc(S,rn,ang(S,lw1),0,False)
    d=Q_['D'];Tp,CR,B3,Q,BT,A4=[tuple(d[k]) for k in ('Tp','CR','B3','Q','BT','A4')];rt,rA,rC,rB=d['rt'],d['rA'],d['rC'],d['rB'];b10=d['b10']*D2R;dB3=(-math.sin(b10),-math.cos(b10));b75=d['b75']*D2R;df=(math.sin(b75),-math.cos(b75));nf=(-df[1],df[0])
    pT=(Tp[0]-rt*nf[0],Tp[1]-rt*nf[1]);Xa=lc(pT,df,A4,rA)[0];tA=ptc(A4,rA,ang(A4,BT));bl0,bl1=tg(BT,rt,1,Q,rt,-1);wl0,wl1=tg(Q,rt,-1,B3,rB,1)
    n3=notch(B3,tuple(d['p']),dB3,d['w'],0);XB=sorted(cc(B3,rB,CR,rC),key=lambda q:q[1])[0];tT=ptc(CR,rC,ang(CR,Tp))
    Dd=Prof();Dd.arc(Tp,rt,ang(Tp,tT),ang(Tp,pT),True);Dd.pt(Xa);Dd.arc(A4,rA,ang(A4,Xa),ang(A4,tA),True);Dd.arc(BT,rt,ang(BT,tA),ang(BT,bl0),True);Dd.arc(Q,rt,ang(Q,bl1),ang(Q,wl0),False)
    Dd.arc(B3,rB,ang(B3,wl1),n3['aL']-brk,True);n3['put'](Dd);Dd.arc(B3,rB,n3['aR']+brk,ang(B3,XB),True);Dd.arc(CR,rC,ang(CR,XB),ang(CR,tT),True)
    u5=(-dB[0],-dB[1]);v5=(-u5[1],u5[0]);M5=nb['mouth']
    fT=lambda p:(dot(V(p,M5),u5),dot(V(p,M5),v5))
    uw=V(wl0,wl1);lw=math.hypot(*uw);uW=(uw[0]/lw,uw[1]/lw);mW=(uW[1],-uW[0])
    fD=lambda p:(dot(V(p,n3['mouth']),uW)+1.5,dot(V(p,wl1),mW))
    return {'T':T,'D':Dd,'fT':fT,'fD':fD}
def bandHook(drum):
    B=_bhk();P=B['D'] if drum else B['T'];f=B['fD'] if drum else B['fT'];t=2*FQ()['BHK']['t'];src='05 07 03-3 (Bandhaken f. Trommel), traced 5:1' if drum else '05 07 03-2 (Bandhaken rund), traced 5:1'
    face=bd.Face(P.edges(f))
    ops=[Plate(face,t,'Cut the hook from Bandstahl 10 × 0.8 (DIN 1016) to the traced outline: arcs and lines as listed in the notes, the notch for the band with its edges broken 0.1',
        [S('thickness',f'{t}','0.8 -0.05 (drawn 0.78)',src),S('stock','Bandstahl 10 × 0.8, DIN 1016',None,src)],src)]
    r=Recipe('bandHookDrum' if drum else 'bandHookRound','050703-3' if drum else '050703-2',"Band's drum hook (Bandhaken f. Trommel)" if drum else "Band's round hook (Bandhaken rund)",src,'Bandstahl 10 × 0.8 (DIN 1016), hard-soldered to the band ("hart gelötet")','none',
      [Setup('1','strip on the mill or the wire-eroder',ops,view='top')],page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,-t/2,-BYW() if drum else 0)),
      notes=["The page draws it flat (a slab 0.78 thick) in the outline fusee.js's BHK walks round from the sheet's traced circles; the recipe walks the same circles as exact arcs and lines. The band (0.22 +0.03) is let into its notch and brazed (\"hart gelötet\")."])
    return r
def BYW():
    q=FQ()['BHK'];return q['y']-(q['RB']+q['ob'])

RECIPES={'keyTube':keyTube,'keyBody':keyBody,'keyPaddle':keyPaddle,'key40Pipe':key40Pipe,'key40Body':key40Body,'key40Cap':key40Cap}
RECIPES.update(LOCKR)
RECIPES.update({'bandHookRound':lambda:bandHook(False),'bandHookDrum':lambda:bandHook(True)})
RECIPES.update({'hook':lambda:hook(False),'hook41':lambda:hook(True),'wireStud':wireStud})
for _b in keyBought()+key40Bought():RECIPES[_b.key]=(lambda b=_b:b)

# ---------------- the coverage lines (1 November 2026): what the parts list holds that a maker buys or that is not machined from the model ----------------
# Each is a Bought line (recipes_site.py writes it to the card as "buy ..."): the box and outer box are joinery and hardware (the owner's choice, 29 October 2026: the box is a joiner's, "not machined from the model"),
# the felt and leather are cut to size, the glass is cut, the standard screws and the jewels are bought. Sizes are the page's own, estimated where case.js says so (no sheet of the set gives the box's hardware).
JOIN="a joiner's work, not machined from the model; the sizes are the page's (case.js), no sheet in the set but 05 01 and 51 00 10 gives them"
def _B(key,hn,title,what,size,std,mat,src,notes=()):return Bought(key,hn,title,what,size,std,mat,src,notes)
def covBought():
    c="case.js, estimated (no sheet of the set draws it)"
    return [
      _B('boxHandle','510010','Box handle (Griff f. Chronometerkasten), two','box carrying handle, let into the side wall over the finger recess (an oval 70 × 30, 10 deep in the 12.5 wall)','as the page draws it (case.js)','a commercial brass box handle (Kastengriff), or turned and bent from Ø 4 brass rod','brass','51 00 10, the elevation; '+c),
      _B('boxHinge','Scharnier','Piano hinge (Scharnier), the box\'s','piano hinge, brass, 148 long, its leaves let into the lid\'s and the box\'s parting faces','148 long','a commercial brass piano hinge, cut to length','brass',c),
      _B('lidStay','Deckelstuetze','Lid stay (Deckelstütze)','slotted brass bar pivoted on the lid\'s left wall, riding on a pin in the box\'s','as the page draws it (case.js)','a commercial lid stay (Deckelstütze), or filed from brass strip','brass','Wempe 6161\'s photograph; '+c),
      _B('keyHolder','Schluesselhalter','Key holder (Schlüsselhalter), the shelf','a shelf across the box\'s back right corner, its front edge curved round the gimbal ring; the key\'s cone seats in the round fitting on it',JOIN.split(';')[0],'joinery, in the box\'s wood','wood (as the box)','Wempe 6161, 3044; 51 00_1 draws a triangle; '+c),
      _B('keyHolderCup','Schluesselhalter.F','Key holder fitting (Fassung), round','a round brass cup standing on the shelf, the key\'s cone seats on its bore','as the page draws it (case.js)','turned from brass bar on a lathe (the page\'s Ø and bore estimated: no sheet), or bought as a brass cup','brass','51 00_1\'s circle; Lange VEB 2285\'s; '+c),
      _B('latchPlate','Schliessblech','Latch plate (Schließblech)','an angle on the box\'s front, its top let into the front wall\'s top, slotted for the lid\'s hook; the knob through its face','as the page draws it (case.js)','a commercial box latch (Schließblech), or filed from brass sheet','brass','Lange 5591\'s, its sizes not seen; '+c),
      _B('hookPlate','Hakenblech','Hook plate (Hakenblech)','an angle on the lid\'s front, its top let into the front wall\'s underside; its hook drops through the latch plate\'s slot over the bolt','as the page draws it (case.js)','a commercial box latch (Hakenblech), or filed from brass sheet','brass','Lange 5591\'s, its sizes not seen; '+c),
      _B('lidPin','Kastenstift','Pins over the outer pivots (Kastenstift), two','dowel pin standing 2.3 out of each side wall\'s parting face over its outer pivot, into a hole in the closed lid\'s wall','Ø as the page draws it, 2.3 proud','dowel pin (ISO 8734) or silver steel rod, pressed in','steel','05 01\'s elevation draws it; its purpose inferred (a lid-locating pin); '+c),
      _B('boxLid','Holzkasten.D','Box lid (Deckel)','the glazed lid, hinged at the back',JOIN,'joinery','wood (mahogany as Wempe 6161\'s: the drawings say "Holzgehäuse")','51 00 10; '+c),
      _B('lidGlass','Deckelglas','Lid glass (Deckelglas)','a pane in the lid\'s top, under its frame','as the page draws it (case.js)','window glass, cut to size and edge-ground','glass',c),
      _B('makersPlate','000101-9','Maker\'s plate (Firmenschild), Type 3371','engraved brass plate on the lid\'s front, held by four pins Ø 1.2 in its holes 2 from its edges, driven into the lid\'s wood','as the page draws it (case.js); pins Ø 1.2','engraved by the plate maker; the four pins from brass wire Ø 1.2','brass','Wempe 6161\'s, Type 3371\'s plate; '+c),
      _B('latchTongue','P510002-2','Latch tongue (Zunge)','the latch\'s bolt, out of view in a mortise in the box\'s front wall behind the latch plate, turning on its screw','as the page draws it (case.js)','a commercial box latch\'s bolt, or filed from brass strip','brass','its arrangement unknown; '+c),
      _B('latchKnob','WN-zk','Latch knob (Knopf), in the tongue\'s M3.5','knurled brass knob, in the tongue\'s M3.5 out through the latch plate\'s face','M3.5 thread','turned from brass bar (the page\'s knob estimated) or a commercial knurled knob','brass','Lange 5591\'s; '+c),
      _B('outerBox','Ueberkasten','Outer box (Überkasten), body and base plate','carries the wooden box for transport, cushioned all round',JOIN,'joinery','bleached birch','51 00 10; '+c),
      _B('rimStrip','Randleiste','Rim strip (Leiste, 17, 18)','inside the rim, 4 over the walls: the lid closes over it',JOIN,'joinery','bleached birch',c),
      _B('feltFB','Polster.S','Cushions, front and back (Polster), two','felt cushions against the wooden box\'s front and back','as the page draws them (case.js)','felt, cut to size and glued','felt',c),
      _B('feltE','Polster.E','Cushions, ends (Polster), two','felt cushions against the wooden box\'s handles','as the page draws them (case.js)','felt, cut to size and glued','felt',c),
      _B('feltB','Polster.B','Cushion, floor (Polster)','the felt cushion the wooden box stands on','as the page draws it (case.js)','felt, cut to size and glued','felt',c),
      _B('strap','Riemen','Strap (Riemen, 10), two','leather strap over the lid to its buckle, its ends on the end walls (its loose ends and buckle not drawn)','as the page draws it (case.js)','a leather strap with a buckle, cut to length','leather',c),
      _B('strapEye','Riemenoese','Strap eye (Öse, 12), two','an eye on each end of the base plate, for the strap','as the page draws it (case.js)','a commercial strap eye, wood-screwed','brass',c),
      _B('outerHinge','Scharnier.U','Outer box hinges (Scharnier, 7), two','hinges joining the outer box\'s lid to its body at the back','as the page draws them (case.js)','commercial hinges, cut or bought to size','brass',c),
      _B('hookEye','Hakenoese','Hook eye (Öse, 9), commercial','the eye on the outer box\'s front, under the rim','as the page draws it (case.js)','a commercial eye','brass',c),
      _B('hookBox','Haken','Hook (Haken, 9), commercial','the hook on the outer box lid\'s front, caught in the eye','as the page draws it (case.js)','a commercial hook','brass',c),
      _B('outerLid','Ueberkasten.D','Outer box lid (Deckel)','hinged at the back, cushioned inside',JOIN,'joinery','bleached birch',c),
      _B('feltLid','Polster.D','Lid cushion (Polster, 16)','the felt cushion that bears on the wooden box\'s lid','as the page draws it (case.js)','felt, cut to size and glued','felt',c),
      # the 6MX's box (Kirov No. 247's photographs; no sheet)
      _B('box6','Kasten6','Box body (Ящик), the 6MX\'s','the box the gimbals hang in, 190 × 190 × 190 outside (the TU\'s)',JOIN,'joinery','wood','Kirov 247\'s photographs, its tiers on Kirov 22823\'s; no sheet'),
      _B('hinge6','Scharnier6','Hinges (6MX), two','hinges joining the glazed lid to the box at the back and the top lid to it','as the page draws them (case.js, estimated: not seen on Kirov 247\'s photographs)','commercial brass hinges','brass',c),
      _B('handle6','Griff6','Ring handle (6MX), two','a ring handle on each side, under the lower parting line','as the page draws them (case.js)','a commercial ring handle','brass',c),
      _B('strips6','Beschlag6','Corner strips (6MX)','brass strips round the box\'s corners (the lids\' with them)','as the page draws them (case.js)','brass strip, bent and screwed on','brass',c),
      _B('hasp6','Ueberfall6','Hasp leaves (6MX), four','two hasps across the parting lines, a knurled screw on each lower leaf','as the page draws them (case.js)','commercial hasps','brass',c),
      _B('number6','Nummernschild','Number plate 247 (6MX), two','engraved plates on the box\'s front and the outer box\'s lid','as the page draws them (case.js)','engraved by the plate maker','brass',c),
      _B('lid6','Kasten6.D','Glazed lid and top lid (6MX)','hinged at the back, opened together here',JOIN,'joinery with a cut pane','wood and glass',c),
      _B('badge6','Firmenschild6','Factory badge, 1 МЧЗ им. Кирова (6MX)','the badge on the glazed lid\'s front','as the page draws it (case.js)','engraved or stamped by the badge maker','brass',c),
      _B('outer6','Ueberkasten6','Outer box (6MX), body','carries the box for transport, felt-lined',JOIN,'joinery','wood','its sizes estimated; '+c),
      _B('felt6','Polster6','Felt (6MX), six','under, round and over the box','as the page draws it (case.js)','felt, cut to size and glued','felt',c),
      _B('outerLid6','Ueberkasten6.D','Outer box lid (6MX)','hinged at the back, its tab closing into the notch',JOIN,'joinery','wood',c),
      # the 6MX bracket screws and the 6MX's bought parts
      _B('bracketScrew6','6MX.bks','Bracket screws (6MX), six','slotted cheese-head screws M2.5 (head Ø 4.8 × 1.6) holding the high case brackets (two each, in slots) and the locking bracket (two, in its vertical slot) to the bowl','M2.5 × 6.4 (the brackets\') and × 6 (the locking bracket\'s)','ISO 1207 / DIN 84 M2.5, cut to length','steel','case.js (the 6MX\'s book, Romanov 1975); estimated'),
      _B('jewel6_38u','6MX.jw38u','Hole jewel (6MX), intermediate arbor, upper','hole jewel in its chaton, olived hole','as the page draws it (frame.js, estimated: no sheet)','a watch hole jewel to size','synthetic ruby','Kirov No. 247\'s photographs'),
      _B('jewel6_35u','6MX.jw35u','Hole jewel (6MX), seconds arbor, upper','hole jewel in its chaton, olived hole','as the page draws it (frame.js, estimated: no sheet)','a watch hole jewel to size','synthetic ruby','Kirov No. 247\'s photographs'),
      _B('jewel6_38l','6MX.jw38l','Hole jewel (6MX), intermediate arbor, lower','hole jewel in its chaton, olived hole','as the page draws it (frame.js, estimated: no sheet)','a watch hole jewel to size','synthetic ruby','Kirov No. 247\'s photographs'),
      _B('jewel6_ctju','6MX.ctju','Hole jewel (6MX), contact staff, upper','hole jewel for the contact staff\'s upper pivot','Ø 1.8 × 0.6, hole Ø 0.42','a watch hole jewel to size','synthetic ruby','train.js (the page\'s, estimated); Romanov 1975'),
      _B('jewel6_ctjeu','6MX.ctjeu','End jewel (6MX), contact staff, upper','end stone on the staff\'s upper end','Ø 1.8 × 0.4','a watch endstone to size','synthetic ruby','train.js (the page\'s, estimated); Romanov 1975'),
      _B('jewel6_ctjl','6MX.ctjl','Hole jewel (6MX), contact staff, lower','hole jewel for the staff\'s lower pivot, in the cock\'s arm','Ø 1.8 × 0.6, hole Ø 0.42','a watch hole jewel to size','synthetic ruby','train.js (the page\'s, estimated); Romanov 1975'),
      _B('jewel6_ctjel','6MX.ctjel','End jewel (6MX), contact staff, lower','end stone under the cap plate','Ø 1.8 × 0.4','a watch endstone to size','synthetic ruby','train.js (the page\'s, estimated); Romanov 1975'),
      _B('stone6','6MX.ctp','Contact lever\'s stone (6MX, 61)','a corundum pallet with a bevelled end, lifted by the contact wheel\'s teeth','as the page draws it (train.js, estimated)','a ruby pallet stone to size, set in the lever','synthetic ruby','Romanov 1975, Figs. 100-103; Kirov 247\'s photographs'),
      _B('fibre6_ctf','6MX.ctf','Insulation (6MX, 68), two','black fibre under each contact block, insulating it from the base','as the page draws it (train.js, estimated)','vulcanised fibre sheet 1.8 thick, punched or cut','vulcanised fibre','Kirov 247\'s photographs (10_Kirow_247_E-Kontakt_1.jpg)'),
      _B('fibre6_ctu','6MX.ctu','Insulating bush (6MX, 67), four','black fibre bush insulating each block screw from its block, its flange under the head','flange Ø 4.6 × 0.95, shank Ø 2.3, bore Ø 1.5, 4.2 overall','turned from fibre rod','vulcanised fibre','train.js (the page\'s, estimated); Kirov 247\'s photographs'),
      _B('fibre6_cfi','6MX.cfi','Contact spring\'s insulation (6MX, 64), two','a black insulating strip between each spring\'s foot and the bowl\'s bore','as the page draws it (case.js, estimated)','vulcanised fibre strip, bent to the bore','vulcanised fibre','Kirov 247\'s photographs'),
      _B('fibre6_cfw','6MX.cfw','Terminal washers (6MX, 63), six','black fibre washers under the springs\' screws and the terminals outside the bowl','Ø 8.5 × 1 (Ø 8 for the terminal\'s)','punched from vulcanised fibre sheet','vulcanised fibre','case.js (the page\'s, estimated)'),
      _B('screw6_cts','6MX.cts','Contact block screws (6MX), four','steel cheese-head screws, head Ø 3.1 × 2.6','M1.4 × 6.2','ISO 1207 M1.4, cut to length','steel','train.js (the page\'s, estimated)'),
      _B('screw6_ctm','6MX.ctm','Contact base screws (6MX, 56), two','steel screws holding the contact base to the pillar plate, their ends flush on the dial side','M1.7 × (2 + the plate\'s thickness)','ISO 1207 M1.7, cut to length','steel','train.js (the page\'s, estimated)'),
      _B('screw6_ctcs','6MX.ctcs','Contact cock screw (6MX)','holds the cock\'s foot to the base','M1.4 × 3','ISO 1207 M1.4, cut to length','steel','train.js (the page\'s, estimated)'),
      _B('screw6_ctccs','6MX.ctccs','Cap plate screws (6MX), two','hold the cap plate to the cock\'s arm','M0.9 × 1.6','a watch screw to size','steel','train.js (the page\'s, estimated)'),
      _B('pin6_ctcp','6MX.ctcp','Contact cock steady pins (6MX), two','place the cock\'s foot on the base','Ø 0.8 × 2.5','dowel pin or silver steel Ø 0.8, pressed in','steel','train.js (the page\'s, estimated)'),
      _B('screw6_cfs','6MX.cfs','Contact spring screws (6MX, 65), four','slotted brass heads outside the bowl holding the springs\' feet through its wall','Ø 5.6 head, M2 × 5.9','ISO 1207 M2 brass, cut to length','brass','case.js (the page\'s, estimated); the holes across the turned bowl not cut on the page'),
      _B('terminal6','6MX.cfk','Contact terminals (6MX), two','a brass socket outside the bowl for each lead, marked + and −','Ø 6.4 × 2, bore Ø 3','turned from brass bar, or a commercial terminal socket','brass','case.js (the page\'s, estimated); Kirov 247\'s photographs')]
for _b in covBought():RECIPES[_b.key]=(lambda b=_b:b)

# the chain and the band: bought lines with the drawing's whole specification (decided 1 November 2026: a fusee chain is riveted of hundreds of plates by chain makers, its links are not a CNC job; the band is strip)
def chainBand():
    return [
      Bought('chain','050704','Chain (Kette), with its two end hooks','fusee chain of 375 links, riveted: each outer link two plates and each inner link one plate, all hardened; the two end links carry the hooks (strip 10 × 0.9) riveted on','pitch 2.05, plates 0.26 thick (outer links two, inner links one), overall width 0.82, lobes r 1.0 about the rivets, waist 1.41; rivets Ø 0.55 (stock 0.6) through all three plates, their ends flush and polished; the top hook 5 from its rivet to its crown, 3.5 wide, the bottom hook 7.5 from its last rivet with a barb (05 07 04)','a chain maker\'s fusee chain to this drawing (05 07 04), or riveted by hand from punched plates','steel, hardened, tempered at 310°, lightly polished','05 07 04 (05 07_14), traced on the two plan views at 5:1; the page draws the plates, rivets and hooks as the drawing, the hooks 0.80 thick',
        ['The hooks are small flat parts (the page draws them as slabs 0.8 thick); a maker can cut them from the strip to the sheet\'s outlines. The links are not made by this book: a chain of 375 links, 1,500 plates and 750 rivets is bought from a chain maker.']),
      Bought('band','050703-1','Band (Schneckenband)','steel band, its two ends let into the notches of the hooks (05 07 03-2, -3) and hard-soldered ("hart gelötet")','727 long × 0.22 +0,03 thick × 0.8 wide (the width is not on the sheet: taken as the hooks\' 0.8, estimated)','steel strip (Bandstahl), cut to length','spring steel','05 07 03, 05 07_11 (thickness and length); width estimated')]
for _b in chainBand():RECIPES[_b.key]=(lambda b=_b:b)

# ---------------- the Soviet 6MX's chatons (6MX.ch38u, .ch35u in the top plate, .ch38l in the intermediate bridge): train.js, estimated from Kirov 247's photographs ----------------
def chaton(key,hn,title,lower):
    q=W()['WD']['SM6'];d=W()['WD'];TOPT=d['TOP_T'];y0=d['PP_T']+q['y0'];ZB=d['PP_T']+3.8;INNER=d['INNER'];src="train.js (the Soviet 6MX's jewels in chatons: Kirov No. 247's photographs; no sheet), estimated";rw,hj,rl,rs=q['rw'],q['hj'],q['rl'],q['rs']
    if lower:L=ZB-y0;prof=[(rw,0),(q['rb'],0),(q['rb'],L),(rs,L),(rl,hj),(rw,hj)];sh=y0
    else:L=TOPT;prof=[(rs,0),(q['rJ'],0),(q['rJ'],L),(rw,L),(rw,L-hj),(rl,L-hj)];sh=-INNER-TOPT
    ops=[Bar(2*max(r for r,_ in prof),L,'Part off brass bar and face to length',[S('overall',f'{L:g}',None,src)],src),
         TurnProfile(prof,"Turn the chaton: its outside to fit the bearing's hole, the oil sink from Ø 3.4 at the outer face to the lip Ø 1.2 over the stone, the stone's seat Ø 2.2 × 0.6 in its inner end"+(" (the stone toward the plate)" if lower else ""),
           [S('outside',f'Ø {2*max(r for r,_ in prof):.3f}',None,src+': fills the bush\'s hole'),S('stone seat',f'Ø {2*rw:g} × {hj:g}',None,src),S('lip',f'Ø {2*rl:g}',None,src),S('oil sink',f'Ø {2*rs:g} at the outer face to the lip',None,src)],src)]
    r=Recipe(key,hn,title,src,'brass, gilt','gilt',[Setup('1','bar in the collet, turned; the stone pressed into its seat and the lip burnished over it',ops)],page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,sh,0)),
      notes=["The jewel is a bought hole jewel Ø 2.2 × 0.6 (its hole olived), pressed in flush with the face the arbor's shoulder bears on."])
    r.rev='6mx';return r
CHAT={'chaton38u':lambda:chaton('chaton38u','6MX.ch38u',"Chaton (6MX), intermediate arbor's upper jewel",False),'chaton35u':lambda:chaton('chaton35u','6MX.ch35u',"Chaton (6MX), seconds arbor's upper jewel",False),'chaton38l':lambda:chaton('chaton38l','6MX.ch38l',"Chaton (6MX), intermediate arbor's lower jewel",True)}
for _k,_f in CHAT.items():RECIPES[_k]=_f
