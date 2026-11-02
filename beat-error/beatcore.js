// Beat error from a recording of a ticking watch. Pure functions, no DOM: analyze(samples, fs, opts) and synth(o).
// Method: band-pass 1.5-10 kHz, envelope at ~8 kHz; the beat rate from the envelope's autocorrelation scored over the standard rates;
// beats tracked, each placed on its parity's template by cross-correlation; ticks and tocks fitted as two lines of one shared period;
// each parity's beats folded on its line, and the onset (first sub-click) found on the folded level curve by the rise rule of
// tools/acoustic.py (the level DLO dB over its own highest 3 to 0.3 ms before, on a rise reaching DHI). Beat error = |d - P/2| where
// d is tick onset to tock onset and P the full period (tick to tick): half the difference of the two intervals.
var BEAT = (function () {
  var RATES = [14400, 18000, 19800, 21600, 25200, 28800, 36000, 43200];
  var DLO = 2, DHI = 4;

  function biquad(x, fs, f, type) {
    var w = 2 * Math.PI * f / fs, c = Math.cos(w), s = Math.sin(w), al = s / (2 * Math.SQRT1_2), b0, b1, b2;
    if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; } else { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    var a0 = 1 + al, a1 = -2 * c, a2 = 1 - al; b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
    var y = new Float32Array(x.length), x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (var i = 0; i < x.length; i++) { var v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v; }
    return y;
  }
  function onePoleZP(e, fe, fc) {   // zero-phase one-pole smoothing (forward then back)
    var a = Math.exp(-2 * Math.PI * fc / fe), y = new Float32Array(e.length), v = e[0];
    for (var i = 0; i < e.length; i++) { v = a * v + (1 - a) * e[i]; y[i] = v; }
    v = y[y.length - 1]; for (i = y.length - 1; i >= 0; i--) { v = a * v + (1 - a) * y[i]; y[i] = v; }
    return y;
  }
  function envelope(x, fs) {
    var y = biquad(biquad(x, fs, 1500, 'hp'), fs, 1500, 'hp');
    if (fs > 24000) y = biquad(biquad(y, fs, 10000, 'lp'), fs, 10000, 'lp');
    var D = Math.max(1, Math.round(fs / 8000)), n = Math.floor(y.length / D), e = new Float32Array(n);
    for (var i = 0; i < n; i++) { var s = 0; for (var k = 0; k < D; k++) s += Math.abs(y[i * D + k]); e[i] = s / D; }
    return { e: onePoleZP(e, fs / D, 3000), fe: fs / D };
  }
  function median(a) { var b = Array.prototype.slice.call(a).sort(function (p, q) { return p - q; }); var n = b.length; return n ? (n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2) : NaN; }
  function pct(a, p) { var b = Array.prototype.slice.call(a).sort(function (u, v) { return u - v; }); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; }
  function at(e, t) { var i = Math.floor(t), f = t - i; if (i < 0 || i + 1 >= e.length) return 0; return e[i] * (1 - f) + e[i + 1] * f; }
  function parab(ym, y0, yp) { var d = ym - 2 * y0 + yp; return d < 0 ? 0.5 * (ym - yp) / d : 0; }

  function chooseRate(e, fe, force) {
    var D = Math.max(1, Math.round(fe / 1000)), n = Math.floor(e.length / D), z = new Float32Array(n), m = 0, i, k;
    for (i = 0; i < n; i++) { var s = 0; for (k = 0; k < D; k++) s += e[i * D + k]; z[i] = s / D; m += z[i]; }
    m /= n; for (i = 0; i < n; i++) z[i] -= m;
    var f1 = fe / D, L = Math.min(n - 1, Math.ceil(0.62 * f1)), ac = new Float32Array(L + 1);
    for (var l = 0; l <= L; l++) { var s2 = 0; for (i = 0; i + l < n; i++) s2 += z[i] * z[i + l]; ac[l] = s2 / (n - l); }
    var a0 = ac[0] || 1; for (l = 0; l <= L; l++) ac[l] /= a0;
    function mx(lag, fr, ab) { var w = Math.max(2, Math.ceil((lag * fr + (ab || 0)) * f1)), c = Math.round(lag * f1), b = -1; for (var q = c - w; q <= c + w; q++) if (q > 0 && q <= L) b = Math.max(b, ac[q]); return b; }
    var best = null, scores = [];
    RATES.forEach(function (bph) {
      var T = 3600 / bph, sc = mx(2 * T, 0.008) + 0.5 * mx(T, 0.03, 0.012) - 0.8 * mx(T / 2, 0.03, 0.012)   // T and T/2 widened by 12 ms: a beat error splits their peaks by twice itself;
      scores.push({ bph: bph, score: sc });
      if ((force ? bph === force : true) && (!best || sc > best.score)) best = { bph: bph, score: sc };
    });
    return { bph: best.bph, score: best.score, scores: scores };
  }

  function analyze(x, fs, opts) {
    opts = opts || {};
    var r = analyzeAt(x, fs, opts);
    // an uneven or unequal tick and tock score well at half the rate: try double the rate, and keep it when both its parities
    // carry sound (at a true slow beat every other one of them is silence)
    if (!opts.bph && r.bph && RATES.indexOf(2 * r.bph) >= 0) {
      var r2 = analyzeAt(x, fs, { bph: 2 * r.bph });
      if (r2.profiles && r2.reason !== 'weak') return r2;   // a clean fit at double the rate (weak includes parities collapsed onto one beat train)
    }
    return r;
  }
  function analyzeAt(x, fs, opts) {
    var E = envelope(x, fs), e = E.e, fe = E.fe, ms = fe / 1000;
    if (e.length < fe * 3) return { ok: false, reason: 'short' };
    var rc = chooseRate(e, fe, opts.bph), bph = rc.bph, Pn = 7200 / bph;
    // the full period, near 2T, from the fine envelope's autocorrelation
    var mean = 0, i, j; for (i = 0; i < e.length; i++) mean += e[i]; mean /= e.length;
    var c2 = Pn * fe, lo = Math.floor(c2 * 0.985), hi = Math.ceil(c2 * 1.015), acs = [], bl = lo;
    for (var l = lo; l <= hi; l++) { var s = 0; for (i = 0; i + l < e.length; i++) s += (e[i] - mean) * (e[i + l] - mean); acs.push(s / (e.length - l)); if (acs[l - lo] > acs[bl - lo]) bl = l; }
    var P = (bl + (bl > lo && bl < hi ? parab(acs[bl - lo - 1], acs[bl - lo], acs[bl - lo + 1]) : 0)); // samples
    var h = P / 2;
    // track beats on the envelope's peaks
    function peakIn(a, b) { a = Math.max(1, Math.floor(a)); b = Math.min(e.length - 2, Math.ceil(b)); var k = a; for (var q = a; q <= b; q++) if (e[q] > e[k]) k = q; return { t: k + parab(e[k - 1], e[k], e[k + 1]), v: e[k] }; }
    var start = Math.round(0.15 * fe), p0 = peakIn(start, start + P), T = [p0.t], V = [p0.v], good = [true], recent = [[p0.v], []];
    var p1 = peakIn(p0.t + 0.4 * h, p0.t + 1.6 * h); T.push(p1.t); V.push(p1.v); good.push(true); recent[1].push(p1.v);
    var w = Math.max(2 * ms, 0.06 * P);
    for (j = 2; ; j++) {
      var pred = T[j - 2] + P; if (pred + w + 0.4 * h >= e.length) break;
      var pk = peakIn(pred - w, pred + w), rm = median(recent[j % 2].slice(-12)), g = pk.v > 0.35 * rm;   // each parity against its own level: tick and tock can differ in loudness
      T.push(g ? pk.t : pred); V.push(pk.v); good.push(g); if (g) recent[j % 2].push(pk.v);
      if (g && j >= 4) { var Pl = (T[j] - T[j - 4]) / 2; if (Math.abs(Pl - P) < 0.01 * P) P = 0.9 * P + 0.1 * Pl; h = P / 2; }
    }
    var nb = T.length; if (nb < 12) return { ok: false, reason: 'few', bph: bph };
    // place each beat on its parity's template by cross-correlation (two passes)
    var W0 = Math.round(0.35 * h), S = Math.round(2 * ms);
    function template(par) {
      var rows = []; for (var q = par; q < nb; q += 2) if (good[q]) rows.push(q);
      var tp = new Float32Array(2 * W0 + 1), col = new Float32Array(rows.length);
      for (var k = -W0; k <= W0; k++) { for (var r = 0; r < rows.length; r++) col[r] = at(e, T[rows[r]] + k); tp[k + W0] = median(col); }
      var m2 = 0; for (k = 0; k < tp.length; k++) m2 += tp[k]; m2 /= tp.length; for (k = 0; k < tp.length; k++) tp[k] -= m2;
      return tp;
    }
    var cc = new Float32Array(nb);
    for (var pass = 0; pass < 2; pass++) {
      var tpl = [template(0), template(1)];
      for (j = 0; j < nb; j++) {
        if (T[j] - W0 - S < 1 || T[j] + W0 + S >= e.length - 1) { good[j] = false; continue; }
        var tp = tpl[j % 2], best = -Infinity, bs = 0, r = [];
        for (var sh = -S; sh <= S; sh++) {
          var m3 = 0, k; for (k = -W0; k <= W0; k++) m3 += at(e, T[j] + sh + k); m3 /= tp.length;
          var dot = 0, nn = 0; for (k = -W0; k <= W0; k++) { var v = at(e, T[j] + sh + k) - m3; dot += v * tp[k + W0]; nn += v * v; }
          var c = dot / Math.sqrt(nn + 1e-30); r.push(c); if (c > best) { best = c; bs = sh; }
        }
        var bi = bs + S, fr = bi > 0 && bi < r.length - 1 ? parab(r[bi - 1], r[bi], r[bi + 1]) : 0;
        T[j] += bs + fr; cc[j] = best;
      }
    }
    for (var pp = 0; pp < 2; pp++) {   // each parity against its own: a quiet tock correlates less with its template than a loud tick
      var ccs = []; for (j = pp; j < nb; j += 2) if (good[j]) ccs.push(cc[j]); var ccm = median(ccs);
      for (j = pp; j < nb; j += 2) if (cc[j] < 0.5 * ccm) good[j] = false;
    }
    // two lines, one period: t_j = a_(j%2) + P*floor(j/2)
    var keep = good.slice(), a = [0, 0], res = new Float32Array(nb);
    for (var it = 0; it < 4; it++) {
      var Sn = [0, 0], St = [0, 0], Snn = 0, Snt = 0, cnt = [0, 0];
      for (j = 0; j < nb; j++) if (keep[j]) { var p = j % 2, nn2 = Math.floor(j / 2); cnt[p]++; Sn[p] += nn2; St[p] += T[j]; Snn += nn2 * nn2; Snt += nn2 * T[j]; }
      if (cnt[0] < 5 || cnt[1] < 5) return { ok: false, reason: 'few', bph: bph };
      // minimise over a0,a1,P: normal equations, P from the pooled within-parity regression
      var num = Snt - Sn[0] * St[0] / cnt[0] - Sn[1] * St[1] / cnt[1], den = Snn - Sn[0] * Sn[0] / cnt[0] - Sn[1] * Sn[1] / cnt[1];
      P = num / den; a = [(St[0] - P * Sn[0]) / cnt[0], (St[1] - P * Sn[1]) / cnt[1]];
      var ar = []; for (j = 0; j < nb; j++) { res[j] = T[j] - a[j % 2] - P * Math.floor(j / 2); if (keep[j]) ar.push(Math.abs(res[j])); }
      var mad = median(ar) * 1.4826, lim = Math.max(5 * mad, 0.25 * ms);
      for (j = 0; j < nb; j++) keep[j] = good[j] && Math.abs(res[j]) < lim;
    }
    h = P / 2;
    // fold each parity on its line (the beats sel picks), find the onset on the level curve; then tick against tock
    var F0 = Math.round(0.45 * h);
    function fold(par, sel) {
      var pr = new Float32Array(2 * F0 + 1), nk = 0, k2;
      for (j = par; j < nb; j += 2) if (keep[j] && sel(Math.floor(j / 2))) { var tc = a[par] + P * Math.floor(j / 2); if (tc - F0 < 0 || tc + F0 >= e.length - 1) continue; nk++; for (k2 = -F0; k2 <= F0; k2++) { var ev = at(e, tc + k2); pr[k2 + F0] += ev * ev; } }
      for (k2 = 0; k2 < pr.length; k2++) pr[k2] /= Math.max(1, nk);
      // power folded, the noise's power taken off: a faint sub-click rises out of the floor as more beats are folded (an amplitude
      // envelope's floor never falls). Level in dB over the floor's own scatter
      var fl = pct(pr, 0.3), sc = Math.max(pct(pr, 0.5) - pct(pr, 0.1), 1e-3 * fl, 1e-30), Ld = new Float32Array(pr.length), im = 0;
      for (k2 = 0; k2 < pr.length; k2++) { Ld[k2] = 10 * Math.log10(Math.max(pr[k2] - fl, sc) / sc); if (Ld[k2] > Ld[im]) im = k2; }
      var b0 = Math.round(3 * ms), b1 = Math.max(1, Math.round(0.3 * ms)), Dd = new Float32Array(pr.length).fill(-99);
      for (k2 = b0; k2 < pr.length; k2++) { var mxp = -1e9; for (var q2 = k2 - b0; q2 <= k2 - b1; q2++) mxp = Math.max(mxp, Ld[q2]); Dd[k2] = Ld[k2] - mxp; }
      var found = [], i2 = b0;
      while (i2 < pr.length) {
        if (Dd[i2] >= DLO) {
          var j2 = i2, pk2 = i2; while (j2 < pr.length && Dd[j2] > 0) { if (Dd[j2] > Dd[pk2]) pk2 = j2; j2++; }
          var top = i2; while (top + 1 < pr.length && Ld[top + 1] >= Ld[top]) top++;   // this sub-click's own first peak, never the next one's
          if (Dd[pk2] >= DHI) { var f = Dd[i2 - 1] > -99 ? (DLO - Dd[i2 - 1]) / (Dd[i2] - Dd[i2 - 1]) : 0; found.push({ t: i2 - 1 + f - F0, rise: Dd[pk2], lev: Ld[top], ti: top }); }
          i2 = j2 + 1;
        } else i2++;
      }
      var Lmax = Ld[im], on = null;
      for (var q4 = 0; q4 < found.length; q4++) if (found[q4].lev >= Math.max(4, Lmax - 25) && found[q4].t >= im - F0 - 25 * ms) { on = found[q4]; break; }
      if (!on) on = { t: im - F0, rise: 0, lev: Lmax, ti: im };
      // the onset's time where that sub-click's own rise is 10 dB under its own peak: the same point on a loud and a quiet click
      var g = Ld[on.ti] - 10, q5 = on.ti; while (q5 > 0 && Ld[q5 - 1] > g && on.ti - q5 < 3 * ms) q5--;
      if (q5 > 0 && Ld[q5 - 1] <= g) on = { t: q5 - 1 + (g - Ld[q5 - 1]) / (Ld[q5] - Ld[q5 - 1]) - F0, rise: on.rise, lev: on.lev, ti: on.ti };
      return { L: Ld, peak: Lmax, peakAt: im - F0, n: nk, on: on };
    }
    function measure(sel) {
      var p0 = fold(0, sel), p1 = fold(1, sel);
      // the tick's and tock's level curves matched as patterns (dB: a loudness difference is an offset, removed): every sub-click
      // takes part, so a first sub-click lost in one parity's noise moves it less than it moves the onset
      var X = Math.round(8 * ms), L0 = p0.L, L1 = p1.L, best = -2, bD = 0, rx = [], k2;
      function cl(v) { return Math.max(v, 1); }
      for (var D2 = -X; D2 <= X; D2++) {
        var m0 = 0, m1 = 0, c0 = 0;
        for (k2 = X; k2 < L0.length - X; k2++) { m0 += cl(L0[k2]); m1 += cl(L1[k2 + D2]); c0++; }
        m0 /= c0; m1 /= c0; var sxy = 0, sxx = 0, syy = 0;
        for (k2 = X; k2 < L0.length - X; k2++) { var u = cl(L0[k2]) - m0, v2 = cl(L1[k2 + D2]) - m1; sxy += u * v2; sxx += u * u; syy += v2 * v2; }
        var r2 = sxy / Math.sqrt(sxx * syy + 1e-30); rx.push(r2); if (r2 > best) { best = r2; bD = D2; }
      }
      var bi2 = bD + X; bD += bi2 > 0 && bi2 < rx.length - 1 ? parab(rx[bi2 - 1], rx[bi2], rx[bi2 + 1]) : 0;
      var dOn = (((a[1] + p1.on.t) - (a[0] + p0.on.t)) % P + P) % P, dPat = (((a[1] - a[0] + bD) % P) + P) % P;
      // the onsets (the timegrapher's definition) when they agree with the pattern; else the pattern, flagged uncertain (evenly
      // spaced sub-clicks can fool the pattern too, so neither is trusted alone)
      var agree = Math.abs(dOn - dPat) < 0.6 * ms;
      return { prof: [p0, p1], d: agree ? dOn : dPat, agree: agree, match: best, gap: (dOn - dPat) / ms };
    }
    var M = measure(function () { return true; }), MA = measure(function (n) { return n % 2 === 0; }), MB = measure(function (n) { return n % 2 === 1; });
    var prof = M.prof, d = M.d, be = Math.abs(d - P / 2) / fe * 1000;
    var beA = Math.abs(MA.d - P / 2) / fe * 1000, beB = Math.abs(MB.d - P / 2) / fe * 1000, pm = Math.max(0.05, Math.abs(beA - beB) / 2);   // two halves of the beats, measured apart: their spread is the reading's
    var kept = 0, rr = []; for (j = 0; j < nb; j++) if (keep[j]) { kept++; rr.push(res[j]); }
    var rsd = 0; rr.forEach(function (v) { rsd += v * v; }); rsd = Math.sqrt(rsd / rr.length) / fe * 1000;
    var Ps = P / fe, rate = (Pn / Ps - 1) * 86400, snr = Math.min(prof[0].peak, prof[1].peak);
    var weak = kept < 24 || kept / nb < 0.6 || rsd > 0.6 || snr < 10 || be > 0.2 * Ps * 500;   // a beat error past a fifth of the half-period: the parities collapsed onto one beat train
    // uncertain: the halves disagree, or the onsets and the patterns do (a faint first sub-click in one of them: which of its
    // sub-clicks answers which of the other's is then not certain)
    var why = [pm > 0.25 ? "halves" : "", !M.agree ? "pattern" : ""].join(""); var uncertain = !weak && !!why;
    var beats = []; for (j = 0; j < nb; j++) beats.push({ t: T[j] / fe, par: j % 2, res: res[j] / fe * 1000, keep: keep[j] });
    return {
      ok: !weak && !uncertain, reason: weak ? 'weak' : uncertain ? 'uncertain' : '', method: M.agree ? "onset" : "pattern", why: why, gap: M.gap, match: M.match,
      bph: bph, rateScore: rc.score, beatError: be, pm: pm, rate: rate, period: Ps,
      intervals: [d / fe * 1000, (P - d) / fe * 1000], beats: beats, kept: kept, total: nb, jitter: rsd, snr: snr,
      profiles: prof.map(function (p) { return { L: p.L, dt: 1000 / fe, t0: -F0 * 1000 / fe, onset: p.on.t * 1000 / fe, peakAt: p.peakAt * 1000 / fe, n: p.n }; }),
      seconds: x.length / fs
    };
  }

  // a synthetic watch: each beat three sub-clicks (unlock, impulse, drop), tick and tock voiced differently
  function synth(o) {
    var fs = o.fs || 44100, dur = o.dur || 12, bph = o.bph || 28800, n = Math.floor(fs * dur), x = new Float32Array(n);
    var Pn = 7200 / bph, P = Pn / (1 + (o.rate || 0) / 86400), d = P / 2 + (o.be || 0) / 1000, seed = o.seed || 1;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function gauss() { return Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd()); }
    var shapes = o.shapes || [[[0, 0.25, 5200], [3.5, 1.0, 4300], [6.8, 0.6, 6100]], [[0, 0.2, 5600], [3.3, 0.55, 4100], [7.1, 1.0, 5900]]];
    var gain = o.gain || [1, 0.7], t0 = 0.05 + rnd() * P;
    for (var k = 0; ; k++) {
      var tb = t0 + k * P; if (tb > dur) break;
      for (var par = 0; par < 2; par++) {
        var tt = tb + (par ? d : 0) + (o.jit || 0.05) / 1000 * gauss();
        shapes[par].forEach(function (c) {
          var ts = tt + c[0] / 1000, i0 = Math.round(ts * fs), amp = c[1] * gain[par] * (1 + 0.1 * gauss()), f = c[2], tau = 0.0006;
          for (var i = Math.max(0, i0); i < Math.min(n, i0 + Math.round(fs * 0.004)); i++) { var u = i / fs - ts; if (u < 0) continue; x[i] += amp * Math.exp(-u / tau) * Math.sin(2 * Math.PI * f * u) * (1 - Math.exp(-u / 0.00005)); }
        });
      }
    }
    var nz = o.noise == null ? 0.01 : o.noise, hum = 0;
    for (var i = 0; i < n; i++) { hum = 0.995 * hum + 0.1 * gauss(); x[i] += nz * gauss() + 0.02 * hum * (o.hum || 0); }
    return { x: x, fs: fs, P: P, d: d };
  }
  return { analyze: analyze, synth: synth, RATES: RATES };
})();
if (typeof module !== 'undefined') module.exports = BEAT;
