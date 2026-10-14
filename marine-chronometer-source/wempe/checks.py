"""The Wempe's tables for the tools (../chronometer-working-model/tools/model.py reads them for --model wempe; each name is the tool's own, the Hamilton's
table the default where a name isn't here). P0 (14 October 2026): the frame alone, so most are empty or off; each fills as the movement grows.
Its parts list is bom.json beside this file, its expected coplanar faces audit-expected.json (audit.py --model wempe --update writes it)."""
# audit.py: loose ends expected (part:geometry, place, radius, why): none yet; the Hamilton's Navy brake isn't fitted
LOOSE=[]
LOOSE_NAVY=[]
# fine.py: the states checked (balance phase, escape teeth, fusee turns from full wind, winding): one, nothing moves yet; the intended contacts; the
# Hamilton's wind through the page's loop, its barrel's swept solid and its dial's printed face left out (the Wempe has no train, barrel or dial yet)
STATES=[(0.0,0,2.5,False)]
EXPECTED={}
WIND_SEQ=False
BARREL=False
DIAL=False
# bom.py: no balance stop to choose (the Hamilton clicks its locking arm's button), no function checks (bom-fn.js is the Hamilton's), no jewels drawn yet
ARM='void 0'
FN=False
JEWELS=0
