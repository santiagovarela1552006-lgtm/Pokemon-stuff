// Loads the game into a sandbox for the test scripts.
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, '..');
const src = ['data.js','regions.js','game.js'].filter(f => fs.existsSync(path.join(dir, f))).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const els = { app:{innerHTML:''}, modal:{innerHTML:'',hidden:true,querySelector:()=>null,contains:()=>false}, toast:{} };
const ctx = { console, Math, JSON, Date, Promise, Set, Map, Object, Array, String, Number, Error, parseInt, isNaN, AbortController,
  document:{ addEventListener(){}, querySelector(s){ return els[s.replace('#','')]||null }, getElementById(id){ return els[id]||null }, activeElement:null },
  localStorage:{ _s:{}, getItem(k){ return this._s[k]||null }, setItem(k,v){ this._s[k]=v } }, setTimeout:()=>0, clearTimeout(){}, navigator:{} };
ctx.window = ctx; ctx.scrollTo = ()=>{};
vm.createContext(ctx);
vm.runInContext(src, ctx);
vm.runInContext(`
var LOG = { battles:0, wins:0, losses:0, caught:0, fled:0, scenes:0, renders:0 };
const _render = render; render = function(){ _render(); LOG.renders++; };
function handleModals(){ let g=0; while (UI.modal && g++<30){ const b = UI.modal.buttons; const i = b.findIndex(x=>/evolve|Forget/.test(x.label)); (b[i>=0?i:b.length-1]).fn(); } if (UI.modal) throw new Error('modal stuck: '+UI.modal.title); }
function bestMove(P, Fo){ let best=P.moves[0], bs=-1; for (const mv of P.moves){ const M=MOVES[mv]; if(!M.p) continue; const dd=dmgDice(P,mv); const sc=(dd.n*(dd.die+1)/2+dd.flat)*effOf(M.t,SPECIES[Fo.sp].t)*(SPECIES[P.sp].t.includes(M.t)?1.25:1); if (sc>bs){bs=sc;best=mv;} } return bs>0 ? best : 'struggle'; }
function botBattle(randomish){
  let guard=0; LOG.battles++;
  while (G.B && guard++<800){
    skipAnim(); const B=G.B;
    if (B.over){ const r=B.result; finishBattle(); handleModals(); LOG[r==='win'?'wins':r==='lose'?'losses':r==='caught'?'caught':'fled']++; return r; }
    if (B.needSwitch){ playerAction({type:'switch', idx:G.party.findIndex(m=>m.hp>0)}); continue; }
    const P=actP(), Fo=actF(), x=Math.random();
    if (randomish){
      if (x<.08 && B.kind==='wild' && G.items.capsule){ playerAction({type:'catch', id:'capsule'}); continue; }
      if (x<.12 && B.kind==='wild'){ playerAction({type:'run'}); continue; }
      if (x<.16){ const i=G.party.findIndex((m,k)=>k!==B.pi && m.hp>0); if (i>=0){ playerAction({type:'switch', idx:i}); continue; } }
      if (x<.2 && G.items.salve){ playerAction({type:'item', id:'salve', uid:P.uid}); continue; }
      if (x<.3){ playerAction({type:'move', id:pick(P.moves)}); continue; }
    }
    if (B.kind==='wild' && B.legendary && G.items.hypercapsule && Fo.hp < maxHP(Fo)*.5){ playerAction({type:'catch', id: G.items.absolute && Fo.sp==='nyxion' ? 'absolute' : 'hypercapsule'}); continue; }
    if (P.hp < maxHP(P)*.25 && G.items.hypersalve){ playerAction({type:'item', id:'hypersalve', uid:P.uid}); continue; }
    playerAction({type:'move', id:bestMove(P, Fo)});
  }
  throw new Error('battle stuck at '+(G.B && G.B.foe.map(m=>m.sp+':'+m.hp).join(',')));
}
function boost(level){ for (const m of G.party){ while (m.lvl < level) gainXP(m, xpNeed(m.lvl)-m.xp, ()=>{}); m.hp=maxHP(m); } runQueues(()=>{}); handleModals(); }
function playScene(id){
  const S = SCENES[id]; G.node = S.node; G.visited[S.node]=true; G.scene=null; G.B=null;
  if (!sceneAvail(S)) return 'unavailable';
  startScene(id); LOG.scenes++;
  let g=0;
  while (G.scene && g++<200){
    if (G.B){ botBattle(false); continue; }
    const sc=G.scene;
    if (sc.pending){ Math.random()<.5 ? spendInspiration() : acceptFailure(); continue; }
    if (sc.ended){ closeScene(); handleModals(); break; }
    const st = SCENES[sc.id].steps[sc.step]; const ch = choicesOf(st);
    if (!ch.length) throw new Error('no choices '+sc.id+'.'+sc.step);
    if (typeof topUp==='function') topUp();
    const good = ch.map((c,k)=>k).filter(k=>!/^(Leave|Retreat|Not yet|Come back later|Leave it|Say goodbye|Leave for now)/.test(ch[k].l));
    choose(good.length ? pick(good) : 0);
  }
  if (g>=200) throw new Error('scene loop '+id);
  return G.done[id] ? 'done' : 'kept';
}
`, ctx);
const run = code => vm.runInContext(code, ctx);
module.exports={run,ctx,els};
