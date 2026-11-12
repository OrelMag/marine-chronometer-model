// wempe_tripping_release.js A [BEAT[,BEAT]] [T]: the Wempe's tripping frame (wempe_tripping.js) round a beat's release, sampled every 20 µs.
// Needs only Node.js.   MC_WREV=build40 node wempe_tripping_release.js 177.3 1,2     (about 10-20 s; reports, never fails; changes no file)
//
// One run of T seconds (default 1.2) started at a swing of A degrees, the version MC_WREV's (last without it); B40_S the drive (default 1), B40_PRE the preload's
// factor, B40_MO other settings of the frame's model (JSON). It prints the run's events, then for each BEAT asked (default 1,2), from 600 µs before its release to
// 4 ms after: the balance's angle, the stone's lift and its rate, the tooth's force on the stone, the discharge stone's on the gold spring, the ride's force (the stone
// on the tooth it let go), whether the detent is on its banking (B), whether the tooth is held, the wheel's place and speed, the tooth's reach under the stone (uS) and
// the impulse stone's force.
//
// This is the trace that showed the fault fixed on 12 November 2026 (63083f45; RESOLVED.md, Escapement): at the release the wheel's speed jumped back by up to
// 11 rad/s within one step. wempe_tripping_beats.js counts how many beats go wrong over many starts.
const path = require('path'), tools = __dirname, A = +process.argv[2], BE = (process.argv[3] || '1,2').split(',').map(Number), T = +(process.argv[4] || 1.2);
if (!(A > 0)) { console.log('usage: [MC_WREV=build40] node wempe_tripping_release.js A_DEGREES [BEAT[,BEAT]] [T]'); process.exit(2); }
if (!process.argv.includes('--model')) process.argv.push('--model', 'wempe');
const TR = require(path.join(tools, 'wempe_tripping.js')), d = Math.PI / 180, trace = [], samp = [];
let next = 0;
const watch = (t, Y, dg, held) => { const th = Y[0] / d; if (th > 5 && th < 40 && Y[1] > 0 && t >= next) { next = t + 2e-5; samp.push([t, th, dg.l, dg.ld, dg.tooth, dg.jew, dg.ride, dg.btn, held ? 1 : 0, Y[2], Y[3], dg.uS, dg.imp]); } };
const M = TR.model({ pre: +(process.env.B40_PRE || 1), ...JSON.parse(process.env.B40_MO || '{}') }), r = TR.run(M, { s: +(process.env.B40_S || 1), A, T, from: T / 2, trace, watch });
console.log(`start ${A}°: swing ${r.A.toFixed(1)}°, ${r.beats} beats, ${r.trips} past, maxL ${(100 * r.maxL).toFixed(1)} %`);
console.log('events:', trace.map(e => `${e[0].toFixed(4)} ${e[1]} ${(+e[2]).toFixed(1)}°`).join('; '));
const rels = trace.filter(e => e[1] === 'release').map(e => e[0]);
for (const b of BE) { const t0 = rels[b - 1]; if (t0 == null) continue;
  console.log(`beat ${b}: µs after release, balance°, lift l, dl, tooth force, jewel force, ride force, banking, held, wheel place, wheel speed, uS, impulse force`);
  let i = 0; for (const x of samp) { const u = (x[0] - t0) * 1e6; if (u > -600 && u < 4000 && (u < 800 ? i % 2 === 0 : i % 10 === 0)) console.log('  ', u.toFixed(0).padStart(5), x[1].toFixed(2).padStart(6), x[2].toExponential(3), x[3].toFixed(2).padStart(7), x[4].toExponential(1).padStart(8), x[5].toExponential(1).padStart(8), x[6].toExponential(1).padStart(8), x[7] > 0 ? 'B' : '.', x[8], x[9].toFixed(5).padStart(9), x[10].toFixed(2).padStart(7), x[11].toExponential(2).padStart(10), x[12].toExponential(1)); if (u > -600) i++; } }
