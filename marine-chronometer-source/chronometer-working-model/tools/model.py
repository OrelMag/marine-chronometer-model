"""Which model a tool checks: the Hamilton (this folder's page, the default) or another model's page, by --model NAME.

    import model                      # strips --model NAME from sys.argv, so the tool's own arguments read as before
    PAGE=model.PAGE                   # the model's index.html, as a file:// URI with ?snap&qa
    EXPECTED=model.cfg('EXPECTED',{...the Hamilton's table...})   # the model's own table, from its checks.py; the default for the Hamilton

Without --model (or with --model hamilton) every tool runs exactly as before. Another model's tables live in its folder's checks.py (marine-chronometer-source/NAME/checks.py),
its bom.json and audit-expected.json beside its index.html (DIR). A --model not followed by a model's name is left alone (smoke.py's --model, the model without its essay)."""
import importlib.util,pathlib,sys
HERE=pathlib.Path(__file__).resolve().parent
MODELS={'hamilton':HERE.parent,'wempe':HERE.parents[1]/'wempe'}
NAME='hamilton'
if '--model' in sys.argv:
    _i=sys.argv.index('--model')
    if _i+1<len(sys.argv) and sys.argv[_i+1] in MODELS:NAME=sys.argv[_i+1];del sys.argv[_i:_i+2]
DIR=MODELS[NAME]
PAGE=(DIR/'index.html').as_uri()+'?snap&qa'+('' if NAME=='hamilton' else '&start=movement')   # the Wempe opens on its Dial view, the box shut and opening; its tools open it on Movement at once, as before 16 October 2026
HAMILTON=NAME=='hamilton'
_C=None
def cfg(name,default=None):
    """The model's value for name: its checks.py's, or default (the Hamilton's tables are the tools' own, so it is always default there)."""
    global _C
    if HAMILTON:return default
    if _C is None:
        f=DIR/'checks.py';_C={}
        if f.exists():
            s=importlib.util.spec_from_file_location(f'checks_{NAME}',f);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);_C=vars(m)
    return _C.get(name,default)
