"""How the tools' Chromium draws WebGL: SwiftShader (software, the same on every machine; the default) or this machine's GPU, with MC_GL=gpu in the environment
(ci.py sets it unless --swiftshader). On 16 October 2026 (an AMD RX 7800 XT through ANGLE's D3D11) solids.py, exploded.py and smoke.py --model wempe printed the
same with either, the GPU 1.2-1.8 times as fast; gltf_check.py's export took 92 s against 179, the same nodes, meshes and triangles, its textures' PNGs drawn on the
GPU 0.4 MB smaller (pixels differ, so compare a page's pixels only with pixels drawn the same way).

    import browser
    b=await p.chromium.launch(args=browser.ARGS)"""
import os
SW=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"]
GPU=["--use-angle=default","--enable-gpu","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"]   # SwiftShader still the fallback where there is no GPU
ARGS=GPU if os.environ.get('MC_GL')=='gpu' else SW
if os.environ.get('MC_TRACE'):   # ci.py's trace of what a step reads (citrace/sitecustomize.py): the files every page of the step loads, from Playwright's requests
    try:
        import sitecustomize as _T,urllib.parse,urllib.request
        from playwright.async_api import Browser as _B
        def _watch(c):c.on('request',lambda r:r.url.startswith('file:') and _T.rec('r',urllib.request.url2pathname(urllib.parse.urlparse(r.url).path)))
        def _wrap(f,ctx):
            async def g(self,*a,**k):
                o=await f(self,*a,**k);_watch(ctx(o));return o
            return g
        _B.new_page=_wrap(_B.new_page,lambda pg:pg.context);_B.new_context=_wrap(_B.new_context,lambda c:c)
    except ImportError:pass
