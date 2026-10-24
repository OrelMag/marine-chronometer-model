// The Wempe page's dial printing as vector paths (Node.js, no browser): dial.js's own face(K, d) run in a vm context on a canvas that records instead of
// drawing, every call put back into millimetres on the dial (dial.js's P(): x right, z down, the centre arbor at 0, 0). dialsvg.py reads it and writes the SVGs.
//   node dialsvg.js wempe|lange|kirov      # JSON on stdout: {DR, ops: [{fill, rule, stroke (mm, round joins) or 0, d: [[cmd, ...], ...]}]} in paint order
// Path commands: ['M', x, z], ['L', x, z], ['A', cx, cz, r, a0, a1, ccw] (the canvas's arc: radians from +x toward +z, ccw its anticlockwise flag), ['Z'].
// Loads js/dims.js (WD), the three traced faces (dialface*.js) and js/dial.js; THREE, KIT and WTRAIN are empty (only build() needs them, never called here).
const fs=require('fs'),path=require('path'),vm=require('vm');
const JS=path.join(__dirname,'..','..','wempe','js'),d=process.argv[2]||'wempe';
if(!['wempe','lange','kirov'].includes(d)){console.error('dial: wempe, lange or kirov');process.exit(2);}
let OPS=[],T=[1,0,0,1,0,0];   /* the context's transform (scale only: face() calls x.scale(K, K)) */
class Path2D{constructor(){this.d=[];this.open=false;}
  moveTo(x,y){this.d.push(['M',x,y]);this.open=true;}
  lineTo(x,y){this.d.push([this.open?'L':'M',x,y]);this.open=true;}
  arc(x,y,r,a0,a1,ccw=false){const sx=x+r*Math.cos(a0),sy=y+r*Math.sin(a0);this.d.push([this.open?'L':'M',sx,sy],['A',x,y,r,a0,a1,!!ccw]);this.open=true;}
  closePath(){this.d.push(['Z']);this.open=false;}}
function ctx2d(){let P=new Path2D();const st={fillStyle:'#000',strokeStyle:'#000',lineWidth:1,lineJoin:'miter'};
  /* canvas px (after the transform) to mm: S px over the dial's 2 DR, the centre at S/2 */
  const S=2048,DR=WDIAL.DR,k=S/(2*DR),u=v=>(v-S/2)/k,mm=c=>c.map((v,i)=>typeof v!=='number'?v:c[0]==='A'&&i===3?v/k:c[0]==='A'&&i>3?v:u(v));
  const rec=(p,o)=>OPS.push({...o,d:p.d.map(mm)});
  return Object.assign(st,{scale(a,b){T=[a,0,0,b,0,0];},fillRect(x,y,w,h){rec({d:[['M',x,y],['L',x+w,y],['L',x+w,y+h],['L',x,y+h],['Z']]},{fill:st.fillStyle,rule:'nonzero',stroke:0,rect:1});},
    beginPath(){P=new Path2D();},moveTo:(x,y)=>P.moveTo(x,y),lineTo:(x,y)=>P.lineTo(x,y),arc:(...a)=>P.arc(...a),closePath:()=>P.closePath(),
    fill(p,rule){if(!(p instanceof Path2D)){rule=p;p=P;}rec(p,{fill:st.fillStyle,rule:rule||'nonzero',stroke:0});},
    stroke(){if(st.lineJoin!=='round')throw Error('only round joins are recorded');const n=OPS.length-1,o=OPS[n];   /* face() strokes the path it has just filled */
      const w=st.lineWidth/k;if(o&&o.fill===st.strokeStyle&&JSON.stringify(o.d)===JSON.stringify(P.d.map(mm)))o.stroke=w;else rec(P,{fill:0,stroke:w,color:st.strokeStyle});}});}
const document={createElement:t=>{if(t!=='canvas')throw Error(t);const c={width:0,height:0,getContext:()=>c._x||(c._x=ctx2d())};return c;}};
/* WTRAIN: dial.js reads the train's tables at load for build()'s heights; an inert stand-in, every property itself, 0 as a number */
const inert=new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?()=>0:inert,apply:()=>inert});
const c=vm.createContext({Math,console,Object,Array,Number,JSON,Error,Infinity,NaN,Set,Map,Path2D,document,THREE:{},KIT:{},WTRAIN:inert,TAU:Math.PI*2,D2R:Math.PI/180});
for(const f of['dims.js','dialface.js','dialface_lange.js','dialface_kirov.js','dial.js'])vm.runInContext(fs.readFileSync(path.join(JS,f),'utf8'),c,{filename:f});
const WDIAL=vm.runInContext('WDIAL',c);WDIAL.face(1,d);
if(T[0]!==1||T[3]!==1)throw Error('face(1) scaled');
/* the disc's holes as dial.js's build() cuts them (05 02 00-4): face, the printed face's (the centre 6.0, the up-and-down 3.2, the seconds 1.7, the screws' Ø 1.8 sinks);
   drill, every hole through the disc (the screws' Ø 1.1 under their sinks, the pin's Ø 1 at 6 deg and the Ø 1 at 185.7 deg, both under the paint). The screws at 354, 120,
   240 deg on r 50.5, the 6MX's (Kirov 247's dial) at 354, 114, 234 on r 49.9: build()'s constants, repeated here [x, z, r] */
const H=vm.runInContext('WD.H',c),at=(a,r)=>[r*Math.sin(a*Math.PI/180),-r*Math.cos(a*Math.PI/180)];
const SCR=(d==='kirov'?[354,114,234]:[354,120,240]).map(a=>at(a,d==='kirov'?49.9:50.5));
const holes={face:[[0,0,3.0],[...H[2],1.6],[...H[35],0.85],...SCR.map(p=>[...p,0.9])],
  drill:[[0,0,3.0],[...H[2],1.6],[...H[35],0.85],...SCR.map(p=>[...p,0.55]),[...at(6,50.5),0.5],[...at(185.7,50.5),0.5]],sink:SCR.map(p=>[...p,0.9])};
process.stdout.write(JSON.stringify({dial:d,DR:WDIAL.DR,holes,ops:OPS}));
