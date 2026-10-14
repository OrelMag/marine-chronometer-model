"""The Wempe's tables for the tools (../chronometer-working-model/tools/model.py reads them for --model wempe; each name is the tool's own, the Hamilton's
table the default where a name isn't here). P1a (14 October 2026): the frame; nothing moves yet, so most are empty or off; each fills as the movement grows.
Its parts list is bom.json beside this file, its expected coplanar faces audit-expected.json (audit.py --model wempe --update writes it)."""
# audit.py: loose ends expected (part:geometry, place, radius, why): none; the Hamilton's Navy brake isn't fitted
LOOSE=[]
LOOSE_NAVY=[]
# audit.py: screws whose heads bear on a part at their edge only (part:geometry, place in the frozen page's world, head radius, why)
_RS="a movement ring screw (05 08 00-3): its head bears on the pillar plate's rim, which stands 0.35 proud of the ring's face, its middle over the ring (the coloured section)"
FLOAT=[('ring:Lathe',(15.22,0,-41.82),3.1,_RS),('ring:Lathe',(-43.82,0,7.73),3.1,_RS),('ring:Lathe',(28.6,0,34.09),3.1,_RS)]
# fine.py: the states checked (balance phase, escape teeth, fusee turns from full wind, winding): the escapement's phases (js/escapement.js, a 225 deg swing): unlocking
# 0.2415-0.25 (the tooth free at 0.2479), the wheel's drop to 0.2521, the impulse to 0.2822 and the run on to the lock to 0.284; the return swing's pass of the gold spring
# 0.755-0.761; then the train at seven more places 97 teeth apart (the centre wheel 1.2 teeth on each time, so its meshes are seen at eight phases); the intended contacts;
# the Hamilton's wind through the page's loop, its barrel's swept solid and its dial's printed face left out (the Wempe has no barrel or dial yet)
PH=[0.0,0.2415,0.244,0.246,0.2479,0.249,0.25,0.2505,0.251,0.2521,0.255,0.26,0.265,0.27,0.275,0.28,0.2822,0.283,0.285,0.3,0.4,0.5,0.6,0.75,0.755,0.758,0.761,0.765,0.9]
STATES=[(ph,0,2.5,False) for ph in PH]+[(0.0,97*k,2.5,False) for k in range(1,8)]
EXPECTED={('detent:Lathe','detentBlock:Buffer'):("the detent's foot screw (M1) and its two steady pins, across into the block's end (05 04 01-4, 1436): a block of vertical walls drawn without holes across",1.9,1.1),
  ('hairspring:Buffer','hairspring:Buffer'):("the hairspring's inner end in the hole across the collet's end (05 03 02-2), drawn without the hole (a collet of vertical walls)",0.45,0.55),
  ('fuseeBush:Lathe','topPlate:Buffer'):("the fusee bush's body pressed 2.7 into the top plate's hole 10 (05 08 01-2: Ø 8 T6, +0.019/+0.028, in 8.0 +0.015 reamed; drawn at the fits' middles, 0.008 interference on the radius)",0.4,2.8)}
WIND_SEQ=False
BARREL=False
DIAL=False
# bom.py: no balance stop to choose (the Hamilton clicks its locking arm's button), no function checks (bom-fn.js is the Hamilton's)
ARM='void 0'
FN=False
JEWELS=12   # the balance's and escape wheel's hole jewels and endstones (8), the impulse, discharge and locking stones, and the seconds arbor's lower jewel (05 05 04-1)
