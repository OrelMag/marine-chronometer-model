/* overhaul.js: the overhaul, in the manual's own order (IDEAS.md 3.5). Sec. V's 58 operations take the movement down and Sec. VIII's 105 put it back together; each
   step names its tools (Sec. XIII's numbers), figures, oil and checks, and the parts that come off or go on by their lines of the parts list (bom.json's ids, the
   Hamilton numbers each piece of the model carries as userData.hn; '@name' a part of the page, PARTS in app.js). The parts move as the Exploded view moves them,
   one operation at a time: each to where that view puts it (its part's rise, part(name, off) in movement.js, and a screw's own lift), so a part lifted off lands
   where the view's clearance check (tools/exploded.py) has it. A part that rides on another until its own operation has a host (HOST): the fusee wheel on the
   fusee until Op. 41, the setup pawl's spring on the barrel bridge until Op. 32. One IIFE; the page sees only OVH. app.js calls OVH.bind() once the model is built,
   and OVH.frame() each frame after the Exploded view's offsets are set */
"use strict";
const OVH=(()=>{
  /* Sec. XIII, the service tools the two sequences name (Hamilton's index numbers) */
  const TOOLS={1:'endshaking stand, centre and third upper bushings',2:'endshaking stand, bar-hole jewels',7:'dialing ring',8:'detent spring testing fixture, with its 0.770 g weight',
    10:'Arkansas oilstone',11:'detent removing wedge',12:'graduated sector',13:'gage pin',18:'let-down key',19:'minute hand remover',20:'hour hand remover',21:'cannon pinion remover',
    31:'endstone undercutter',32:'endstone press',33:'cannon pinion closer',34:'balance lower bridge screw wrench',35:'hour hand punch, Lucite',36:'minute hand punch, Lucite',
    37:'wind indicator hand punch, Lucite',38:'second hand pusher',39:'hour wheel broach',40:'hour hand broach',42:'drop adjusting tool',47:'winding key',49:'dial shield',
    51:'sustaining ratchet wheel assembly block',52:'balance work block',53:'fusee assembly block',55:'barrel assembly block',56:'mainspring ring',57:'mainspring winder',
    79:'wind indicator and second hand remover',80:'wind indicator and second hand remover',82:'second hand broach',84:'steel tweezers, No. 3',87:'Lucite pointer',
    89:'screwdriver, hairspring stud and train-blocking screw',90:'screwdriver, endstone cap screws',91:'screwdriver, dial screws',93:'screwdriver, fusee ratchet wheel screws',
    94:'screwdriver, lower train bridge screws',95:'screwdriver, balance cock screw',96:'shell screwdriver, bridge and pillar screws',98:'work ring, with legs',101:'circular level',
    102:'wide-blade screwdriver, gimbal pivot screws',103:'screwdriver, gimbal support strap screws',104:'special illuminator',105:'second hand closer',106:'minute and hour hand closers',
    107:'rat-tail file',108:'mainspring grease syringe',110:'hand setting tool'};
  /* what a part rides on until its own operation moves it: an id, a part ('@name') or 0 (the movement, where its own group would carry it off) */
  const HOST={'42015':'42021','42009':'42021','42016':'42015','@sq':'42021','42001':'42021','42038':'42168','42037':'42168','42170':'42168',
    '42028':'@barrelBridge','42036':'@barrelBridge','42052':'@barrelBridge','42053':'@barrelBridge','@lowerBridge':'@trainBridge','@tblock':'@lowerBridge','@lockArm':'@trainBridge'};
  /* sd, the side up: t the train side, d the dial side, c the movement in its case, b in its box. out, in: what comes off, goes on; ls: loosened only; oi: the points
     oiled or greased (o: red oil, argon oil, grease); fc: what to look at when nothing moves; a: blk1 or blk0, the train-blocking screw down or up, wind, wind it */
  const DIS=[
    {op:1,sd:'c',t:'Take off the bezel',x:'Turn the bezel counterclockwise and take it off. (The case comes out of its gimbals first: loosen the locknut on the case’s rear pivot screw in the gimbal ring and back the screw off until the case tilts out into the hand.)',fc:['@dial']},
    {op:2,sd:'d',t:'Take the movement out of the bowl',x:'Lower the movement out of the bowl, pushing it gently with the winding key if need be (“Taking Movement from Case”, p. 10).'},
    {op:3,sd:'t',t:'Onto the work ring',x:'Take the legs off the work ring and, keeping the movement train side up, put it on the ring. (Working on the train side, the ring’s three long legs can come off; on the dial side, put them back.)',tl:[98]},
    {op:4,sd:'t',t:'Stop the balance',x:'If it is running, stop the balance with a non-metallic pointer, or with something dry and soft.',tl:[87],fg:[15],fc:['@bal']},
    {op:5,sd:'t',t:'Lower the train-blocking screw',x:'Lower the train-blocking screw carefully, making sure it doesn’t come down on top of an arm of the fourth wheel. In an early chronometer, without the screw, put a wire loop round the fourth wheel’s rim and the nearest pillar (Fig. 100).',tl:[89],fg:[16],a:'blk1',fc:['@tblock','@fw']},
    {op:6,sd:'t',t:'Run the train down to the screw',x:'Swing the balance with the pointer, or with pegwood or a brush, so the escapement works until the blocking screw stops the train against an arm of the fourth wheel (or the wire loop does). <b>Caution:</b> don’t let the balance’s swing grow so far that it damages the escape and balance pivots.',tl:[87],fg:[15],fc:['@bal','@fw','@tblock']},
    {op:7,sd:'t',t:'Wind the chain onto the fusee',x:'With the winding key, wind the fusee chain fully onto the fusee.',tl:[47],a:'wind',fc:['42021','42001']},
    {op:8,sd:'t',t:'Let the mainspring down',x:'Put the let-down key on the barrel arbor, hold the setup pawl away from the setup ratchet wheel, and let the key turn slowly in the fingers until the mainspring is disarmed. Unhook the chain from the barrel. <b>Caution:</b> not the winding key for this.',tl:[18],fg:[17],fc:['@ratchet','42168']},
    {op:9,sd:'t',t:'Let the sustaining spring down',x:'With the let-down key on the fusee arbor, turn it slightly clockwise to free the sustaining pawl from the sustaining ratchet wheel; hold the pawl away and let the key turn counterclockwise until the sustaining power is spent.',tl:[18],fg:[18],fc:['@spawl','@sratchet']},
    {op:10,sd:'t',t:'Loosen the hairspring stud screw',x:'Pressing the screwdriver gently down, unscrew the hairspring stud screw just far enough to free the stud. (A Navy Y-arm balance stop, which the manual doesn’t describe, comes off before this: on the restoration video’s 2E8489 it is unscrewed at its seal’s flange and lifted off with the seal, 6:15-6:24. The overhaul shows the manual’s locking arm, Fig. 9, which stays on the upper train bridge.)',tl:[89],fg:[19],ls:['27760.st']},
    {op:11,sd:'t',t:'Take out the balance cock screw',x:'Take out the balance cock screw with the large screwdriver.',tl:[95],fg:[19],out:['42192']},
    {op:12,sd:'t',t:'Lift off the balance cock',x:'Lift off the balance cock, holding the balance staff upright.',fg:[19],out:['@cock']},
    {op:13,sd:'t',t:'Lift out the balance',x:'Lift the balance unit out, moving it slightly away from the detent, and put it on the balance work block. For cleaning, the balance unit isn’t taken apart unless its pivots are in poor condition or there is some other reason (Sec. VII).',tl:[52],out:['@bal','@spr']},
    {op:14,sd:'t',t:'The balance upper endstone cap',x:'Take out the balance upper endstone cap screws and the cap. Put the cock, cap and screws in the cleaning tray: endstone caps go in the same compartment as their bridges (Sec. VI).',tl:[90],fg:[19],out:['20762.ep','42160','42155','J.bue']},
    {op:15,sd:'t',t:'Take out the hairspring stud screw',x:'Take out the hairspring stud screw and put it in the tray’s screw compartment (Fig. 33).',fg:[19],out:['27760.st']},
    {op:16,sd:'d',t:'Turn the movement over',x:'Put the work ring’s legs back and turn the movement over, dial side up.',tl:[98]},
    {op:17,sd:'d',t:'Take off the hour and minute hands',x:'Take off the hour hand and the minute hand with their removers.',tl:[19,20],fg:[20],out:['42032','42033']},
    {op:18,sd:'d',t:'Take off the second and wind indicator hands',x:'Take off the second hand and the wind indicator hand with the hand removers, the dial shield between the tools and the dial.',tl:[79,80,49],fg:[21],out:['42034','42035']},
    {op:19,sd:'t',t:'Take out the four dial screws',x:'Turn the movement, holding its dial side in the left hand with tissue paper between palm and dial, and take out the four dial screws. They go in the tray’s screw compartment, where every small screw from the operations that follow goes too.',tl:[91],fg:[21],out:['35756']},
    {op:20,sd:'d',t:'Take off the dial',x:'Turn the movement over and put it on the bench, dial side up. Take off the dial, by its take-off slot.',fg:[21],out:['@dial']},
    {op:21,sd:'d',t:'Take off the motion work',x:'Take off the wind indicator wheel, the hour wheel and the minute wheel, then the cannon pinion with its remover.',tl:[21],fg:[21],out:['42081','42080','42078','42077']},
    {op:22,sd:'t',t:'Take off the escape upper bridge',x:'Turn the movement over (taking the work ring’s legs off). Take out the escape upper bridge’s two screws, put them in the tray, and lift out the bridge.',fg:[22],out:['20762.eb','@escBridge']},
    {op:23,sd:'t',t:'Take out the escape wheel',x:'Take out the escape wheel and put it with the balance unit.',fg:[22],out:['@escW']},
    {op:24,sd:'t',t:'The escape upper endstone cap',x:'Take the two endstone cap screws out of the escape upper bridge, and the cap off it. If it isn’t marked already, mark a “1” in the cap’s milled recess. Bridge, cap and cap screws go in the tray with the bridge’s screws.',fg:[22],out:['20762.euc','42159.eu','J.eue']},
    {op:25,sd:'t',t:'Wedge the detent; its block screw',x:'Put the detent removing wedge between the balance lower bridge and the detent support block, and take out the detent support block screw.',tl:[11],fg:[23],out:['42056.blk']},
    {op:26,sd:'t',t:'Take out the detent',x:'Take the wedge out carefully, then the detent assembly, straddling it with the tweezers; if it is tight, push it off with nickel wire against its steady pins. Put it with the escape wheel and the balance.',fg:[22],out:['@det']},
    {op:27,sd:'t',t:'Take off the setup cover plate',x:'Take out the setup cover plate’s two screws and the plate.',fg:[24],out:['42056.cv','42029']},
    {op:28,sd:'t',t:'Take off the setup pawl and ratchet',x:'Take off the setup pawl and the setup ratchet wheel.',fg:[24],out:['42027','42026']},
    {op:29,sd:'t',t:'Take off the dust seal',x:'Take out the dust seal’s two screws and the seal, and take its packing ring unit off it. The packing rings are replaced at every overhaul; never let them touch the cleaning solution.',fg:[24],out:['42056.sl','42051','42054']},
    {op:30,sd:'t',t:'The seal ring and its spring',x:'Take off the seal ring and its helical seal ring spring.',fg:[24],out:['42052','42053']},
    {op:31,sd:'t',t:'Take off the barrel bridge',x:'With the shell screwdriver, take out the three screws that hold the barrel bridge, and lift it off.',tl:[96],fg:[24,25],out:['42055.bb','42055.bbp','@barrelBridge']},
    {op:32,sd:'t',t:'Strip the barrel bridge',x:'Push the setup pawl spring off by its steady pins from the bridge’s underside; take out the setup pawl pivot screw; unscrew the winding stop (a left-hand thread).',fg:[24],out:['42028','42036','42099']},
    {op:33,sd:'t',t:'Lift out the barrel',x:'Lift out the mainspring barrel.',fg:[25],out:['42168']},
    {op:34,sd:'t',t:'Take out the barrel cap screws',x:'Take out the barrel cap screws. (Ops. 34-37 are usually done after the last operation of all; the manual sets them here, where the barrel has just come out.)',fg:[26],out:['37023']},
    {op:35,sd:'t',t:'Take off the barrel cap',x:'Take off the barrel cap, tapping the end of the barrel arbor if need be.',fg:[26],out:['42169']},
    {op:36,sd:'t',t:'Take out the barrel arbor',x:'Take out the barrel arbor.',fg:[26],out:['42170']},
    {op:37,sd:'t',t:'Take out the mainspring',x:'Take the mainspring out with the mainspring winder and restraining ring. <b>Caution:</b> there is always a danger of injury unless the spring is tightly held; use the ring to contain it as it comes out of the barrel (Fig. 76).',tl:[56,57],fg:[26],out:['42038','42037']},
    {op:38,sd:'t',t:'Lift out the fusee',x:'Hold the sustaining pawl clear and lift out the fusee, with its wheel, ratchets and chain.',fg:[27],out:['42021']},
    {op:39,sd:'t',t:'Take off the chain',x:'Take the chain off the fusee (a pin holds its end, Fig. 28) and hang it over a rod so it can’t kink. (Ops. 39-45 are usually done after Op. 58; the manual sets them here, where the fusee has just come out.)',fg:[28],out:['42001']},
    {op:40,sd:'t',t:'The taper pin and end plate',x:'Take out the taper pin and the fusee end plate. If it isn’t marked already, mark the end plate lightly on the side the pin came out of.',fg:[28],out:['42020','42019']},
    {op:41,sd:'t',t:'Take off the fusee wheel',x:'Take off the fusee wheel, the sustaining spring and the sustaining ratchet wheel.',fg:[28],out:['42015','42016','42009']},
    {op:42,sd:'t',t:'The winding pawl springs',x:'Take the four screws out of the sustaining ratchet wheel, freeing the winding pawl springs.',fg:[28],out:['42012','42007']},
    {op:43,sd:'t',t:'Take off the winding ratchet wheel',x:'Take the winding ratchet wheel’s two screws out of the fusee, freeing the wheel.',tl:[93],fg:[28],out:['42014','42013']},
    {op:44,sd:'t',t:'Take off the fusee top plate',x:'Take out the fusee top plate’s two screws, freeing the plate.',fg:[28],out:['27760.fu','42008']},
    {op:45,sd:'t',t:'The winding stop-bar',x:'Take out the winding stop-bar spring and the winding stop-bar.',fg:[28],out:['42025','42024']},
    {op:46,sd:'t',t:'Free the train',x:'Free the train by backing the train-blocking screw up (Op. 5).',fg:[16],a:'blk0',fc:['@tblock','@fw']},
    {op:47,sd:'t',t:'The upper train bridge’s screws',x:'Take out the upper train bridge’s three screws with the shell screwdriver.',tl:[96],fg:[29],out:['42055.tb']},
    {op:48,sd:'t',t:'Lift off the upper train bridge',x:'Lift the upper train bridge straight up off the pillars.',fg:[29],out:['@trainBridge']},
    {op:49,sd:'t',t:'Take out the train',x:'Take out the fourth wheel, the centre wheel, the third wheel and the sustaining pawl.',fg:[29],out:['@fw','@cw','@tw','@spawl']},
    {op:50,sd:'t',t:'Take off the balance lower bridge',x:'Take the balance lower bridge’s two screws out of the upper train bridge with the shell screwdriver, and take off the bridge.',tl:[96],fg:[29,30],out:['42055.lb','@lowerBridge']},
    {op:51,sd:'t',t:'The blocking screw and lower cap',x:'Take out the train-blocking screw. Take out the balance lower endstone cap’s two screws and the cap; if it isn’t marked already, mark a “2” in its milled recess.',fg:[29,30],out:['@tblock','20762.blc','42159.bl','J.ble']},
    {op:52,sd:'d',t:'Take out the pillars',x:'From the dial side, take out the four pillar screws with the shell screwdriver, letting the pillars drop out. <b>Caution:</b> each pillar goes back where it came from, so mark them as they come out. (From here the work ring is turned back and forth, and held in the hand, as is convenient.)',tl:[96],fg:[29],out:['42055.pil','42055.pilb','@pillars']},
    {op:53,sd:'d',t:'Take off the lower train bridge',x:'Take out the lower train bridge’s two screws and the bridge.',tl:[94],fg:[31,29],out:['42163','@ltb']},
    {op:54,sd:'d',t:'The escape lower endstone cap',x:'Take out the escape lower endstone cap’s two screws and the cap; if it isn’t marked already, mark a “3” in its milled recess.',fg:[29],out:['20762.elc','42159.el','J.ele']},
    {op:55,sd:'d',t:'The mounting ring screws',x:'With the shell screwdriver, take out the mounting ring screws, and lift the pillar plate from the mounting ring.',tl:[96],fg:[29],out:['42055.ring']},
    {op:56,sd:'d',t:'The wind indicator wheel post',x:'Take out the wind indicator post’s screw and the post.',fg:[29],out:['35779.ud','42084']},
    {op:57,sd:'d',t:'The minute wheel post',x:'Take out the minute wheel post’s screw and the post.',fg:[29],out:['35779.mw','42085']},
    {op:58,sd:'d',t:'Off the work ring',x:'Take the mounting ring off the work ring. <b>Caution:</b> the mounting ring is lacquered: keep it away from alcohol. Further taking down, for repairs, is in Sec. VII, “Inspection and Repair”.',out:['42057']}];
  const RE=[
    {op:1,sd:'t',t:'The pillar plate on its mounting ring',x:'Put the mounting ring on the work ring, the pillar plate on the ring, and screw in the three mounting ring screws with the shell screwdriver. (Ops. 16-34, the fusee, and 35-39, the barrel, are usually done before this one.) <b>Caution:</b> every screw in a chronometer must be tight.',tl:[98,96],fg:[67],in:['42057','42055.ring']},
    {op:2,sd:'d',t:'The minute and wind indicator wheel posts',x:'Turn the work ring over and put in the minute wheel post and the wind indicator wheel post.',fg:[67],in:['42085','42084']},
    {op:3,sd:'t',t:'Their screws',x:'Hold the posts in place with tissue, turn over, and screw in the two post screws.',fg:[67],in:['35779.mw','35779.ud']},
    {op:4,sd:'t',t:'The barrel bridge pillar',x:'Put in the barrel bridge pillar and fasten its screw from below.',tl:[96],fg:[67],in:['42058','42055.pilb']},
    {op:5,sd:'t',t:'The upper train bridge’s pillars',x:'Put in the three pillars for the upper train bridge and fasten their screws.',tl:[96],fg:[67],in:['42059','42055.pil']},
    {op:6,sd:'d',t:'The escape lower endstone cap',x:'Put the escape lower endstone cap (number 3) in its recess and screw in its two screws.',tl:[90],fg:[67],in:['42159.el','J.ele','20762.elc']},
    {op:7,sd:'d',t:'The lower train bridge',x:'Put on the lower train bridge and screw in its two screws, tightened with the large screwdriver.',tl:[94],fg:[67,68],in:['@ltb','42163']},
    {op:8,sd:'t',t:'The train',x:'Turn the movement over and put the third wheel, centre wheel and fourth wheel in their pivot holes.',fg:[67],in:['@tw','@cw','@fw']},
    {op:9,sd:'t',t:'The sustaining pawl',x:'Put in the sustaining pawl.',fg:[67],in:['@spawl']},
    {op:10,sd:'t',t:'The train-blocking screw',x:'Screw the train-blocking screw into the balance lower bridge so that its cone is below the bridge’s top face. (The manual prints Tool No. 84; its tool list makes No. 89 the screwdriver for this screw. Train-blocking screws began with chronometer No. 3500; every one after 4002 has one.)',tl:[84],fg:[67],in:['@tblock']},
    {op:11,sd:'t',t:'The balance lower endstone cap',x:'Turn the balance lower bridge over and put on the balance lower endstone cap (number 2) with its two screws.',tl:[90],fg:[67],in:['42159.bl','J.ble','20762.blc']},
    {op:12,sd:'t',t:'The balance lower bridge on the train bridge',x:'Screw the balance lower bridge to the upper train bridge with its two screws.',tl:[96],fg:[30],in:['@lowerBridge','42055.lb']},
    {op:13,sd:'t',t:'Back up the blocking screw',x:'Turn the upper train bridge over and back the train-blocking screw up, to leave room for putting the bridge on.',fg:[67],fc:['@tblock']},
    {op:14,sd:'t',t:'The upper train bridge',x:'Put the upper train bridge over the pillar plate and lower it slowly and carefully into place; screw in its three pillar screws. <b>Caution:</b> make sure every pivot is in its hole and the wheels and pinions are in mesh.',fg:[67],in:['@trainBridge','42055.tb']},
    {op:15,sd:'t',t:'The train’s endshake',x:'Check the endshake of the fourth, third and centre wheels and the sustaining pawl: 0.001 to 0.003 in. It can be set by pressing a bushing or jewel in or out; the sustaining pawl has no bushing, so one with the wrong endshake is replaced (some train bridges were undercut for it when made).',tl:[1,2],fc:['@fw','@tw','@cw','@spawl']},
    {op:16,sd:'t',t:'The fusee on its assembly block',x:'Put the fusee, complete with its arbor, square end down on the fusee assembly block. (Ops. 16-34 are usually done before Op. 1; the manual sets them here, where the fusee goes into the movement.)',tl:[53],fg:[69],fc:['42021']},
    {op:17,sd:'t',t:'The winding ratchet wheel',x:'Fix the winding ratchet wheel to the fusee with its two screws.',fg:[69,70],in:['42013','42014']},
    {op:18,sd:'t',t:'The winding pawl springs',x:'On the sustaining ratchet wheel assembly block, fix the winding pawl springs to the sustaining ratchet wheel with their four screws. A drop of red oil on each winding pawl’s post (Fig. 69, arrow 1); grease the pawl springs where they touch the pawls (arrow 2).',tl:[51],fg:[69],in:['42007','42012'],o:'red oil, grease',oi:['42009']},
    {op:19,sd:'t',t:'The sustaining spring',x:'A spot of grease under the sustaining spring’s working end (Fig. 69, arrow 3); put the spring in the fusee wheel (Fig. 71).',fg:[69,70,71],in:['42016'],o:'grease',oi:['42016']},
    {op:20,sd:'t',t:'Grease the fusee wheel',x:'Six drops of grease on the fusee wheel’s lip (Fig. 71, arrow 1), and a little on the outside of its hub (arrow 2).',fg:[71],o:'grease',oi:['42015']},
    {op:21,sd:'t',t:'Grease the winding ratchet',x:'Lightly grease the winding ratchet’s teeth (Fig. 69, arrow 4).',fg:[69],o:'grease',oi:['42013']},
    {op:22,sd:'t',t:'Grease the fusee arbor',x:'Grease the fusee arbor above the ratchet wheel (Fig. 69, arrow 5).',fg:[69],o:'grease',oi:['42021']},
    {op:23,sd:'t',t:'Grease the fusee’s elevation',x:'Grease the elevation at the outer rim on top of the fusee, as it sits on the block (Fig. 69, arrow 6).',fg:[69],o:'grease',oi:['42021']},
    {op:24,sd:'t',t:'The sustaining ratchet wheel',x:'Put the sustaining ratchet wheel on the fusee, taking care that the pawls are rightly placed.',fg:[70],in:['42009']},
    {op:25,sd:'t',t:'The fusee wheel',x:'Put the fusee wheel in place on the fusee.',fg:[70],in:['42015']},
    {op:26,sd:'t',t:'Grease its recess',x:'Grease both elevations in the fusee wheel’s recess (Fig. 72).',fg:[72],o:'grease',oi:['42015']},
    {op:27,sd:'t',t:'The fusee end plate',x:'Put on the fusee end plate. Its notches must match the taper pin’s taper; with new parts they may need filing deeper (Op. 29).',fg:[70],in:['42019']},
    {op:28,sd:'t',t:'The taper pin',x:'Put in the taper pin from the arbor hole’s larger end, on the side the end plate is marked.',fg:[70],in:['42020']},
    {op:29,sd:'t',t:'Check it turns',x:'With the assembly block as a key, make sure it turns freely counterclockwise; if need be, file the end plate’s slots. Watch that the sustaining spring works as it should.',tl:[53,107],fc:['42021','42019']},
    {op:30,sd:'t',t:'Grease the stop-bar’s slot',x:'Turn the fusee over in the block and grease the bottom of the stop-bar’s slot.',o:'grease',oi:['42021']},
    {op:31,sd:'t',t:'The winding stop-bar',x:'Put in the winding stop-bar spring and the stop-bar; grease the bar’s top (Fig. 73).',fg:[73],in:['42025','42024'],o:'grease',oi:['42024']},
    {op:32,sd:'t',t:'The fusee top plate',x:'Put on the fusee top plate with its two screws, and check that the winding stop-bar is free.',fg:[70],in:['42008','27760.fu']},
    {op:33,sd:'t',t:'Wind the chain on',x:'Wind the chain carefully onto the fusee, all but its last turn. <b>Caution:</b> don’t bend the links the wrong way.',in:['42001']},
    {op:34,sd:'t',t:'The fusee into the movement',x:'Hold the sustaining pawl aside and put the fusee assembly in place.',fg:[74],in:['42021']},
    {op:35,sd:'t',t:'The mainspring brace',x:'Grease the mainspring brace and put it in the barrel, the angle of its ends right so it can’t slip. (Ops. 35-39 are usually done before the movement is begun at all; the manual sets them here, where the barrel goes in.)',fg:[75],in:['42037'],o:'grease',oi:['42037']},
    {op:36,sd:'t',t:'The mainspring',x:'Put the mainspring in the barrel with the winder and ring, laying a thin coat of grease along it with the syringe, over its whole flat. <b>Caution:</b> there is always a danger of injury unless the spring is tightly held; use the ring to contain it from winder to barrel (Fig. 76).',tl:[56,57,108],fg:[76],in:['42038'],o:'grease',oi:['42038']},
    {op:37,sd:'t',t:'Grease the barrel arbor',x:'A little grease on the barrel arbor’s two bearing surfaces (Fig. 75, arrows 1 and 2).',fg:[75],o:'grease',oi:['42170']},
    {op:38,sd:'t',t:'The barrel arbor',x:'Put in the barrel arbor, making sure the mainspring is hooked on it.',fg:[75],in:['42170']},
    {op:39,sd:'t',t:'The barrel cap',x:'In the barrel assembly block, put on the barrel cap as Fig. 75 has it. Its five screws must be tight.',tl:[55],fg:[75],in:['42169','37023']},
    {op:40,sd:'t',t:'The barrel into the movement',x:'Put the barrel in its pivot hole in the pillar plate, winding square up.',in:['42168']},
    {op:41,sd:'t',t:'The setup pawl pivot screw',x:'Screw the setup pawl pivot screw into the barrel bridge.',fg:[80],in:['42036']},
    {op:42,sd:'t',t:'The winding stop',x:'Screw in the winding stop (a left-hand thread).',fg:[80],in:['42099']},
    {op:43,sd:'t',t:'Oil the sustaining pawl',x:'Oil the sustaining pawl’s upper pivot with argon oil (Fig. 80, arrow 1).',fg:[80],o:'argon oil',oi:['@spawl']},
    {op:44,sd:'t',t:'The barrel bridge',x:'Put on the barrel bridge and fasten its three screws with the shell screwdriver.',tl:[96],fg:[77],in:['@barrelBridge','42055.bb','42055.bbp']},
    {op:45,sd:'t',t:'Lower the train-blocking screw',x:'Lower the train-blocking screw between the fourth wheel’s arms (Op. 5 of the disassembly).',fg:[16],a:'blk1',fc:['@tblock','@fw']},
    {op:46,sd:'t',t:'Oil the upper bushings',x:'With argon oil, oil the fusee upper bushing (arrow 1), the barrel upper bushing (2), the centre upper bushing (3) and the third upper bushing (4).',fg:[78],o:'argon oil',oi:['42164.fu','42164.bu','42166','42167']},
    {op:47,sd:'t',t:'Oil the upper jewels',x:'With red oil, oil the fourth upper jewel (arrow 5), the escape lower jewel (6) and the balance lower jewel (7).',fg:[78],o:'red oil',oi:['42161.fu','42162.el','42162.bl']},
    {op:48,sd:'d',t:'Oil the lower bushings',x:'Turn the movement over. With argon oil, oil the fusee lower bushing (arrow 1), the barrel lower bushing (2), the centre lower bushing (3) and the sustaining pawl’s pivot (4).',fg:[79],o:'argon oil',oi:['42164.fl','42164.bl','42165','@spawl']},
    {op:49,sd:'d',t:'Oil the lower jewels',x:'With red oil, oil the third and fourth lower jewels (arrows 5 and 6).',fg:[79],o:'red oil',oi:['42161.tl','42161.fl']},
    {op:50,sd:'t',t:'The setup ratchet and pawl',x:'Turn the movement over. Put on the setup ratchet wheel, the setup pawl and the pawl spring.',fg:[80],in:['42026','42027','42028']},
    {op:51,sd:'t',t:'The setup cover plate',x:'Put on the setup cover plate with its two screws.',fg:[80],in:['42029','42056.cv']},
    {op:52,sd:'t',t:'The dust seal',x:'Fit new packing rings to the dust seal; put on the helical seal spring, the seal ring and the dust seal with its two screws.',fg:[80],in:['42053','42052','42054','42051','42056.sl']},
    {op:53,sd:'t',t:'Hook on the chain',x:'Hook the fusee chain on the barrel and wind the barrel about one turn.',fg:[75],fc:['42001','42168']},
    {op:54,sd:'t',t:'Wind it: the stop works',x:'Wind the chain onto the fusee, checking that the winding stop-bar and the winding stop work.',a:'wind',fc:['42021','42001','42099']},
    {op:55,sd:'t',t:'Check the chain',x:'Check the chain as it lies: straight and true, and fitting every turn of the fusee.',fc:['42001','42021']},
    {op:56,sd:'t',t:'Set up the mainspring',x:'Wind the mainspring fully and let it down about a quarter turn.',fc:['@ratchet','42168']},
    {op:57,sd:'d',t:'Into the dialing ring',x:'Take the movement off the work ring, turn it over and put it in the dialing ring; turn it over again, making sure the ring’s centre pinion supporting screw fits down onto the centre pivot.',tl:[7],fg:[83]},
    {op:58,sd:'d',t:'The cannon pinion',x:'Turn the movement over in the dialing ring. Oil the centre staff’s cannon pinion bearing with argon oil (Fig. 81, arrow 1) and put on the cannon pinion (a new one closed with the cannon pinion closer). Check its friction by putting the minute hand on and turning it counterclockwise; take the hand off. It must be tight on the centre wheel’s staff, but not so tight that it moves the train.',tl:[33],fg:[81,82],in:['42077'],o:'argon oil',oi:['@cw']},
    {op:59,sd:'d',t:'The motion work',x:'Put on the minute wheel, the hour wheel and the wind indicator wheel. The hour wheel must be free on the cannon pinion; a new one may need broaching.',tl:[39],fg:[81],in:['42078','42080','42081']},
    {op:60,sd:'d',t:'The dial',x:'Put the dial in place.',fg:[82],in:['@dial']},
    {op:61,sd:'t',t:'The dial screws',x:'Turn the movement over, holding the dial in place with the hand protected by tissue, and put in and tighten the four dial screws.',tl:[91],fg:[83],in:['35756']},
    {op:62,sd:'d',t:'The wind indicator hand',x:'Turn the movement over. Put on the wind indicator hand pointing to “UP”.',tl:[37],fg:[81],in:['42035']},
    {op:63,sd:'d',t:'Set the cannon pinion',x:'With the minute hand, turn the cannon pinion until the hand points to “12”; take the hand off.',fc:['42077']},
    {op:64,sd:'d',t:'The hour and minute hands',x:'Put on the hour hand pointing to “3” and the minute hand pointing to “12”. A new hour hand that is too tight is broached; the minute hand can be broached with a square file; one too loose is closed.',tl:[35,36,40,106],in:['42032','42033']},
    {op:65,sd:'t',t:'Back on the work ring',x:'Take off the dialing ring, holding the dial with tissue, and put the movement on the work ring, train side up.',tl:[98]},
    {op:66,sd:'t',t:'The escape upper endstone cap',x:'Screw the escape upper endstone cap (number 1) to the escape upper bridge with its two screws.',fg:[84],in:['42159.eu','J.eue','20762.euc']},
    {op:67,sd:'t',t:'Oil the escape upper jewel',x:'Oil the escape upper jewel with red oil (Fig. 84, arrow 1).',fg:[84],o:'red oil',oi:['42162.eu']},
    {op:68,sd:'t',t:'The escape wheel',x:'Put in the escape wheel. <b>Caution:</b> no lubricant on its teeth.',fg:[84],in:['@escW']},
    {op:69,sd:'t',t:'The escape upper bridge',x:'Lower the escape upper bridge into place and put in its two screws. Check the escape wheel’s endshake: 0.001 to 0.003 in. Too much: mill the endstone cap’s face down with the undercutter (Fig. 86) and press the endstone down to seat it. Too little: a better-fitting endstone cap, the hole jewel pressed up to it.',tl:[31,32],fg:[84,86],in:['@escBridge','20762.eb']},
    {op:70,sd:'t',t:'The balance upper endstone cap',x:'Screw the balance upper endstone cap to the balance cock with its two screws. (It is the diamond endstone cap: both its sides are flat.)',fg:[85],in:['42160','42155','J.bue','20762.ep']},
    {op:71,sd:'t',t:'Oil the balance upper jewel',x:'Oil the balance upper jewel with red oil (Fig. 85, arrow 1).',fg:[85],o:'red oil',oi:['42162.bu']},
    {op:72,sd:'t',t:'The balance',x:'Put in the balance assembly as a unit (put together as in Sec. VII). <b>Caution:</b> no lubricant on the locking and unlocking jewels.',in:['@bal','@spr']},
    {op:73,sd:'t',t:'The balance cock',x:'Lower the balance cock carefully into place, guiding the balance staff with tweezers so that its pivot goes freely into the jewel hole.',fg:[85],in:['@cock']},
    {op:74,sd:'t',t:'The balance cock screw',x:'Holding the cock in place with the fingers, put in its screw, making sure the balance staff has endshake before tightening it. With the screw in, check the endshake again: 0.001 to 0.003 in.',fg:[85],in:['42192']},
    {op:75,sd:'t',t:'The hairspring stud',x:'Start the hairspring stud screw in its hole. Turn the balance clockwise carefully until the stud is where it goes, lift the stud into place and fasten the screw (Fig. 87). Free the train: back the train-blocking screw up as far as it goes and tighten it there.',fg:[87],in:['27760.st'],a:'blk0'},
    {op:76,sd:'t',t:'The teeth on the impulse jewel',x:'Move the balance to and fro: each escape tooth should drop into the large part of the impulse roller’s crescent, where the impulse jewel stops it. A tooth that misses the jewel altogether means the jewel is too short or the escape wheel worn: replace the wheel, or use a larger roller. Check that the impulse jewel is upright and its edge unchipped (Fig. 38).',fc:['@escW','@bal']},
    {op:77,sd:'d',t:'Look the detent over',x:'Turn the movement over. Check the detent and its screws for rust and that every screw is tight; check that the jewel is upright and the detent and trip springs straight. <b>Caution:</b> no lubricant on any part of the detent. (Late detents are beryllium copper, their trip springs Hamilton Elinvar; any other is changed to these.)',fc:['@det']},
    {op:78,sd:'d',t:'The detent spring’s action',x:'In the spring testing fixture, hang 0.770 g on the locking jewel: it should lift the detent spring off its stop button by about 0.005 in. If need be, bend the detent springs carefully until it does, keeping the locking jewel upright.',tl:[8],fg:[88],fc:['@det']},
    {op:79,sd:'d',t:'The trip spring',x:'Watch the trip spring: it should flex under a very slight force and not fly back violently. It should lie flat and rest lightly on the abutment arm.',fc:['@det']},
    {op:80,sd:'t',t:'Put in the detent',x:'Put in the detent, wedging it in place with the detent removing wedge.',tl:[11],fg:[89],in:['@det']},
    {op:81,sd:'t',t:'Its block screw',x:'Turn the movement over; put in the detent support block screw and take out the wedge.',fg:[89],in:['42056.blk']},
    {op:82,sd:'t',t:'The escape wheel’s height',x:'Check the escape wheel’s height on the impulse jewel: high enough to clear the detent, but centred on the jewel, as much of the jewel above it as below (Fig. 14). With a staking set’s stump and punch the wheel can be driven a little up or down on its pinion.',fg:[14],fc:['@escW','@bal']},
    {op:83,sd:'t',t:'The teeth on the jewel’s face',x:'Check that the escape teeth strike the impulse jewel’s face: never its edge, nor ever the small part of the crescent. If they do, close the angle between the impulse and unlocking jewels with the spanner.',tl:[42],fc:['@escW','@bal']},
    {op:84,sd:'t',t:'Roller shake',x:'With the illuminator, check the roller shake: the clearance between the impulse roller and the ends of the two escape teeth nearest it, the wheel locked. About 0.002 in each, nearly equal or, better, a little more on the outgoing tooth. If the two together are well over or under 0.004 in, fit a new roller; if about 0.004, even them with the detent adjusting screw, its clamp screw loosened, then tightened again.',tl:[104],fg:[90],fc:['@escW','@bal','@det']},
    {op:85,sd:'t',t:'The lock',x:'Check the lock on every tooth with the illuminator, the graduated sector on the upper train bridge under the balance’s edge and the gage pin near the middle of its rim at rest (Fig. 91). Turn the balance clockwise until the trip spring is back in place, then counterclockwise until light shows between the detent and its stop button; read the gage, and turn on until the tooth on the locking jewel drops off; read it again. The lock should be about 6°; set it with the lock adjusting screw, its clamp screw loosened (Fig. 90). (If the trip spring seems too short to unlock some teeth, the balance staff’s lower pivot may be bent.)',tl:[104,12,13,87],fg:[90,91],fc:['@det','@bal','@escW']},
    {op:86,sd:'t',t:'The let-off',x:'Check the let-off, the arc from the unlocking to the detent’s release: turn the balance clockwise until the trip spring is back in place, then counterclockwise until the tooth on the locking jewel drops off, and read the gage on until the detent falls back. At least 6°; less means the trip spring is too short (Op. 87), or, rarely, the detent out of line.',fg:[91],fc:['@det','@bal']},
    {op:87,sd:'t',t:'The overall',x:'Check the trip spring’s length by the overall, the balance’s arc over the trip spring’s whole travel: turn the balance clockwise until the trip spring falls off the unlocking jewel and is back in place, stop it there with the pointer and read the gage; turn it counterclockwise until the detent falls back, and read it again. The difference should be 26° to 30°. Its length is put right in Ops. 90 and 91.',tl:[87],fg:[91],fc:['@det','@bal']},
    {op:88,sd:'t',t:'The unlocking jewel',x:'Check that the unlocking jewel is upright and that the detent’s abutment arm clears it by about 0.010 in.',fg:[90],fc:['@det','@bal']},
    {op:89,sd:'t',t:'Take the detent out',x:'Take the detent out: put in the wedge and take out the support block screw, turn the movement over and straddle the detent with tweezers; take out the wedge and the detent. (Whenever the detent is taken out, this is how.)',tl:[11],out:['42056.blk','@det']},
    {op:90,sd:'t',t:'A trip spring too short',x:'If Op. 87 found the trip spring too short, fit a new one (Sec. VII, the detent taken apart and put together).',fc:['@det']},
    {op:91,sd:'t',t:'A trip spring too long',x:'If too long, stone it to length: clamp the detent down, steady the trip spring in the tweezers, and stone its end off straight with all burrs removed (Fig. 92).',tl:[10],fg:[92],fc:['@det']},
    {op:92,sd:'t',t:'Back in; check again',x:'Put the detent back and check the overall, lock and let-off. It may come out several times before the trip spring is right.',in:['@det','42056.blk']},
    {op:93,sd:'t',t:'The springs again',x:'With the overall right, check the detent spring’s and the trip spring’s action again (Ops. 78 and 79). The detent clamp screw must be tight and the detent adjusting screw screwed in against the detent.',fc:['@det']},
    {op:94,sd:'t',t:'Clean the detent',x:'Take the detent out, dip it in naphtha and dry it in warm air.',out:['42056.blk','@det']},
    {op:95,sd:'t',t:'The detent back',x:'Put the detent back.',in:['@det','42056.blk']},
    {op:96,sd:'t',t:'Overall, lock and let-off',x:'Check the overall, lock and let-off.',fg:[91],fc:['@det','@bal']},
    {op:97,sd:'t',t:'The drop',x:'Check the drop with the sector and pin (Fig. 91): turn the balance counterclockwise until a tooth falls on the impulse jewel, stop it and read the gage; turn it clockwise until the tooth falls off the jewel, and read it again. Allow for teeth of different lengths, so the shorter ones don’t miss the jewel: for the average escape wheel about 2°. Set it with the spanner, the angle between the impulse and unlocking jewels opened if the drop is too great, closed if a tooth misses the jewel. (With a one-piece roller the trip spring can be reshaped a little instead, not so as to change its look.)',tl:[42],fg:[91],fc:['@escW','@bal']},
    {op:98,sd:'t',t:'A tooth on the locking jewel',x:'Move the balance until an escape tooth rests on the locking jewel.',fc:['@escW','@det']},
    {op:99,sd:'d',t:'The second hand',x:'Turn the movement over. Holding the balance lightly with a finger so it can’t swing, put on the second hand exactly over a seconds mark with the second hand pusher; not pressed tight until after Op. 100. A new hand may need broaching, or closing.',tl:[38,82,105],fg:[93],in:['42034']},
    {op:100,sd:'d',t:'The seconds fall true',x:'Let the balance swing and watch the second hand against the seconds marks for a whole turn. If it doesn’t fall evenly on the seconds, set it on its pipe with the pusher, the balance held, and repeat Ops. 98-100; then press it home, clear of the dial. (The dial or movement can shift on the mounting ring and put the seconds bit off centre: shift it back.)',tl:[38],fc:['42034']},
    {op:101,sd:'t',t:'The check list',x:'Go over the reassembly check list: <b>A</b> the balance’s endshake; <b>B</b> the train wheels’ and sustaining pawl’s; <b>C</b> the chain tight on the fusee; <b>D</b> aligned on the barrel; <b>E</b> the impulse jewel and <b>F</b> the locking jewel in line with the escape wheel; <b>G</b> the trip spring with the unlocking jewel and abutment arm; <b>H</b> the detent’s look and its screws tight; <b>I</b> the escapement: drop, lock, overall, let-off, the balance screws, timing and vernier weights tight, the detent and trip springs’ action; <b>J</b> the jewels and bushings clean, their oil right; <b>K</b> the mainspring’s setup; <b>L</b> the dial side: the wind indicator hand, the hour and minute hands and the second hand aligned; <b>M</b> fingermarks, dust, lint, marks and marred screws (above all on the balance), every other screw tight (the balance lower bridge screws with their wrench). It is then ready for regulation and isochronal testing (Sec. IX).',tl:[34]},
    {op:102,sd:'t',t:'Off the work ring',x:'Take the movement off the work ring.'},
    {op:103,sd:'c',t:'Into the case; start it',x:'Put the movement in its case. Start the chronometer and set the hands for the pre-test. It then goes through pre-testing and the performance test (Sec. IX); after them it goes into its mounting box (Ops. 104 and 105) or is prepared for storage (Sec. X).',tl:[110]},
    {op:104,sd:'b',t:'Into the gimbals',x:'Lightly grease the gimbal mount’s four pivots. Loosen the gimbal ring’s rear pivot screw, put the chronometer on its pivots in the ring, and tighten the pivot screw and its locknut against the ring.',tl:[102],fg:[94],o:'grease'},
    {op:105,sd:'b',t:'Free and level',x:'Check that the chronometer is free in its gimbals. If need be, correct its endshake by under-turning the head of the rear pivot screw or cutting back its shoulder. If free but out of level, level it with the case and gimbal support straps: the case strap at “6” centres and levels the case, the gimbal ring’s at “3” levels the ring, a circular level with its bubble on the middle of the bezel. If the ring is not free in the box, or too free, cup or thin one of the gimbal ring pivot screw washers. Having passed its tests and gone back into its box, it is ready for use.',tl:[103,101],fg:[94]}];
  const SEQ={d:DIS,r:RE};

  let A=null,on=null,i=0,play=0,bz=false,prog=1,HID=new Set();   /* A: app.js's; on: 'd' or 'r'; i: the step shown; HID: the meshes put away (in the tray) */
  /* the movers: each object an id moves. F its place now (0 in, 1 off), T where the step leaves it, P0 where it was as the step began; host what it rides on;
     R how far it comes off what carries it (along the movement's y, mm); U the movement's y in its parent's frame; last the rise last added to its position; M2M each mesh's nearest mover */
  const MV=[],MVS=new Set(),byId=new Map(),F=new Map(),T=new Map(),P0=new Map(),host=new Map(),R=new Map(),U=new Map(),last=new Map(),W=new Map(),WL=new Map(),M2M=new Map();   /* WL: each mover's rise as last drawn */
  let EX=null;   /* what the Exploded view's offsets (explode(), each frame) set back: the parts and the screws and loose pieces */
  const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  /* the objects an id names: a part's group, or every object carrying the line (hn), not one inside another */
  function find(id){if(byId.has(id))return byId.get(id);const mv=A.mv,out=[];
    if(id[0]==='@'){mv.traverse(o=>{if(o.userData.off!==undefined&&o.userData.partName===id.slice(1))out.push(o);});}
    else{const has=o=>{const h=o.userData.hn;return h===id||Array.isArray(h)&&h.includes(id);};mv.traverse(o=>{if(has(o)){for(let p=o.parent;p&&p!==mv;p=p.parent)if(has(p))return;out.push(o);}});}
    byId.set(id,out);return out;}
  /* where a piece comes off other than the way the side facing up and the Exploded view send it: mm from what carries it along the movement's y (+ toward the dial
     side). The winding stop unscrews from the barrel bridge's underside (KLUwI2UUCMQ 12:58-13:04); the barrel's cap is on its dial side, and the arbor (its
     core wider than the barrel's end holes), the mainspring and its brace come out that way once it is off (Ops. 35-37; KLUwI2UUCMQ 15:16-17:04), and the cap's
     screws' heads are on that side (further out than the cap, which they go on with); the balance lower endstone cap comes out of the lower bridge's underside. The seal ring and its spring, built in the dust seal's group (they rise with it in the Exploded view), stand on the barrel bridge (KLUwI2UUCMQ 12:34-12:38.5), so it carries them here.
     The fusee goes well clear (90 mm), so what comes off it on the bench (Ops. 39-45) lands above the movement, not in the upper train bridge still on it */
  const UP={'42099':6,'42169':6,'42170':8,'42038':8,'42037':8,'37023':8,'42159.bl':4,'J.ble':4,'42021':-90};
  function setup(){if(MV.length)return;const mv=A.mv,ids=new Set(Object.keys(HOST));for(const q of[DIS,RE])for(const s of q)for(const k of['out','in','ls'])for(const id of s[k]||[])ids.add(id);
    for(const id of ids)for(const o of find(id)){if(!MVS.has(o)){MV.push(o);MVS.add(o);}o.userData.ovId=id;}
    EX=new Set([...Object.values(mv.userData.parts),...mv.userData.lifted]);
    /* each mover's host: its id's (HOST), else the nearest mover above it in the scene; a host given as an id is its first object */
    for(const o of MV){const h=HOST[o.userData.ovId];let hh=null;if(h===0)hh=0;else if(h!=null)hh=find(h)[0]||null;else for(let p=o.parent;p&&p!==mv;p=p.parent)if(MVS.has(p)){hh=p;break;}host.set(o,hh);F.set(o,0);T.set(o,0);last.set(o,0);}
    /* each one's rise in the Exploded view, measured: where it stands at full spread against where it stands assembled (a part turned over inside another moves
       the other way); and the movement's y in its parent's frame, for moving it there */
    const at=o=>mv.worldToLocal(o.getWorldPosition(new THREE.Vector3())).y,q=new THREE.Quaternion(),qm=new THREE.Quaternion();
    mv.userData.explode(0);mv.updateMatrixWorld(true);const y0=new Map(MV.map(o=>[o,at(o)]));mv.getWorldQuaternion(qm);
    for(const o of MV){o.parent.getWorldQuaternion(q);U.set(o,new THREE.Vector3(0,1,0).applyQuaternion(qm).applyQuaternion(q.invert()));}
    mv.userData.explode(1);mv.updateMatrixWorld(true);const r1=new Map(MV.map(o=>[o,at(o)-y0.get(o)]));mv.userData.explode(0);mv.updateMatrixWorld(true);
    /* where each comes off: as far past what carries it as UP says; else as far as that view sets them apart; else, where that view leaves it on what carries it,
       away from the side facing up: half the least lift of the screws that come out of it the same way in the same operation (so it never passes their heads),
       else 6 mm */
    const side=new Map(),mates=new Map();for(const q2 of[DIS,RE])for(const s of q2){const os=[...(s.out||[]),...(s.in||[])].flatMap(find);for(const o of os){if(!side.has(o))side.set(o,s.sd);if(!mates.has(o))mates.set(o,os);}}
    const hr=o=>{const h=host.get(o);return h?r1.get(h):0;};
    for(const o of MV){const r=r1.get(o)-hr(o),id=o.userData.ovId,sg=side.get(o)==='d'?1:-1;
      if(UP[id]!=null)R.set(o,UP[id]);
      else if(Math.abs(r)<0.5){const sc=(mates.get(o)||[]).filter(x=>x!==o&&host.get(x)===host.get(o)&&(r1.get(x)-hr(x))*sg>=0.5).map(x=>Math.abs(r1.get(x)-hr(x)));R.set(o,sg*(sc.length?Math.min(...sc)*0.45:6));}
      else R.set(o,r);}
    mv.traverse(m=>{if(!m.isMesh)return;for(let p=m;p&&p!==mv;p=p.parent)if(MVS.has(p)){M2M.set(m,p);return;}});}
  /* the state after step k: each mover in (0), off (1) or loosened (0.2); a disassembly starts with all in, a reassembly with all it puts in off */
  function stateAt(q,k){const S=new Map(),st=SEQ[q];for(const o of MV)S.set(o,0);
    if(q==='r')for(const s of st)for(const id of s.in||[])for(const o of find(id))S.set(o,1);
    for(let j=0;j<=k;j++){const s=st[j];for(const id of s.out||[])for(const o of find(id))S.set(o,1);for(const id of s.in||[])for(const o of find(id))S.set(o,0);for(const id of s.ls||[])for(const o of find(id))S.set(o,0.2);}
    return S;}
  /* what step k puts away: off before it and after it, and neither moved, worked on nor carrying what is (the cleaning tray holds what is done with) */
  function away(q,k){const a=stateAt(q,k-1),b=stateAt(q,k),s=SEQ[q][k],inv=new Set();
    const pres=(S,o)=>S.get(o)<1&&(host.get(o)?pres(S,host.get(o)):true);
    for(const id of[...(s.out||[]),...(s.in||[]),...(s.ls||[]),...(s.oi||[]),...(s.fc||[])])for(let o of find(id)){for(;o;o=host.get(o)){if(!MVS.has(o))break;inv.add(o);}}
    return new Set(MV.filter(o=>!inv.has(o)&&!pres(a,o)&&!pres(b,o)));}
  /* each mover's rise: its host's, and the share f of how far it comes off its host, so a piece and what carries it moving in one operation go in straight lines; then moved there along the movement's y in its parent, less what the movers above it in the scene have risen. The Exploded
     view's offsets have just set the parts' and screws' y back (each frame), so only what was added across it is taken off */
  const rises=f=>{W.clear();const wr=o=>{if(W.has(o))return W.get(o);const h=host.get(o),w=(h?wr(h):0)+R.get(o)*f.get(o);W.set(o,w);return w;};for(const o of MV)wr(o);return W;};
  function pose(){rises(F);
    for(const o of MV){let up=0;for(let p=o.parent;p&&p!==A.mv;p=p.parent)if(MVS.has(p)){up=W.get(p);break;}const d=W.get(o)-up,l=last.get(o),u=U.get(o);
      if(EX.has(o)){o.position.x+=u.x*(d-l);o.position.z+=u.z*(d-l);o.position.y+=u.y*d;}else o.position.addScaledVector(u,d-l);last.set(o,d);}
    for(const o of MV)WL.set(o,W.get(o));}
  const VIEW={t:{lift:1,flip:1,yaw:-0.62,pitch:0.55},d:{lift:1,flip:0,yaw:0.3,pitch:0.8},c:{lift:0,flip:0,yaw:0.3,pitch:0.9,dist:330},b:{lift:0,flip:0,yaw:0.72,pitch:0.4,dist:640}};
  /* what a step looks at: the parts moving, oiled or named, framed whole where they start (fa) and where they are going (fb): each mesh's box as drawn, taken
     back by its mover's rise as last drawn and moved by its rise at each end */
  function frameOf(s,fa,fb){const ids=[...(s.out||[]),...(s.in||[]),...(s.ls||[]),...(s.oi||[]),...(s.fc||[])],obs=ids.flatMap(find),mv=A.mv;
    const pk=new Set();for(const o of obs)o.traverse(m=>{if(m.isMesh&&(m.userData.pk||m.userData.part))pk.add(m.userData.pk||m.userData.part);});   /* a piece where the page has pieces (PIECES), so a plate's screws light up without the plate */
    if(!obs.length)return{pk:null,c:null,d:0};
    const Wa=new Map(rises(fa)),Wb=new Map(rises(fb));
    mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),b=new THREE.Box3(),bb=new THREE.Box3(),M=new THREE.Matrix4(),v=new THREE.Vector3();
    for(const o of obs)o.traverse(m=>{if(!m.isMesh||!m.geometry||!m.visible&&!m.userData.onlyDrive)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();M.multiplyMatrices(inv,m.matrixWorld);bb.copy(m.geometry.boundingBox).applyMatrix4(M);
      const mo=M2M.get(m),c=mo?WL.get(mo)||0:0;for(const w of[Wa,Wb])b.union(bb.clone().translate(v.set(0,(mo?w.get(mo):0)-c,0)));});
    if(b.isEmpty())return{pk,c:null,d:0};const c=b.getCenter(new THREE.Vector3()),z=b.getSize(new THREE.Vector3());
    return{pk,c,d:clamp(Math.max(z.x,z.y,z.z)*2+40,70,380)};}
  function show(k,jump){const st=SEQ[on];i=clamp(k,0,st.length-1);const s=st[i],S=stateAt(on,i);
    const F0=new Map(F);for(const o of MV){T.set(o,S.get(o));P0.set(o,F.get(o));}prog=0;if(jump){for(const o of MV)F.set(o,S.get(o));prog=1;}
    let bk=0;for(let j=0;j<=i;j++){if(st[j].a==='blk1')bk=1;else if(st[j].a==='blk0')bk=0;}A.blk(bk);if(s.a==='wind')A.wind();   /* the train-blocking screw as the operations so far have left it */
    bz=on==='d'?i>=0:i<102;   /* the bezel: off from the disassembly's first operation, back on with the reassembly's 103rd */
    const aw=away(on,i);HID=new Set();for(const[m,o]of M2M)if(aw.has(o))HID.add(m);
    const v=VIEW[s.sd],f=frameOf(s,jump?S:F0,S);A.focus(f.pk);
    A.cam({lift:v.lift,flip:v.flip,yaw:v.yaw,pitch:v.pitch,dist:v.dist||f.d||235,target:f.c&&v.lift?(c=>()=>A.mv.localToWorld(c.clone()))(f.c):null});
    const n=st.length;$('#oStep').textContent=`${on==='d'?'Disassembly':'Reassembly'}, Op. ${s.op} of ${n}`;$('#oTitle').textContent=s.t;$('#oText').innerHTML=s.x;$('#oMeta').innerHTML=meta(s).join('<br>');
    $('#oSl').max=n;$('#oSl').value=i+1;$('#oSl').setAttribute('aria-valuetext',`Op. ${s.op}: ${s.t}`);$('#oPrev').disabled=i===0;$('#oNext').textContent=i===n-1?'Finish':'Next';A.changed();}
  /* a step's oil, tools, figures and the parts it takes off or puts on (their lines of the parts list), as lines of HTML: the panel's and the build book's */
  function meta(s){const name=id=>{if(id[0]==='@'){const p=A.PARTS[id.slice(1)];return p?p.t:id.slice(1);}const l=MAKERS.find(x=>x.id===id);return l?`${l.no} ${l.name}`:id;},
      tools=(s.tl||[]).map(t=>`No. ${t}, ${TOOLS[t]||'tool'}`),pt=[...(s.out||[]),...(s.in||[]),...(s.ls||[])].map(name);
    return[s.o?`<b>${esc(s.o[0].toUpperCase()+s.o.slice(1))}</b>`:'',tools.length?'Tools: '+tools.map(esc).join('; '):'',s.fg?'Fig'+(s.fg.length>1?'s':'')+'. '+s.fg.join(', '):'',
      pt.length?(s.out&&s.in?'Off and on':s.out?'Off':s.in?'On':'Loosened')+': '+pt.map(esc).join('; '):''].filter(Boolean);}
  function start(q,k=0){if(!SEQ[q])return;A.begin();setup();const fresh=on!==q;on=q;$('#ovhIntro').classList.add('hidden');$('#ovhBody').classList.remove('hidden');show(k,fresh);}
  function end(){if(!on)return;on=null;stopPlay();for(const o of MV){F.set(o,0);T.set(o,0);}pose();bz=false;HID=new Set();$('#ovhIntro').classList.remove('hidden');$('#ovhBody').classList.add('hidden');A.finish();}
  function stopPlay(){clearInterval(play);play=0;const b=$('#oPlay');if(b){b.textContent='Play';b.setAttribute('aria-pressed','false');}}
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  return{TOOLS,DIS,RE,HOST,meta,
    bind(api){A=api;
      $('#ovhDis').addEventListener('click',()=>start('d'));$('#ovhRe').addEventListener('click',()=>start('r'));
      $('#oPrev').addEventListener('click',()=>{stopPlay();show(i-1);});$('#oNext').addEventListener('click',()=>{stopPlay();if(i<SEQ[on].length-1)show(i+1);else end();});
      $('#oSl').addEventListener('input',e=>{stopPlay();const k=+e.target.value-1;show(k,Math.abs(k-i)>1);});   /* a step either way moves its parts; further, the slider goes straight there */$('#oExit').addEventListener('click',end);
      $('#oPlay').addEventListener('click',()=>{if(play){stopPlay();return;}const b=$('#oPlay');b.textContent='Pause';b.setAttribute('aria-pressed','true');play=setInterval(()=>{if(!on||i>=SEQ[on].length-1){stopPlay();return;}show(i+1);},2600);});},
    on:()=>on,bezelOff:()=>!!on&&bz,hides:m=>HID.has(m),
    /* the box hidden while the movement is out of its case, on the work ring or in the dialing ring */
    boxOff:()=>!!on&&'td'.includes(SEQ[on][i].sd),
    /* the hash: ovh=d12 (Op. 12 of the disassembly), ovh=r46 */
    hash:()=>on?on+SEQ[on][i].op:null,
    go(v){const m=/^([dr])(\d+)$/.exec(v||'');if(!m)return false;const k=SEQ[m[1]].findIndex(s=>s.op===+m[2]);if(k<0)return false;start(m[1],k);return true;},
    start,end,
    label:()=>on?`Overhaul, ${on==='d'?'disassembly':'reassembly'} Op. ${SEQ[on][i].op} of ${SEQ[on].length}: ${SEQ[on][i].t}.`:'',
    /* each frame, after the Exploded view's offsets: the step's parts moved together from where they were to where it leaves them, in about a second (at once with
       ?snap or reduced motion), each by the same share, the path tools/overhaul.py checks; its sum is the frame's signature */
    frame(dt,snap){if(!on)return 0;if(prog<1){prog=snap?1:Math.min(1,prog+dt*1.1);const e=prog<1?prog*prog*(3-2*prog):1;for(const o of MV)F.set(o,P0.get(o)+(T.get(o)-P0.get(o))*e);}pose();return prog+i;},
    /* for tools/overhaul-check.js: the movers, and each one's rise s of the way through step k of q (from the state after k-1), as the page moves them */
    check:{movers:()=>{setup();return MV;},rises(q,k,s){setup();const a=stateAt(q,k-1),b=stateAt(q,k),f=new Map();for(const o of MV)f.set(o,a.get(o)+(b.get(o)-a.get(o))*s);const w=rises(f);return MV.map(o=>w.get(o));},
      away:(q,k)=>{setup();const aw=away(q,k);return MV.map(o=>aw.has(o));}}};
})();
