"""The fusee as the page builds it, for mainspring_friction.py's TUP, TDOWN, FUSEE and INT, IN, RHO0 lines (and physics.js's rB, ratio, IN):
read off ?qa (R.fs: MS.Tup and Tdown, Ib(n) and torque(n) every quarter turn, INT, IN, rc at the chain's place fully wound and at its end pin).
python fusee_table.py [--write]  (--write puts them into mainspring_friction.py and physics.js; without it prints them)"""
import os,re,sys,json,pathlib
from playwright.sync_api import sync_playwright
HERE=pathlib.Path(__file__).resolve().parent;sys.path.insert(0,str(HERE));import browser
PAGE=(HERE.parent/'index.html').resolve().as_uri()+'?snap&qa'
with sync_playwright() as pw:
    b=browser.launch(pw) if hasattr(browser,'launch') else pw.chromium.launch();pg=b.new_page();pg.goto(PAGE)
    pg.wait_for_function('window.__mv&&__mv.userData&&__mv.userData.R&&__mv.userData.R.fs',timeout=240000)
    d=pg.evaluate('''(()=>{const F=__mv.userData.R.fs,rows=[];for(let i=0;i*0.25<=F.N-0.25+1e-9;i++){const n=i*0.25;rows.push([n,+F.Ib(n).toFixed(5),+F.torque(n).toFixed(5)]);}
      return {tup:F.MS.Tup,tdn:F.MS.Tdown,INT:F.INT,IN:F.IN,lev0:F.lever(0),rcE:F.rc(F.ME),rows}})()''');b.close()
rho=d['lev0']/d['rcE'];print(json.dumps({k:v for k,v in d.items() if k!='rows'}),'RHO0',rho)
rb=None
if '--write' in sys.argv:
    p=HERE/'mainspring_friction.py';s=p.read_text(encoding='utf-8')
    s=re.sub(r'TUP,TDOWN=[\d.]+,[\d.]+',f"TUP,TDOWN={d['tup']:.4f},{d['tdn']:.5f}",s,count=1)
    rows=d['rows'];txt='FUSEE=['+','.join(f'[{n:g},{ib:g},{tq:g}]'+('\n  ' if (k+1)%5==0 and k+1<len(rows) else '') for k,(n,ib,tq) in enumerate(rows))+']'
    s=re.sub(r'FUSEE=\[\[.*?\]\]\n',lambda m:txt+'\n',s,count=1,flags=re.S)
    s=re.sub(r'INT,IN,RHO0=[\d.]+,TUP-TDOWN,[\d.]+',f"INT,IN,RHO0={d['INT']:.6f},TUP-TDOWN,{rho:.7f}",s,count=1)
    p.write_text(s,encoding='utf-8',newline='\n');print('wrote',p.name)
