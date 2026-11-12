// Plays the whole story with a bot, fuzzes 500 random battles and renders every view. Usage: node tools/playtest.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, '..');
const src = fs.readFileSync(path.join(dir,'data.js'),'utf8') + '\n' + fs.readFileSync(path.join(dir,'game.js'),'utf8');
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
const order = [
 ['intro',5],['oldcatcher',6],['glint',8],['museum',10],['gym1',15],['diggers',15],['moonseam',15],['rival2',18],['burglary',18],['gym2',23],
 ['recruiter',20],['burglar',20],['bram',20],['returnfruit',20],['meridian',23],['gym3',27],['tunnel',27],['fawn',27],['hideout',31],['gym4',32],
 ['spire',32],['slumber',34],['warden',34],['compass',34],['warden',36],['gym5',42],['silvane',44],['gym6',46],['mansion',46],['fossil',46],['gym7',49],['gym8',53],
 ['rival6',53],['boulder',53],['pyreon',55],['frostwing',55],['stormcrest',55],['league',64],['vanefinal',66],['nyxion',70],['museum2',70],['fossil',70],['lumin',72],['profcodex',72]
];
const failures = [];
for (let trial = 0; trial < 6; trial++) {
  try {
    run(`newGame({name:'Bot', bg:${JSON.stringify(['ace','researcher','ranger','silver'][trial%4])}, abil:{str:12,dex:14,con:12,int:13,wis:14,cha:11}, diff:${JSON.stringify(['story','adventurer','veteran'][trial%3])}}); UI.view='game'; G.items.hypercapsule=20; G.items.hypersalve=30;`);
    for (const [id, lvl] of order) {
      if (id !== 'intro') run(`boost(${lvl})`);
      if (id === 'lumin') run('for (const c of CODEX_IDS.slice(0,100)) G.codex.caught[c]=true');
      if (id === 'profcodex') run('for (const c of CODEX_IDS.slice(0,150)) G.codex.caught[c]=true');
      let res, tries = 0;
      do { if (tries > 0) run(`healParty()`); res = run(`playScene(${JSON.stringify(id)})`); tries++; }
      while (res === 'kept' && tries < 25 && !['warden','profcodex','league'].includes(id));
      if (id === 'league') { let t = 0; while (!run(`F(G,'champion')`) && t++ < 15) { run(`boost(${lvl + t})`); run(`playScene('league')`); } }
      if (id === 'intro') run(`G.party.push(makeMon('gnawrat',5)); G.party.push(makeMon('dusklet',5)); G.party.push(makeMon('scrapup',5));`);
      if (res === 'unavailable' && !['returnfruit','warden','fossil','compass'].includes(id)) failures.push(`trial ${trial}: ${id} unavailable`);
    }
    run(`for (const nid of Object.keys(NODES)) { const n=NODES[nid]; if (!n.enc) continue; G.node=nid; G.scene=null; for (let k=0;k<4;k++){ healParty(); explore(); if (G.B) botBattle(true); } }`);
    const s = run(`JSON.stringify({champ:F(G,'champion'), badges:G.badges.length, done:Object.keys(G.done).length, party:G.party.map(m=>m.sp+':'+m.lvl).join(' '), ranch:G.ranch.length, codex:caughtCount(G), money:G.money, nyx:F(G,'legend_nyxion'), lumin:F(G,'legend_lumin'), museum:F(G,'museum_gift'), starters:Object.keys(G.flags).filter(k=>k.startsWith('starter_')).join('+'), codexr:Object.keys(G.flags).filter(k=>k.startsWith('codexr')).length, keys:Object.keys(G.keys).join(',')})`);
    console.log('trial', trial, s);
  } catch (e) { failures.push(`trial ${trial}: ${e.stack.split('\n').slice(0,5).join(' | ')}`); }
}
try {
  run(`newGame({name:'Fuzz', bg:'ranger', abil:{str:10,dex:10,con:10,int:10,wis:10,cha:10}, diff:'adventurer'}); UI.view='game'; G.starter='budling';
  G.items.capsule=999; G.items.salve=999;
  const ids = Object.keys(SPECIES).filter(s=>!SPECIES[s].nocodex);
  for (let k=0;k<500;k++){ G.party = []; for (let p=0;p<3;p++) G.party.push(makeMon(pick(ids), 2+rnd(80))); G.scene=null;
    if (k%3===0) startTrainer(pick(Object.keys(TRAINERS)), null); else startWild(pick(ids), 2+rnd(80), null, k%7===0);
    botBattle(true); }`);
  console.log('fuzz OK', run(`JSON.stringify(LOG)`));
} catch (e) { failures.push('fuzz: ' + e.stack.split('\n').slice(0,5).join(' | ')); }
try {
  run(`UI.view='title'; render(); newCreate(); UI.view='create'; render(); UI.view='game';
  for (const p of ['explore','map','shop','ranch','dice']) { G.node = p==='dice' ? 'verdance' : 'brightwater'; UI.panel=p; render(); }
  for (const t of ['party','bag','sheet','codex']) { UI.tab=t; render(); }
  openMenu(); closeModal(); openMonInfo(G.party[0].uid); closeModal(); openSpeciesInfo('nyxion'); closeModal(); openUseItem('salve'); closeModal(); openHof(); closeModal();
  startWild('emberkit', 10, null); G.B.menu='fight'; skipAnim(); render(); G.B.menu='bag'; render(); G.B.menu='party'; render(); G.B.menu='target:salve'; render();`);
  console.log('views OK, app html length', els.app.innerHTML.length);
} catch (e) { failures.push('views: ' + e.stack.split('\n').slice(0,5).join(' | ')); }
console.log(failures.length ? 'FAILURES:\n' + failures.join('\n') : 'ALL_OK');
