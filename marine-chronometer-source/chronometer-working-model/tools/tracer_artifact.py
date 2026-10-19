"""tracer.html as a claude.ai artifact's page: the tracer for a phone, private to its owner.

    python tracer_artifact.py [OUT]     (default r_tracer_artifact.html in the current directory; under a second)

The Artifact tool wraps the page it publishes in its own <!doctype html><head>…<body> skeleton (charset,
viewport with viewport-fit=cover), so this writes the tracer without its own: the comment, <title> and
<style> first, then the body's content. Published with the capabilities {db, assets, downloads}, the page
lists the frames Claude puts in the artifact's store (frames/ID: the image as an asset, the task, a
mapping JSON or holes JSON as text) and Send to Claude writes traces/ID there, which Claude reads back
(tracer.html's "published on claude.ai" section). The file itself is unchanged and still opens locally.
"""
import pathlib, re, sys

SRC = pathlib.Path(__file__).with_name('tracer.html')
s = SRC.read_text(encoding='utf-8')
title = re.search(r'<title>.*?</title>', s).group(0)
comment = re.search(r'<!--.*?-->', s, re.S).group(0)
style = re.search(r'<style>.*?</style>', s, re.S).group(0)
body = re.search(r'<body>(.*)</body>', s, re.S).group(1)
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'r_tracer_artifact.html')
out.write_bytes('\n'.join([title, comment, style, body.strip(), '']).encode('utf-8'))
print(f'{out}: {out.stat().st_size} bytes')
