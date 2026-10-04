// Types for the page's globals that TypeScript can't see (jsconfig.json; not loaded by the page). three.js r128 is vendored without its types: any.
declare const THREE: any;
// shared/escapement.js ends with module.exports for Node (tools/escapement.js), so TypeScript reads it as a module; on the page makeEsc is a global.
declare const makeEsc: typeof import('../../shared/escapement.js').makeEsc;
