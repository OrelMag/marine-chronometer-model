# Beat Error Meter

A phone page that listens to a mechanical wristwatch and gives its **beat error**, rate and beat, with no input but one tap.
It is a side tool, not part of the chronometer models.

- `beat-error.html`: the page, one self-contained file (built). Open it in a phone's browser from an `https://` address (or
  `localhost`): browsers only let a page use the microphone from a secure address. Opened as a local file it can still analyse a
  recording.
- `page.html`: the page's source; `beatcore.js`: the analysis (pure functions, no DOM, also runs in Node);
  `node build.js [FRAGMENT.html]` writes `beat-error.html` (and the page without its document skeleton, for hosts that add one).
- `node test.js`: 30 synthetic watches (14400-43200 bph, beat error 0-9.5 ms, rate to ±300 s/d, unequal tick and tock, noise,
  hum, 16-48 kHz) and noise alone; exits 1 if a reading is wrong or noise gives one (about 10 s).
- `node sweep.js`: 384 synthetic watches over noise and loudness balance, tabulated right / wrong / uncertain / no reading (a few
  minutes). Reports, never fails.

## Using it

Tap **Listen** with the watch's case back on the phone's microphone, in a quiet room. It reads every 2 seconds and stops on its
own when three readings agree (0.1 ms, 3 s/d), at most after 30 s. While it listens, a strip shows the last 3 seconds of
what reaches the microphone with each click marked, and says whether it hears steady ticking, scattered clicks or nothing
(then where the microphone is: on most phones the grille on the bottom edge). A recording that gives no reading is told apart
the same way: no ticking in it at all, or ticks too faint to time. `BEAT.clicks` is that detector: clicks 3 times over the
floor and over the level just before them, steady when most gaps are the typical gap (or twice it) and that gap is at least 40 ms. **Analyse a recording** takes a sound file instead (WAV is
best; a phone recorder's compressed files blur the clicks). **Settings** can fix the beat rate if Auto reads a wrong one.

## Method

1. Band-pass 1.5-10 kHz, envelope at about 8 kHz.
2. The beat rate: the envelope's autocorrelation scored at each standard rate (14400 ... 43200 bph) at its full period, its
   beat and half its beat (the last two widened by 12 ms, since a beat error splits those peaks); then double the rate tried
   and kept if its fit is clean, since an uneven or unequal tick and tock score well at half the rate.
3. Beats tracked on the envelope, each placed on its parity's template by cross-correlation; ticks and tocks fitted as two
   lines of one shared period (robust, outliers dropped). The period gives the rate: (nominal / measured − 1) × 86400 s/d.
4. Each parity's beats folded on its line in power, the noise floor's power taken off, so a faint first click rises out of the
   floor as more beats are folded. The onset (first sub-click) by the rise rule of the model's `tools/acoustic.py`, timed where
   that sub-click's own rise is 10 dB under its own first peak, so a loud and a quiet click are timed at the same point.
5. Beat error = |d − P/2|, d tick onset to tock onset, P the full period: half the difference of the two intervals, as a
   timegrapher gives it.
6. Checks: the tick and tock level curves matched as patterns must agree with the onsets within 0.6 ms (else the pattern's
   value is shown, marked **Uncertain**: one parity's first click is likely lost in noise); two halves of the beats measured
   apart give the ± (over 0.25 ms: Uncertain); too few beats, scatter over 0.6 ms, a quiet fold or a beat error past a fifth of
   the half-period give no reading.

## How far it can be trusted

On the synthetic sweep: all 96 clean recordings read right; with some noise 87 of 96 read right (2 wrong, the rest flagged or
refused); with heavy noise and a tock much quieter than its tick, about a quarter are wrong, because a first click lost in the
noise can't be told from the next one. The page says so (Uncertain) in most of those cases but not all, so hold the microphone against the case back and
compare a second reading. The first real recording sent (an iPhone's Voice Memos, 2 November 2026) had no ticks in it at all: no click stood
above the hiss and nothing repeated at any beat rate, most likely the watch away from the bottom-edge microphone or Enhance
Recording on. That is why the live guide exists. Not yet tried on a real recording with ticks.
