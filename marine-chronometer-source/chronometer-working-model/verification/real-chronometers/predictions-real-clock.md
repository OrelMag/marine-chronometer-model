# Predictions before a real Model 21 is recorded

Written 11 October 2026, on `17e9412`, **before any of the user's own recordings was analysed**, so that nothing
is fitted after the fact. The report will say how each fared. Each number was recomputed from the model's own
code on that commit (commands below); none is fitted to a recording.

## 1. The balance's free run-down (`TF` 52 s)

From 248°, the swing at each turning point (`tools/dynamics.js`, `sim`):

| Time after the train stops | 0 s | 15 s | 30 s | 60 s | 90 s | 120 s |
|---|---|---|---|---|---|---|
| Balance free (no escapement touches it) | 247° | 185° | 139° | 78° | 44° | 25° |
| Train held (the wheel locked, the detent still lifted each active swing) | 246° | 170° | 105° | 30° | stopped | |

The handoff's figures (187, 140, 79, 44, 25; held 172, 107, 30) agree within 2°: they were taken a turning
point or two apart.

What the alternative reading of `We1dLNXiBj0`'s start would give, the balance free from 248°:

| `TF` | 15 s | 30 s | 60 s |
|---|---|---|---|
| 52 s (the model) | 185° | 139° | 78° |
| 120 s | 218° | 193° | 150° |
| 160 s | 225° | 205° | 170° |

So 30 s after the train stops tells them apart: about 140° if the model is right, 190-205° if the start was.
Which state applies (free or held) depends on what still touches the balance once the train is stopped; it will
be simulated as found, and `TF` fitted to the measured decay in that state.

## 2. The clicks inside a beat (the corrected escapement)

`dynamics.js` through `verification/real-chronometers/reportdata.js` (`assets/data.json`, `model`):

| Swing | Unlocking → strike | Strike → lock |
|---|---|---|
| 189° | 9.2 ms | 11.9 ms |
| 255° | 7.1 ms | 8.5 ms |
| 289° | 6.4 ms | 7.4 ms |
| 331° | 5.7 ms | 6.4 ms |

The ratio of the two is 0.77-0.89 (the old kinematic model's 0.16). A steady recording should show three clicks
with these spacings at its swing; the strike should be the loudest. With picture and sound synchronised, the
tooth meeting the impulse jewel should fall on the second of the three.

## 3. The running swing

The manual asks for 247.5-270° (1⅜-1½ turns, Sec. IX); the model runs at 255° at 12 h from full wind. The sound
of other movements read 212° and about 295°. The prediction for this movement is therefore only the band: inside
247.5-270° if it is in the condition the manual asks for. Video (one feature), sound and timegrapher should agree
within their uncertainties; if the sound again reads about 6 % above the video, the model's strike-to-lock arc is
the suspect.

## 4. Rate against swing (isochronism)

`tools/escapement.js`, the escapement alone, the hairspring taken as isochronous:

| Swing | Torque | Rate |
|---|---|---|
| 247.5° | 95 % | −0.15 s a day |
| 255° | 100 % | 0 |
| 270° | 111 % | +0.28 s a day |

A real measurement includes the hairspring's own isochronism, which the model doesn't have; so this predicts only
the escapement's share: the rate rising with the swing by about 0.02 s a day per degree near 255°.

## Commands

    node tools/escapement.js                      # isochronism, last lines
    node verification/real-chronometers/reportdata.js   # writes assets/data.json (the intervals)

and, from `tools/`, the run-downs (about 10 s):

    node -e "const{sim}=require('./dynamics.js'),a=(r,t)=>t.map(x=>(r.amps[Math.round(x/0.25)]*180/Math.PI).toFixed(0));
      console.log(a(sim({ideal:true,kick:0,A:248,T:121,from:0}),[0,15,30,60,90,120]));
      console.log(a(sim({mode:'phys',s:0,A:248,T:61,from:0}),[0,15,30,60]));
      for(const TF of[120,160])console.log(TF,a(sim({ideal:true,kick:0,A:248,T:61,from:0,TF}),[15,30,60]))"
