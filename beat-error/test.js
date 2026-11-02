const B = require('./beatcore.js');
const cases = [];
for (const bph of [18000, 21600, 28800, 36000]) for (const be of [0.3, 1.5, 8]) for (const rate of [-30, 25]) cases.push({ bph, be, rate });
cases.push({ bph: 28800, be: 0.6, rate: 5, noise: 0.05, fs: 48000 }, { bph: 28800, be: 2.0, rate: -120, gain: [1, 0.3], noise: 0.03 },
  { bph: 21600, be: 0.0, rate: 0, hum: 1, noise: 0.03 }, { bph: 19800, be: 1.0, rate: 300, dur: 20 }, { bph: 36000, be: 9.5, rate: 10, noise: 0.02 });
let fails = 0;
for (const c of cases) {
  const s = B.synth(Object.assign({ seed: 7 + cases.indexOf(c) }, c));
  const t = Date.now(), r = B.analyze(s.x, s.fs);
  const ok = r.bph === c.bph && Math.abs(r.beatError - c.be) < 0.12 && Math.abs(r.rate - c.rate) < 3 && (r.ok || r.reason === 'uncertain');   // a clean recording must give the right reading (flagged uncertain at worst)
  if (!ok) fails++;
  console.log((ok ? 'ok  ' : 'FAIL'), JSON.stringify(c), '->', r.bph, 'BE', r.beatError?.toFixed(3), 'rate', r.rate?.toFixed(1), 'kept', r.kept + '/' + r.total, 'jit', r.jitter?.toFixed(3), 'snr', r.snr?.toFixed(1), r.reason, (Date.now() - t) + ' ms');
}
// silence and noise only must not give a result
const n = new Float32Array(44100 * 10).map(() => (Math.random() - 0.5) * 0.1), rn = B.analyze(n, 44100);
console.log(rn.ok ? 'FAIL noise gave a reading' : 'ok   noise rejected (' + rn.reason + ')'); if (rn.ok) fails++;
process.exit(fails ? 1 : 0);
