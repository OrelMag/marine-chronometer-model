"""drawing_ledger.py: the Wempe's drawings-check ledger (PLAN-wempe-drawing-check.md). Every drawing image in References/wempe/drawings/, its sheet (the transcriptions'
headers), the batch that compares it with the model (or why none does), and whether that batch's report lists it as reviewed: the reports are
marine-chronometer-source/wempe/drawing-check/batchN.md, each with a "## Sheets reviewed" list of "- 05-08/Wempe_05-08_14.jpg — ..." lines (and "## Sheets not reviewed").
The changes made, sheet by sheet, are read from marine-chronometer-source/wempe/drawing-check/changes.md ("- IMAGES | kind | what | commit": corrected,
open or kept) and listed beside each sheet. Writes WEMPE-DRAWING-LEDGER.md at the root.

    python drawing_ledger.py            # rewrite the ledger
    python drawing_ledger.py --check    # and exit 1 if a sheet has no batch, a reported batch left one of its sheets unreviewed, or a change names no drawing

No browser, under a second."""
import pathlib,re,sys
ROOT=pathlib.Path(__file__).resolve().parents[3];DR=ROOT/'References'/'wempe'/'drawings';TR=ROOT/'References'/'wempe'/'transcriptions'
REP=ROOT/'marine-chronometer-source'/'wempe'/'drawing-check';OUT=ROOT/'WEMPE-DRAWING-LEDGER.md'
BATCH={1:'plates, pillars, movement ring',2:'bridges, bushes, cocks, set-up click',3:'balance, hairspring, stud, rollers, balance jewels',4:'escape wheel, detent, detent block, escape jewels',
  5:'fusee, fusee wheel, cover plate, vorreiber, dust plate',6:'maintaining work, maintaining detent, stop work',7:'barrel, arbor, set-up ratchet, mainspring, chain',8:'going train',
  9:'motion work, hands, dial',10:'case, gimbals, boxes, keys'}
ANKER='the lever (Anker) chronometer\'s, not this model\'s: read to confirm nothing on it is the spring-detent chronometer\'s'
# (pattern on the path under drawings/, batch, note); the first that matches
RULES=[(r'^001-002/Wempe_002\.jpg$',0,ANKER),(r'^001-002/Wempe_001\.jpg$|Wempe_Einheitschronometer\.jpg$',1,'general arrangement: every batch reads it for its parts\' places and heights; batch 1 for the frame'),
  (r'05-08/Wempe_05-08_(01a|01b|02|03a|03b|07|11|32-2)\.jpg$',1,''),(r'05-08/Wempe_05-08_(04|05|06|08|09|10|12|13|14)\.jpg$',2,''),
  (r'05-08/Wempe_05-08_(30|31|32-1|33)\.jpg$',0,ANKER),
  (r'05-03/',3,''),(r'05-04/Wempe_05-04_0[456]\.jpg$',3,''),(r'05-04/Wempe_05-04_2[01]\.jpg$',0,ANKER),(r'05-04/',4,''),
  (r'05-05/Wempe_05-05_1[12]\.jpg$',6,''),(r'05-05/',8,''),
  (r'05-06/Wempe_05-06_(04|09|1[0-4])\.jpg$',6,''),(r'05-06/',5,''),(r'05-07/',7,''),(r'05-02/',9,''),(r'05-01/|51-00/',10,''),
  (r'05-33/',0,'the hand setting (05 33), not built: the lever chronometer BC 1010\'s (README, the owner\'s decision, 18 October 2026)'),
  (r'05-36/',0,'the balance holding device (05 36), not built (the owner\'s decision, 18 October 2026)'),
  (r'05-38/',0,'the electrical seconds contact (38 00), not on this model')]
def sheets():
  t={}
  for f in TR.glob('*.md'):
    for l in f.read_text(encoding='utf-8').splitlines():
      m=re.match(r'^## (.*?) — `([^`]+\.jpg)`',l)
      if m:t[m.group(2)]=m.group(1)
  return t
def reports():
  R={}
  for f in sorted(REP.glob('batch*.md')):
    n=int(re.search(r'batch(\d+)',f.name).group(1));txt=f.read_text(encoding='utf-8');sec=lambda h:(re.search(r'^## '+h+r'\s*$(.*?)(?=^## |\Z)',txt,re.M|re.S) or [None,''])[1]
    R[n]={'done':set(re.findall(r'^- ([\w./-]+\.jpg)',sec('Sheets reviewed'),re.M)),'not':{k:v for k,v in re.findall(r'^- ([\w./-]+\.jpg)\s*[—-]\s*(.*)$',sec('Sheets not reviewed'),re.M)},'file':f.relative_to(ROOT).as_posix()}
  return R
