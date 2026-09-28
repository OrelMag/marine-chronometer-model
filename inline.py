"""Turn an HTML page that loads local files into one self-contained file.

Every <script src="..."> and <link rel="stylesheet" href="..."> that points at a local file is replaced by the file's
contents, and every url(...) inside those stylesheets (the fonts) becomes a data: URI. Remote URLs are left alone, so
anything still loaded from the network shows up in `remote_refs()`.
"""
import base64,mimetypes,pathlib,re

mimetypes.add_type('font/woff2','.woff2')

def _local(ref):
    return not re.match(r'^(?:[a-z]+:)?//|^data:',ref)

def _css(path):
    css=path.read_text(encoding='utf-8')
    def url(m):
        ref=m.group(1).strip('\'"')
        if not _local(ref):return m.group(0)
        f=(path.parent/ref).resolve();mt=mimetypes.guess_type(f.name)[0] or 'application/octet-stream'
        return 'url(data:%s;base64,%s)'%(mt,base64.b64encode(f.read_bytes()).decode())
    return re.sub(r'url\(([^)]+)\)',url,css)

def inline(html,base):
    """html: page text; base: directory its relative paths are resolved from."""
    base=pathlib.Path(base)
    def script(m):
        ref=m.group(1)
        if not _local(ref):return m.group(0)
        js=(base/ref).read_text(encoding='utf-8')
        return '<script>\n'+js.replace('</script','<\\/script')+'\n</script>'
    def style(m):
        ref=m.group(1)
        if not _local(ref):return m.group(0)
        return '<style>\n'+_css((base/ref).resolve())+'</style>'
    html=re.sub(r'<script src="([^"]+)"></script>',script,html)
    html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',style,html)
    return html

def remote_refs(html):
    """Scripts, stylesheets and fonts the page still fetches from the network (hyperlinks are ignored)."""
    return sorted(set(re.findall(r'<(?:script|link)[^>]+(?:src|href)="(https?://[^"]+)"',html)))
