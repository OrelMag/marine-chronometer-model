// @ts-check
/* dims.js: the Wempe Einheits-Chronometer's dimensions, each from Wempe's works drawings (References/wempe/drawings/), with the sheet and how sure the reading is.
   Part of the Wempe model (three.js r128). Declares only WD. P1a (14 October 2026): the frame's shared numbers, read off the frame's sheets (05 08, References/wempe/
   transcriptions/05-08-frame.md, checked on the sheets); the frame's own sizes (cocks, bridges, ring, bushes) are in js/frame.js beside the parts they make.
   Plan coordinates as the sheets' hole tables give them: N/S along the 12-6 line and O (Ost, east)/W across, from the centre wheel's arbor (hole 1, Minutenrad, N 0 O 0),
   the plates' centre (the 85 rim scales 42.3 from it on 05 08_3b). Every plan of the frame (05 08_1b, _3b, _4, _5, _13, _31, _32) is drawn with N up and O to the right,
   seen from above with the movement lying dial down: the Oberplatte from its outer face (its pillar seats, which are in its inner face, dashed; Schnitte A-B, C-D, G-H mark
   "oben" on that face), the Unterplatte from its inner face (its pillar seats drawn whole). Seconds at 6 (Sekundenrad S 23.0) and the up-and-down at 12 (Auf u. Ab N 23.0)
   put N at 12 o'clock, and seen from above, O is the dial's 9 o'clock: the dial side's photograph of Wempe 3955 (photos/dg-chrono-dec/3_Wempe_3955_uZ.jpg, square-on on
   millimetre paper) has the Wechselrad (hole 19, O 10.9 S 6.3) left of the centre and below it, and the Werkring's sheet (05 08 00-3, drawn from the dial side) puts its three
   screws at 20, 140 and 260 deg from 12 clockwise, where the top plate's photograph (2_Wempe_3955_A.jpg) has them at 339, 99 and 218 deg from N toward O (sure).
   In the movement frame (as the Hamilton's: mm, dial side +y, 12 o'clock -z, 3 o'clock +x): x = W, z = S. */
