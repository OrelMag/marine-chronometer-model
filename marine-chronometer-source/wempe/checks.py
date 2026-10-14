"""The Wempe's tables for the tools (../chronometer-working-model/tools/model.py reads them for --model wempe; each name is the tool's own, the Hamilton's
table the default where a name isn't here). P1a (14 October 2026): the frame; nothing moves yet, so most are empty or off; each fills as the movement grows.
Its parts list is bom.json beside this file, its expected coplanar faces audit-expected.json (audit.py --model wempe --update writes it)."""
# audit.py: loose ends expected (part:geometry, place, radius, why): none; the Hamilton's Navy brake isn't fitted
LOOSE=[]
LOOSE_NAVY=[]
# audit.py: screws whose heads bear on a part at their edge only (part:geometry, place in the frozen page's world, head radius, why)
_RS="a movement ring screw (05 08 00-3): its head bears on the pillar plate's rim, which stands 0.35 proud of the ring's face, its middle over the ring (the coloured section)"
FLOAT=[('ring:Lathe',(15.22,0,-41.82),3.1,_RS),('ring:Lathe',(-43.82,0,7.73),3.1,_RS),('ring:Lathe',(28.6,0,34.09),3.1,_RS)]
# fine.py: the states checked (balance phase, escape teeth, fusee turns from full wind, winding): the train at eight places 97 teeth apart (the centre wheel 1.2 teeth
# on each time, so its meshes are seen at eight phases; the escapement, fusee and wind aren't built yet); the intended contacts; the Hamilton's wind through the page's
# loop, its barrel's swept solid and its dial's printed face left out (the Wempe has no barrel or dial yet)
STATES=[(0.0,97*k,2.5,False) for k in range(8)]
EXPECTED={('fuseeBush:Lathe','topPlate:Buffer'):("the fusee bush's body pressed 2.7 into the top plate's hole 10 (05 08 01-2: Ø 8 T6, +0.019/+0.028, in 8.0 +0.015 reamed; drawn at the fits' middles, 0.008 interference on the radius)",0.4,2.8)}
WIND_SEQ=False
BARREL=False
DIAL=False
# bom.py: no balance stop to choose (the Hamilton clicks its locking arm's button), no function checks (bom-fn.js is the Hamilton's); the jewels drawn so far: the
# seconds arbor's lower jewel (05 05 04-1), the train's only one (its other bearings are brass bushes, WN-300 to 302)
ARM='void 0'
FN=False
JEWELS=1
