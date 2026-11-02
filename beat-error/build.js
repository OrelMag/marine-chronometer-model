// node build.js [FRAGMENT.html]: page.html with beatcore.js and its font inlined into beat-error.html, one self-contained file (open it, or put
// it on any https host so the browser lets it use the microphone). FRAGMENT gets the same page without the document skeleton
// (for hosts that add their own, as a claude.ai artifact does).
const fs = require('fs'), path = require('path'), here = __dirname;
const core = fs.readFileSync(path.join(here, 'beatcore.js'), 'utf8').replace(/<\/script/gi, '<\\/script');
const tag = '<script id="beatcore" src="beatcore.js"></script>';
let page = fs.readFileSync(path.join(here, 'page.html'), 'utf8');
// the site's own face, vendored (../vendor/fonts, SIL OFL), inlined: the page loads nothing from the network
const font = fs.readFileSync(path.join(here, '..', 'vendor', 'fonts', 'InstrumentSans-normal-400.woff2')).toString('base64');
if (!page.includes('/*FONTFACE*/')) throw new Error('page.html: no /*FONTFACE*/');
page = page.replace('/*FONTFACE*/', '@font-face { font-family: "Instrument Sans"; font-style: normal; font-weight: 400 700; font-display: swap; src: url(data:font/woff2;base64,' + font + ') format("woff2") }');
if (!page.includes(tag)) throw new Error('page.html: no ' + tag);
page = page.replace(tag, () => '<script id="beatcore">\n' + core + '</script>');
const doc = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head>\n<body>\n' + page + '</body>\n</html>\n';
fs.writeFileSync(path.join(here, 'beat-error.html'), doc);
if (process.argv[2]) fs.writeFileSync(process.argv[2], page);
console.log('beat-error.html', doc.length, 'bytes');