const WD=(()=>{const NO=(n,o)=>[-o,-n];   /* a hole table's N and O (S and W as negative) to plan [x, z] */
  /* the hole table: every hole's place, by its number on the sheets (05 09 01 = 05 08_1a for the Oberplatte, 05 08 02-1 = 05 08_3a for the Unterplatte; the cocks' and the
     barrel bridge's own tables, 05 08 00-2, 05 08 03-1, 05 08 05-1, give the same places for the holes they share, to the last figure: sure). Holes 14-18 (the hand-setting
     work's, struck through on 05 08 02-1: "nur wenn Zeigerstellung eingebaut wird") are in: Wempe 3955's plate is drilled for it (3_Wempe_3955_uZ.jpg, fitted on its holes 1,
     12, 26, 30, 40 at 8.52 px/mm, puts 14-18 within 0.15-0.6 mm of the table). 56, 57 (the seconds contact's screws, "nur bei Bedarf") and the lever chronometer's 27, 31-34
     are left out; 30 (Ankerrad) is on the detent chronometer's own Unterplatte (05 08 02-1's table, 05 08 02's assembly with a setting in it, and drilled in Wempe 3955's plate) */
  const H={1:NO(0,0),2:NO(23,0),3:NO(37,0),4:NO(36.437,6.425),5:NO(38.507,10.684),6:NO(27.821,3.577),7:NO(23.911,5.676),8:NO(19.765,0.559),9:NO(11.555,2.760),
    10:NO(15.292,16.708),11:NO(-3.225,36.858),12:NO(-9.576,35.739),13:NO(-16.238,34.536),14:NO(-17.229,36.411),15:NO(-22.871,33.211),16:NO(-21.471,30.789),17:NO(-15.929,33.989),18:NO(-12.780,22.136),
    19:NO(-6.30,10.912),20:NO(-2.451,6.512),22:NO(-6.018,3.259),23:NO(-12.110,9.10),
    26:NO(-21.743,11.783),28:NO(-26.410,4.315),29:NO(-28.580,7.062),30:NO(-33.730,5.028),35:NO(-23.0,0),36:NO(-11.922,-0.502),37:NO(-17.826,-4.263),38:NO(-15.170,-9.910),
    39:NO(-32.043,-18.50),40:NO(-26.163,-26.163),41:NO(-24.01,-30.732),42:NO(-18.50,-32.043),43:NO(-5.251,-22.464),44:NO(-3.081,-25.21),45:NO(6.0,-24.784),
    46:NO(17.046,-29.474),47:NO(31.551,-22.924),48:NO(32.668,-17.370),49:NO(36.437,-6.425),50:NO(25.233,-6.083),51:NO(-7.537,23.386),52:NO(-24.094,20.836),53:NO(-37.0,15.0)};
  /* 53 (Stift f. Wendelfeder) is O 15.0 on the detent plate's table (05 08_1a) and O 13.0 on the lever plate's (05 08_30): the detent plate's, both read clearly */
  /* the pillars' fits as the sheets give them, [nominal, lower, upper limit] (mm): the spigots Ø 4.5 f7 (05 08 00-1: -0.010/-0.022, ISO 286's f7 at 4.5) and the plates' holes reamed
     4.50 +0.012 (05 09 01, 05 08 02-1, nos. 11, 39, 49); the model draws each at the middle of its limits (sr, PIL_HOLE) */
  const PSF=[4.5,-0.022,-0.010],PHF=[4.5,0,0.012],mid=(/** @type {number[]} */f)=>f[0]+(f[1]+f[2])/2;
  /* the fusee arbor (05 06 04-1) and the barrel arbor (05 07 02-1) with the barrel's heights they turn between (fusee.js's comments give each figure's source), here so
     the recipes read them (29 October 2026); fusee.js reads them too. FA: its shoulders (yD, 19.7 apart), the winding square across the flats at its root (3,1 r6, 1:100),
     the Vorreiber pin's holes (Ø 1.15), the square's 28.3 to the tip and its point's 38.7° half-angle, the cross hole 2 from the dial-side shoulder at the pin's turn;
     prof() the arbor's turned profile [r, y]. BAR: the barrel's bottom face, rim height, bottom's inner face, its boss's face, the lid's, the arbor's shoulders and
     its core's ends 0.05 off the bosses; the square 2.93 past the upper journal, 2.7 tapering to 2.605 over 9.5, its point to 0.3 over 0.5; prof() and bal() */
  const FA=(()=>{const F={yD:-0.025,len:19.7,SQ0:3.12,VPR:0.575,LS:28.3,ang:38.7,hole:{dy:2,a:0.9,from:-3}};
    F.prof=()=>{const yT=F.yD-F.len,rS=yT+19.7,rU=(/** @type {number} */y)=>0.8375+((rS+6.5+9.85)/2-y)/140;
      return[[0,yT-8],[2.195,yT-8],[2.25,yT],[3.05,yT],[3.05,yT+3.1],[3.52,yT+3.1],[3.52,yT+11.0],[2.25,yT+11.0],[2.19,rS],[1.4,rS],[1.3536,rS+6.5],[rU(rS+6.5),rS+6.5],[rU(9.85),9.85],[0.6,10.1],[0,10.1]];};
    return F;})(),BAR=(()=>{const B={BB:-3.65,h:18.08,bi:1.25,bf:3.1,lu:1.2,lf:3.3,BA0:-0.03,BA1:-22.32,e:0.05,sq:2.93,sqr:{a:2.7,b:2.605,L:9.5,tip:0.3,tl:0.5}};
    B.bal=()=>{const o=[];for(let i=0;i<=6;i++){const t=Math.PI/2*i/6;o.push([1.44*Math.cos(t),4.35+0.6*Math.sin(t)]);}return o;};
    B.prof=()=>{const BB=B.BB,BR=BB-B.h,BBF=BB-B.bf,BLT=BR,BLF=BLT+B.lf,BA0=B.BA0,BA1=B.BA1,BC0=BBF-B.e,BC1=BLF+B.e,BSQ=BA1-B.sq;
      return[[0,BSQ],[1.94,BSQ],[1.94,BA1],[2.24,BA1],[2.24,BC1],[5.0,BC1],[6.65,BC1+1.65],[6.65,BC0-1.65],[5.0,BC0],[2.24,BC0],[2.24,BA0],[1.44,BA0],...B.bal()];};
    /* the barrel as last revised (05 07 01, 20.4.48), lifted from fusee.js for the recipes (29 October 2026; fusee.js reads them, its comments give each figure's source):
       BLK the hook block's rivet hole's angle in the drum (the chain's slot + 5π/4, 0207); dr the drum 05 07 01-1 (outside R, its bottom's edge broken to Rb, chY high; the
       lid's seat from seat at the rim to seatU at the lid's underside; the bore, the boss's face and land, the wall's inside ri; sl the Steg's slot through the bottom, rv
       the hook block's M2.6 hole, y from the bottom's face, cs the chain's slot, its middle rm, w round the drum, h half its height, from where along its lean it starts);
       lid 05 07 01-2 (no its 9 o'clock notch, pr the prising notch opposite, e past the lid); steg 05 07 00-1 (r0 to r1, w half its width); hook 05 07 01-3 (b0 back
       toward the Steg and b1 on from the rivet hole, round the bore; d deep, h half its height, its hole from r from); drum() and lid() the turned profiles [r, y] */
    B.BLK=3.585;B.dr={R:20.8,Rb:20.6,chY:0.2,seat:19.6,seatU:19.695,bore:2.275,boss:4.0,land:6.0,ri:19.25,sl:{r0:18.3,r1:19.1,w:2.025,d:1.6},rv:{y:9.05,r:1.32,from:18.6},cs:{rm:20.0,w:1.25,h:0.425,from:-1.6}};
    B.lid={no:{r0:18.3,w:2.025},pr:{dr:2.1,w:2.75},e:0.1};B.steg={r0:18.3,r1:18.8,w:1.0};B.hook={b0:4.6,b1:1.4,d:0.5,h:1.525,from:17};
    B.drum=()=>{const D=B.dr,BB=B.BB,BR=BB-B.h,BI=BB-B.bi,BBF=BB-B.bf,BLT=BR,BLU=BLT+B.lu;
      return[[D.seat,BR],[D.R,BR],[D.R,BB-D.chY],[D.Rb,BB],[D.bore,BB],[D.bore,BBF],[D.boss,BBF],[D.land,BI],[D.ri,BI],[D.ri,BLU],[D.seatU,BLU]];};
    B.lidP=()=>{const D=B.dr,BB=B.BB,BR=BB-B.h,BLT=BR,BLU=BLT+B.lu,BLF=BLT+B.lf;
      return[[D.bore,BLT],[D.seat,BLT],[D.seatU,BLU],[D.land,BLU],[D.boss,BLF],[D.bore,BLF]];};
    return B;})();
  /* the fusee's and the barrel's other made parts (05 06, 05 07), lifted from fusee.js for the recipes (29 October 2026; fusee.js reads them, its comments give each
     figure's source), written with fusee.js's own expressions in its order: the stack along the fusee arbor (the Vorreiber's hub face VHF, its face a VFA and flange VFB;
     the fusee wheel W..WTB; the maintaining spring GS0, GS1; the maintaining ratchet G..GC; the body's large end F, its re-turn RT, the blank's face F0, its length LB, the
     small end S, the recess floor FRC; the click wheel CW0, CW1; the cover plate DP0; the stop bar's slot SLD; the maintaining detent DTU, DTL, DTT); the chain's pin's
     angle PINA (the stop bar's line) and radius PINR; sh (a shape's point at r, a) and ratchet() (fusee.js's); then each part's sizes: DP the cover plate 05 06 00-4, SP
     the dust plate 05 06 00-1, VR the Vorreiber 05 06 00-2, CW the click wheel 05 06 04-3, FW the fusee wheel 05 06 00-3, MR the maintaining ratchet 05 06 02-1, SR the
     set-up ratchet 05 07 00-3 */
  const FU=(()=>{const yD=FA.yD,sh=(/** @type {number} */r,/** @type {number} */a)=>[r*Math.cos(a),r*Math.sin(a)];
    const VHF=yD-0.9,VFA=VHF-2.76,VFB=VHF-1.9;
    const W=VFA+1.3,WT=W-2.62,WW=W-1.22,WL=W-2.42,WTB=W-5.0;
    const MSt=1.3,GS0=WW,GS1=WW-MSt;   /* the maintaining spring's thickness (05 06 01-1), read by tools/wempe_sustaining.js */
    const G=WT-0.05,GT=G-1.02,GP=G-1.3,GC=G-3.1;
    const F=GT-0.05,RT=0.2,F0=F+RT,LB=12.55,S=F0-LB,FRC=F0-2.7;
    const CW0=FRC,CW1=FRC+2;
    const DP={t:0.8,R:21.05/2,ch:0.65,hb:6.109/2,cl:0.4,ca:60,sp:0.9,sk:1.575,skd:0.7,scr:{r:6,off:1},at:[0,0]};
    const DP0=S-DP.t;
    const SLD=1.5;
    const DTU=yD-6.2,DTL=DTU+2,DTT=DTU+1;
    const PHI0=0,PINA=PHI0-0.17,PINR=16.8;
    DP.at=sh(DP.scr.r,PINA+Math.asin(DP.scr.off/DP.scr.r));
    /* a ratchet's outline (fusee.js's, its comment there) */
    function ratchet(/** @type {number} */z,/** @type {number} */rt,/** @type {number} */rr,/** @type {number} */dir,lean=0,nb=6){const P=TAU/z,o=[];
      for(let k=0;k<z;k++){const a=k*P;
        if(dir>0){o.push(sh(rt,a));for(let i=1;i<=nb;i++){const f=i/nb,b=a+P*f;o.push(sh(rt+(rr-rt)*f,b-(i===nb?Math.max(0.004,lean):0)));}}
        else{o.push(sh(rr,a+lean));for(let i=1;i<=nb;i++){const f=i/nb;o.push(sh(rr+(rt-rr)*f,a+lean+(P-lean)*f));}}}
      return o;}
    const SP={gap:1.0,t:3.0,R:7.55/2,ch:0.5,rec:3.125,recd:1.0,cl:0.002,d:[3.0,1.0]};
    const VR={rb0:2.19,tp:0.06/8.7,fit:0.007,rel:0.425,r1:4.975,rf:6.9475,ch:0.35,rh:3.75,hole:{dy:1.1,a:0.9,from:-5},
      prof:()=>{const rb=(/** @type {number} */y)=>VR.rb0+(yD-y)*VR.tp-VR.fit;
        return[[rb(VFA+VR.rel),VFA+VR.rel],[VR.r1,VFA+VR.rel],[VR.r1,VFA],[VR.rf,VFA],[VR.rf,VFB-VR.ch],[VR.rf-VR.ch,VFB],[VR.rh,VFB],[VR.rh,VHF],[rb(VHF),VHF]];}};
    const CW={z:35,D:15.99,dg:14.4,ang:8,nb:5,bore:7.525,ch:0.4,fl:0.05,h0:1.0,h1:1.125,pc:5.75,a0:74,o:/** @type {number[][]} */([]),holes:/** @type {number[][]} */([])};
    CW.o=ratchet(CW.z,CW.D/2,CW.dg/2,-1,-(CW.D-CW.dg)/2*Math.tan(CW.ang*D2R)/(CW.dg/2),CW.nb);
    CW.holes=[0,1,2].map(k=>sh(CW.pc,PINA+CW.a0*D2R+k*TAU/3));
    const FW={RM:17.1/2,RH:8.65,ca:60,bore:2.275,tube:3.245,hubR:7.3,hubD:8.3,rec:7.0,web:16.15,lip:16.9,pin:{r:14.2,a:295,d:0.6035},teeth:[90,0.4356,40.57,37.84,14,0.64],
      prof:()=>{const ch=(/** @type {number} */r)=>W-(FW.RM-r)/Math.tan(FW.ca*D2R);
        return[[FW.bore,WTB],[FW.tube,WTB],[FW.tube,W-2.22],[FW.hubR,W-2.22],[FW.hubD,WW],[FW.RH,WW],[FW.RH,W],[FW.RM,W],[FW.rec,ch(FW.rec)],[FW.rec,W-1.3],[FW.bore,W-1.3]];}};
    const MR={z:120,D:37.2,D1:37.45,dp:0.725,nb:3,bore:6.5075/2,pin:{r:14.2,d:0.6035},ck:{r:9.75+0.0125,a:[270,90],d:0.87},cup:[12.225,12.7,13.0],rv:{r:0.3,at:13.5,dy:0.75,a:[228,210,48,30]},o:/** @type {number[][]} */([]),o1:/** @type {number[][]} */([])};
    MR.o=ratchet(MR.z,MR.D/2,MR.D/2-MR.dp,1,0,MR.nb);MR.o1=ratchet(MR.z,MR.D1/2,MR.D1/2-MR.dp,1,0,MR.nb);
    const SR={z:16,rt:7.0,rr:5.5,RBK:12.5/2,off:1.2,nb:8,t:2.65,BB:3.32,gap:0.05,sq:2.7,tp:0.01,cl:0.002,o:/** @type {number[][]} */([])};
    SR.o=(()=>{const z=SR.z,P=TAU/z,o=[],rt=SR.rt,rr=SR.rr,RBK=SR.RBK,wrap=(/** @type {number} */a)=>Math.atan2(Math.sin(a),Math.cos(a));
      for(let k=0;k<z;k++){const a=k*P,t=Math.asin(SR.off/rt),u=Math.asin(SR.off/rr);
        o.push(sh(rt,a+t));const A=sh(rt,a+t),B=sh(rr,a+P+u),m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(d[0],d[1]),h=Math.sqrt(RBK*RBK-l*l/4),c=[m[0]-d[1]/l*h,m[1]+d[0]/l*h];
        const a0=Math.atan2(A[1]-c[1],A[0]-c[0]),a1=Math.atan2(B[1]-c[1],B[0]-c[0]);for(let i=1;i<=SR.nb;i++){const aa=a0+wrap(a1-a0)*i/SR.nb;o.push([c[0]+RBK*Math.cos(aa),c[1]+RBK*Math.sin(aa)]);}}
      return o.map(([x,y])=>[x,-y]).reverse();})();
    /* CK the clicks 05 06 02-3 (their outline o and the lines and arcs it is drawn from: the base line B, the hollow r3 about C3 from h0 to the nose's foot N, the
       nose's face to its tip T, the back r8 about q8 to the boss's point BB, the boss rb, the top edge to T1, the tail's round rt about TC; t thick; the hole r and its sinks);
       SB the stop bar 05 06 03-1 (its near and far sides N and F, fusee.js's figures; t thick, its pin's hole; o its outline); DT the maintaining detent 05 05 05-1 (the tip's
       corners E and E1, the hollow r9 about C9 from the boss's point h0, the back r18 about C18, the boss rb; o its outline in the sheet; A its turn onto the fusee from the
       sheet's ratchet centre s; the step's point SA and angle; the hole r at DTU, opening 1:tp on the radius) */
    const CK=(()=>{const CKB=-1.5,CKN=[-2.78-Math.sqrt(9-(3.54+CKB)**2),CKB],CKT=[CKN[0]+2/Math.tan(85*D2R),CKB+2];
      const o=[],arc=(/** @type {number[]} */c,/** @type {number} */r,/** @type {number} */a0,/** @type {number} */a1,/** @type {number} */n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}};
      const C3=[-2.78,-3.54],h0=[-2.78+Math.sqrt(9-(3.54+CKB)**2),CKB],q8=(()=>{const A=CKT,B=[-0.4,1.45],m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(d[0],d[1]),h=Math.sqrt(64-l*l/4);return[m[0]+d[1]/l*h,m[1]-d[0]/l*h];})();
      const TK=(()=>{let a=0.5,b=0.7;for(let i=0;i<50;i++){const k=(a+b)/2,s=Math.hypot(k,1);if(Math.hypot((1.5*s-0.2*s-(CKB+0.2))/k,CKB+0.2)+0.2>5.2)a=k;else b=k;}return(a+b)/2;})();
      const TL=[TK,1].map(v=>v/Math.hypot(TK,1)),TC=[(1.5*Math.hypot(TK,1)-0.2*Math.hypot(TK,1)-(CKB+0.2))/TK,CKB+0.2],T1=[TC[0]+0.2*TL[0],TC[1]+0.2*TL[1]],TB=Math.atan2(TL[1],TL[0]);
      o.push([TC[0],CKB]);o.push(h0);
      arc(C3,3,Math.atan2(h0[1]-C3[1],h0[0]-C3[0]),Math.atan2(CKN[1]-C3[1],CKN[0]-C3[0]),14);
      o.push(CKT);
      arc(q8,8,Math.atan2(CKT[1]-q8[1],CKT[0]-q8[0]),Math.atan2(1.45-q8[1],-0.4-q8[0]),12);
      arc([0,0],1.5,Math.atan2(1.45,-0.4),TB,8);
      o.push(T1);for(let i=1;i<8;i++){const a=TB+(-Math.PI/2-TB)*i/8;o.push([TC[0]+0.2*Math.cos(a),TC[1]+0.2*Math.sin(a)]);}
      return{B:CKB,N:CKN,T:CKT,C3,r3:3,h0,q8,r8:8,BB:[-0.4,1.45],rb:1.5,TC,T1,TB,rt:0.2,o,t:1.82,hole:{r:0.6045,cr:1.1,cd:0.42,sr:0.85,sd:0.25}};})();
    const SB={N:4.01,F:5.99,d:5.0,lo:-11.52,hi:10.98,tr:3.6,lf:-10.58,ru:8.555,rr:2.47,rt:0.39,sp:-6.0,us:8.0,ub:3.4,tt:1.05,t:1.45,pin:{r:0.25,z:3.5,dy:0.5},o:/** @type {number[][]} */([])};
    SB.o=(()=>{const SBN=SB.N,SBF=SB.F,o=[],c=[SB.lo+SB.rt,SBN+SB.rt],e=Math.asin((SBN+SB.rr-SBF)/SB.rr);
      for(let i=0;i<=8;i++){const a=Math.PI*(150+120*i/8)/180;o.push([c[0]+SB.rt*Math.cos(a),c[1]+SB.rt*Math.sin(a)]);}
      for(let i=0;i<=16;i++){const a=-Math.PI/2+(Math.PI/2-e)*i/16;o.push([SB.ru+SB.rr*Math.cos(a),SBN+SB.rr+SB.rr*Math.sin(a)]);}
      o.push([SB.lf,SBF]);return o.map(([u,v])=>[u,-v]).reverse();})();
    const DT=(()=>{const DTE=[Math.sqrt(144-2.5*2.5),-2.5],DTE1=[DTE[0]-2.6/Math.tan(80*D2R),DTE[1]+2.6],C9=[6.273,-9.645];
      const C18=(()=>{const A=[0,2.5],B=DTE1,m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(d[0],d[1]),h=Math.sqrt(324-l*l/4);return[m[0]+d[1]/l*h,m[1]-d[0]/l*h];})();
      const o=[],arc=(/** @type {number[]} */c,/** @type {number} */r,/** @type {number} */a0,/** @type {number} */a1,/** @type {number} */n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}};
      arc(C9,9,Math.atan2(-2.1-C9[1],1.366-C9[0]),Math.atan2(DTE[1]-C9[1],DTE[0]-C9[0]),24);
      for(let i=1;i<4;i++)o.push([DTE[0]+(DTE1[0]-DTE[0])*i/4,DTE[1]+(DTE1[1]-DTE[1])*i/4]);
      arc(C18,18,Math.atan2(DTE1[1]-C18[1],DTE1[0]-C18[0]),Math.atan2(2.5-C18[1],-C18[0]),24);
      arc([0,0],2.5,Math.PI/2,TAU+Math.atan2(-2.1,1.366),24);o.pop();
      const FX=H[10],DX=H[4],A=(()=>{const s=[-10.8,-20.9],w=[FX[0]-DX[0],-(FX[1]-DX[1])];return Math.atan2(w[1],w[0])-Math.atan2(s[1],s[0]);})();
      return{E:DTE,E1:DTE1,C9,r9:9,h0:[1.366,-2.1],C18,r18:18,rb:2.5,o,A,SA:[8.6,1.403],sa:30,hole:{r:1.125,tp:140}};})();
    return{CK,SB,DT,VHF,VFA,VFB,W,WT,WW,WL,WTB,MSt,GS0,GS1,G,GT,GP,GC,F,RT,F0,LB,S,FRC,CW0,CW1,DP0,SLD,DTU,DTL,DTT,PHI0,PINA,PINR,sh,ratchet,DP,SP,VR,CW,FW,MR,SR};})();
  return{H,NO,FA,BAR,FU,
    PLATE_R:84.989/2,   // the plates' radius: 05 09 01 "Fertigmaß 3,35 × 85∅ h6", 05 08 02-1 "fertig 85∅ h6", sheet 001 "Platten∅ 85 mm", drawn at h6's middle (0/-0.022): sure
    TOP_T:3.35,   // the top plate's thickness: 05 09 01 "Fertigmaß 3,35" (05 08_30, the lever plate: "3,3 in 3,35 geändert"): sure
    PP_T:3.35,   // the pillar plate's: 05 08 02-1 "3,35 ±0,02 stark", struck through with a replacement no longer legible (its blank turned 3,5 × 90∅, as the top plate's); its Schnitt A-B draws 3,35: likely
    INNER:19.0,   // the plates' inner faces apart: sheet 001 "innerer Plattenabstand 19 mm" = the pillar's 19.6 between shoulders less its two 0.3 seats (PIL_SEAT): sure
    PIL_SEAT:[8.6/2,0.3],PIL_SEAT_T:0.03,   // each pillar's seat in each plate's inner face: Ø 8.6, 0.3 +0.03 deep (05 09 01 Schnitt L-M, 05 08 02-1 Schnitt E-F; dashed from the top plate's outer face): sure
    PIL:{r:8.0/2,   // the pillar (05 08 00-1, Pfeiler, Rundmessing 8,5 Ms 58): body Ø 8.1 -0.2 (read "8,1∅", the ∅ written high as on its "4,3∅" and "4,5∅"; 8.06 scaled at 5:1): likely; drawn at the middle, 8.0 (8.1 until 26 October 2026)
      L:19.6,LT:0.04,   // shoulder to shoulder 19.6 ±0.04: likely (the tolerance's last glyph has a crossbar and a stem, beside the same sheet's plain "1": the second drawing check's 9-M8; read ±0.01, sure, until 28 October 2026)
      sr:mid(PSF)/2,sF:PSF,   // its end spigots Ø 4.5 f7 (-0.010/-0.022, PSF), drawn at the middle of the fit, 4.484: sure
      sL:2.8,   // each 2.8 -0.1 long, drawn 2.8 so the overall is 25.3 -0.2's middle, 25.2 (19.6 + 2 × 2.8: the sheet's figures close there, not at both middles; 2.75 from 26 to 28 October 2026, the overall 25.10 at its least: drawing check 2's 9-M8): sure
      tip:[mid(PSF)/2-1.1*Math.tan(6*Math.PI/180),1.1],   // each spigot's end turned at the drawn 6° over 1.1 -0.2, so to Ø 4.25 at the end, inside 4.3 -0.2 (the three figures over-determine: Ø 4.3 over 1.1 gave 4.8°, until 28 October 2026, 9-M8): sure
      cs:2.6/2,   // the 90° countersink at each end of the thread, Ø 2.6 at the face (2.59 scaled at 5:1, no figure: the thread's own diameter), to the tap drill (about 0.25 deep, drawn): likely (2.7 until 27 October 2026)
      grv:[3.25,0.35],   // a relief groove in each shoulder's face round the spigot's root, out to r 3.25 and 0.35 deep, half-round: drawn at 5:1 without figures, scaled: estimated
      Ltot:25.3},   // overall 25.3 -0.2 (19.6 + 2 × 2.8 = 25.2): sure; tapped M2.6 through from both ends ("Gewinde von beiden Seiten einschneiden")
    PIL_HOLE:mid(PHF)/2,PIL_HF:PHF,   // the plates' pillar holes, reamed 4.50 +0.012 (PHF; 05 09 01 nos. 11, 39, 49; 05 08 02-1 the same), drawn at the middle of the fit, 4.506: sure
    PILLARS:[H[11],H[39],H[49]],   // nos. 11 S 3,225 O 36,858; 39 S 32,043 W 18,50; 49 N 36,437 W 6,425, each 37.00 from the centre at 95°, 210°, 350° from N toward O: sure
    /* the Soviet 6MX's pillar 39 (the Variants' third version; Altmeppen's list: pillar 39 in another place): Kirov No. 247's top plate (2_Kirow_247_A.jpg, a similarity on the
       fusee, barrel, balance and escape arbors and pillars 11 and 49, 8.98 px/mm, residuals under 0.55 mm; the screws' centres by circles fitted to their edges) has no pillar at
       210° and its screw at 190.0°, r 36.45, where 11 and 49 read 94.9° and 350.1°, r 36.9 and 36.7; its dial side (3_Kirow_247_uZ.jpg, seven holes, 8.63 px/mm, under 0.42)
       189.6°, r 37.47, 11 and 49 94.8° and 349.9°, r 36.9 and 37.4. So 190° (sure to ±0.5°: 49's 350° mirrored across the O-W line) and r 36.6-37.3 (each reading corrected by
       11's and 49's in its fit). On r 37 the drawn pillar (Ø 8.1) would stand 0.11 into the drawn seconds wheel's tips (Ø 21.9 at hole 35); clear of them from r 37.2: taken at
       r 37.3, 0.2 clear, within the dial side's reading (likely; the 6MX's seconds wheel isn't seen) */
    P39_6MX:[37.3*Math.sin(10*D2R),37.3*Math.cos(10*D2R)],   // plan [x = W, z = S]: 190° from N toward O on r 37.3, S 36.733 W 6.477
    /* the Soviet 6MX's electrical seconds contact (Kirov No. 247's: dg-chrono-6mx-gallery/leben-des-6mx/10_-12_Kirow_247_E-Kontakt_*.jpg, dg-chrono-6mx/6_Kiro_247_S.jpg,
       2_Kirow_247_A.jpg and 3_Kirow_247_uZ.jpg against Kirov 1564's without one; Kirov 009's, 2973's, Poljot 08479's and Kirov-Poljot 24020's the same design; Romanov 1975,
       Proektirovanie priborov vremeni, Figs. 100 and 101 and p. 105's parts 52-69, and p. 209), measured 18 October 2026 (scratchpad: holemap.py --model wempe on both dial
       sides, 8.60-8.98 px/mm, residuals under 0.56; Fig. 100 mapped by an affine on 13 photographed anchors, each part then moved onto its own; heights from Fig. 101 at
       9.68 px/mm, which gives the seconds wheel's height to 0.06 and the 19 between the plates, and the S views at 10.5 and 21 px/mm). Plan [x, z] as H; y from the pillar
       plate's inner face (0) toward the top plate's (−19). js/train.js builds it */
    CONTACT6:{
      base:[[35.47,24.27],[34.71,23.35],[32.79,22.68],[28.85,21.22],[24.91,19.64],[22.33,18.27],[20.41,17.95],[18.45,18.56],[16.92,19.75],[15.15,21.63],[13.6,23.52],[12.16,25.64],[11.3,27.74],[10.95,31.24],[10.75,33.81],[10.46,38.59],[9.79,39.63],[8.84,40.44],[7.71,40.96],[6.48,41.13],[5.25,40.96],[4.11,40.44],[3.17,39.63],[2.49,38.59],[1.58,35.22],[-0.13,35.12],[-1.52,35.84],[-2.25,37.25],[-2.48,40.75],[-2.34,43.31],[-1.58,44.35],[-0.03,45.7],[1.56,45.67],[3.16,45.59],[4.75,45.45],[6.33,45.26],[7.91,45.01],[9.48,44.71],[11.03,44.35],[12.57,43.94],[14.1,43.47],[15.61,42.95],[17.1,42.38],[18.57,41.76],[20.02,41.08],[21.44,40.36],[22.84,39.59],[24.21,38.76],[25.55,37.89],[26.85,36.98],[28.13,36.02],[29.37,35.01],[30.57,33.97],[31.74,32.88],[32.87,31.75],[33.96,30.58],[35.01,29.38],[36.01,28.14],[36.97,26.86],[37.89,25.55]],   // the base 58 (gilt brass, y 0 to −2): its outer edge an arc r 45.7 beyond the plate's rim (A247: likely), cut round pillar 39 (r 4.4), its inner edge traced on Fig. 100 (estimate, ±2); it overhangs the pillar plate's window for the intermediate wheel (Ø 24.5 about hole 38), 0.23 over the wheel, which in the 6MX's Exploded view leaves toward the dial with its bridge
      screws56:[[0,38.2],[24.36,29.03]],access:[[-0.61,38.6],[23.6,29.14]],   // its two screws into the pillar plate, M1.7 through, their ends flush on the dial side (uZ247; open holes on Kirov 1564's: likely); the top plate's Ø 3.5 access holes over them, 179.1° r 38.6 and 219.0° r 37.5 (A247, A1564: likely)
      blkP:[[-1.69,40.37],[-1.87,44.56],[-1.11,45.39],[0.5,45.4],[2.12,45.35],[3.73,45.25],[5.33,45.09],[6.93,44.87],[8.52,44.59],[10.1,44.26],[11.67,43.88],[13.22,43.43],[14.75,42.94],[16.27,42.38],[14.48,37.72],[12.99,38.26],[11.47,38.74],[9.97,39.41],[9.0,40.34],[7.8,40.93],[6.48,41.13],[5.15,40.93],[3.95,40.34],[2.82,40.3],[1.32,40.38],[-0.19,40.4]],   // block 52 (+), y −3.8 to −5.25 on the black fibre 68 (−2 to −3.8): its two screws at 182.9° and 193.3° r 43 (A247: likely), the outline from Fig. 100 moved onto them (estimate)
      blkM:[[19.71,35.27],[22.15,39.63],[23.57,38.8],[24.96,37.92],[26.32,36.99],[27.65,36.01],[28.94,34.98],[30.19,33.91],[31.4,32.79],[32.57,31.63],[33.7,30.43],[34.78,29.18],[34.51,27.94],[31.4,25.43],[30.41,26.6],[29.37,27.74],[28.3,28.84],[27.18,29.89],[26.02,30.9],[24.83,31.87],[23.6,32.79],[22.33,33.67],[21.04,34.49]],   // block 57 (−): its screws at 214.6° and 226.0° r 42.9 (A247 and 009: the two steel heads under the top plate's edge), outline as block 52's
      bsP:[[2.17,42.85],[10.03,42.12]],bsM:[[24.36,35.31],[30.86,29.8]],   // the four block screws (steel cheese heads Ø 3.1 × 2.6 on black bush flanges Ø 4.6, −5.25 to −6.2, A247 and 10_Kirow_247: likely; M1.4 into the base, estimated); 193.3°'s 0.15 out from pillar 39, inside its ±0.8, so its flange clears the pillar
      disc:{th:207.7,r:41.6,y:-8.3,d:11.9,t:1.2},   // the contact disc 55: upright in the radial plane at 207.7° (A247: its edge 3° off the radius), knurled, Ø 11.9 × 1.2 (Fig. 101, 247's and 2973's close-ups: likely), on a bracket on block 57's low end, turnable to renew the contact (the user instruction)
      screw54:{h:[16.14,42.7],tip:[20.27,40.66],y:-5.85,d:1.0},   // the contact screw 54, tangential at r 45.5 on the lever's end, its steel point on the disc's low face (A247 tip and end, 10_Kirow_247's thread: likely), a lock nut at its holder; its axis at -5.85 and Ø 1.0 (10_Kirow_247 through the m6_contact camera, its 0.6 mm residuals, a scale stood at its tip: -5.15 ±0.6, 0.91 across the thread: likely; taken at -5.85, the top of that range, where it passes 0.1 over block 52's top at -5.25 (fine.py); -6.7 and 1.2 until 18 October 2026), held in a block under the lever's end
      staff:[13.67,27.82],staffY:[-2.0,-13.2],   // the lever's staff 69 (206.2°, r 31.8 on Fig. 100 through the mapping, ±1.5: estimate; taken r 31.0, so the spiral's outer coil, Ø 8.9 measured, clears the contact disc by 0.2), jewelled at both ends, the lower capped (10_Kirow_247: the capped setting on the cock)
      stone:[9.83,21.16],   // the lever's corundum stone 61 at the stone arm's end, on the contact wheel 10.0 from the seconds arbor, its acting corner 9.7 (the wheel's tips 10.2, roots 9.3): estimate
      cockFoot:[[30.74,22.7],[21.88,18.28],[17.64,22.18],[26.39,26.61]],cockArm:[[21.88,18.28],[12.74,25.63],[11.5,28.32],[12.55,31.22],[14.8,31.89],[17.76,28.82],[24.17,24.66]],   // the cock: its foot on the base (one screw, two pins), a leg 1.5 × 5, its arm 2.1 thick at −11 to −13.2 over the spiral to the staff (Fig. 100 mapped; 10_Kirow_247 46 px at 22.2 px/mm): estimate
      stud:[[11.55,39.24],[12.42,42.21],[14.25,41.6],[13.52,38.6]],   // the stud 53 on block 52, −5.25 to −9.85, its clamp screw on top (10_Kirow_247: estimate), its outer face at r 44.0 (3.0 deep read: estimated), 0.4 inside the lever's holder as it swings, its outer corner on the lever's side taken in 0.3 so the screw arm clears it at full lift
      wheel:{z:60,tip:20.4,root:18.6,rim:16.8,spokes:8,y:[-6.65,-7.65],collet:2.0,colY:[-6.1,-10.65]}},   // the contact wheel 62 on the seconds arbor under its wheel (Romanov: fixed to it), its collet Ø 2.0 rising 3.0 above it (10_Kirow_247: likely; 3.1 and to -11.2 until 18 October 2026): 60 ratchet teeth, one taken out for the minute (Figs. 100, 101; 6_Kirow_009_S: a sawtooth wheel there): tips likely, depth estimate
    /* the frame's sizes frame.js draws beside its parts, here so the recipes (tools/recipes/wempe.py) read the page's own (29 October 2026; each with its source in frame.js's comments):
       the hole radii (tapped at the thread's size + 0.02, reamed and pressed fits drawn at their middles), the pillar plate's ring-pin notch, hole 10, the intermediate wheel's
       opening and the hand-setting window and bore (05 08 02-1, 05 08_3a/b) */
    FRAME:{rM26:1.32,rM2:1.02,rM17:0.87,rM14:0.72,rM12:0.62,rCl26:2.8/2,rPinP:1.6025/2,rPinQ:1.5825/2,rPin:1.6/2,rJ:4.596/2,rH35:3.506/2,
      ringPin:1.0,pp10:2.82,op38:24.5,op35:6.0,hsOut:8.25,hsW:6.5,hsIn:12.1,hsArc:14,hsBore:2.0,hsBoreY:1.68},
    /* the movement ring (05 08 00-3, revised 6.12.46): y from the pillar plate's inner face (0) toward the dial; its sizes as frame.js's comments read them */
    RING:{y0:0.35,ySeat:3.35,yCone:5.35,yFl:6.35,yRec:10.35,yTop:11.05,bandD:96,flD:105.90,seatD:85.0175,lipD:83,coneD1:85,coneD2:93,recD:104.05,
      screwD:89,screws:[340,100,220],dialR:50.5,dialPin:1.1,dialScrews:[354,120,240],casePin:1.6,casePinZ:2.8,casePinR0:43.5,scr:[3.1,3.05,6.3]},
    /* the cork ring (05 08 01-4, no sheet: scaled on the coloured section): outside and bore radii, its height as drawn (squeezed) and the 6MX's, its seat under the top plate */
    CORK:{ro:8.05,ri:4.81,h:3.70,h6:2.4,below:[1.5,15.1]},
    /* the barrel bridge (05 08 05-1) and its click (05 08 05-2, revised 25.5.48) with the click's screw (WN-22); the fusee bush (05 08 01-2) with its screws (WN-34) and the
       dust bush (05 08 01-3, as last revised on 05 08 01): their sizes as frame.js's comments read them, here for the recipes (29 October 2026) */
    /* drawn at the middles of their tolerances since 29 October 2026 (the owner's choice; until then at their figures' tops): the barrel bridge's 3.32 -0.04 (05 08 05-1)
       3.30, the fusee bush's flange Ø 13.2 -0.2 (05 08 01-2) 13.1, the dust bush's body Ø 13.1 -0.2, collar Ø 15.1 -0.2 and neck Ø 9.7 -0.2 (05 08 01-3) 13.0, 15.0 (from its
       Rundmessing 15) and 9.6, its bottom keeping the figured 0.5 bearing ring inside the 0.3 × 45° chamfer (estimated) and its collar's flat flush with the body (14.1 -0.2
       from the far side, at its middle 14.0), and the cork ring's bore the neck's + 0.01 as before */
    BB:{t:3.30,d45:3.9,c45:7,dc:-0.7,e48:5,a:30,pinD:2.5,cs:0.3,scr:[3.2,3.0,6.2]},
    CLICK:{d:5.7,c6:[-5.142,-7.212],r6:6,rn:1,ln:7.5,beak:3.5,ang:85,rb:12.5,rb2:11.5,brg:23.3,t:2.56,hole:3.215,scr:{r:2.25,h:2.1,sd:3.19,sl:2.61,t0:2.55,len:3.2}},
    FB:{r:2.26,spD:7.9905,lo:2.6,upD:8.0235,up:2.9,top:4.4,cs:3.5,fl:6.55,flT:1.5,holeD:1.55,sinkD:2.207,sinkH:0.5,pcd:5.2,taper:140,scr:[1.05,0.45,3.2,0.7],scrY:1.0},
    DB:{L:18.1,bore:8.0075,taper:140,mouth:1.8,mAng:20,body:6.5,ch:0.3,ring:[6.2,5.7],dish:5,neck:4.8,nkY:15.1,col:15.0,lugY:12.0,flatBrg:255,last:[5.4,6.7,10.5/2,13.0]},
    /* the upper balance cock (05 08 03-1; kompl. 127-556.04 U30), the lower (05 08 00-2, revised 2.12.46) and the intermediate bridge (05 08 04), with their screws (WN-ucs,
       WN-53, WN-52): their sizes as frame.js's comments read them, here for the recipes (29 October 2026). UC: in its own frame, u along its axis from 23 toward 345°, v toward
       75°; heights over the top plate's outer face (the foot's underside) */
    UC:{ax:345,vo:75,foot:[43,8.5],r6:6,web:26.5,r22:22,step:[11.2,12],relief:0.8,top:15,arm:12.6,armT:2.4,armFull:11.8,footT:3.2,slot:1.8045,slotIn:3.4,lean:8,
      boss:[6,7.6],seat:5.206,seatY:12.3,floor:4.596,scr:3.525,h20:2.8,pinD:2.5,pinCs:0.2,scrH:[3.2,3.0,6.2]},
    LC:{bar:[20,8,10],lug:[10,3.22],ctr:[-5,8.2],r5:5,floor:0.5,scr:3.55,pinD:2.5,seat:5.206,scrH:[2.9,1.7,5.0],sink:1.8},
    ZB:{half:17.75,w:10,t:3.8,sink:[2.35,2.0],bush:4.3,mouth:[2.85,0.69],set:5.2,pinD:2.5,scr:[2.1,1.9,4.7],scrY:1.8},
    PSCR:{r:6.4/2,   // the pillar screws (WN-57 the top plate's, WN-56 the pillar plate's, by the coloured section's labels): heads Ø 6.4: the coloured section 6.4 and 6.1 (scaled on the
                     // pillar's 8.1 and 19 between the plates, 28.3 px/mm), Wempe 3955's top plate 6.4-6.6 (2_Wempe_3955_A.jpg, 8.82 px/mm by the pillars' 62.41 and 58.7 mm apart), sheet 001 6.6: estimated (±0.2)
      h:3.0,   // head height: the coloured section 3.0 (both screws): estimated (±0.2); their WN sheet isn't in the set
      rs:2.6/2,   // thread M2.6 (05 08 00-1): sure
      len:7.7}   // shank: the coloured section 7.8 and 7.7 from the head's seat to the end: estimated
  };})();
