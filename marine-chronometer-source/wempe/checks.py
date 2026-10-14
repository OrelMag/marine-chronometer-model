"""The Wempe's tables for the tools (../chronometer-working-model/tools/model.py reads them for --model wempe; each name is the tool's own, the Hamilton's
table the default where a name isn't here). P1a (14 October 2026): the frame; nothing moves yet, so most are empty or off; each fills as the movement grows.
Its parts list is bom.json beside this file, its expected coplanar faces audit-expected.json (audit.py --model wempe --update writes it)."""
# audit.py: loose ends expected (part:geometry, place, radius, why); the Hamilton's Navy brake isn't fitted
LOOSE=[('topPlate:Cylinder',(-5.68,-17.25,-23.91),0.8,"the fusee's stop pin (05 08 01-5), standing 1.5 out under the top plate's inner face (\"unten vorstehend\") into the stop bar's path: its end is free")]
LOOSE_NAVY=[]
# audit.py: screws whose heads bear on a part at their edge only (part:geometry, place in the frozen page's world, head radius, why)
_RS="a movement ring screw (05 08 00-3): its head bears on the pillar plate's rim, which stands 0.35 proud of the ring's face, its middle over the ring (the coloured section)"
FLOAT=[('ring:Lathe',(15.22,0,-41.82),3.1,_RS),('ring:Lathe',(-43.82,0,7.73),3.1,_RS),('ring:Lathe',(28.6,0,34.09),3.1,_RS)]
# fine.py: the states checked (balance phase, escape teeth, fusee turns from full wind, winding): the train at 97 teeth apart (the centre wheel 1.2 teeth on each time, so
# its meshes are seen at many phases), with the fusee across its wind: fully wound (n 0) running and with the key on, the stop bar's travel (the chain coming onto its end
# about 0.17 turn before full wind), mid-wind running and winding, near and at run down (N_RUN 8.78); the escapement isn't built yet
STATES=[(0.0,97*k,n,w) for k,(n,w) in enumerate([(2.5,False),(0,False),(0,True),(0.05,False),(0.12,False),(0.17,True),(0.3,False),(1.2,True),(3.1,False),(4.4,True),
  (5.7,False),(7.0,False),(8.2,False),(8.7,False),(8.78,False),(6.3,True),(2.0,False)])]
EXPECTED={('fuseeBush:Lathe','topPlate:Buffer'):("the fusee bush's body pressed into the top plate's hole 10 (05 08 01-2: Ø 8 T6, +0.019/+0.028, in 8.0 +0.015 reamed; drawn at the fits' middles, 0.008 interference on the radius)",0.4,2.8),
 # the fusee and barrel (P1c): joints in holes a turned or extruded part can't have cut across it, and the parts that touch by design
 ('fusee:Lathe','stopWork:Extrude'):("the stop bar in its slot across the fusee's small end (05 06 04-2: 2 H8 wide, 1.5 +0.05 deep), which isn't cut in the turned body",18.0,1.5),
 ('coverPlate:Lathe','fusee:Lathe'):("the cover plate's screw (WN-20) in the body's M1.7 hole, 6 deep (05 06 04-2), which isn't cut in the turned body",8.5,3.6),
 ('chain:Buffer','stopWork:Extrude'):("the chain coming down on the stop bar's lower end in the top turn and pressing it in (its travel drawn as a ramp over the 0.15 turn before the chain lies on it)",1.0,0.5),
 ('chain:Extrude','stopWork:Extrude'):("the same, an inner link's plate",0.4,0.15),
 ('barrelArbor:Cylinder','mainspring:Buffer'):("the arbor's hook (05 07 02-2) through the mainspring's eye at its inner end, the eye not cut in the drawn strip",0.8,2.05),
 ('chain:Extrude','fusee:Cylinder'):("the chain's top hook on the fusee's pin (05 06 00-6), round it",0.1,0.3),
 ('chain:Buffer','chain:Extrude'):("the chain's hooks riveted between its end links' plates (the rivets through them)",0.08,0.3),
 ('band:Buffer','fusee:Lathe'):("the band in the fusee's groove, 0.78 in the 0.82 land, along the turned groove's walls (drawn as slopes over its 0.04 rows)",2.5,0.25),
 ('band:Extrude','barrel:Lathe'):("the band's drum hook (05 07 03-3): its barb in the slot in the drum's wall, cut at the fusee's assembly (0207), not in the turned drum",1.2,0.8),
 ('band:Buffer','stopWork:Extrude'):("the band coming down on the stop bar's lower end in the top turn and pressing it in (as the chain)",0.4,0.4),
 ('band:Extrude','fusee:Cylinder'):("the band's round hook (05 07 03-2) on the fusee's pin",0.1,0.8),
 ('band:Buffer','band:Extrude'):("the band's ends brazed to its hooks (05 07 03): the strip's end against its round hook where the pin's hook turns off the groove's start",0.05,0.8),
 ('chain:Buffer','fusee:Lathe'):("the chain's links in the fusee's groove: 0.80 across in the 0.82 land (05 07 04, 05 06 04-2), the links' and the turned groove's facets meeting",0.04,0.06)}
WIND_SEQ=False
BARREL=False
DIAL=False
# bom.py: no balance stop to choose (the Hamilton clicks its locking arm's button), no function checks (bom-fn.js is the Hamilton's); the jewels drawn so far: the
# seconds arbor's lower jewel (05 05 04-1), the train's only one (its other bearings are brass bushes, WN-300 to 302)
ARM='void 0'
FN=False
JEWELS=1
