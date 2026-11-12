// wempe_tripping_beats.js [REV] [T] [OUT.json]: how often a beat of the Wempe's tripping frame (wempe_tripping.js) goes wrong, counted beat by beat.
// Needs only Node.js.   node wempe_tripping_beats.js build40 10     (about 2-6 minutes on 14 processes, MC_PROCS; reports, never fails; changes no file)
//
// REV is a version wempe_load.js knows (last, 6mx, 1943, build, build40; default build40), T the seconds each run lasts (default 10, counted from T/2). 28 runs, each a
// child process: the version's own swing started 16 times in steps of 0.05° (B40_N another count), and 12 drives across the wind (0.954-1.043 of the drive) each at makeEsc's
// swing for it. Every release is followed to its lock: a beat is wrong if a tooth gets past, the escapement unlocks twice, the detent is knocked, the lock comes later than
// 60° of the balance or with the stone lifted over 20 % of its release, or no lock comes before the next release. First beats (the start's transient) are counted apart.
// B40_PRE scales the detent's preload, B40_MO gives wempe_tripping.js's model other settings (JSON).
//
// Written to find the fault fixed on 12 November 2026 (63083f45; RESOLVED.md, Escapement: a held tooth pressed on through the step in which the stone's lift passed lFr):
// on the 1940s build it counted 5 wrong beats of 560 before the fix and none of 560 after, the stone's largest lift 23-25 % in every run (the Wempe README, "The 1940s
// build"). wempe_tripping_release.js traces one beat's release every 20 µs.
const path = require('path'), fs = require('fs'), { spawn } = require('child_process'), tools = __dirname, rev = process.argv[2] || 'build40', T = +(process.argv[3] || 10), OUT = process.argv[4], d = Math.PI / 180;
if (process.env.B40_JOB) {
  if (!process.argv.includes('--model')) process.argv.push('--model', 'wempe');
  const j = JSON.parse(process.env.B40_JOB), TR = require(path.join(tools, 'wempe_tripping.js')), trace = [];
  const r = TR.run(TR.model({ pre: j.pre, ...(j.mo || {}) }), { s: j.s, A: j.A, T, from: T / 2, trace });
  process.stdout.write(JSON.stringify({ A: r.A, beats: r.beats, trips: r.trips, maxL: r.maxL, maxTh: r.maxTh, maxRet: r.maxRet, ev: trace.map(e => [+e[0].toFixed(5), e[1], +(+e[2]).toFixed(2), typeof e[3] === 'number' ? +e[3].toFixed(3) : e[3]]) }) + '\n'); return;
}
const load = require(path.join(tools, 'wempe_load.js')), W = load({ rev }), P = W.WPHYS, E = P.ESC, A0 = E.A / d, jobs = [];
const mo = JSON.parse(process.env.B40_MO || '{}'), pre = +(process.env.B40_PRE || 1), n1 = +(process.env.B40_N || 16);
for (let k = 0; k < n1; k++) jobs.push({ s: 1, A: A0 - 0.4 + 0.05 * k, pre, mo });
for (let k = 0; k < 12; k++) { const s = 0.954 + (1.043 - 0.954) * k / 11; jobs.push({ s: +s.toFixed(4), A: E.ampAt(s) / d, pre, mo }); }
const kid = j => new Promise((res, rej) => { const p = spawn(process.execPath, [__filename, rev, String(T)], { cwd: tools, env: { ...process.env, MC_WREV: rev, B40_JOB: JSON.stringify(j) } }); let o = ''; p.stdout.on('data', x => o += x); p.stderr.on('data', x => process.stderr.write(x)); p.on('close', c => c ? rej(Error('child exited ' + c)) : res(JSON.parse(o.trim().split('\n').pop()))); });
const N = +process.env.MC_PROCS || 14, t0 = Date.now(); let next = 0;
Promise.all([...Array(N)].map(async () => { while (next < jobs.length) { const j = jobs[next++]; try { j.r = await kid(j); } catch (e) { j.err = String(e); } } })).then(() => {
  let first = 0, firstBad = 0, rest = 0, restBad = 0; const bad = [];
  for (const j of jobs) { if (j.err) { console.log('  failed', j.s, j.A, j.err); continue; }
    const ev = j.r.ev, rels = ev.filter(e => e[1] === 'release'); let b = 0;
    for (let i = 0; i < rels.length; i++) { const t0 = rels[i][0], t1 = rels[i + 1] ? rels[i + 1][0] : 1e9, mine = ev.filter(e => e[0] > t0 && e[0] < t1), lock = mine.find(e => e[1] === 'lock');
      const wrong = mine.some(e => e[1] === 'passed' || e[1] === 'twice' || e[1] === 'knocked') || (lock && (lock[2] > 60 || lock[3] > 0.2)) || (!lock && rels[i + 1]);
      if (i === 0) { first++; if (wrong) firstBad++; } else { rest++; if (wrong) restBad++; }
      if (wrong) { b++; bad.push(`  drive ${j.s} start ${j.A.toFixed(2)}°: beat ${i + 1}: ${mine.map(e => `${e[1]} ${e[2]}°${e[1] === 'lock' ? ' (' + (100 * e[3]).toFixed(0) + ' % of release)' : ''}`).join(', ') || 'no lock'}`); } }
    j.bad = b; }
  console.log(`${rev}${Object.keys(mo).length ? ' ' + JSON.stringify(mo) : ''}, preload ${pre}x, ${jobs.length} runs of ${T} s (${((Date.now() - t0) / 1000).toFixed(0)} s): first beats ${firstBad} wrong of ${first}; later beats ${restBad} wrong of ${rest}`);
  console.log(`  the runs' largest held lift: ${jobs.filter(j => j.r).map(j => (100 * j.r.maxL).toFixed(0)).join(' ')} % of the lock; teeth past in all: ${jobs.reduce((a, j) => a + (j.r ? j.r.trips : 0), 0)}`);
  for (const b of bad) console.log(b);
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(jobs));
});
