"""Every part in the model against the manual's parts list (Sec. XI, Figs. 106-110): count, fit, drive and jewels (exit code 1 on any failure).

    python bom.py          # check
    python bom.py --md     # check, and write BOM.md at the repository root
    python bom.py --eval "JS"   # run some JS after the page loads first (a planted fault, to prove a check)

The parts list is ../bom.json: one line per catalogue line (its id is the Hamilton number, with a suffix where the number is on several lines), with
what the part does and how it goes into the mechanism, as relations bom-check.js measures on the built meshes (every piece carries its line as
userData.hn, hn() in core.js):
  - counts: the pieces of each line against the list's units per assembly (a range for the balance screws); a tag with no line, a piece tagged twice,
    and a mesh with no line fail;
  - in: the part (a screw's thread, a pivot, a pin, a post, a setting) inside the named part; round: the part's bore round the named part (a wheel on
    its post, a hand on its pipe, a roller on the staff); the gap in its kind's range over at least the kind's length, and nowhere tighter (a twentieth of the
    samples allowed: a ray lying in a face's plane)
    (tap: threaded into a tapped hole; clear: through a clearance hole; run: a pivot in its bearing; free: turning on a post or pipe; press: pressed in);
  - on: resting on the named part (surfaces within 0.02 mm); mesh: centre distance m(z1+z2)/2 within 0.02 mm, the same module, faces overlapping
    0.5 mm or more, and turning in the tooth ratio the other way; endshake: 0.001-0.003 in (Ops. 15, 69, 74);
  - jewels: the manual's fourteen (Sec. II), each seated in its setting, roller or detent;
  - the registry: every Hamilton number in a part card (app.js PARTS[k].sp) is in the list, and every number a card's part holds is on its card.
    The parts' pieces (app.js PIECES): every line a piece lists is in the list, and every number on a piece's card is one of its lines'.
Checks named in a line's 'check' (escapement.js, invariants.py, maintaining.py, fine.py) are that tool's; they must exist. 'bom.py fn: NAME' is one of
bom-fn.js's function checks, run last through the page's own controls at 1× (about 30 s; --no-fn skips them): the locking arm stops the balance at a timing
weight and it doesn't restart by itself, the twist starts it, the train-blocking screw holds the train and lets it go, the shield plate covers the key hole
and opens onto it, the gimbal latch holds the case to the box. A named one not written yet is reported (~~), not failed.
A line's 'dev' lists known deviations from the manual, each with its reason: printed with ~~, not failed."""
import asyncio,json,pathlib,re,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
BOM=json.loads((HERE.parent/'bom.json').read_text(encoding='utf-8'))
JS=(HERE/'bom-check.js').read_text(encoding='utf-8');FNJS=(HERE/'bom-fn.js').read_text(encoding='utf-8')
IN={'tap':(0.4,-0.03,0.35),'clear':(0.1,0.0,9),'run':(0.1,0.003,0.06),'free':(0.2,0.003,0.25),'press':(0.04,-0.03,0.05),'embed':(0.3,-9,-0.01)}   # kind: least length engaged, gap from, gap to (mm)
# press and run in a bevelled hole: at its faces, where it has its size (it is wider inside); embed: a thread or pin across a part drawn without a hole for it
# (the part is an extrusion or a turned solid that can't be holed across: the balance rim, the detent's block and foot, the fusee arbor), so inside its metal
ENDSHAKE=(0.0254,0.0762)
D=[]   # known deviations met (bom.json 'dev'): printed, not failed
def qty_ok(q,n):
    if isinstance(q,list):return q[0]<=n<=q[1]
    if isinstance(q,int):return n==q
    return n==0
