// Types for the Wempe page's globals that TypeScript can't see (jsconfig.json; not loaded by the page). three.js r128 is vendored without its types: any.
declare const THREE: any;
// The Hamilton's globals that core.js reads lazily, in functions the Wempe doesn't call (its movement.js, mainspring.js and app.js declare them there); the Wempe's own names are kept apart (movement.js builds inside buildWempe).
declare const L: any, DIAL_R: any, SEC_L: any, UDA: any, UD_SWEEP: any, MSHAPE: any;
// The Hamilton's movement.js's checkHoles, which core.js's discGeo calls: the Wempe doesn't call discGeo (KIT.checkHoles is the same function, for when it does).
declare const checkHoles: any;
