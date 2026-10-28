# Handover: a converging measure for the Wempe transmission's mesh peaks

Written 28 October 2026 by session marine-chronometer-1b, which is running the second Wempe drawing check (`PLAN-wempe-drawing-check-2.md`, ledger `WEMPE-DRAWING-LEDGER-2.md`, item O-1). That session stays on the drawing check. This task is yours alone.

## The task

In `marine-chronometer-source/chronometer-working-model/tools/wempe_transmission.js`, replace the peak load that the beat's mesh-strength lines judge with a measure that converges as the integration step is refined. Judge it over the 8 starting phases. Then take the seconds wheel → escape pinion line off "soft" (`~~`), and leave it passing or failing on a figure that means something.

## Why

That line takes the mesh's peak at the moment the seconds wheel takes up the escape pinion again after its backlash. The mesh lets go 1.1-1.2 % of the time, and the escape wheel lands on its stone dead (`dynamics.js`'s `eR` 0). The peak is an impact spike. It moves with the train's starting phase, and it does not settle as the step (`MC_TR_H`, `PAR.hs`) is made finer:

| `MC_TR_H` | main bd869088: start 0 / max over 8 | fixes 41e30bd8: start 0 / max over 8 | verdict main / fixes |
|---|---|---|---|
| 1 (default) | 46.7× / 1089.6× | 229.7× / 1021.0× | ok / fails |
| 0.5 | 38.1× / 257.3× | 55.0× / 278.4× | ok / ok |
| 0.25 | 115.5× / 2326.0× | 115.4× / 8777.2× | fails / fails |

The figures are times the running load. The full outputs are in `runs/` beside this file: `main*.txt` and `tip*.txt` at the three steps, and the `--json` of the default runs.

- **Starts at the default step:**
  - main: 46.7, 56.7, 182.6, 146.4, 1089.6, 76.3, 114.6, 53.9;
  - fixes: 229.7, 1021.0, 56.4, 44.9, 55.3, 112.9, 301.0, 54.0.
  - The median over the 8 starts (95.5× and 84.7×) doesn't settle it either.
- **The other lines are stable.** The fusee, centre and intermediate meshes (1.0-1.1×, 1.1-1.3× and 1.7-2.7×), the cannon pinion (0.65-1.41 against 16.2 mN·m), the maintaining spring and the clicks barely move over starts and steps.
- **Main has failed this line too.** Its own reports failed it twice on 27 October 2026 (start 0 at 90.2×, commits 0cdf391a and bee7a137).

**The owner's choice (28 October 2026):** report the line soft (`~~`) now, so the drawing check's fixes can merge, and fix the measure afterwards as its own task. This handover is that task.

## State when you start

- **The soft marking.** Session marine-chronometer-c9 is putting it in on its branch `claude/wempe-seat-audit`, before merging to main. On that branch `wempe_transmission.js` also judges mesh strength on the median of the 8 starts' peaks, and keeps the starts' range in the line's text. **Start only after that branch is on main.** Check with `git log origin/main --oneline | grep -i seat`, or ask c9 with SendMessage. Then build on its version of the file, not on today's.
- **The record.** The non-convergence is in the Wempe README's **Unresolved** section and in `Review-results.md` ("The transmission's fatigue line on the seconds wheel's mesh"), both on branch `claude/wempe-drawing-fixes-2`. That branch reaches main after c9's. When your fix closes the item, move the README entry to its closed form and update the Review-results section.
- **Where the line lives.** Look in `wempe_transmission.js`, the beat's section, the block that pushes `out.beat.meshes` and judges `STR.mesh[i]`. It is around lines 414-420 at bd869088: `Fd=e.maxL/r1.tq[q.B]*STR.mesh[i].F` (`e.maxL` is the mesh's instantaneous peak torque). `PHS` and `NPH` give the 8 starts; `RUN` and `RS` hold each start's results; each start's peak ratios are in `out.beat.runs[k].pk`.
- **The Hamilton's counterpart.** `hamilton_transmission.js` has the same structure, but its beat runs one start (CLAUDE.md). Check whether its seconds → escape line has the same spike, and report it. Don't change it unless the same fix plainly applies; if it does, tell the owner.

## What to do

