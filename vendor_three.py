"""three.js as one classic script.

Since r161 three.js ships ES modules only (the migration guide, r160 -> r161: build/three.js and three.min.js removed), and
since r171 as two files, three.core and three.module. The pages here are classic scripts sharing globals, opened from disk,
and a module can't be loaded from file:// in Chromium, nor run before the classic scripts that follow it. So the two
upstream files are kept byte for byte in vendor/three-rNNN/ (checked against cdnjs's SHA-512 integrity hashes, HASH below)
and this script joins them into vendor/three.rNNN.js: each module's body in a function of its own, its import list a
destructuring of the core's exports, its export list the object returned, the whole assigned to the global THREE as the
old UMD build did. Nothing in the bodies is changed.

    python vendor_three.py            # check the upstream files' hashes and write vendor/three.rNNN.js (and addons)
    python vendor_three.py --check    # exit 1 if a hash is wrong or the written file isn't what this would write
    python vendor_three.py --fetch    # download the upstream files from cdnjs first (the network; then checks and writes)

An addon (examples/jsm, not on cdnjs: taken from the npm tarball, whose sha512 is TARBALL) is wrapped the same way,
its imports from 'three' read off the global: ADDONS below.
"""
import base64,hashlib,pathlib,re,sys,urllib.request

ROOT=pathlib.Path(__file__).resolve().parent
REV='187'
UP=ROOT/'vendor'/f'three-r{REV}'
OUT=ROOT/'vendor'/f'three.r{REV}.js'
CDN=f'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.{REV}.0/'
# cdnjs's SRI hashes (https://api.cdnjs.com/libraries/three.js/0.187.0?fields=sri), read 11 November 2026
HASH={'three.core.min.js':'sha512-hpTczJBHkiQPaMCKS4tghJ3t0ILToAA5sQLnNKk8yT9HHQnYoRODoyJTq6mSPGx1ONaJHxBKAiX3qARH+rqTng==',
      'three.module.min.js':'sha512-F6gJHU01wmqHJCSeajo30HX2Rt2CHvPCaONRYovudSEky46Sr2xqM9YUm4gcrJn0sOLrs3HUb3Y6GTMXK5lMtQ=='}
# the npm tarball three-0.187.0.tgz (registry.npmjs.org's dist.integrity), which the addons' files come from
TARBALL='sha512-Qiu7R+Cmh8CstZsY1uJOSWnVlfo7ZtNLV7mF8Jltk3LB3AtDu9cRZlcnRKkAk8Y4z6KKw35z7Y7Urd7jWY8etA=='
# addons kept in vendor/three-rNNN/ as the tarball has them (their sha256), each written as vendor/NAME.rNNN.js adding its exports to THREE
ADDONS={}

def sri(b):return 'sha512-'+base64.b64encode(hashlib.sha512(b).digest()).decode()

def names(s):
    """'a as B,c' -> [('a','B'),('c','c')]"""
    out=[]
    for p in s.split(','):
        p=p.strip()
        if not p:continue
        m=re.fullmatch(r'([\w$]+)(?:\s+as\s+([\w$]+))?',p)
        if not m:raise SystemExit(f'vendor_three: a name list entry this script does not know: {p!r}')
        out.append((m.group(1),m.group(2) or m.group(1)))
    return out

IMP=re.compile(r'\bimport\s*\{([^}]*)\}\s*from\s*["\']([^"\']+)["\'];?')
REX=re.compile(r'\bexport\s*\{([^}]*)\}\s*from\s*["\']([^"\']+)["\'];?')
EXP=re.compile(r'\bexport\s*\{([^}]*)\}\s*;?')

def split(js,what,froms=()):
    """A module's text as (licence, imports [(from, names)], re-exports [(from, names)], body, exports). It must have the
    shape three's builds have: imports and re-exports first, one export list last, and no other import or export."""
    lic=re.match(r'\s*/\*\*.*?\*/\s*',js,re.S);head=lic.group(0) if lic else '';js=js[len(head):]
    imps=[];rex=[]
    while True:
        m=IMP.match(js) or REX.match(js)
        if not m:break
        (imps if m.re is IMP else rex).append((m.group(2),names(m.group(1))));js=js[m.end():].lstrip()
    ms=list(EXP.finditer(js))
    if len(ms)!=1 or js[ms[0].end():].strip():raise SystemExit(f'vendor_three: {what}: expected one export list, at the end (found {len(ms)})')
    body=js[:ms[0].start()]
    if re.search(r'\b(?:import|export)\s*[{*"\']',body) or re.search(r'\bimport\s*\(|\bimport\.meta\b',body):raise SystemExit(f'vendor_three: {what}: an import or export inside the body')
    for f,_ in imps+rex:
        if f not in froms:raise SystemExit(f'vendor_three: {what} imports from {f!r}, which this script does not provide')
    return head,imps,rex,body,names(ms[0].group(1))