ARM="document.querySelector('#stopV button[data-v=\"arm\"]').click()"   # the parts list's balance stop, the locking arm (Fig. 9): the page fits the Navy's Y-arm by default, which the manual doesn't list (its button, so the part's card and numbers are the arm's too)
async def run(evl):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1000,"height":700});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("window.__mv&&!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(ARM);await pg.wait_for_timeout(300)
        if evl:await pg.evaluate(evl)
        res=await pg.evaluate(JS,BOM)
        if '--no-fn' in sys.argv:res['fn']=[]
        else:   # on a fresh page: bom-check.js turns the train and balance through update(), and a held train isn't redrawn from the page's own state
            await pg.reload();await pg.wait_for_function("window.__mv&&!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
            await pg.evaluate(ARM)
            if evl:await pg.evaluate(evl)
            res['fn']=await pg.evaluate(FNJS)
        sp=await pg.evaluate("Object.fromEntries(Object.entries(window.__parts).map(([k,v])=>[k,v.sp||'']))")
        res['pcs']=await pg.evaluate("Object.fromEntries(Object.entries(window.__parts).flatMap(([p,v])=>(v.pcs||[]).map(c=>[p+'.'+c.k,[c.sp||'',c.h]])))")   # the parts' pieces (PIECES, app.js): card, lines
        await b.close()
    return res,sp,errs
def judge(res,sp):
    L={l['id']:l for l in BOM['lines']};F=[];ok=lambda c,m:None if c else F.append(m)
    # counts
    for l in BOM['lines']:
        n=res['counts'].get(l['id'],0)
        if l['kind'] in('part','jewel'):ok(qty_ok(l['qty'],n),f"count {l['id']} ({l['name']}): model {n}, manual {l['qty']}")
        else:ok(n==0,f"count {l['id']}: a {l['kind']} line is tagged {n} times")
    for k in res['counts']:ok(k in L,f"tag {k} has no line in bom.json")
    for k in set(res['doubled']):ok(False,f"{k} tagged inside a piece of the same line")
    for k,n in res['untagged'].items():ok(False,f"{n} mesh(es) of '{k}' belong to no line")
    jw=[l for l in BOM['lines'] if l['kind']=='jewel'];ok(len(jw)==14 and sum(res['counts'].get(l['id'],0) for l in jw)==14,f"jewels: {sum(res['counts'].get(l['id'],0) for l in jw)} in the model, the manual's 14")
    # relations
    D.clear()
    for r in res['rel']:
        tag=f"{r['kind']} {r['id']}#{r['i']} -> {r['tgt']}"+(f" ({r['how']})" if r.get('how') else '')
        dv=[d for d in L[r['id']].get('dev',[]) if d['rel']==[r['kind'],r['tgt']] and r['i'] in d['inst']]
        if dv:D.append(f"{tag}: {dv[0]['why']}");continue   # a known deviation, reported with its reason
        if r.get('err'):F.append(f"{tag}: {r['err']}");continue
        if r['kind'] in('in','round'):
            mn,lo,hi=IN[r['how']];g=[v for v in r.get('g',[]) if v is not None];fit=r.get('step',0)*sum(lo<=v<=hi for v in g);under=sum(v<lo for v in g)
            if r['how']=='embed':fit=max(fit,r.get('embed',0))   # inside the part's metal, found by rays both ways
            r['fit']=round(fit,3);r['under']=under
            ok(fit>=mn and under<=max(1,len(g)//20),f"{tag}: in range over {fit:.2f} mm of {r['len']} (want >= {mn}), gap {lo}..{hi}; {under} samples tighter; least gap {r.get('gabs')}; along it: "+' '.join(f"{k}:{n}{'' if g is None else '/'+str(g)}" for k,n,g in r['path']))
        elif r['kind']=='on':ok(r['d']<=0.02,f"{tag}: {r['d']} mm apart")
        elif r['kind']=='mesh':
            ok(abs(r['d']-r['want'])<=0.02 and abs(r['ma']-r['mb'])<1e-3 and r['ov']>=0.5 and abs(r['ratio']-r['wantRatio'])<=1e-3*abs(r['wantRatio']),
               f"{tag}: centres {r['d']} (want {r['want']}), modules {r['ma']}/{r['mb']}, faces overlap {r['ov']}, ratio {r['ratio']} (want {r['wantRatio']})")
        elif r['kind']=='endshake':
            s=r['dial'][0]+r['train'][0];ok(ENDSHAKE[0]<=s<=ENDSHAKE[1],f"{tag}: endshake {s:.4f} mm (dial way {r['dial'][0]} to {r['dial'][1]}, train way {r['train'][0]} to {r['train'][1]}); want 0.025-0.076")
    # jewels seated
    for j in res['jewels']:
        ids=[k for k,_ in j['by']];top=ids[0] if ids else None
        seated=(j['holder'] in ids) if j['type']=='pallet' else top==j['holder']   # a pallet stone stands out of its slot: its holder among what surrounds it
        ok(seated and (j['gmin'] is None or j['gmin']>=-0.02),f"jewel {j['id']}: set in {j['by']} (want {j['holder']}), gap {j['gmin']}")
    # checks named
    for l in BOM['lines']:
        c=l.get('check')
        if c:t=c.split(':')[0].strip();ok(t=='bom.py fn' or (HERE/t.split()[0]).exists(),f"{l['id']}: check tool {t} not found")
        if c and c.startswith('bom.py fn:') and res['fn']:   # a function check bom-fn.js runs; one not written yet is reported, not failed
            n=c.split(':',1)[1].strip()
            if not any(f[0]==n for f in res['fn']):D.append(f"{l['id']}: function check '{n}' not written yet")
    for n,good,msg in res.get('fn',[]):ok(good,f"fn {n}: {msg}")
    # registry
    nos={l['no'] for l in BOM['lines'] if l.get('no')}
    num=re.compile(r'(?<![\d.])(\d{3,5}A?)(?![\d.])')
    def nums(s):   # the numbers on a card, a range such as 42032-42035 taken whole
        out=num.findall(s)
        for a,b in re.findall(r'(\d{5})\s*[–-]\s*(\d{5})',s):out+=[str(n) for n in range(int(a),int(b)+1)]
        return out
    for k,s in sp.items():
        for m in num.findall(s):ok(m in nos,f"card {k}: {m} is not in the parts list")
        held={l['no'] for l in BOM['lines'] if l.get('part')==k and l['kind'] in('part','jewel') and l.get('no')}
        miss=sorted(h for h in held if h not in nums(s))
        ok(not miss,f"card {k}: holds {', '.join(miss)}, not on its card")
    # the pieces: every line a piece lists is in the parts list, and every number on its card is one of its lines'
    for k,(s,h) in res.get('pcs',{}).items():
        for i in h.split():ok(i in L,f"piece {k}: {i} is not a line of the parts list")
        own={L[i]['no'] for i in h.split() if i in L}
        for m in nums(s):ok(m in own,f"piece {k}: {m} on its card is none of its lines")
    return F
def main():
    evl=None
    if '--eval' in sys.argv:evl=sys.argv[sys.argv.index('--eval')+1]
    res,sp,errs=asyncio.run(run(evl))
    (HERE/'r_bom.json').write_text(json.dumps(res,indent=1),encoding='utf-8')
    F=judge(res,sp)
    for n,good,msg in res.get('fn',[]):print(('ok  ' if good else '!!  ')+f'fn {n}: {msg}')
    for d in D:print('~~ known deviation:',d)
    for f in F:print('!!',f)
    for e in errs:print('page error:',e)
    print(f"{sum(1 for l in BOM['lines'] if l['kind'] in('part','jewel'))} lines, {len(res['rel'])} relations, {len(res['jewels'])} jewels: "+('ok' if not F and not errs else f'{len(F)} failures'))
    if '--md' in sys.argv:
        import bom_md;bom_md.write(BOM,res,F,D,HERE.parents[2]/'BOM.md')
    sys.exit(1 if F or errs else 0)
if __name__=='__main__':main()
