// Checks every cross-reference in the campaign data. Usage: node tools/validate.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, '..');
const src = ['data.js','regions.js','arclight.js','zenith.js','game.js'].filter(f => fs.existsSync(path.join(dir, f))).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const els = { app:{innerHTML:''}, modal:{innerHTML:'',hidden:true,querySelector:()=>null,contains:()=>false}, toast:{} };
const ctx = { console, Math, JSON, Date, Promise, Set, Map, Object, Array, String, Number, Error, parseInt, isNaN,
  document:{ addEventListener(){}, querySelector(s){ return els[s.replace('#','')]||null }, getElementById(id){ return els[id]||null }, activeElement:null },
  localStorage:{ _s:{}, getItem(k){ return this._s[k]||null }, setItem(k,v){ this._s[k]=v } },
  setTimeout:()=>0, clearTimeout(){}, AbortController, navigator:{} };
ctx.window = ctx; ctx.window.scrollTo = ()=>{};
vm.createContext(ctx);
vm.runInContext(src + `\n;globalThis.__T = {SCENES,TRAINERS,NODES,SPECIES,MOVES,POOLS,ITEMS,KEYS,RIVAL_TEAMS,RIVAL_LINE,learnset,movesAt};`, ctx);
const T = ctx.__T; const errs = [];
// scenes
for (const S of Object.values(T.SCENES)) {
  if (!T.NODES[S.node]) errs.push(`scene ${S.id}: bad node ${S.node}`);
  if (!S.steps.start) errs.push(`scene ${S.id}: no start`);
  for (const [sid, st] of Object.entries(S.steps)) {
    if (st.next && !S.steps[st.next]) errs.push(`scene ${S.id}.${sid}: next ${st.next} missing`);
    if (!st.end && !st.next && !(st.c && st.c.length)) errs.push(`scene ${S.id}.${sid}: dead end`);
    for (const c of st.c || []) {
      for (const k of ['go','fail','fled','lose']) if (c[k] && !S.steps[c[k]]) errs.push(`scene ${S.id}.${sid}: ${k}->${c[k]} missing`);
      if (!c.go) errs.push(`scene ${S.id}.${sid}: choice "${c.l}" has no go`);
      if (c.battle && !T.TRAINERS[c.battle]) errs.push(`scene ${S.id}: trainer ${c.battle} missing`);
      if (Array.isArray(c.wild) && !T.SPECIES[c.wild[0]]) errs.push(`scene ${S.id}: species ${c.wild[0]} missing`);
      if (c.chk && !(c.chk[0]==='luck' || ['str','dex','con','int','wis','cha'].includes(c.chk[0]) || ['athletics','acrobatics','stealth','investigation','nature','insight','survival','perception','persuasion','deception','intimidation'].includes(c.chk[0]))) errs.push(`scene ${S.id}: bad skill ${c.chk[0]}`);
      if (c.wild === 'node' && !T.NODES[S.node].enc) errs.push(`scene ${S.id}: wild node but no enc`);
    }
  }
}
// nodes
for (const n of Object.values(T.NODES)) {
  for (const a of n.adj) { if (!T.NODES[a]) errs.push(`node ${n.id}: adj ${a} missing`); else if (!T.NODES[a].adj.includes(n.id)) errs.push(`node ${n.id}<->${a} not symmetric`); }
  for (const e of n.enc || []) if (!T.SPECIES[e[0]] || e[1] > e[2]) errs.push(`node ${n.id}: enc ${e}`);
  if (n.rare && !T.SPECIES[n.rare[0]]) errs.push(`node ${n.id}: rare`);
  for (const t of n.trainers || []) if (!T.TRAINERS[t]) errs.push(`node ${n.id}: trainer ${t}`);
}
for (const t of Object.values(T.TRAINERS)) {
  if (t.rival) { if (!T.RIVAL_TEAMS[t.id]) errs.push(`rival ${t.id} no team`); for (const [s] of T.RIVAL_TEAMS[t.id]||[]) if (typeof s==='string' && !T.SPECIES[s]) errs.push(`rival ${t.id} species ${s}`); }
  else for (const [s] of t.team) if (!T.SPECIES[s]) errs.push(`trainer ${t.id} species ${s}`);
}
for (const s of Object.values(T.SPECIES)) {
  for (const ty of s.t) if (!T.POOLS[ty]) errs.push(`species ${s.id} type ${ty}`);
  if (s.evo && !T.SPECIES[s.evo[1]]) errs.push(`species ${s.id} evo ${s.evo[1]}`);
  if (s.evo && typeof s.evo[0]==='string' && !T.ITEMS[s.evo[0]]) errs.push(`species ${s.id} evo item ${s.evo[0]}`);
  const ls = T.learnset(s.id); if (ls.length < 2) errs.push(`species ${s.id} learnset short`);
  for (const [,m] of ls) if (!T.MOVES[m]) errs.push(`species ${s.id} move ${m}`);
  if (!T.movesAt(s.id, 5).length) errs.push(`species ${s.id} no moves at 5`);
}
for (const [ty,p] of Object.entries(T.POOLS)) for (const [k,m] of Object.entries(p)) if (!T.MOVES[m]) errs.push(`pool ${ty}.${k} ${m}`);
console.log(errs.length ? errs.join('\n') : 'DATA_OK', '| species', Object.keys(T.SPECIES).length, '| scenes', Object.keys(T.SCENES).length, '| trainers', Object.keys(T.TRAINERS).length);