def obj(ns):return '{'+','.join(e if a==e else f'{e}:{a}' for a,e in ns)+'}'
def des(ns,src):return 'const{'+','.join(a if a==l else f'{a}:{l}' for a,l in ns)+'}='+src+';'

def build():
    for f,h in HASH.items():
        b=(UP/f).read_bytes()
        if sri(b)!=h:raise SystemExit(f'vendor_three: vendor/three-r{REV}/{f} is not the file cdnjs publishes ({sri(b)})')
    core=(UP/'three.core.min.js').read_text(encoding='utf-8');mod=(UP/'three.module.min.js').read_text(encoding='utf-8')
    lic,i0,r0,cb,ce=split(core,'three.core.min.js')
    if i0 or r0:raise SystemExit('vendor_three: three.core imports something')
    _,i1,r1,mb,me=split(mod,'three.module.min.js',('./three.core.js','./three.core.min.js'))   # cdnjs's minified module still names ./three.core.js
    js=(lic.strip()+f'\n/* three.js r{REV} as one classic script, the global THREE: written by vendor_three.py from vendor/three-r{REV}/three.core.min.js and\n'
        f'   three.module.min.js (cdnjs, their SHA-512 hashes in vendor_three.py), each module\'s body unchanged in a function of its own. Do not edit. */\n'
        '(function(THREE_GLOBAL){"use strict";\nconst THREE_CORE=(function(){\n'+cb.rstrip()+'\nreturn'+obj(ce)+';})();\n'
        'const THREE_ALL=(function(){\n'+''.join(des(n,'THREE_CORE') for _,n in i1)+'\n'+mb.rstrip()+'\nreturn Object.assign('+','.join(['{}']+['(({'+','.join(a if a==e else f'{a}:{e}' for a,e in n)+'})=>('+obj([(e,e) for _,e in n])+'))(THREE_CORE)' for _,n in r1]+[obj(me)])+');})();\n'
        'THREE_GLOBAL.THREE=THREE_ALL;})(typeof globalThis!=="undefined"?globalThis:self);\n')
    out={OUT:js}
    for name,(src,sha) in ADDONS.items():
        b=(UP/src).read_bytes()
        if hashlib.sha256(b).hexdigest()!=sha:raise SystemExit(f'vendor_three: vendor/three-r{REV}/{src} is not the tarball\'s file')
        al,ai,ar,ab,ae=split(b.decode('utf-8'),src,('three',))
        if ar:raise SystemExit(f'vendor_three: {src} re-exports')
        out[ROOT/'vendor'/f'{name}.r{REV}.js']=(f'/* three.js r{REV}\'s examples/jsm/{src} as a classic script adding to the global THREE: written by vendor_three.py, the body unchanged. MIT, three.LICENSE.txt. Do not edit. */\n'
            '(function(){"use strict";\n'+''.join(des(n,'THREE') for _,n in ai)+'\n'+ab.rstrip()+'\nObject.assign(THREE,'+obj(ae)+');})();\n')
    return out

def main():
    if '--fetch' in sys.argv:
        UP.mkdir(parents=True,exist_ok=True)
        for f in HASH:(UP/f).write_bytes(urllib.request.urlopen(urllib.request.Request(CDN+f,headers={'User-Agent':'vendor_three'})).read())
    out=build()
    if '--check' in sys.argv:
        bad=[p.name for p,js in out.items() if not p.exists() or p.read_bytes()!=js.encode('utf-8')]
        if bad:sys.exit(f'vendor_three: stale: {", ".join(bad)} (run python vendor_three.py)')
        print(f'vendor_three: three.js r{REV}: the upstream files are cdnjs\'s and {", ".join(p.name for p in out)} is what they give');return
    for p,js in out.items():
        p.write_bytes(js.encode('utf-8'));print(f'wrote vendor/{p.name}: {len(js.encode())/1024:.0f} KB')

if __name__=='__main__':main()
