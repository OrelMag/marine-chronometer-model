#!/usr/bin/env python3
"""Deploy site/ to the live site, only as a new version.

    python deploy.py           # the checks, then npx wrangler deploy, then tag the commit vM.mm.pp
    python deploy.py --check   # the checks alone: wrangler.jsonc's build command runs this before every `wrangler deploy`

The live page never changes without a new version in CHANGELOG.md. Refused when:
- a rebuild with the live address changes the built copies or site/ (they are stale, or were built without --site-url);
- CHANGELOG.md, the sources, the built copies or the Worker have uncommitted changes (what goes live must be a commit);
- the live page's version is newer than this one, or the same with a different page: make a release first,
  python build.py --release patch|minor|major -m "what changed" --site-url https://www.marinechronometermodel.com, and commit it;
- the version's tag already marks another commit;
- the live page can't be read (no network): its version can't be compared.
The same version with the same page passes (redeploying the Worker or wrangler.jsonc only), and is not tagged again.
"""
import argparse,pathlib,re,subprocess,sys,urllib.request
ROOT=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT))
import changelog
URL='https://www.marinechronometermodel.com'
PAGE=ROOT/'site/index.html'
TRACKED=['CHANGELOG.md','changelog.py','build.py','inline.py','worker.js','wrangler.jsonc','chronometer-working-model.html','site','site-assets','vendor','marine-chronometer-source']

def git(*a):return subprocess.run(['git',*a],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
def refuse(why):sys.exit('deploy refused: '+why)
def ver(html):
    m=re.search(r'"softwareVersion":"(\d+)\.(\d\d)\.(\d\d)"',html)
    return tuple(map(int,m.groups())) if m else (0,0,0)   # pages from before 1.05.00 carry no version

def live():
    try:
        with urllib.request.urlopen(urllib.request.Request(URL+'/',headers={'User-Agent':'deploy.py','Cache-Control':'no-cache'}),timeout=30) as r:return r.read()
    except Exception as e:refuse(f"can't read the live page ({e}), so its version can't be compared")

def check():
    """Returns (version, whether it is a new release)."""
    r=subprocess.run([sys.executable,str(ROOT/'build.py'),'--site-url',URL],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
    if r.returncode:refuse('the build failed:\n'+r.stdout+r.stderr)
    dirty=git('status','--porcelain','--untracked-files=no','--',*TRACKED).stdout.rstrip()
    if dirty:refuse('uncommitted changes (a rebuild with the live address included):\n'+dirty+'\ncommit them first: what goes live must be a commit')
    mine=PAGE.read_bytes();v=ver(mine.decode('utf-8'));top=changelog.read()[0][0]
    if v!=top:refuse(f'site/index.html is {changelog.fmt(v)} but CHANGELOG.md is at {changelog.fmt(top)}')
    theirs=live();lv=ver(theirs.decode('utf-8','replace'))
    if lv>v:refuse(f'the live site is {changelog.fmt(lv)}, newer than this {changelog.fmt(v)}')
    if lv==v and theirs!=mine:refuse(f'{changelog.fmt(v)} is already live with a different page. Make a release first:\n'
        f'  python build.py --release patch -m "what changed" --site-url {URL}\nthen commit CHANGELOG.md and the builds')
    new=lv<v
    if new:
        t=git('rev-parse','-q','--verify',f'refs/tags/v{changelog.fmt(v)}^{{commit}}').stdout.strip()
        if t and t!=git('rev-parse','HEAD').stdout.strip():refuse(f'tag v{changelog.fmt(v)} already marks {t[:7]}, not this commit: release a new version')
    print(f'deploy check: {changelog.fmt(v)}'+(f', live {changelog.fmt(lv)}: a new release' if new else ': already live with the same page (Worker or settings only)'))
    return changelog.fmt(v),new

def main():
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check',action='store_true',help='run the checks only (what wrangler.jsonc runs before a deploy)')
    a=ap.parse_args()
    v,new=check()
    if a.check:return
    if subprocess.run('npx wrangler deploy',cwd=ROOT,shell=True).returncode:sys.exit('wrangler deploy failed')
    if new and not git('rev-parse','-q','--verify',f'refs/tags/v{v}').stdout.strip():
        git('tag','-a',f'v{v}','-m',f'Release {v}');print(f'tagged v{v}: push it with git push origin main --follow-tags')

if __name__=='__main__':main()