1. **Study it first.** Run `wempe_transmission.js` at `MC_TR_H` 1, 0.5, 0.25 and 0.125 on main (with c9's merge in). Keep the meshes' tables with `MC_TR_TABS` so each run is about a minute. For every candidate measure, tabulate start 0 and all 8 starts at each step. Candidates:
   - **(a) The impulse per re-engagement:** the time integral of the contact force over each take-up, with the force a tooth carries derived from it.
   - **(b) The peak filtered at the mesh's contact period:** a low-pass at the tooth contact's natural frequency, from `gearing.js`'s mesh stiffness and the bodies' inertias.
   - **(c) A physical landing:** a restitution or contact damping set from the materials (steel on brass), instead of a dead landing. Check `dynamics.js`'s `eR` and why it is 0 (CLAUDE.md: the Wempe stone lands on the escaping tooth's back with brass's 0.80-0.95; `wempe_tolerances.js` caps the preload at 0.80 g there). Don't change the escapement's own physics without the owner.
   - Anything better the study shows.
2. **Choose the measure** that converges, meaning it changes by less than a few percent from 0.25 to 0.125, and that is a fair input to the teeth's strength line in `wempe_strength.js`. That line is judged against brass's endurance or yield, so a shock load may need its own criterion. Say which criterion and why, citing a source if there is one (as `wempe_strength.js` does).
3. **Put it in the tool.** Judge it over the 8 starts as the beat is (mean or worst, chosen and said). Keep the old instantaneous peak in the printout for comparison. Remove the `~~` once the line is judged on the new measure. Update the comments, the JSON (`out.beat.meshes`, read by the Wempe report's section 13 and by `wempe_letgo_fix.js`), and CLAUDE.md's `wempe_transmission.js` entry.
4. **Rerun what reads it:**
   - `node reportdata.js` in `marine-chronometer-source/wempe/verification/` (or `--only` its transmission part, if there is one), then `python build_report.py` there;
   - `wempe_transmission_trace.js` if the trace data changes, then `wempe_letgo_fix.js`;
   - `python build.py --site-url https://www.marinechronometermodel.com` at the root;
   - `ci.py --only` with the transmission steps, plus `--plan` to see what else reads the file.
5. **Record it.**
   - The Wempe README: the Unresolved entry closed; "Physics: the transmission" brought up to date.
   - `Review-results.md`: the study's table at the four steps.
   - `RESOLVED.md`: an entry under the Wempe's physics heading with the hash.
   - Tell marine-chronometer-1b, with the ledger item O-1 and the commit, so the drawing check's ledger can be closed.

## Rules (from CLAUDE.md and the owner)

- **Branch and worktree.** Work in your own worktree on a branch of your own, for example `claude/wempe-transmission-converge`, made from main after c9's merge. Push it with `-u` after the first commit and after every commit. Never switch branches, stash, reset or clean a shared checkout.
- **Time estimates.** Give an ETA before every run. `wempe_transmission.js` takes about 2 minutes fresh and about a minute with `MC_TR_TABS`; a finer step is slower, roughly 4-5 minutes at 0.25, and 0.125 is untried.
- **Tolerances.** Never widen a tolerance or add an excuse to make a line pass. If the converged figure fails, report it to the owner with what it means.
- **Asking the owner.** Use AskUserQuestion with 2-4 options, the recommended one first. End every turn saying whether the session can be closed.
- **Merging and releasing.** When the checks the change calls for pass (chosen by judgment: the transmission tools, the report, the build), merge into main with `git merge --no-ff`, after fetching first. Main moves under you; other sessions release hourly. Then release (`python build.py --release patch -m "..." --site-url https://www.marinechronometermodel.com`), commit, `python deploy.py`, push with `--follow-tags`, and bring the root README up to date. Release without asking (the owner's rule, 21 October 2026); say what went live.
- **Memory.** Save a short project memory under `~/.claude/projects/e--Marine-Chronometer/memory/` when done.

## Contacts

- **marine-chronometer-1b:** the drawing check. It owns ledger item O-1 and the README/Review-results text on `claude/wempe-drawing-fixes-2`.
- **marine-chronometer-c9:** the seat audit, `seatcheck.py`. It owns the soft marking and the median change in `wempe_transmission.js` on `claude/wempe-seat-audit`.