def changes():
  f=REP/'changes.md';C=[]
  if not f.exists():return C
  for l in f.read_text(encoding='utf-8').splitlines():
    m=re.match(r'^- (.+?) \| (corrected|open|kept) \| (.+?) \| (.+)$',l)
    if m:C.append({'imgs':[i.strip() for i in m.group(1).split(';')],'kind':m.group(2),'what':m.group(3),'commit':m.group(4).strip()})
  return C
def main():
  T=sheets();R=reports();CH=changes();imgs=sorted(p.relative_to(DR).as_posix() for p in DR.rglob('*.jpg'));rows=[];bad=[]
  for c in CH:
    for i in c['imgs']:
      if i not in imgs:bad.append(i+': a change names it, not a drawing')
  for i in imgs:
    b,note=next(((b,n) for p,b,n in RULES if re.search(p,i)),(None,''))
    by=[n for n,r in R.items() if i in r['done']];nr=[(n,r['not'][i]) for n,r in R.items() if i in r['not']]
    if b is None:st='NO BATCH';bad.append(i+': no batch')
    elif b==0:st='excluded'+(' (also reviewed by batch %s)'%', '.join(map(str,by)) if by else '')
    elif by:st='reviewed by batch '+', '.join(map(str,by))
    elif b in R:st='NOT REVIEWED'+(': '+nr[0][1] if nr else '');bad.append(i+': batch %d reported without it'%b)
    else:st='waiting for batch %d'%b
    rows.append((i,T.get(i,'(no transcription header)'),b,note,st))
  L=['# The Wempe\'s drawings, each against the model','','Written by `marine-chronometer-source/chronometer-working-model/tools/drawing_ledger.py` (do not edit by hand): every drawing image in `References/wempe/drawings/`, the batch of PLAN-wempe-drawing-check.md that compares it with the built model, and whether that batch\'s report (`marine-chronometer-source/wempe/drawing-check/batchN.md`) lists it under "Sheets reviewed". `--check` fails on a sheet with no batch or one a reported batch left out.','',
    '## Batches','','| # | Parts | Report | Sheets | Reviewed | Corrected | Open |','|---|---|---|---|---|---|---|']
  for n,d in BATCH.items():
    mine=[r for r in rows if r[2]==n];rv=sum(1 for r in mine if r[4].startswith('reviewed'))
    mi={r[0] for r in mine};cn=lambda k:sum(1 for c in CH if c['kind']==k and mi&set(c['imgs']))
    L.append('| %d | %s | %s | %d | %s | %d | %d |'%(n,d,R[n]['file'] if n in R else '(running or to come)',len(mine),'%d of %d'%(rv,len(mine)) if n in R else '—',cn('corrected'),cn('open')))
  ex=sum(1 for r in rows if r[2]==0);L+=['','%d images: %d in batches, %d excluded with a reason, %d without a batch.'%(len(rows),len(rows)-ex-sum(1 for r in rows if r[2] is None),ex,sum(1 for r in rows if r[2] is None)),'',
    '## Every sheet','','| Image | Sheet | Batch | Status | Changes | Note |','|---|---|---|---|---|---|']
  for i,t,b,note,st in rows:
    mc=[c for c in CH if i in c['imgs']];cs='; '.join('%s: %s (%s)'%(c['kind'],c['what'],c['commit']) for c in mc).replace('|','/') or '—'
    L.append('| `%s` | %s | %s | %s | %s | %s |'%(i,t.replace('|','/'),'—' if not b else b,st,cs,note))
  L+=['','## Changes made','','From `marine-chronometer-source/wempe/drawing-check/changes.md`: %d corrected, %d left open, %d kept as recorded departures.'%tuple(sum(1 for c in CH if c['kind']==k) for k in('corrected','open','kept')),'',
    '| Drawings | Kind | What | Commit |','|---|---|---|---|']+['| %s | %s | %s | %s |'%(', '.join('`%s`'%i for i in c['imgs']),c['kind'],c['what'].replace('|','/'),c['commit']) for c in CH]
  extra=sorted({i for r in R.values() for i in r['done']}-set(imgs))
  if extra:L+=['','Listed as reviewed but not in the drawings folder (a misspelt path): '+', '.join('`%s`'%e for e in extra)];bad+=[e+': not a drawing' for e in extra]
  OUT.write_text('\n'.join(L)+'\n',encoding='utf-8',newline='\n');print('wrote',OUT.name,'-',len(rows),'images;',len(bad),'problems')
  for b in bad:print('  ',b)
  if '--check' in sys.argv and bad:sys.exit(1)
main()
