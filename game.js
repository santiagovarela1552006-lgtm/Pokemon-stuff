'use strict';
/* Halcyon Road: rules engine and interface. */

/* ================= Utilities ================= */
const $ = (s, el = document) => el.querySelector(s);
const rnd = n => Math.floor(Math.random() * n);
const d = sides => 1 + rnd(sides);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const amod = score => Math.floor((score - 10) / 2);
const sgn = m => (m >= 0 ? '+' : '−') + Math.abs(m);
const fmtMoney = n => '₵' + Math.max(0, Math.round(n)).toLocaleString('en-US');
const pick = arr => arr[rnd(arr.length)];
const paras = t => String(t).split(/\n\n+/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
const ABIL_ORDER = ['str','dex','con','int','wis','cha'];

/* ================= Derived data ================= */
const DIE = [0, 4, 6, 8, 10, 12];
const PREVO = {};
for (const s of Object.values(SPECIES)) if (s.evo) PREVO[s.evo[1]] = s.id;
function STAGE(id){ let n = 0, c = id; while (PREVO[c]) { n++; c = PREVO[c]; } return n; }
const CODEX_IDS = Object.keys(SPECIES).filter(id => !SPECIES[id].nocodex);
const LS_CACHE = {};
function learnset(id){
  if (LS_CACHE[id]) return LS_CACHE[id];
  const s = SPECIES[id];
  if (s.apexOf) return (LS_CACHE[id] = learnset(s.apexOf));
  let L;
  if (s.ls) L = s.ls.map(x => x.slice());
  else {
    const [t1, t2] = s.t; const P1 = POOLS[t1], P2 = t2 ? POOLS[t2] : null;
    L = [[1, P1[1] || (P2 && P2[1]) || 'tackle'], [1, P1.s || 'growl'], [6, P1[2]], [11, P2 ? P2[2] : 'quickstrike'],
         [17, P1[3]], [24, P2 ? P2[3] : 'headbutt'], [31, P1[4]], [39, P2 ? P2[4] : 'bodyslam'], [47, P1[5]]];
  }
  if (s.ex) for (const [lv, mv] of Object.entries(s.ex)) L.push([+lv, mv]);
  L.sort((a, b) => a[0] - b[0]);
  const seen = new Set();
  L = L.filter(([, m]) => { if (!m || !MOVES[m] || seen.has(m)) return false; seen.add(m); return true; });
  return (LS_CACHE[id] = L);
}
function movesAt(id, lvl){ return learnset(id).filter(([l]) => l <= lvl).map(([, m]) => m).slice(-4); }

/* ================= State ================= */
let G = null;
const UI = { view:'title', panel:'explore', tab:'party', modal:null, create:null, dmDraft:'', save:null, localSave:null, cloudSave:null, cloudChecking:false, bet:100, diceLast:null, pendingHof:false, importText:'' };
const DM = { state:'pending', busy:false, ctl:null, sample:null };
const CLOUD = { db:null, uid:null, writing:false, dirty:false };
const DIFF = () => DIFFS[G.diff] || DIFFS.adventurer;

function newGame(o){
  G = { v:1, name:o.name, bg:o.bg, abil:o.abil, diff:o.diff, money:3000, items:{salve:2}, keys:{}, flags:{}, done:{}, beaten:{},
    badges:[], party:[], ranch:[], node:'thistle', lastHaven:'thistle', visited:{thistle:true}, codex:{seen:{}, caught:{}},
    feed:[], insp:0, uidc:0, starter:null, dmLoot:{}, hof:[], scene:null, B:null, pendingLearn:[], pendingEvo:[],
    settings:{tier:'quick', speed:'normal'}, created:Date.now(), savedAt:0, lastBattle:null, tower:{streak:0, best:0, sets:0, foe:null}, arena:{cups:0, round:1, foe:null}, games:{cups:0, round:1, foe:null}, world:{titles:0, round:1, foe:null, used:[]}, teams:{}, starters:{} };
}
function migrate(g){
  const base = { items:{}, keys:{}, flags:{}, done:{}, beaten:{}, badges:[], party:[], ranch:[], visited:{}, codex:{seen:{}, caught:{}}, feed:[], insp:0, uidc:0, dmLoot:{}, hof:[], scene:null, B:null, pendingLearn:[], pendingEvo:[], settings:{tier:'quick', speed:'normal'}, lastHaven:'thistle', node:'thistle', money:0 };
  for (const k in base) if (g[k] === undefined) g[k] = base[k];
  if (!g.tower) g.tower = { streak:0, best:0, sets:0, foe:null };
  if (!g.arena) g.arena = { cups:0, round:1, foe:null };
  if (!g.games) g.games = { cups:0, round:1, foe:null };
  if (!g.world) g.world = { titles:0, round:1, foe:null, used:[] };
  if (!g.starters) g.starters = {};
  if (!g.teams) {
    // Saves from before fresh starts: whatever team is out belongs to Halcyon. If the save is
    // already in another region, that team goes home to the daycare and the arrival scene replays.
    g.teams = {};
    const rg = NODES[g.node] && NODES[g.node].rg;
    if (rg && rg !== 'halcyon') {
      g.teams.halcyon = { party:g.party, ranch:g.ranch }; g.party = []; g.ranch = [];
      delete g.done[rg === 'solenne' ? 's_arrive' : 'n_arrive'];
    }
  }
  if (!g.B) for (const m of [...g.party, ...g.ranch]) if (m.apexFrom) { m.sp = m.apexFrom; delete m.apexFrom; }
  if (!g.settings.speed) g.settings.speed = 'normal';
  if (!NODES[g.node]) g.node = 'thistle';
  if (g.flags.champion && !g.flags.gift_absolute3) {
    g.flags.gift_absolute3 = true; g.items.absolute = (g.items.absolute || 0) + 3;
    g.feed.push({ k:'sys', text:'A parcel arrives from Professor Marr: 3 Absolute Capsules. “For the champion who has everything except these.”' });
  }
  return g;
}

/* ================= Story helpers (used by data.js) ================= */
function F(g, f){ return !!(g && g.flags[f]); }
function setF(g, f){ g.flags[f] = true; }
function hasKey(g, k){ return !!(g && g.keys[k]); }
function nb(g){ return g ? g.badges.length : 0; }
function hasBadge(g, id){ return g.badges.includes(id); }
function note(text){ if (G.scene) G.scene.trail.push({ sys:text }); else pushFeed({ k:'sys', text }); }
function giveKey(g, k){ g.keys[k] = true; note(`Key item: ${KEYS[k][0]}.`); }
function give(g, id, q = 1){ g.items[id] = (g.items[id] || 0) + q; note(`Received ${q} × ${ITEMS[id].n}.`); }
function badge(g, id){ if (!g.badges.includes(id)) { g.badges.push(id); note(`Badge earned: ${BADGES.find(b => b[0] === id)[1]}.`); } gainInsp(g); }
function gainInsp(g){ if (!g.insp) { g.insp = 1; note('You gain Inspiration. Spend it to reroll a failed check.'); } }
function hurt(g, n){ const m = g.party.find(x => x.hp > 0); if (!m) return; m.hp = Math.max(1, m.hp - n); note(`${mname(m)} takes ${n} damage.`); }
function gift(g, sp, lvl){ const m = makeMon(sp, lvl); const where = addMon(m); note(`${SPECIES[sp].n} (Lv ${lvl}) joins you${where === 'ranch' ? ' and heads to the ranch' : ''}.`); }
function topLevel(g){ return g.party.reduce((a, m) => Math.max(a, m.lvl), 0); }
function strongestName(g){ const m = g.party.slice().sort((a, b) => b.lvl - a.lvl)[0]; return m ? mname(m) : 'Your partner'; }
function pickStarter(g, sp){ g.starter = sp; addMon(makeMon(sp, 5)); }
function pickRegionStarter(g, region, sp){ g.starters[region] = sp; addMon(makeMon(sp, 5)); }
function teamRegion(rg){ return { halcyon:'Thistle Hollow', solenne:'Port Calder', nordhaven:'Skerrport', arclight:'Grand Central', zenith:'Zenith Harbor' }[rg] || 'Thistle Hollow'; }
function becomeChampion(g){ setF(g, 'champion'); g.hof.push({ at:Date.now(), region:'halcyon', team:g.party.map(m => ({ sp:m.apexFrom || m.sp, lvl:m.lvl })) }); UI.pendingHof = true; }
function becomeRegionChampion(g, r){ setF(g, 'champion_' + r); g.hof.push({ at:Date.now(), region:r, team:g.party.map(m => ({ sp:m.apexFrom || m.sp, lvl:m.lvl })) }); UI.pendingHof = true; }
function badgeRegion(id){ const b = BADGES.find(x => x[0] === id); return (b && b[5]) || 'halcyon'; }
function rb(g, r){ return g ? g.badges.filter(b => badgeRegion(b) === r).length : 0; }

/* ---------- Summit Tower ---------- */
const TOWER_NAMES = ['Ace Trainer Wilda','Veteran Osric','Dragon Tamer Ysolde','Psychic Calloway','Black Belt Haru','Swimmer Nerys','Ranger Fennick','Hiker Bartholomew','Mystic Odile','Gentleman Ashby','Duelist Kestrel','Scholar Imogen','Bird Keeper Lark','Ace Trainer Corvin','Veteran Maud','Firebreather Ignatz','Skier Pell','Captain Marisol'];
const TOWER_LINES = ['“Let’s see that champion’s pin earn its keep.”','“I’ve watched your last three battles. I took notes.”','“Five in a row? Not on my floor.”','“The tower remembers everyone who falls here.”','“I came from three regions away for this.”','“Don’t mind me. I’m just the next one.”'];
const TOWER_POOL = CODEX_IDS.filter(id => !SPECIES[id].evo && !SPECIES[id].legend && SPECIES[id].b.reduce((a, b) => a + b, 0) >= 300);
function ensureTowerFoe(g){
  const f = (g.tower && g.tower.foe) || { name:'Tower Challenger', team:[['comethyst',60]], intro:'' };
  TRAINERS.tower_foe = Object.assign(TRAINERS.tower_foe || {}, { id:'tower_foe', name:f.name, mult:60, team:f.team, intro:f.intro, outro:'“Good battle. Keep climbing.”', ai:'smart', heals:g.tower && g.tower.streak >= 10 ? 1 : 0 });
}
function towerGen(g){
  const lvl = 55 + Math.min(30, g.tower.streak), pool = TOWER_POOL.slice(), team = [];
  for (let i = 0; i < 3; i++) team.push([pool.splice(rnd(pool.length), 1)[0], Math.min(100, lvl + rnd(3))]);
  g.tower.foe = { name:pick(TOWER_NAMES), team, intro:pick(TOWER_LINES) };
  ensureTowerFoe(g);
}
function towerIntro(g){ const t = g.tower; return `The attendant at the foot of the Summit Tower bows. “Five battles in a row, champion, against challengers from every corner of the world. No rest between them. Only what you carry. Your streak carries over from set to set, and so does the difficulty.”\n\nCurrent streak: ${t.streak}. Best streak: ${t.best}. Sets cleared: ${t.sets}.`; }
function towerRound(g, n){ towerGen(g); const f = g.tower.foe; return `Battle ${n} of 5. ${f.name} steps onto the platform with three partners around level ${f.team[0][1]}.`; }
function towerWon(g){ const t = g.tower; t.streak++; t.best = Math.max(t.best, t.streak); return `Win. That’s ${t.streak} in a row.\n\n`; }
function towerSetClear(g){
  const t = g.tower; t.sets++;
  const cash = 2000 + 300 * t.sets;
  g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 2; g.items.hypercapsule = (g.items.hypercapsule || 0) + 3; g.items.absolute = (g.items.absolute || 0) + 1; g.money += cash;
  return `Five for five. Your prize: 2 Wisdom Fruits, 3 Hyper Capsules, an Absolute Capsule and ${fmtMoney(cash)}. Your streak carries into your next set.`;
}
function towerLost(g){ const s = g.tower.streak; g.tower.streak = 0; return `Your streak ends at ${s}. The attendant patches up your partners and bows. “The tower will be here.”`; }
const CODEX_REWARDS = [[10, [['supercapsule',5]]], [25, [['hypercapsule',5],['wisdomfruit',2]]], [40, [], 'starter'], [60, [['maxsalve',3],['wisdomfruit',3]]], [80, [], 'starter'],
  [100, [['hypercapsule',10]], 'lumin'], [150, [['absolute',1],['wisdomfruit',5]]], [200, [['maxsalve',5],['wisdomfruit',5]]], [250, [['absolute',1],['hypercapsule',10]]],
  [CODEX_IDS.length, [['maxsalve',5],['revive',5]]]];
function caughtCount(g){ return CODEX_IDS.filter(id => g.codex.caught[id]).length; }
function seenCount(g){ return CODEX_IDS.filter(id => g.codex.seen[id]).length; }
function codexTalk(g){
  const c = caughtCount(g), s = seenCount(g), tot = CODEX_IDS.length;
  const line = c < 5 ? '“A start! Every catalogue begins with a single entry.”' : c < 15 ? '“Now we’re getting somewhere. Keep at it.”' : c < 30 ? '“Remarkable. The university will want copies.”' : c < tot ? '“I haven’t seen a Codex this full in forty years.”' : '“Every creature in Halcyon. Every single one. I need to sit down.”';
  const next = CODEX_REWARDS.find(([n]) => !g.flags['codexr' + n]);
  return `Professor Marr flips through your Field Codex. ${s} seen, ${c} caught, out of ${tot} known species.\n\n${line}` + (next && c < next[0] ? `\n\n“Catch ${next[0]} and come back. I have something for you.”` : '');
}
function codexRewardsDue(g){ const c = caughtCount(g); return CODEX_REWARDS.filter(([n]) => c >= n && !g.flags['codexr' + n]); }
function claimCodexRewards(g){
  const got = [], extra = [];
  for (const [n, items, special] of codexRewardsDue(g)) {
    setF(g, 'codexr' + n);
    for (const [id, q] of items) { g.items[id] = (g.items[id] || 0) + q; got.push(`${q} × ${ITEMS[id].n}`); }
    if (special === 'starter') {
      const left = ['emberkit', 'rippup', 'budling'].filter(sp => sp !== g.starter && !g.flags['starter_' + sp]);
      if (left.length) { const sp = left[0]; setF(g, 'starter_' + sp); got.push(`a capsule holding a ${SPECIES[sp].n}`); extra.push(sp); }
    }
    if (special === 'lumin') extra.push('lumin');
  }
  let text = `“You’ve earned these,” the professor says, and hands over ${got.join(', ')}.`;
  for (const x of extra) {
    if (x === 'lumin') text += '\n\n“One more thing. The old Cinderisle notes mention a small light seen over the black lake in the Hollow Below, before Nyxion was ever made. Nobody has seen it since. A trainer with a Codex like yours might.”';
    else { text += `\n\n“That ${SPECIES[x].n} has waited in the lab since the day you left. It would rather see the world with you.”`; GIFT_QUEUE.push(x); }
  }
  return text;
}
const GIFT_QUEUE = [];
function flushGifts(g){ while (GIFT_QUEUE.length) gift(g, GIFT_QUEUE.shift(), 20); }

/* ================= Creatures ================= */
function maxHP(m){ return 12 + m.lvl * 2 + Math.floor(SPECIES[m.sp].b[0] * m.lvl / 40); }
function spdMod(m){ return Math.floor((SPECIES[m.sp].b[3] - 50) / 10); }
function stageMul(s){ return s >= 0 ? 1 + .25 * s : 1 / (1 + .25 * -s); }
function hitBonus(m, st, side){ return 3 + Math.floor(m.lvl / 10) + Math.floor((SPECIES[m.sp].b[1] - 50) / 20) + (st ? st.hit : 0) + (side === 'p' && G.bg === 'ace' ? 1 : 0); }
function armorClass(m, st){ return 10 + Math.floor(m.lvl / 10) + Math.floor((SPECIES[m.sp].b[2] - 50) / 20) + (st ? st.ac : 0); }
function dmgDice(m, mv){ const M = MOVES[mv]; if (!M.p) return null; return { n:1 + Math.floor((m.lvl + 2) / 7), die:DIE[M.p], flat:Math.floor(m.lvl / 5) + 1 }; }
function xpNeed(l){ return Math.floor(6 + 1.2 * l * l); }
function mname(m){ return m.nick || SPECIES[m.sp].n; }
function newUid(){ G.uidc = (G.uidc || 0) + 1; return 'm' + G.uidc; }
function makeMon(sp, lvl, wild){
  const m = { uid: wild ? 'w' + Math.random().toString(36).slice(2, 9) : newUid(), sp, lvl, xp:0, moves:movesAt(sp, lvl), st:null, slp:0 };
  m.hp = maxHP(m);
  return m;
}
function markSeen(sp){ if (!SPECIES[sp].nocodex) G.codex.seen[sp] = true; }
function markCaught(sp){ if (!SPECIES[sp].nocodex) { G.codex.seen[sp] = true; G.codex.caught[sp] = true; } }
function addMon(m){ markCaught(m.sp); if (G.party.length < 6) { G.party.push(m); return 'party'; } G.ranch.push(m); return 'ranch'; }
function findMon(uid){ return G.party.find(m => m.uid === uid) || G.ranch.find(m => m.uid === uid) || null; }
function healParty(){ for (const m of G.party) { m.hp = maxHP(m); m.st = null; m.slp = 0; } }
function gainXP(m, amt, say){
  if (m.lvl >= 100) return;
  m.xp += amt;
  while (m.lvl < 100 && m.xp >= xpNeed(m.lvl)) { m.xp -= xpNeed(m.lvl); levelUp(m, say); }
}
function levelUp(m, say){
  const before = maxHP(m); m.lvl++;
  m.hp = Math.min(maxHP(m), m.hp + (maxHP(m) - before));
  say(`${mname(m)} grows to level ${m.lvl}!`);
  learnAtLevel(m, say);
  const s = SPECIES[m.sp];
  if (s.evo && typeof s.evo[0] === 'number' && m.lvl >= s.evo[0] && !G.pendingEvo.some(p => p.uid === m.uid)) G.pendingEvo.push({ uid:m.uid, into:s.evo[1] });
}
function learnAtLevel(m, say){ for (const [l, mv] of learnset(m.sp)) if (l === m.lvl) learnMove(m, mv, say); }
function learnMove(m, mv, say){
  if (m.moves.includes(mv)) return;
  if (m.moves.length < 4) { m.moves.push(mv); say(`${mname(m)} learns ${MOVES[mv].n}!`); }
  else if (!G.pendingLearn.some(p => p.uid === m.uid && p.mv === mv)) G.pendingLearn.push({ uid:m.uid, mv });
}

/* ================= Checks ================= */
function profBonus(){ return Math.min(6, 2 + Math.floor(nb(G) / 3)); }
function checkInfo(skill){
  if (skill === 'luck') return { label:'Luck', bonus:0 };
  if (ABIL[skill]) return { label:ABIL[skill], bonus:amod(G.abil[skill]) };
  const [label, ab] = SKILLS[skill];
  const prof = BACKGROUNDS[G.bg].skills.includes(skill);
  return { label, bonus:amod(G.abil[ab]) + (prof ? profBonus() : 0), prof };
}
function rollCheck(skill, dc, adv){
  const info = checkInfo(skill);
  const r1 = d(20), r2 = adv ? d(20) : null, r = adv ? Math.max(r1, r2) : r1;
  const total = r + info.bonus;
  return { label:info.label, r, r1, r2, bonus:info.bonus, total, dc, ok: r === 20 || (r !== 1 && total >= dc), adv:!!adv };
}

/* ================= Persistence ================= */
const LS_KEY = 'halcyon-road.save.v1';
function lsGet(){ try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
function lsSet(json){ try { localStorage.setItem(LS_KEY, json); return true; } catch (e) { return false; } }
function serialize(){ const o = Object.assign({}, G); o.B = null; return JSON.stringify(o); }
function metaOf(s){ return s ? { name:s.name, badges:(s.badges || []).length, node:s.node, savedAt:s.savedAt || 0 } : null; }
function saveGame(manual){
  if (!G || G.B) return;
  G.savedAt = Date.now();
  const json = serialize();
  const ok = lsSet(json);
  cloudWrite(json);
  UI.localSave = null; UI.save = metaOf(G);
  if (manual) toast(CLOUD.uid ? 'Saved to your account and this browser.' : ok ? 'Saved in this browser.' : 'Could not save in this browser. Export your save from the menu to keep it.');
}
async function cloudWrite(json){
  if (!CLOUD.db || !CLOUD.uid) return;
  if (CLOUD.writing) { CLOUD.dirty = true; return; }
  CLOUD.writing = true;
  try { await CLOUD.db.doc(`data/users/${CLOUD.uid}/halcyon`).set({ state:json, savedAt:G ? G.savedAt : Date.now() }); }
  catch (e) { /* the browser copy still holds the save */ }
  finally {
    CLOUD.writing = false;
    if (CLOUD.dirty && G && !G.B) { CLOUD.dirty = false; cloudWrite(serialize()); }
  }
}
async function cloudRead(){
  try {
    const snap = await Promise.race([CLOUD.db.doc(`data/users/${CLOUD.uid}/halcyon`).get(), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 9000))]);
    const data = snap && snap.data ? snap.data() : null;
    if (data && data.state) return JSON.parse(data.state);
  } catch (e) { /* no cloud save */ }
  return null;
}
function bestSave(){
  const a = UI.cloudSave, b = UI.localSave || lsGet();
  if (a && b) return (a.savedAt || 0) >= (b.savedAt || 0) ? a : b;
  return a || b || null;
}

/* ================= Feed ================= */
function pushFeed(e){ G.feed.push(e); if (G.feed.length > 70) G.feed.splice(0, G.feed.length - 70); }
function feedPlain(e){
  if (e.k === 'you') return `Player: ${e.text}`;
  if (e.k === 'check') return `${e.res.label} check ${e.res.total} vs DC ${e.res.dc}: ${e.res.ok ? 'success' : 'failure'}`;
  if (e.k === 'roll') return '';
  if (e.k === 'scene') return `${e.title}: ${String(e.text).slice(0, 400)}`;
  return e.text || '';
}

/* ================= Scenes ================= */
function sceneAvail(S){
  if (S.node !== G.node) return false;
  if (!S.repeat && G.done[S.id]) return false;
  if (S.req && !S.req(G)) return false;
  return true;
}
function choicesOf(st){
  if (st.next) return [{ l:st.nl || 'Continue', go:st.next }];
  return (st.c || []).filter(c => !c.req || c.req(G));
}
function startScene(id){ G.scene = { id, step:null, trail:[], pending:null, ended:false }; enterStep('start'); }
function enterStep(stepId){
  const S = SCENES[G.scene.id], st = S.steps[stepId];
  if (!st) { console.error('Missing scene step', G.scene.id, stepId); G.scene = null; return; }
  G.scene.step = stepId;
  const text = typeof st.t === 'function' ? st.t(G) : st.t;
  if (text) G.scene.trail.push({ text });
  if (st.do) st.do(G);
  if (st.end) { G.scene.ended = true; if (!st.keep && !S.repeat) G.done[S.id] = true; }
}
function choose(i){
  const sc = G.scene; if (!sc || sc.pending || sc.ended) return;
  const st = SCENES[sc.id].steps[sc.step];
  const ch = choicesOf(st)[i]; if (!ch) return;
  if ((ch.battle || ch.wild) && !G.party.some(m => m.hp > 0)) { toast('You have no partners with you who can battle.'); return; }
  sc.trail.push({ choice:ch.l });
  if (ch.do) ch.do(G);
  if (ch.chk) {
    const adv = ch.adv ? !!ch.adv(G) : false;
    const res = rollCheck(ch.chk[0], ch.chk[1], adv);
    sc.trail.push({ check:res });
    if (res.r === 20) gainInsp(G);
    if (!res.ok && G.insp > 0) sc.pending = { go:ch.go, fail:ch.fail || ch.go, chk:ch.chk, adv };
    else enterStep(res.ok ? ch.go : (ch.fail || ch.go));
    return commit();
  }
  if (ch.battle) {
    const T = TRAINERS[ch.battle];
    if (G.beaten[ch.battle] && !ch.rematch && !T.rival) { sc.trail.push({ sys:`You’ve already beaten ${T.name}.` }); enterStep(ch.go); return commit(); }
    startTrainer(ch.battle, { scene:sc.id, go:ch.go, lose:ch.lose, soft:!!ch.soft });
    return commit();
  }
  if (ch.wild) {
    const w = ch.wild === 'node' ? rollEnc(NODES[G.node]) : ch.wild;
    startWild(w[0], w[1], { scene:sc.id, go:ch.go, fled:ch.fled });
    return commit();
  }
  enterStep(ch.go);
  commit();
}
function spendInspiration(){
  const sc = G.scene, p = sc && sc.pending; if (!p) return;
  G.insp = 0;
  const res = rollCheck(p.chk[0], p.chk[1], p.adv); res.reroll = true;
  sc.trail.push({ check:res }); sc.pending = null;
  if (res.r === 20) gainInsp(G);
  enterStep(res.ok ? p.go : p.fail);
  commit();
}
function acceptFailure(){ const sc = G.scene, p = sc && sc.pending; if (!p) return; sc.pending = null; enterStep(p.fail); commit(); }
function closeScene(){
  const sc = G.scene; if (!sc) return;
  const S = SCENES[sc.id];
  const last = [...sc.trail].reverse().find(t => t.text);
  pushFeed({ k:'scene', title:S.title, text: last ? last.text : '' });
  for (const t of sc.trail) if (t.sys && /^(Received|Key item|Badge|You gain|.* joins you)/.test(t.sys)) pushFeed({ k:'loot', text:t.sys });
  G.scene = null;
  if (UI.pendingHof) { UI.pendingHof = false; openHof(); }
  commit();
}
function commit(){ saveGame(); render(); }

/* ================= Travel & exploring ================= */
function canEnter(id){ const n = NODES[id]; return !n.req || n.req(G); }
function canCoach(id){ const n = NODES[id]; return nb(G) >= 2 && !!G.visited[id] && !!n.haven && id !== G.node && n.rg === NODES[G.node].rg && !NODES[G.node].adj.includes(id) && canEnter(id); }
const CROSSINGS = {};
for (const [a, b, w] of [['saltmere','s_port','ferry'], ['s_aurelia','n_port','airship'], ['n_port','a_station','train'], ['a_harbor','w_port','liner']]) CROSSINGS[[a, b].sort().join('|')] = w;
const WAY_NAME = { ferry:'Ferry', airship:'Airship', train:'Undersea Express', liner:'Champions’ Liner' };
const WAY_SUB = { ferry:'by ferry', airship:'by airship', train:'by the Undersea Express', liner:'aboard the Champions’ Liner' };
function crossWay(a, b){ return CROSSINGS[[a, b].sort().join('|')] || 'ferry'; }
/* Zenith Isle hosts the World Tournament, where every partner from every region may fight.
   Arriving gathers all regional teams into one; leaving sends each partner back to its home
   region (new catches go with you). A partner that was in your Zenith party joins the front of
   its home region's party. */
const WORLD_REGION = 'zenith';
function gatherTeams(g, from){
  const party = [], ranch = [];
  for (const [r, t] of Object.entries(g.teams)) {
    t.party.forEach((m, i) => { m.home = r; m.wasParty = i + 1; (r === from ? party : ranch).push(m); });
    for (const m of t.ranch) { m.home = r; delete m.wasParty; ranch.push(m); }
  }
  g.teams = {}; g.party = party; g.ranch = ranch.sort((a, b) => b.lvl - a.lvl);
}
function scatterTeams(g, to){
  const groups = {};
  const put = (m, inParty) => {
    const r = m.home || to, t = groups[r] || (groups[r] = { now:[], was:[], rest:[] });
    (inParty ? t.now : m.wasParty ? t.was : t.rest).push(m);
  };
  for (const m of g.party) put(m, true);
  for (const m of g.ranch) put(m, false);
  for (const [r, t] of Object.entries(groups)) {
    // A region's old party keeps its old order, after anyone who just fought in the Zenith party.
    t.was.sort((a, b) => a.wasParty - b.wasParty);
    const line = [...t.now, ...t.was];
    for (const m of [...line, ...t.rest]) { delete m.home; delete m.wasParty; }
    g.teams[r] = { party:line.slice(0, 6), ranch:[...line.slice(6), ...t.rest] };
  }
  g.party = []; g.ranch = [];
}
function travel(id){
  if (!G || G.B || G.scene) return;
  const n = NODES[id], adj = NODES[G.node].adj.includes(id), coach = canCoach(id);
  if (!adj && !coach) return;
  if (!canEnter(id)) { toast(n.lock || 'You can’t go there yet.'); return; }
  const from = NODES[G.node].rg, cross = n.rg !== from, way = cross ? crossWay(G.node, id) : '';
  if (cross) {
    // Each region keeps its own team. Yours waits at the daycare until you come back.
    if (from === WORLD_REGION) scatterTeams(G, n.rg);
    else G.teams[from] = { party:G.party, ranch:G.ranch };
    if (n.rg === WORLD_REGION) gatherTeams(G, from);
    else { const t = G.teams[n.rg] || { party:[], ranch:[] }; G.party = t.party; G.ranch = t.ranch; delete G.teams[n.rg]; }
    if (n.haven) G.lastHaven = id;
  }
  G.node = id; G.visited[id] = true; UI.panel = 'explore';
  pushFeed({ k:'travel', text:n.n + (cross ? ', ' + REGIONS[n.rg].n : ''), sub: cross ? WAY_SUB[way] : coach ? 'by coach' : '' });
  if (cross) pushFeed({ k:'sys', text: n.rg === WORLD_REGION ? 'Every partner you have ever caught has come to Zenith Isle with you. Choose your six from the ranch at any haven on the island.'
    : from === WORLD_REGION ? `Your partners from every region head home. Your ${REGIONS[n.rg].n} team is back with you.`
    : G.party.length ? `Your ${REGIONS[n.rg].n} team is back with you. Your ${REGIONS[from].n} team waits at the daycare.` : `Your ${REGIONS[from].n} team stays behind at the daycare. In ${REGIONS[n.rg].n}, you start again.` });
  const auto = Object.values(SCENES).find(S => S.auto && sceneAvail(S));
  if (auto) startScene(auto.id);
  commit();
}
function rollEnc(n){
  const tot = n.enc.reduce((a, e) => a + e[3], 0);
  let x = Math.random() * tot;
  for (const e of n.enc) { x -= e[3]; if (x <= 0) return [e[0], e[1] + rnd(e[2] - e[1] + 1)]; }
  return [n.enc[0][0], n.enc[0][1]];
}
const LOOT = {
  1:[['salve',50],['capsule',50]],
  2:[['salve',35],['capsule',35],['supersalve',15],['tonic',15]],
  3:[['supersalve',35],['supercapsule',30],['tonic',10],['revive',10],['salve',15]],
  4:[['supersalve',25],['supercapsule',25],['hypersalve',20],['revive',15],['hypercapsule',15]],
  5:[['hypersalve',35],['hypercapsule',30],['revive',20],['maxsalve',15]],
  6:[['hypersalve',30],['hypercapsule',30],['revive',20],['maxsalve',20]]
};
function lootFor(n){ const t = LOOT[n.tier] || LOOT[1]; let x = Math.random() * 100; for (const [id, w] of t) { x -= w; if (x <= 0) return id; } return t[0][0]; }
const STIR = ['Something stirs in the undergrowth.', 'A shape breaks cover ahead of you.', 'You hear it before you see it.', 'Something has been following you.', 'A creature steps into your path.'];
const FIND_FAIL = ['You turn up a bottle cap and a great deal of mud.', 'Nothing but a very startled beetle.', 'Whatever glinted, it was only wet stone.', 'You find a footprint. Yours.'];
function explore(){
  const n = NODES[G.node]; if (!n.enc || G.B || G.scene || !G.party.length) return;
  const r = d(20);
  pushFeed({ k:'roll', text:'Exploration roll', r });
  if (r >= 15 && r <= 18) {
    const res = rollCheck('perception', 9 + n.tier);
    pushFeed({ k:'check', res });
    if (res.r === 20) gainInsp(G);
    if (res.ok) { const it = Math.random() < .06 ? 'wisdomfruit' : lootFor(n); G.items[it] = (G.items[it] || 0) + 1; pushFeed({ k:'loot', text:`You find a ${ITEMS[it].n}.` }); }
    else pushFeed({ k:'nar', text:pick(FIND_FAIL) });
    return commit();
  }
  if (r === 19) {
    const t = (n.trainers || []).find(id => !G.beaten[id]);
    if (t) { pushFeed({ k:'nar', text:`${TRAINERS[t].name} spots you and comes over.` }); startTrainer(t, null); return commit(); }
  }
  const rare = r === 20 && n.rare;
  const e = rare ? [n.rare[0], n.rare[1] + rnd(n.rare[2] - n.rare[1] + 1)] : rollEnc(n);
  pushFeed({ k:'nar', text: r === 1 ? 'Ambush! Something bursts out of cover before you can react.' : rare ? 'You spot something rare, and it spots you.' : pick(STIR) });
  startWild(e[0], e[1], null, r === 1);
  commit();
}
function rest(){
  const n = NODES[G.node]; if (!n.haven) return;
  healParty(); G.lastHaven = G.node;
  pushFeed({ k:'sys', text: n.haven === 'home' ? 'You sleep in your own bed. Your partners are fully rested.' : n.haven === 'lodge' ? 'The rangers patch up your partners by the fire. Everyone is fully healed.' : 'The Haven nurse takes your partners for an hour. They come back fully healed.' });
  commit();
}
function whiteout(){
  const lost = Math.floor(G.money / 2); G.money -= lost;
  G.node = G.lastHaven; healParty(); G.scene = null; UI.panel = 'explore';
  pushFeed({ k:'sys', text:`You blacked out and woke at ${NODES[G.lastHaven].n}. You dropped ${fmtMoney(lost)} somewhere along the way.` });
}
function price(id){ return Math.round(ITEMS[id].price * (G.bg === 'silver' ? .8 : 1)); }
function buy(id, q){ const p = price(id) * q; if (G.money < p) return toast('You can’t afford that.'); G.money -= p; G.items[id] = (G.items[id] || 0) + q; toast(`Bought ${q} × ${ITEMS[id].n}.`); commit(); }
function consume(id){ G.items[id]--; if (G.items[id] <= 0) delete G.items[id]; }
function diceBet(choice){
  const bet = UI.bet; if (G.money < bet) return toast('You don’t have enough crowns for that bet.');
  const a = d(6), b = d(6), s = a + b;
  const win = (choice === 'under' && s < 7) || (choice === 'over' && s > 7) || (choice === 'seven' && s === 7);
  const net = win ? (choice === 'seven' ? bet * 4 : bet) : -bet;
  G.money += net; UI.diceLast = { a, b, s, choice, win, net };
  commit();
}

/* ================= Battle ================= */
let ANIM = null;
const stages0 = () => ({ atk:0, ac:0, hit:0 });
const actP = () => G.party[G.B.pi];
const actF = () => G.B.foe[G.B.fi];
function snap(){ const B = G.B, p = G.party[B.pi], f = B.foe[B.fi]; return { pu:p.uid, ph:p.hp, pst:p.st, fu:f.uid, fh:f.hp, fst:f.st }; }
function qf(text, cls, dice, hit){ G.B.queue.push({ text, cls:cls || '', dice:dice || null, hit:hit || null, snap:snap() }); }
function nameOf(side, m){ if (side === 'p') return mname(m); return (G.B.kind === 'wild' ? (G.B.legendary ? '' : 'Wild ') : 'Foe ') + SPECIES[m.sp].n; }
function rivalLine(T){
  if (T && T.rline) { const lines = REGION_RIVAL[T.rline]; return lines[G.starters && G.starters[T.rline]] || Object.values(lines)[0]; }
  return RIVAL_LINE[G.starter] || RIVAL_LINE.emberkit;
}
function trainerTeam(id){
  const T = TRAINERS[id];
  const line = rivalLine(T);
  const team = T.rival ? RIVAL_TEAMS[id].map(([s, l]) => [typeof s === 'number' ? line[s] : s, l]) : T.team;
  return team.map(([s, l]) => makeMon(s, Math.max(2, Math.round(l * DIFF().lvl)), true));
}
function startTrainer(id, hook){
  if (id === 'tower_foe') ensureTowerFoe(G);
  else if (TRAINERS[id] && TRAINERS[id].dyn) TRAINERS[id].dyn(G);
  const T = TRAINERS[id];
  const ai = G.diff === 'veteran' && T.ai === 'normal' ? 'smart' : T.ai;
  beginBattle('trainer', trainerTeam(id), { trainer:id, ai, heals:T.heals, hook });
}
function startWild(sp, lvl, hook, ambush){ beginBattle('wild', [makeMon(sp, lvl, true)], { ai:'wild', hook, legendary:!!SPECIES[sp].legend, ambush }); }
function beginBattle(kind, foe, o){
  let pi = G.party.findIndex(m => m.hp > 0);
  if (pi < 0) { healParty(); pi = 0; }
  G.B = { kind, foe, fi:0, pi, st:{ p:stages0(), f:stages0() }, part:[G.party[pi].uid], fainted:[], over:false, result:null,
    trainer:o.trainer || null, ai:o.ai, heals:o.heals || 0, hook:o.hook || null, legendary:!!o.legendary, needSwitch:false, menu:'main', log:[], queue:[], cur:null };
  const f = foe[0];
  markSeen(f.sp);
  if (kind === 'wild') qf(G.B.legendary ? `${SPECIES[f.sp].n} rises to meet you. (Lv ${f.lvl})` : `A wild ${SPECIES[f.sp].n} appears! (Lv ${f.lvl})`, 'big');
  else { const T = TRAINERS[o.trainer]; qf(`${T.name} wants to battle!`, 'big'); if (T.intro) qf(T.intro, 'quote'); qf(`${T.name} sends out ${SPECIES[f.sp].n} (Lv ${f.lvl}).`); foeMaybeAscend(); }
  qf(`Go, ${mname(G.party[pi])}!`);
  if (o.ambush) { qf('The wild creature strikes first!', 'muted'); useMove('f', chooseFoeMove()); resolveFaints(); }
  play();
}
function speed(){ return G && G.settings.speed === 'fast' ? 260 : 620; }
function play(){ if (!G.B || ANIM) return; stepAnim(); }
function stepAnim(){
  const B = G.B; if (!B) { ANIM = null; return; }
  if (!B.queue.length) { ANIM = null; render(); return; }
  const fr = B.queue.shift(); B.log.push(fr); if (B.log.length > 150) B.log.shift(); B.cur = fr;
  render();
  ANIM = setTimeout(stepAnim, fr.dice ? speed() * 1.4 : speed());
}
function skipAnim(){
  const B = G.B; if (!B) return;
  clearTimeout(ANIM); ANIM = null;
  while (B.queue.length) { const fr = B.queue.shift(); B.log.push(fr); B.cur = fr; }
  if (B.log.length > 150) B.log.splice(0, B.log.length - 150);
  render();
}
function immune(m, st){ const t = SPECIES[m.sp].t; return (st === 'burn' && t.includes('fire')) || (st === 'poison' && t.includes('poison')) || (st === 'para' && t.includes('electric')); }
function applyStatus(D, st, dn){
  if (D.st || D.hp <= 0 || immune(D, st)) return false;
  D.st = st; if (st === 'sleep') D.slp = d(3);
  qf(`${dn} ${({ burn:'is burned!', poison:'is poisoned!', para:'is paralyzed!', sleep:'falls asleep!' })[st]}`, 'status');
  return true;
}
function diceKind(r, crit){ return r === 20 || crit ? 'crit' : r === 1 ? 'fumble' : ''; }
function useMove(side, mv){
  const B = G.B, o = side === 'p' ? 'f' : 'p';
  const A = side === 'p' ? actP() : actF(), D = side === 'p' ? actF() : actP();
  if (!A || !D || A.hp <= 0 || D.hp <= 0) return;
  const aSt = B.st[side], dSt = B.st[o], an = nameOf(side, A), dn = nameOf(o, D);
  if (A.st === 'sleep') { if (A.slp > 0) { A.slp--; qf(`${an} is fast asleep.`, 'muted'); return; } A.st = null; qf(`${an} wakes up!`); }
  if (A.st === 'para' && d(4) === 1) { qf(`${an} is paralyzed and can’t move!`, 'muted'); return; }
  const M = MOVES[mv];
  qf(`${an} uses ${M.n}!`, side === 'p' ? 'you' : 'foe');
  if (M.flop) { qf('Nothing happens. It just flops around.', 'muted'); return; }
  if (!M.p) { statusMove(A, D, M, aSt, dSt, an, dn); return; }
  const r = d(20), hb = hitBonus(A, aSt, side) + (M.acc || 0), ac = armorClass(D, dSt);
  const crit = r >= (M.crit || 20);
  const hit = r !== 1 && (crit || r + hb >= ac);
  qf(`Attack roll ${r} ${sgn(hb)} = ${r + hb} vs AC ${ac}${crit && hit ? '. Critical hit!' : ''}`, 'roll', { v:r, kind:diceKind(r, crit && hit), label:'Attack' });
  if (!hit) { qf(r === 1 ? `${an} fumbles it completely.` : 'It misses.', 'muted'); return; }
  const e = effOf(M.t, SPECIES[D.sp].t);
  if (e === 0) { qf(`It has no effect on ${dn}.`, 'muted'); return; }
  const dd = dmgDice(A, mv), nDice = crit ? dd.n * 2 : dd.n;
  let raw = dd.flat; for (let i = 0; i < nDice; i++) raw += d(dd.die);
  const sa = SPECIES[A.sp], sd = SPECIES[D.sp];
  let dmg = raw * clamp((sa.b[1] + 50) / (sd.b[2] + 50), .7, 1.4) * clamp(1 + (A.lvl - D.lvl) / 50, .6, 1.4) * (sa.t.includes(M.t) ? 1.25 : 1) * e * stageMul(aSt.atk);
  if (M.vsSleep && D.st === 'sleep') dmg *= 2;
  if (A.st === 'burn') dmg *= .75;
  dmg = Math.max(1, Math.round(dmg));
  D.hp = Math.max(0, D.hp - dmg);
  qf(`${dn} takes ${dmg} damage. (${nDice}d${dd.die}+${dd.flat})`, e > 1 ? 'hurt strong' : 'hurt', null, o);
  if (e > 1) qf('It’s super effective!', 'eff');
  else if (e < 1) qf('It’s not very effective.', 'muted');
  if (M.drain && A.hp > 0) { const h = Math.max(1, Math.round(dmg * M.drain)); const b = A.hp; A.hp = Math.min(maxHP(A), A.hp + h); if (A.hp > b) qf(`${an} drains ${A.hp - b} HP.`); }
  if (M.recoil && A.hp > 0) { const x = Math.max(1, Math.round(dmg * M.recoil)); A.hp = Math.max(0, A.hp - x); qf(`${an} is hurt by the recoil. (${x})`, 'muted', null, side); }
  if (M.sec && D.hp > 0 && r >= M.sec[1]) applyStatus(D, M.sec[0], dn);
}
function statusMove(A, D, M, aSt, dSt, an, dn){
  if (M.inflict) {
    if (D.st || immune(D, M.inflict)) { qf('But it fails.', 'muted'); return; }
    const dc = 12 + Math.floor(A.lvl / 10), r = d(20), bonus = 1 + Math.floor(D.lvl / 10), tot = r + bonus;
    qf(`${dn} saving throw ${r} ${sgn(bonus)} = ${tot} vs DC ${dc}`, 'roll', { v:r, kind:diceKind(r), label:'Save' });
    if (r !== 1 && (r === 20 || tot >= dc)) { qf(`${dn} shakes it off.`, 'muted'); return; }
    applyStatus(D, M.inflict, dn);
  }
  if (M.buff) for (const [stat, amt, who] of M.buff) {
    const tgt = who === 'self' ? aSt : dSt, nm = who === 'self' ? an : dn, before = tgt[stat];
    tgt[stat] = clamp(before + amt, -3, 3);
    const words = { atk:['attack rises','attack falls'], ac:['AC rises','AC falls'], hit:['aim sharpens','aim falters'] }[stat];
    qf(tgt[stat] === before ? `${nm}’s ${stat === 'ac' ? 'AC' : stat === 'atk' ? 'attack' : 'aim'} won’t go any ${amt > 0 ? 'higher' : 'lower'}.` : `${nm}’s ${words[amt > 0 ? 0 : 1]}.`, tgt[stat] === before ? 'muted' : 'status');
  }
  if (M.heal) {
    const b = A.hp; A.hp = Math.min(maxHP(A), A.hp + Math.round(maxHP(A) * M.heal));
    qf(A.hp === b ? `${an} is already at full health.` : `${an} recovers ${A.hp - b} HP.`, A.hp === b ? 'muted' : 'good');
  }
}
function awardXP(foe){
  const B = G.B, s = SPECIES[foe.sp];
  const base = s.xp * foe.lvl / 6 * DIFF().xp * (B.kind === 'trainer' ? 1.5 : 1) * (G.bg === 'researcher' ? 1.25 : 1);
  for (const m of G.party) {
    if (m.hp <= 0) continue;
    const inB = B.part.includes(m.uid);
    const amt = Math.max(1, Math.round(base * (inB ? 1 : .3) * clamp(1 + (foe.lvl - m.lvl) / 15, .2, 1.5)));
    if (inB) qf(`${mname(m)} gains ${amt} XP.`, 'xp');
    gainXP(m, amt, t => qf(t, 'level'));
  }
}
function resolveFaints(){
  const B = G.B; let any = false;
  const Fo = actF();
  if (Fo.hp <= 0 && !B.fainted.includes(Fo.uid)) {
    B.fainted.push(Fo.uid); any = true;
    qf(`${nameOf('f', Fo)} faints!`, 'big', null, 'f');
    awardXP(Fo);
    const nxt = B.foe.findIndex(m => m.hp > 0);
    if (nxt < 0) { victory(); return true; }
    B.fi = nxt; B.st.f = stages0(); markSeen(B.foe[nxt].sp);
    qf(`${TRAINERS[B.trainer].name} sends out ${SPECIES[B.foe[nxt].sp].n} (Lv ${B.foe[nxt].lvl}).`);
    foeMaybeAscend();
  }
  const P = actP();
  if (P.hp <= 0 && !B.fainted.includes(P.uid)) {
    B.fainted.push(P.uid); any = true;
    qf(`${mname(P)} faints!`, 'big', null, 'p');
    if (!G.party.some(m => m.hp > 0)) { defeat(); return true; }
    B.needSwitch = true;
  }
  return any;
}
function victory(){
  const B = G.B; B.over = true; B.result = 'win';
  if (B.kind === 'trainer') {
    const T = TRAINERS[B.trainer];
    G.beaten[B.trainer] = true;
    qf(`You defeated ${T.name}!`, 'big');
    if (T.outro) qf(T.outro, 'quote');
    if (!T.nomoney && T.mult) {
      const pay = Math.round(T.mult * Math.max(...B.foe.map(m => m.lvl)) * (G.bg === 'silver' ? 1.25 : 1));
      G.money += pay; qf(`You receive ${fmtMoney(pay)}.`, 'good');
    }
  } else qf('You win the battle.', 'big');
}
function defeat(){
  const B = G.B; B.over = true; B.result = 'lose';
  qf('You have no partners left who can fight.', 'big');
  if (!(B.hook && B.hook.soft)) qf('Everything goes dark…', 'muted');
}
function chooseFoeMove(){
  const B = G.B, Fo = actF(), P = actP();
  const ms = Fo.moves.length ? Fo.moves : ['tackle'];
  const scores = ms.map(mv => {
    const M = MOVES[mv];
    if (!M.p) {
      if (M.flop) return .2;
      if (M.inflict) return P.st || immune(P, M.inflict) ? 0 : 7;
      if (M.heal) return Fo.hp < maxHP(Fo) * .45 ? 24 : 0;
      if (M.buff) { const [st, amt, who] = M.buff[0]; const cur = who === 'self' ? B.st.f[st] : B.st.p[st]; return (amt > 0 ? cur >= 2 : cur <= -2) ? 0 : 5; }
      return 1;
    }
    const dd = dmgDice(Fo, mv);
    return (dd.n * (dd.die + 1) / 2 + dd.flat) * effOf(M.t, SPECIES[P.sp].t) * (SPECIES[Fo.sp].t.includes(M.t) ? 1.25 : 1) * (1 + (M.acc || 0) * .07);
  });
  if (!canDamage(Fo, P) && Math.random() < .6) return 'struggle';
  const best = scores.indexOf(Math.max(...scores));
  const pBest = B.ai === 'smart' ? .82 : B.ai === 'normal' ? .55 : .3;
  if (Math.random() < pBest && scores[best] > 0) return ms[best];
  const tot = scores.reduce((a, b) => a + b + .5, 0);
  let x = Math.random() * tot;
  for (let i = 0; i < ms.length; i++) { x -= scores[i] + .5; if (x <= 0) return ms[i]; }
  return ms[0];
}
function canDamage(A, D){ return A.moves.some(mv => MOVES[mv].p && effOf(MOVES[mv].t, SPECIES[D.sp].t) > 0); }
/* ---------- Apex Ascension ---------- */
function apexFor(m){ const id = 'apex_' + m.sp; return SPECIES[id] ? id : null; }
function canAscend(){
  const B = G.B; if (!B || B.apexUsed || !G.keys.apexband) return false;
  const P = actP(); return P.hp > 0 && !P.apexFrom && !!apexFor(P) && !!G.keys['apexstone_' + P.sp];
}
function ascend(side){
  const B = G.B, m = side === 'p' ? actP() : actF(), into = apexFor(m); if (!into) return;
  const name = nameOf(side, m);
  m.apexFrom = m.sp; m.sp = into;
  if (side === 'p') B.apexUsed = true; else B.foeApexUsed = true;
  qf(side === 'p' ? `${name}’s Apex Stone answers your Apex Band!` : `${TRAINERS[B.trainer].name}’s Apex Band flares!`, 'status');
  qf(`${name} ascends into ${SPECIES[into].n}!`, 'big');
}
function foeMaybeAscend(){
  const B = G.B; if (!B.trainer || B.foeApexUsed) return;
  const T = TRAINERS[B.trainer]; if (!T.apex) return;
  const want = T.apex.map(a => a === 'starter' ? rivalLine(T)[2] : a);
  const F0 = actF(); if (want.includes(F0.sp) && apexFor(F0)) ascend('f');
}
function foeDecide(){
  const B = G.B, Fo = actF();
  if (B.heals > 0 && Fo.hp < maxHP(Fo) * .3 && Math.random() < .6) return { type:'heal' };
  return { type:'move', id:chooseFoeMove() };
}
function foeHeal(){
  const B = G.B, Fo = actF(); B.heals--;
  const b = Fo.hp; Fo.hp = Math.min(maxHP(Fo), Fo.hp + Math.round(maxHP(Fo) * .5));
  qf(`${TRAINERS[B.trainer].name} uses a Hyper Salve. ${SPECIES[Fo.sp].n} recovers ${Fo.hp - b} HP.`, 'foe');
}
function doRun(){
  const B = G.B, r = d(20), bonus = amod(G.abil.dex) + (G.bg === 'ranger' ? 2 : 0), tot = r + bonus;
  const dc = 10 + clamp(Math.floor((SPECIES[actF().sp].b[3] - SPECIES[actP().sp].b[3]) / 20), -3, 4);
  qf(`Escape roll ${r} ${sgn(bonus)} = ${tot} vs DC ${dc}`, 'roll', { v:r, kind:diceKind(r), label:'Escape' });
  if (r !== 1 && (r === 20 || tot >= dc)) { qf('You get away safely.'); B.over = true; B.result = 'fled'; return true; }
  qf('You can’t get away!', 'muted');
  return false;
}
function doCatch(id){
  const B = G.B, f = actF(), s = SPECIES[f.sp], ball = ITEMS[id];
  consume(id);
  qf(`You throw a ${ball.n}!`);
  if (ball.bonus >= 99) { qf('The capsule doesn’t even wobble.', 'muted'); caught(f); return true; }
  const hpB = Math.floor(8 * (1 - f.hp / maxHP(f)));
  const stB = f.st === 'sleep' || f.st === 'para' ? 3 : f.st ? 2 : 0;
  const dc = s.dc + Math.floor(f.lvl / 5) - hpB - stB;
  const r = d(20), bonus = ball.bonus + amod(G.abil.dex) + (G.bg === 'ranger' ? 2 : 0), tot = r + bonus;
  qf(`Capture roll ${r} ${sgn(bonus)} = ${tot} vs DC ${dc}`, 'roll', { v:r, kind:diceKind(r), label:'Capture' });
  if (r === 20 || (r !== 1 && tot >= dc)) { caught(f); return true; }
  const miss = dc - tot;
  qf(miss <= 2 ? 'Argh! It was so close!' : miss <= 6 ? 'It breaks free!' : 'It bursts out immediately!', 'muted');
  return false;
}
function caught(f){
  const B = G.B;
  const m = { uid:newUid(), sp:f.sp, lvl:f.lvl, xp:0, moves:f.moves.slice(), hp:Math.max(1, f.hp), st:null, slp:0 };
  const where = addMon(m);
  qf(`Gotcha! ${SPECIES[f.sp].n} is caught!`, 'big good');
  if (where === 'ranch') qf(`Your party is full, so ${SPECIES[f.sp].n} goes to the ranch.`, 'muted');
  B.over = true; B.result = 'caught';
}
function doSwitch(idx, forced){
  const B = G.B, old = actP();
  B.pi = idx; B.st.p = stages0();
  const m = actP(); if (!B.part.includes(m.uid)) B.part.push(m.uid);
  qf(forced ? `Go, ${mname(m)}!` : `${mname(old)}, come back! Go, ${mname(m)}!`, 'you');
}
function battleItem(id, uid){
  const B = G.B, it = ITEMS[id], m = findMon(uid);
  consume(id);
  if (it.kind === 'heal') { const b = m.hp; m.hp = Math.min(maxHP(m), m.hp + it.amt); qf(`You use a ${it.n} on ${mname(m)}. (+${m.hp - b} HP)`, 'good'); }
  else if (it.kind === 'revive') { m.hp = Math.floor(maxHP(m) / 2); B.fainted = B.fainted.filter(u => u !== uid); qf(`${mname(m)} is back on its feet!`, 'good'); }
  else if (it.kind === 'cure') { m.st = null; m.slp = 0; qf(`${mname(m)} is cured.`, 'good'); }
}
function playerAction(a){
  const B = G.B; if (!B || B.over || B.queue.length || ANIM) return;
  if (B.needSwitch) { if (a.type !== 'switch') return; B.needSwitch = false; B.menu = 'main'; doSwitch(a.idx, true); play(); return; }
  B.menu = 'main';
  const foeAct = foeDecide();
  if (a.type === 'move') {
    if (foeAct.type === 'heal') { foeHeal(); useMove('p', a.id); resolveFaints(); }
    else {
      const P = actP(), Fo = actF();
      const ip = d(20) + spdMod(P) + (MOVES[a.id].prio || 0) + (P.st === 'para' ? -2 : 0);
      const iF = d(20) + spdMod(Fo) + (MOVES[foeAct.id].prio || 0) + (Fo.st === 'para' ? -2 : 0);
      qf(`Initiative: ${mname(P)} ${ip}, ${SPECIES[Fo.sp].n} ${iF}.`, 'init');
      const order = ip >= iF ? [['p', a.id], ['f', foeAct.id]] : [['f', foeAct.id], ['p', a.id]];
      for (const [s, mv] of order) { useMove(s, mv); if (resolveFaints()) break; }
    }
  } else {
    if (a.type === 'run') { if (doRun()) return play(); }
    else if (a.type === 'catch') { if (doCatch(a.id)) return play(); }
    else if (a.type === 'switch') doSwitch(a.idx, false);
    else if (a.type === 'item') battleItem(a.id, a.uid);
    if (foeAct.type === 'heal') foeHeal(); else { useMove('f', foeAct.id); resolveFaints(); }
  }
  if (!B.over && !B.needSwitch) endRound();
  play();
}
function endRound(){
  for (const side of ['p', 'f']) {
    const m = side === 'p' ? actP() : actF(); if (m.hp <= 0) continue;
    const n = nameOf(side, m);
    if (m.st === 'burn') { const x = Math.max(1, Math.floor(maxHP(m) / 12)); m.hp = Math.max(0, m.hp - x); qf(`${n} is hurt by its burn. (${x})`, 'status', null, side); }
    if (m.st === 'poison') { const x = Math.max(1, Math.floor(maxHP(m) / 10)); m.hp = Math.max(0, m.hp - x); qf(`${n} is hurt by poison. (${x})`, 'status', null, side); }
  }
  resolveFaints();
}
function finishBattle(){
  const B = G.B; if (!B || !B.over || B.queue.length) return;
  const res = B.result, hook = B.hook, foeName = SPECIES[B.foe[0].apexFrom || B.foe[0].sp].n;
  for (const m of G.party) { m.st = null; m.slp = 0; if (m.apexFrom) { m.sp = m.apexFrom; delete m.apexFrom; } }
  G.lastBattle = res; G.B = null;
  const inScene = hook && G.scene && G.scene.id === hook.scene;
  if (res === 'lose') {
    if (hook && hook.soft) { healParty(); note('Your partners are patched up before you go on.'); }
    else whiteout();
  } else if (!inScene) {
    if (B.kind === 'wild') pushFeed({ k:'sys', text: res === 'caught' ? `Caught ${foeName}.` : res === 'fled' ? `You slipped away from the ${foeName}.` : `You drove off the wild ${foeName}.` });
    else pushFeed({ k:'sys', text:`Defeated ${TRAINERS[B.trainer].name}.` });
  }
  runQueues(() => {
    if (inScene && G.scene && !(res === 'lose' && !hook.soft)) {
      const target = res === 'fled' ? (hook.fled || hook.go) : res === 'lose' ? (hook.lose || hook.go) : hook.go;
      enterStep(target);
    }
    commit();
  });
}
function runQueues(cb){
  const L = G.pendingLearn.shift();
  if (L) { const m = findMon(L.uid); if (!m || m.moves.includes(L.mv)) return runQueues(cb); openLearn(m, L.mv, () => runQueues(cb)); return; }
  const E = G.pendingEvo.shift();
  if (E) { const m = findMon(E.uid); if (!m || m.sp === E.into || !SPECIES[m.sp].evo || SPECIES[m.sp].evo[1] !== E.into) return runQueues(cb); openEvo(m, E.into, () => runQueues(cb)); return; }
  cb();
}
function evolve(m, into){
  const before = maxHP(m), old = SPECIES[m.sp].n;
  m.sp = into; m.hp = Math.min(maxHP(m), m.hp + (maxHP(m) - before));
  markCaught(into);
  pushFeed({ k:'loot', text:`${old} evolved into ${SPECIES[into].n}!` });
  learnAtLevel(m, t => pushFeed({ k:'sys', text:t }));
  const ns = SPECIES[into];
  if (ns.evo && typeof ns.evo[0] === 'number' && m.lvl >= ns.evo[0]) G.pendingEvo.push({ uid:m.uid, into:ns.evo[1] });
}

/* ================= Items outside battle ================= */
function useItemOn(id, uid){
  const it = ITEMS[id], m = findMon(uid); if (!m || !G.items[id]) return;
  if (it.kind === 'heal') {
    if (m.hp <= 0) return toast(`${mname(m)} has fainted. A Revival Herb would help.`);
    if (m.hp >= maxHP(m)) return toast(`${mname(m)} is already at full health.`);
    const b = m.hp; m.hp = Math.min(maxHP(m), m.hp + it.amt); consume(id);
    pushFeed({ k:'sys', text:`${mname(m)} recovers ${m.hp - b} HP.` });
  } else if (it.kind === 'revive') {
    if (m.hp > 0) return toast(`${mname(m)} hasn’t fainted.`);
    m.hp = Math.floor(maxHP(m) / 2); consume(id); pushFeed({ k:'sys', text:`${mname(m)} is back on its feet.` });
  } else if (it.kind === 'level') {
    if (m.lvl >= 100) return toast('It can’t grow any further.');
    consume(id); gainXP(m, xpNeed(m.lvl) - m.xp, t => pushFeed({ k:'sys', text:t }));
    UI.modal = null; return runQueues(commit);
  } else if (it.kind === 'stone') {
    const s = SPECIES[m.sp];
    if (!s.evo || s.evo[0] !== id) return toast('Nothing happens.');
    consume(id); G.pendingEvo.push({ uid:m.uid, into:s.evo[1] });
    UI.modal = null; return runQueues(commit);
  }
  UI.modal = null; commit();
}

/* ================= AI Dungeon Master ================= */
const DM_CHIPS = ['Look around', 'Talk to someone nearby', 'Search for anything useful', 'Train with my partners'];
const DM_ITEMS = ['salve', 'capsule', 'supersalve', 'tonic'];
function dmPrompt(action){
  const n = NODES[G.node], bg = BACKGROUNDS[G.bg];
  const skills = Object.keys(SKILLS).map(k => `${k} ${sgn(checkInfo(k).bonus)}`).join(', ');
  const party = G.party.map(m => `${mname(m)} (${SPECIES[m.sp].t.join('/')}, Lv ${m.lvl}, HP ${m.hp}/${maxHP(m)})`).join('; ');
  const story = MILESTONES.filter(([f]) => F(G, f)).map(([, t]) => '- ' + t).join('\n') || '- The journey has only just begun.';
  const badges = G.badges.map(b => BADGES.find(x => x[0] === b)[1]).join(', ') || 'none yet';
  const here = [...new Set((n.enc || []).map(e => SPECIES[e[0]].n))];
  const recent = G.feed.slice(-8).map(feedPlain).filter(Boolean).join('\n');
  return [
`You are the Dungeon Master for "Halcyon Road", a single-player tabletop-style creature-trainer RPG played with d20 rules. The world is the Halcyon Region: trainers catch creatures ("partners") in Capsules, earn eight gym badges and challenge the Summit League. Team Umbra (black lantern pins, led by Director Cassius Vane) is the villainous organization. The rival is Corin Marr, grandchild of Professor Linden Marr of Thistle Hollow.`,
`Rules for you:
- Narrate in second person, present tense, warm and a little wry. 2 to 4 sentences per outcome. Never decide how the player feels.
- The scripted campaign owns the main plot. Do not award badges, key items or story progress, do not resolve Umbra's schemes, and do not move the player to another location. If the player tries something the story handles (a gym, a locked road, a story event), say it can't happen right now or point them toward it, with no check.
- Wild creatures that live here: ${here.length ? here.join(', ') : 'none (this is a settlement)'}. Mention no other species.
- Keep effects small and earned. Most actions need no effects at all.`,
`Location: ${n.n}, in ${(REGIONS[n.rg] || REGIONS.halcyon).n}. ${n.d}
Trainer: ${G.name}, ${bg.n}. Skill bonuses: ${skills}. Money: ${G.money} crowns. Badges: ${badges}.
Party: ${party}.
Story so far:
${story}
Recent events:
${recent || '(nothing yet)'}`,
`The player's action: """${action}"""`,
`Decide whether this needs an ability check. Trivial, safe or impossible actions need none. If one is needed, pick one skill from [${Object.keys(SKILLS).join(', ')}] and a DC (5 very easy, 10 easy, 13 medium, 15 hard, 20 very hard). Write the outcome for both success and failure; the game rolls the d20.
Optional effects, at most 2 per outcome:
{"type":"item","id":"salve"|"capsule"|"supersalve"|"tonic","qty":1}
{"type":"money","amount":-200 to 300}
{"type":"heal"} (only after real rest somewhere safe)
{"type":"hurt","amount":1 to 15} (the lead partner is hurt)
{"type":"encounter","species":"<one creature from the list above>"} (a wild creature attacks; a battle starts after your text)
{"type":"inspiration"} (rarely, for a clever or heartfelt idea)
Reply with only JSON in this shape:
{"check":null or {"skill":"perception","dc":13},"success":{"text":"...","effects":[]},"failure":{"text":"...","effects":[]}}
If check is null, write only "success".`
  ].join('\n\n');
}
async function dmAct(text){
  text = String(text || '').trim().slice(0, 300);
  if (!text || !DM.sample || DM.busy || !G || G.B || G.scene) return;
  pushFeed({ k:'you', text });
  UI.dmDraft = '';
  DM.busy = true; const ctl = new AbortController(); DM.ctl = ctl;
  render();
  try {
    const out = await DM.sample.json(dmPrompt(text), { modelTier: G.settings.tier === 'rich' ? 'default' : 'quick', cache:false, signal:ctl.signal });
    DM.busy = false; DM.ctl = null;
    if (G.B || G.scene) return render();
    resolveDM(out);
  } catch (e) {
    DM.busy = false; DM.ctl = null;
    const code = e && e.code;
    if (code === 'cancelled') pushFeed({ k:'sys', text:'You think better of it.' });
    else if (['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'].includes(code)) { DM.state = 'denied'; pushFeed({ k:'sys', text:'The AI Dungeon Master is switched off for this visit. Everything scripted still works.' }); }
    else if (code === 'rate_limited') pushFeed({ k:'sys', text:'The Dungeon Master needs a breather. Try again in a little while.' });
    else if (code === 'refused') pushFeed({ k:'sys', text:'The Dungeon Master won’t narrate that one. Try something else.' });
    else pushFeed({ k:'sys', text:'The Dungeon Master lost the thread. Try again, or put it another way.' });
    commit();
  }
}
function resolveDM(out){
  if (!out || typeof out !== 'object') { pushFeed({ k:'sys', text:'The Dungeon Master lost the thread. Try again.' }); return commit(); }
  let branch = out.success || out;
  const c = out.check;
  if (c && typeof c === 'object' && SKILLS[c.skill]) {
    const res = rollCheck(c.skill, clamp(Math.round(Number(c.dc) || 10), 5, 25));
    pushFeed({ k:'check', res });
    if (res.r === 20) gainInsp(G);
    branch = res.ok ? (out.success || {}) : (out.failure || out.success || {});
  }
  const txt = String((branch && branch.text) || out.text || '').trim().slice(0, 1400);
  if (txt) pushFeed({ k:'dm', text:txt });
  const enc = applyDMEffects(Array.isArray(branch && branch.effects) ? branch.effects.slice(0, 2) : []);
  if (enc) { startWild(enc[0], enc[1], null); }
  commit();
}
function applyDMEffects(effs){
  const n = NODES[G.node];
  const loot = G.dmLoot[G.node] || 0;
  let encounter = null;
  for (const e of effs) {
    if (!e || typeof e !== 'object') continue;
    if (e.type === 'item' && DM_ITEMS.includes(e.id) && loot < 3) { const q = clamp(Math.round(Number(e.qty) || 1), 1, 2); G.items[e.id] = (G.items[e.id] || 0) + q; G.dmLoot[G.node] = loot + 1; pushFeed({ k:'loot', text:`Received ${q} × ${ITEMS[e.id].n}.` }); }
    else if (e.type === 'money') {
      const a = clamp(Math.round(Number(e.amount) || 0), -200, 300);
      if (a > 0 && loot < 3) { G.money += a; G.dmLoot[G.node] = loot + 1; pushFeed({ k:'loot', text:`+${fmtMoney(a)}` }); }
      else if (a < 0) { const x = Math.min(G.money, -a); G.money -= x; pushFeed({ k:'sys', text:`You spend ${fmtMoney(x)}.` }); }
    }
    else if (e.type === 'heal') { healParty(); pushFeed({ k:'sys', text:'Your partners are rested.' }); }
    else if (e.type === 'hurt') { const m = G.party.find(x => x.hp > 0); if (m) { const a = clamp(Math.round(Number(e.amount) || 1), 1, 15); m.hp = Math.max(1, m.hp - a); pushFeed({ k:'sys', text:`${mname(m)} takes ${a} damage.` }); } }
    else if (e.type === 'inspiration') gainInsp(G);
    else if (e.type === 'encounter' && n.enc && !encounter) {
      const want = String(e.species || '').toLowerCase();
      const row = n.enc.find(r => SPECIES[r[0]].n.toLowerCase() === want || r[0] === want);
      if (row) encounter = [row[0], row[1] + rnd(row[2] - row[1] + 1)];
    }
  }
  return encounter;
}

/* ================= Sprites ================= */
function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mix(a, b, t){
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = sh => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return '#' + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1);
}
function textOn(hex){ const p = parseInt(hex.slice(1), 16); const l = (.299 * ((p >> 16) & 255) + .587 * ((p >> 8) & 255) + .114 * (p & 255)) / 255; return l > .6 ? '#1a2426' : '#ffffff'; }
const SPR_CACHE = {};
function sprite(id, opt = {}){
  const key = id + (opt.flip ? ':f' : '');
  if (!SPR_CACHE[key]) SPR_CACHE[key] = buildSprite(id, !!opt.flip);
  return `<svg class="spr ${opt.cls || ''}" viewBox="0 0 100 100" role="img" aria-label="${esc(SPECIES[id].n)}">${SPR_CACHE[key]}</svg>`;
}
function buildSprite(id, flip){
  const s = SPECIES[id], h = hashStr(id), j = k => ((h >>> k) & 15) / 15;
  const c1 = TYPE_COLOR[s.t[0]], c2 = s.t[1] ? TYPE_COLOR[s.t[1]] : mix(c1, '#000000', .28);
  const lite = mix(c1, '#ffffff', .55), INK = '#1c2426', BONE = '#f1e8d0';
  const f = new Set(s.f), back = [], body = [], front = [];
  const SW = `stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"`;
  let H, top, bk, tail, eyes, belly, mouth;
  const er = f.has('eyesbig') ? 5.4 : 3.8;
  if (s.sh === 'round') {
    const rx = 25 + j(0) * 4, ry = 23 + j(4) * 3;
    body.push(`<ellipse cx="38" cy="84" rx="8" ry="4.5" fill="${mix(c1, '#000000', .35)}" ${SW}/><ellipse cx="62" cy="84" rx="8" ry="4.5" fill="${mix(c1, '#000000', .35)}" ${SW}/>`);
    body.push(`<ellipse cx="50" cy="60" rx="${rx}" ry="${ry}" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="50" cy="${66 + ry * .1}" rx="${rx * .58}" ry="${ry * .5}" fill="${lite}"/>`;
    H = { x:50, y:52, r:rx }; top = { x:50, y:60 - ry }; bk = { x:50, y:60 - ry }; tail = { x:50 + rx - 3, y:66 };
    eyes = [[41, 54], [59, 54]]; mouth = [50, 62];
  } else if (s.sh === 'quad') {
    const rx = 23 + j(0) * 4, ry = 14 + j(4) * 2, legC = mix(c1, '#000000', .2);
    for (const x of [40, 48, 63, 71]) body.push(`<rect x="${x - 3.5}" y="64" width="7" height="22" rx="3" fill="${legC}" ${SW}/>`);
    body.push(`<ellipse cx="56" cy="62" rx="${rx}" ry="${ry}" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="56" cy="68" rx="${rx * .6}" ry="${ry * .38}" fill="${lite}"/>`;
    H = { x:31, y:45, r:13 }; top = { x:31, y:32 }; bk = { x:58, y:62 - ry }; tail = { x:56 + rx - 2, y:58 };
    eyes = [[27, 43], [35, 43]]; mouth = [26, 51];
  } else if (s.sh === 'tall') {
    const legC = mix(c1, '#000000', .2);
    body.push(`<rect x="39" y="76" width="8" height="12" rx="3" fill="${legC}" ${SW}/><rect x="53" y="76" width="8" height="12" rx="3" fill="${legC}" ${SW}/>`);
    body.push(`<ellipse cx="31" cy="62" rx="5" ry="11" transform="rotate(20 31 62)" fill="${c1}" ${SW}/><ellipse cx="69" cy="62" rx="5" ry="11" transform="rotate(-20 69 62)" fill="${c1}" ${SW}/>`);
    body.push(`<ellipse cx="50" cy="63" rx="${17 + j(0) * 3}" ry="${20 + j(4) * 2}" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="50" cy="67" rx="10" ry="12" fill="${lite}"/>`;
    H = { x:50, y:33, r:14 }; top = { x:50, y:19 }; bk = { x:50, y:44 }; tail = { x:64, y:76 };
    eyes = [[45, 32], [55, 32]]; mouth = [50, 39];
  } else if (s.sh === 'bird') {
    body.push(`<line x1="50" y1="72" x2="47" y2="87" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><line x1="60" y1="72" x2="63" y2="87" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`);
    body.push(`<path d="M74,56 L92,48 L90,62 Z" fill="${c2}" ${SW}/>`);
    body.push(`<ellipse cx="56" cy="60" rx="${21 + j(0) * 3}" ry="${15 + j(4) * 2}" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="52" cy="66" rx="12" ry="7" fill="${lite}"/>`;
    H = { x:35, y:43, r:11.5 }; top = { x:35, y:31 }; bk = { x:60, y:46 }; tail = { x:78, y:56 };
    eyes = [[32, 41]]; mouth = null;
  } else if (s.sh === 'serpent') {
    const p = 'M18,84 C30,62 50,94 66,72 S78,46 60,40';
    body.push(`<path d="${p}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round"/><path d="${p}" fill="none" stroke="${c1}" stroke-width="13.5" stroke-linecap="round"/><path d="${p}" fill="none" stroke="${lite}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`);
    H = { x:58, y:34, r:12 }; top = { x:58, y:22 }; bk = { x:42, y:76 }; tail = { x:18, y:84 };
    eyes = [[54, 32], [63, 32]]; mouth = [58, 41];
  } else if (s.sh === 'blob') {
    body.push(`<path d="M24,84 Q18,52 50,34 Q82,52 76,84 Q63,78 50,86 Q37,78 24,84Z" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="50" cy="68" rx="14" ry="9" fill="${lite}" opacity=".8"/>`;
    H = { x:50, y:56, r:22 }; top = { x:50, y:35 }; bk = { x:50, y:38 }; tail = { x:74, y:80 };
    eyes = [[42, 57], [58, 57]]; mouth = [50, 65];
  } else if (s.sh === 'ghost') {
    body.push(`<path d="M28,82 Q24,40 50,30 Q76,40 72,70 Q74,88 63,80 Q57,92 50,82 Q43,92 37,82 Q30,90 28,82Z" fill="${c1}" opacity=".93" ${SW}/>`);
    H = { x:50, y:50, r:20 }; top = { x:50, y:31 }; bk = { x:50, y:32 }; tail = { x:68, y:82 };
    eyes = null; mouth = [50, 64];
  } else if (s.sh === 'insect') {
    for (let i = 0; i < 3; i++) { const x0 = 40 + i * 9; body.push(`<path d="M${x0 + 5},64 l5,10 l-2,11" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/><path d="M${x0},64 l-6,10 l3,11" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`); }
    body.push(`<ellipse cx="64" cy="62" rx="${17 + j(0) * 3}" ry="${12 + j(4) * 2}" fill="${c1}" ${SW}/><circle cx="46" cy="60" r="9" fill="${mix(c1, '#000000', .14)}" ${SW}/><circle cx="32" cy="52" r="10" fill="${c1}" ${SW}/>`);
    belly = `<path d="M54,67 q11,6 23,0" fill="none" stroke="${lite}" stroke-width="3" stroke-linecap="round"/>`;
    H = { x:32, y:52, r:10 }; top = { x:32, y:42 }; bk = { x:62, y:51 }; tail = { x:80, y:64 };
    eyes = [[29, 50], [36, 50]]; mouth = null;
  } else if (s.sh === 'crab') {
    for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) body.push(`<path d="M${50 + sx * (10 + i * 6)},70 l${sx * 7},8 l${sx * 2},8" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);
    for (const sx of [-1, 1]) {
      const ax = 50 + sx * 22, cx = 50 + sx * 34, arm = `M${ax},62 Q${50 + sx * 31},60 ${cx},50`;
      body.push(`<path d="${arm}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${arm}" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round"/><path d="M${cx},51 q${sx * 1},-15 ${sx * 11},-13 l${-sx * 6},9 z" fill="${c2}" ${SW}/><path d="M${cx},51 q${sx * 11},-1 ${sx * 12},-8 l${-sx * 7},2 z" fill="${c2}" ${SW}/>`);
    }
    body.push(`<path d="M44,56 L41,43 M56,56 L59,43" stroke="${INK}" stroke-width="2"/><ellipse cx="50" cy="64" rx="${24 + j(0) * 3}" ry="${14 + j(4) * 2}" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="50" cy="70" rx="14" ry="5" fill="${lite}"/>`;
    H = { x:50, y:52, r:14 }; top = { x:50, y:50 }; bk = { x:50, y:52 }; tail = { x:74, y:70 };
    eyes = [[41, 41], [59, 41]]; mouth = [50, 64];
  } else if (s.sh === 'bulb') {
    body.push(`<ellipse cx="38" cy="87" rx="9" ry="4" fill="#5aa24c" ${SW}/><ellipse cx="62" cy="87" rx="9" ry="4" fill="#5aa24c" ${SW}/>`);
    body.push(`<path d="M50,30 C70,40 77,62 72,75 Q66,88 50,88 Q34,88 28,75 C23,62 30,40 50,30Z" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="50" cy="76" rx="13" ry="7" fill="${lite}"/>`;
    H = { x:50, y:60, r:20 }; top = { x:50, y:32 }; bk = { x:50, y:36 }; tail = { x:72, y:74 };
    eyes = [[43, 60], [57, 60]]; mouth = [50, 68];
  } else {
    body.push(`<path d="M72,58 L90,43 L90,73 Z" fill="${c2}" ${SW}/>`);
    body.push(`<ellipse cx="50" cy="58" rx="${26 + j(0) * 2}" ry="${16 + j(4) * 2}" fill="${c1}" ${SW}/>`);
    belly = `<ellipse cx="46" cy="64" rx="15" ry="6" fill="${lite}"/>`;
    H = { x:36, y:55, r:14 }; top = { x:50, y:42 }; bk = { x:52, y:43 }; tail = { x:74, y:58 };
    eyes = [[34, 53]]; mouth = [27, 62];
  }
  if (f.has('aura')) back.push(`<circle cx="50" cy="56" r="44" fill="${c2}" opacity=".13"/><circle cx="50" cy="56" r="43" fill="none" stroke="${c2}" stroke-width="1.4" stroke-dasharray="3 5" opacity=".7"/>`);
  if (f.has('tail') || f.has('flame') || f.has('bolt')) {
    if (f.has('tail') && s.sh !== 'bird') {
      const tp = `M${tail.x},${tail.y} q12,-2 13,-18`;
      back.push(`<path d="${tp}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${tp}" fill="none" stroke="${c1}" stroke-width="5" stroke-linecap="round"/>`);
    }
    const tx = s.sh === 'bird' ? top.x : tail.x + (f.has('tail') && s.sh !== 'bird' ? 13 : 2), ty = s.sh === 'bird' ? top.y - 2 : tail.y - (f.has('tail') && s.sh !== 'bird' ? 18 : 6);
    if (f.has('flame')) back.push(`<path d="M${tx},${ty + 4} q-7,-6 -2,-15 q2,5 5,4 q-2,-7 4,-12 q1,9 5,12 q4,8 -4,11 z" fill="#ffb547" ${SW}/><path d="M${tx + 1},${ty + 2} q-3,-4 0,-8 q2,4 4,3 q2,4 -1,5 z" fill="#ff6a2b"/>`);
    if (f.has('bolt')) back.push(`<path d="M${tx - 2},${ty + 2} l6,-8 -3,0 6,-9 -2,7 3,0 -8,10 z" fill="#f7d84a" ${SW}/>`);
  }
  if (f.has('wings') && s.sh !== 'bird') back.push(`<ellipse cx="${bk.x + 10}" cy="${bk.y - 4}" rx="15" ry="7" transform="rotate(-32 ${bk.x + 10} ${bk.y - 4})" fill="${lite}" ${SW}/><ellipse cx="${bk.x - 8}" cy="${bk.y - 6}" rx="13" ry="6" transform="rotate(-150 ${bk.x - 8} ${bk.y - 6})" fill="${mix(lite, '#000000', .1)}" ${SW}/>`);
  if (f.has('wings') && s.sh === 'bird') back.push(`<ellipse cx="62" cy="44" rx="16" ry="7" transform="rotate(-35 62 44)" fill="${mix(c2, '#000000', .15)}" ${SW}/>`);
  if (f.has('mane')) for (const a of [-160, -125, -90, -55, -20]) { const rr = H.r + 1, x = H.x + rr * Math.cos(a * Math.PI / 180) + (s.sh === 'quad' ? 4 : 0), y = H.y + rr * Math.sin(a * Math.PI / 180); back.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${c2}" ${SW}/>`); }
  if (f.has('tentacles')) for (const x of [34, 44, 56, 66]) back.push(`<path d="M${x},80 q-4,6 0,10 q4,4 0,9" fill="none" stroke="${c2}" stroke-width="3.5" stroke-linecap="round"/>`);
  const headNeeded = ['quad', 'tall', 'bird', 'serpent'].includes(s.sh);
  if (headNeeded) {
    if (s.sh === 'quad') body.push(`<circle cx="${H.x}" cy="${H.y}" r="${H.r}" fill="${c1}" ${SW}/><ellipse cx="21" cy="50" rx="7" ry="5" fill="${lite}" ${SW}/>`);
    else body.push(`<circle cx="${H.x}" cy="${H.y}" r="${H.r}" fill="${c1}" ${SW}/>`);
    if (s.sh === 'bird') body.push(`<path d="M25,41 L13,45 L25,49 Z" fill="#e8b84a" ${SW}/>`);
  }
  if (f.has('cap')) front.push(`<path d="M18,${top.y + 14} Q50,${top.y - 18} 82,${top.y + 14} Q50,${top.y + 22} 18,${top.y + 14}Z" fill="${c2}" ${SW}/><circle cx="38" cy="${top.y + 6}" r="3" fill="#fff"/><circle cx="56" cy="${top.y + 2}" r="4" fill="#fff"/><circle cx="68" cy="${top.y + 10}" r="2.5" fill="#fff"/>`);
  if (f.has('shell')) front.push(`<path d="M${bk.x - 20},${bk.y + 14} Q${bk.x},${bk.y - 14} ${bk.x + 20},${bk.y + 14} Z" fill="${c2}" ${SW}/><path d="M${bk.x - 10},${bk.y + 9} Q${bk.x},${bk.y - 3} ${bk.x + 10},${bk.y + 9}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  if (f.has('rocks')) for (const [dx, dy] of [[-12, 10], [10, 6], [0, 20]]) front.push(`<path d="M${50 + dx - 5},${60 + dy} l4,-5 6,1 2,5 -5,4z" fill="#8f8676" ${SW}/>`);
  if (f.has('spikes')) for (const i of [-1, 0, 1]) { const cx = bk.x + i * 9, cy = bk.y + Math.abs(i) * 3 + 2; front.push(`<path d="M${cx - 4.5},${cy} L${cx},${cy - 10} L${cx + 4.5},${cy} Z" fill="${s.t[0] === 'ice' ? '#e8fbff' : BONE}" ${SW}/>`); }
  if (f.has('fin')) front.push(`<path d="M${bk.x - 7},${bk.y + 2} L${bk.x + 1},${bk.y - 13} L${bk.x + 8},${bk.y + 2} Z" fill="${c2}" ${SW}/>`);
  const hx = H.x, hy = H.y, hr = H.r;
  if (f.has('ears')) {
    const L = `M${hx - hr * .85},${hy - hr * .35} L${hx - hr * .6},${hy - hr * 1.45} L${hx - hr * .05},${hy - hr * .85} Z`;
    const R = `M${hx + hr * .85},${hy - hr * .35} L${hx + hr * .6},${hy - hr * 1.45} L${hx + hr * .05},${hy - hr * .85} Z`;
    (s.sh === 'round' || s.sh === 'blob' || s.sh === 'ghost' ? front : body).push(`<path d="${L}" fill="${c1}" ${SW}/><path d="${R}" fill="${c1}" ${SW}/>`);
  }
  if (f.has('horns')) front.push(`<path d="M${hx - hr * .45},${hy - hr * .75} L${hx - hr * .95},${hy - hr * 1.7} L${hx - hr * .1},${hy - hr * .95} Z" fill="${BONE}" ${SW}/><path d="M${hx + hr * .45},${hy - hr * .75} L${hx + hr * .95},${hy - hr * 1.7} L${hx + hr * .1},${hy - hr * .95} Z" fill="${BONE}" ${SW}/>`);
  if (f.has('horn')) front.push(s.sh === 'quad' ? `<path d="M17,46 L13,32 L24,44 Z" fill="${BONE}" ${SW}/>` : `<path d="M${hx - 4},${top.y + 2} L${hx},${top.y - 12} L${hx + 4},${top.y + 2} Z" fill="${BONE}" ${SW}/>`);
  if (f.has('antlers')) for (const sgnx of [-1, 1]) { const x0 = hx + sgnx * hr * .4, y0 = hy - hr * .85; front.push(`<path d="M${x0},${y0} l${sgnx * 6},-14 M${x0 + sgnx * 3},${y0 - 7} l${sgnx * 7},-3 M${x0 + sgnx * 5},${y0 - 11} l${-sgnx * 3},-6" fill="none" stroke="#b98a52" stroke-width="2.6" stroke-linecap="round"/>`); }
  if (f.has('crest')) for (const i of [-1, 0, 1]) front.push(`<path d="M${top.x + i * 4 - 2},${top.y + 3} L${top.x + i * 6},${top.y - 10} L${top.x + i * 4 + 2},${top.y + 3} Z" fill="${c2}" ${SW}/>`);
  if (f.has('leaf')) front.push(`<path d="M${top.x},${top.y + 2} q-12,-12 -1,-20 q11,8 1,20 z" fill="#6cc25a" ${SW}/><path d="M${top.x},${top.y + 1} l-1,-14" stroke="${INK}" stroke-width="1"/>`);
  if (f.has('curl')) front.push(`<path d="M${top.x},${top.y + 2} c-7,-8 6,-15 6,-6 c0,4 -5,3 -4,0" fill="none" stroke="${c1}" stroke-width="3.2" stroke-linecap="round"/>`);
  if (f.has('antennae')) front.push(`<path d="M${top.x - 4},${top.y + 2} L${top.x - 10},${top.y - 11} M${top.x + 4},${top.y + 2} L${top.x + 10},${top.y - 11}" stroke="${INK}" stroke-width="1.6"/><circle cx="${top.x - 10}" cy="${top.y - 12}" r="2.4" fill="${c2}" ${SW}/><circle cx="${top.x + 10}" cy="${top.y - 12}" r="2.4" fill="${c2}" ${SW}/>`);
  if (f.has('antenna')) front.push(`<path d="M${top.x},${top.y + 2} L${top.x + 5},${top.y - 12}" stroke="${INK}" stroke-width="1.8"/><circle cx="${top.x + 5}" cy="${top.y - 13}" r="3.4" fill="#f7d84a" ${SW}/>`);
  if (f.has('stinger')) front.push(`<path d="M${tail.x - 2},${tail.y - 3} L${tail.x + 12},${tail.y + 3} L${tail.x - 2},${tail.y + 6} Z" fill="#2c2c34" ${SW}/>`);
  if (f.has('claws')) for (const x of [35, 41, 59, 65]) front.push(`<path d="M${x - 2},86 L${x},91 L${x + 2},86 Z" fill="${BONE}" ${SW}/>`);
  const C = ({ round:[50, 60], quad:[56, 62], tall:[50, 63], bird:[56, 60], serpent:[44, 72], blob:[50, 64], ghost:[50, 58], fish:[50, 58], insect:[64, 62], crab:[50, 64], bulb:[50, 66] })[s.sh] || [50, 60];
  const flameAt = (tx, ty) => `<path d="M${tx},${ty + 4} q-7,-6 -2,-15 q2,5 5,4 q-2,-7 4,-12 q1,9 5,12 q4,8 -4,11 z" fill="#ffb547" ${SW}/><path d="M${tx + 1},${ty + 2} q-3,-4 0,-8 q2,4 4,3 q2,4 -1,5 z" fill="#ff6a2b"/>`;
  if (f.has('wool')) for (let i = 0; i < 7; i++) { const a = (195 + i * 25) * Math.PI / 180; body.push(`<circle cx="${(C[0] + 24 * Math.cos(a)).toFixed(1)}" cy="${(C[1] + 3 + 21 * Math.sin(a)).toFixed(1)}" r="7.5" fill="#f3efe4" ${SW}/>`); }
  if (f.has('stripes')) for (const dx of [-9, 0, 9]) front.push(`<path d="M${C[0] + dx - 2},${C[1] - 9} q5,9 0,18" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" opacity=".32"/>`);
  if (f.has('spots')) for (const [dx, dy, r] of [[-9, -4, 3.2], [8, -7, 2.5], [5, 6, 2.9], [-3, 9, 2.1]]) front.push(`<circle cx="${C[0] + dx}" cy="${C[1] + dy}" r="${r}" fill="${BONE}" opacity=".75"/>`);
  if (f.has('mask') && eyes) { const xs = eyes.map(e => e[0]); front.push(`<rect x="${Math.min(...xs) - 6}" y="${eyes[0][1] - 4.5}" width="${Math.max(...xs) - Math.min(...xs) + 12}" height="9" rx="4" fill="${INK}" opacity=".6"/>`); }
  if (f.has('gem')) front.push(`<path d="M${hx},${hy - hr * .62 - 5} l4.5,5 -4.5,5 -4.5,-5 z" fill="${s.t[1] ? c2 : '#bfe9ff'}" ${SW}/>`);
  if (f.has('petals')) { const pc = s.t[1] ? c2 : '#f08bb4'; for (let i = 0; i < 6; i++) { const a = i * 60, rad = a * Math.PI / 180; front.push(`<ellipse cx="${(top.x + 7 * Math.cos(rad)).toFixed(1)}" cy="${(top.y - 3 + 5 * Math.sin(rad)).toFixed(1)}" rx="5.5" ry="3.2" transform="rotate(${a} ${(top.x + 7 * Math.cos(rad)).toFixed(1)} ${(top.y - 3 + 5 * Math.sin(rad)).toFixed(1)})" fill="${pc}" ${SW}/>`); } front.push(`<circle cx="${top.x}" cy="${top.y - 3}" r="3.2" fill="#f7d84a" ${SW}/>`); }
  if (f.has('plume')) for (const r of [-38, -18, 2]) back.push(`<ellipse cx="${tail.x + 8}" cy="${tail.y - 4}" rx="11" ry="3.6" transform="rotate(${r} ${tail.x} ${tail.y})" fill="${c2}" ${SW}/>`);
  if (f.has('topflame')) front.push(flameAt(top.x - 2, top.y - 1));
  if (belly) body.push(belly);
  if (eyes) for (const [ex, ey] of eyes) front.push(`<circle cx="${ex}" cy="${ey}" r="${er}" fill="#fff" ${SW}/><circle cx="${ex + (s.sh === 'bird' || s.sh === 'fish' ? -1 : 0)}" cy="${ey + .4}" r="${er * .52}" fill="${INK}"/><circle cx="${ex + .9}" cy="${ey - .9}" r=".9" fill="#fff"/>`);
  else front.push(`<ellipse cx="42" cy="51" rx="4.2" ry="6" fill="${INK}"/><ellipse cx="58" cy="51" rx="4.2" ry="6" fill="${INK}"/><circle cx="43.3" cy="49" r="1.4" fill="#fff"/><circle cx="59.3" cy="49" r="1.4" fill="#fff"/>`);
  if (f.has('eyes3')) front.push(`<circle cx="${hx}" cy="${(eyes ? eyes[0][1] : 50) - 8}" r="2.8" fill="#fff" ${SW}/><circle cx="${hx}" cy="${(eyes ? eyes[0][1] : 50) - 8}" r="1.4" fill="${c2}"/>`);
  if (mouth) front.push(`<path d="M${mouth[0] - 3},${mouth[1]} q3,3 6,0" fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>`);
  if (f.has('teeth') && mouth) front.push(`<path d="M${mouth[0] - 2.5},${mouth[1] + .6} l1.2,3 1.2,-3 M${mouth[0] + .2},${mouth[1] + 1} l1.2,3 1.2,-3" fill="${BONE}" stroke="${INK}" stroke-width=".8"/>`);
  if (f.has('tusks') && eyes) front.push(`<path d="M${eyes[0][0] + 2},${eyes[0][1] + 12} l2,9 2,-9z" fill="${BONE}" ${SW}/><path d="M${eyes[eyes.length - 1][0] - 6},${eyes[0][1] + 12} l2,9 2,-9z" fill="${BONE}" ${SW}/>`);
  if (f.has('whiskers') && mouth) front.push(`<path d="M${mouth[0] - 5},${mouth[1] - 2} l-10,-3 M${mouth[0] - 5},${mouth[1]} l-10,2 M${mouth[0] + 5},${mouth[1] - 2} l10,-3 M${mouth[0] + 5},${mouth[1]} l10,2" stroke="${INK}" stroke-width="1"/>`);
  if (f.has('wings') && s.sh === 'bird') front.push(`<ellipse cx="60" cy="56" rx="16" ry="8" transform="rotate(-18 60 56)" fill="${c2}" ${SW}/><path d="M50,58 q10,4 22,-6" fill="none" stroke="${INK}" stroke-width="1"/>`);
  const stage = STAGE(id);
  const sc = (s.legend ? 1.04 : .8 + stage * .09) * (f.has('big') ? 1.14 : 1);
  const op = s.ghostly ? ' opacity=".78"' : '';
  const inner = `<g transform="translate(50 86) scale(${sc.toFixed(3)}) translate(-50 -86)"${op}>${back.join('')}${body.join('')}${front.join('')}</g>`;
  return flip ? `<g transform="translate(100 0) scale(-1 1)">${inner}</g>` : inner;
}
function typeChip(t){ return `<span class="tchip" style="background:${TYPE_COLOR[t]};color:${textOn(TYPE_COLOR[t])}">${t === 'none' ? 'typeless' : t}</span>`; }
function d20svg(v, kind){
  return `<svg class="d20 ${kind || ''}" viewBox="0 0 40 40" aria-hidden="true"><polygon class="d-f" points="20,2 36,11 36,29 20,38 4,29 4,11"/><path class="d-l" d="M20,9 L31,27 L9,27 Z M20,2 L20,9 M36,11 L20,9 M4,11 L20,9 M36,11 L31,27 M36,29 L31,27 M20,38 L31,27 M20,38 L9,27 M4,29 L9,27 M4,11 L9,27"/><text x="20" y="23">${v}</text></svg>`;
}

/* ================= Map ================= */
const LAND = 'M18,40 L60,22 L120,30 L160,12 L240,10 L300,8 L340,30 L370,60 L388,110 L380,160 L390,220 L385,268 L340,282 L285,276 L260,240 L230,222 L190,218 L140,222 L110,240 L100,280 L55,292 L40,262 L30,220 L10,180 L8,120 L12,70 Z';
const ISLANDS = [[205,283,22,11],[122,284,24,12],[226,251,16,9]];
const LABEL_POS = { underpass:[-9, 3.2, 'end'], ashgrove:[-9, 3.2, 'end'], wildreach:[-9, 3.2, 'end'], stormworks:[-9, 3.2, 'end'], league:[-5, -10, 'start'], summitpass:[-5, -10, 'start'], tower:[-5, -10, 'start'], s_league:[-5, -10, 'start'] };
const SEA_NODES = { rimefrost:1, cinderisle:1, stormworks:1 };
function mapSVG(){
  const cur = NODES[G.node], R = REGIONS[cur.rg] || REGIONS.halcyon;
  const here = Object.values(NODES).filter(n => n.rg === cur.rg);
  const edges = [], done = new Set();
  for (const a of here) for (const b of a.adj) {
    if (NODES[b].rg !== cur.rg) continue;
    const k = [a.id, b].sort().join('|'); if (done.has(k)) continue; done.add(k);
    const B = NODES[b], sea = SEA_NODES[a.id] || SEA_NODES[b];
    edges.push(`<line x1="${a.x}" y1="${a.y}" x2="${B.x}" y2="${B.y}" class="${sea ? 'm-sea' : 'm-road'}"/>`);
  }
  const nodes = here.map(n => {
    const here = n.id === G.node, adj = cur.adj.includes(n.id), coach = canCoach(n.id), open = canEnter(n.id);
    const go = (adj || coach) && !here;
    const cls = ['m-node', 'k-' + n.k, here ? 'here' : '', go ? (open ? 'go' : 'locked') : '', G.visited[n.id] ? 'seen' : ''].join(' ');
    const shape = n.k === 'town' ? `<circle r="6.2"/>` : n.k === 'league' ? `<rect x="-6" y="-6" width="12" height="12" transform="rotate(45)"/>` : n.k === 'cave' ? `<path d="M0,-6.5 L6.5,0 L0,6.5 L-6.5,0 Z"/>` : `<circle r="3.8"/>`;
    const [lx, ly, la] = n.lp || LABEL_POS[n.id] || [9, 3.2, 'start'];
    const lbl = `<text x="${lx}" y="${ly}" text-anchor="${la}">${esc(n.n)}</text>`;
    const attrs = go ? ` data-a="travel" data-v="${n.id}" role="button" tabindex="0" aria-label="${esc((adj ? 'Travel to ' : 'Coach to ') + n.n + (open ? '' : ' (locked)'))}"` : '';
    return `<g class="${cls}" transform="translate(${n.x} ${n.y})"${attrs}>${here ? '<circle class="m-pulse" r="11"/>' : ''}${shape}${lbl}</g>`;
  }).join('');
  return `<svg class="map" viewBox="0 0 400 300" role="img" aria-label="Map of ${esc(R.n)}"><rect width="400" height="300" class="m-water"/><path d="${R.land}" class="m-land"/>${R.islands.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="m-land"/>`).join('')}${edges.join('')}${nodes}</svg>`;
}

/* ================= Rendering ================= */
function render(){
  const app = $('#app'); if (!app) return;
  const active = document.activeElement, activeId = active && active.id, selEnd = active && 'selectionEnd' in active ? active.selectionEnd : null;
  if (UI.view === 'title') app.innerHTML = viewTitle();
  else if (UI.view === 'create') app.innerHTML = viewCreate();
  else if (G) app.innerHTML = viewGame();
  renderModal();
  for (const id of ['chron', 'trail', 'blog']) { const el = document.getElementById(id); if (el) el.scrollTop = el.scrollHeight; }
  if (activeId) { const el = document.getElementById(activeId); if (el && el !== document.activeElement && !el.disabled) { el.focus(); if (selEnd != null && 'setSelectionRange' in el) try { el.setSelectionRange(selEnd, selEnd); } catch (e) {} } }
}

function viewTitle(){
  const save = UI.save;
  return `<div class="title-screen">
    <div class="title-art" aria-hidden="true">${sprite('budling', { cls:'t1' })}${sprite('emberkit', { cls:'t2' })}${sprite('rippup', { cls:'t3', flip:true })}</div>
    <p class="eyebrow center">A creature-trainer campaign for one player</p>
    <h1 class="wordmark">Halcyon Road</h1>
    <p class="tagline">Eight badges, one rival, a villainous syndicate, and a d20 that decides how it all goes.</p>
    <div class="title-actions">
      ${save ? `<button class="btn primary big" data-a="continue">Continue<span class="btn-sub">${esc(save.name)} · ${save.badges} badge${save.badges === 1 ? '' : 's'} · ${esc(NODES[save.node] ? NODES[save.node].n : '')}</span></button>` : ''}
      <button class="btn big ${save ? '' : 'primary'}" data-a="new">New campaign</button>
      ${UI.cloudChecking ? '<p class="fine center">Looking for a save on your account…</p>' : ''}
    </div>
    <section class="howto" aria-label="How to play">
      <div><h3>Checks</h3><p>Story choices that carry a risk show a skill and a DC. You roll a d20, add your bonus, and need to meet the DC. A natural 20 grants Inspiration, which buys one reroll.</p></div>
      <div><h3>Battles</h3><p>Partners roll to hit against Armor Class and roll damage dice that grow with level. Types matter, conditions call for saving throws, and initiative is rolled every round.</p></div>
      <div><h3>Capture</h3><p>Wear a creature down, put it to sleep, then throw. Your capture roll adds the Capsule’s bonus and your Dexterity against the creature’s capture DC.</p></div>
      <div><h3>Free actions</h3><p>On claude.ai, type anything into the Free action box and an AI Dungeon Master sets the DC and narrates what happens. The scripted story works without it.</p></div>
    </section>
  </div>`;
}

function newCreate(){
  const rolls = rollSet();
  UI.create = { name:'', bg:'ranger', diff:'adventurer', rolls, sel:null };
  arrangeFor('ranger');
}
function rollStat(){ const dice = [d(6), d(6), d(6), d(6)]; const s = dice.slice().sort((a, b) => a - b); return { dice, v:s[1] + s[2] + s[3] }; }
function rollSet(){ let r; do { r = ABIL_ORDER.map(rollStat); } while (r.reduce((a, x) => a + x.v, 0) < 68); return r; }
function arrangeFor(bg){
  const c = UI.create, sorted = c.rolls.slice().sort((a, b) => b.v - a.v), out = new Array(6);
  BACKGROUNDS[bg].pri.forEach((ab, i) => { out[ABIL_ORDER.indexOf(ab)] = sorted[i]; });
  c.rolls = out;
}
function viewCreate(){
  const c = UI.create;
  const bgCards = Object.entries(BACKGROUNDS).map(([k, b]) => `<button class="card-opt${c.bg === k ? ' on' : ''}" data-a="cbg" data-v="${k}" aria-pressed="${c.bg === k}"><b>${b.n}</b><span>${esc(b.d)}</span><span class="perk">${esc(b.perk)}</span><span class="fine">Proficient: ${b.skills.map(s => SKILLS[s][0]).join(', ')}</span></button>`).join('');
  const stats = ABIL_ORDER.map((ab, i) => {
    const r = c.rolls[i]; const lowIdx = r.dice.indexOf(Math.min(...r.dice));
    return `<button class="stat-box${c.sel === i ? ' sel' : ''}" data-a="cstat" data-v="${i}" aria-pressed="${c.sel === i}"><span class="ab">${ab.toUpperCase()}</span><span class="sv">${r.v}</span><span class="sm">${sgn(amod(r.v))}</span><span class="dice">${r.dice.map((x, k) => `<i class="${k === lowIdx ? 'drop' : ''}">${x}</i>`).join('')}</span></button>`;
  }).join('');
  const diffs = Object.entries(DIFFS).map(([k, v]) => `<button class="card-opt slim${c.diff === k ? ' on' : ''}" data-a="cdiff" data-v="${k}" aria-pressed="${c.diff === k}"><b>${v.n}</b><span>${esc(v.d)}</span></button>`).join('');
  return `<div class="create">
    <p class="eyebrow">New campaign</p><h1>Who sets out from Thistle Hollow?</h1>
    <section class="cr-sec"><label class="cr-h" for="cName">Your name</label><input id="cName" class="inp" maxlength="20" autocomplete="off" placeholder="Rowan" value="${esc(c.name)}"></section>
    <section class="cr-sec"><h2 class="cr-h">Background</h2><div class="opts">${bgCards}</div></section>
    <section class="cr-sec"><h2 class="cr-h">Ability scores</h2><p class="fine">Rolled 4d6, lowest die dropped. Click two scores to swap them.</p><div class="stats-row">${stats}</div>
      <div class="row-btns"><button class="btn sm" data-a="creroll">Reroll all</button><button class="btn sm" data-a="carrange">Arrange for ${esc(BACKGROUNDS[c.bg].n)}</button></div></section>
    <section class="cr-sec"><h2 class="cr-h">Pace</h2><div class="opts three">${diffs}</div></section>
    <div class="row-btns end"><button class="btn" data-a="totitle">Back</button><button class="btn primary big" data-a="begin">Begin the campaign</button></div>
  </div>`;
}

function viewGame(){
  return `${viewHeader()}<div class="layout"><main class="stage">${viewStage()}</main><aside class="side" aria-label="Party, bag and trainer sheet">${viewSide()}</aside></div>`;
}
function viewHeader(){
  const n = NODES[G.node];
  return `<header class="bar"><div class="bar-in">
    <span class="brand">Halcyon Road</span>
    <span class="where"><span class="eyebrow">${esc((REGIONS[n.rg] || REGIONS.halcyon).n)}</span>${esc(n.n)}</span>
    <span class="stats"><span class="stat num">${fmtMoney(G.money)}</span><span class="stat">${n.rg === WORLD_REGION ? (G.world.titles ? `${G.world.titles} world title${G.world.titles === 1 ? '' : 's'}` : 'World Tournament') : `${rb(G, n.rg)}/8 badges`}</span><span class="stat insp${G.insp ? ' on' : ''}" title="Inspiration: spend it to reroll a failed check">${G.insp ? 'Inspired' : 'No Inspiration'}</span></span>
    <span class="bar-btns"><button class="btn sm" data-a="save" ${G.B ? 'disabled' : ''}>Save</button><button class="btn sm" data-a="menu">Menu</button></span>
  </div></header>`;
}
function viewStage(){
  if (G.B) return viewBattle();
  if (G.scene) return viewScene();
  if (UI.panel === 'map') return viewMap();
  if (UI.panel === 'shop' && NODES[G.node].shop) return viewShop();
  if (UI.panel === 'ranch' && NODES[G.node].haven) return viewRanch();
  if (UI.panel === 'dice' && NODES[G.node].dice) return viewDice();
  return viewExplore();
}
function checkHTML(r){
  const advTxt = r.adv ? ` (advantage: ${r.r1} and ${r.r2})` : '';
  return `<div class="chk ${r.ok ? 'ok' : 'bad'}">${d20svg(r.r, r.r === 20 ? 'crit' : r.r === 1 ? 'fumble' : '')}<span class="chk-t">${esc(r.label)}${r.reroll ? ' reroll' : ''}${advTxt}: ${r.r} ${sgn(r.bonus)} = <b>${r.total}</b> vs DC ${r.dc}</span><b class="chk-v">${r.ok ? 'Success' : 'Failure'}</b></div>`;
}
function feedHTML(e){
  switch (e.k) {
    case 'you': return `<p class="f-you">${esc(e.text)}</p>`;
    case 'dm': return `<div class="f-dm"><span class="tag">Dungeon Master</span>${paras(e.text)}</div>`;
    case 'check': return checkHTML(e.res);
    case 'roll': return `<div class="chk plain">${d20svg(e.r, e.r === 20 ? 'crit' : e.r === 1 ? 'fumble' : '')}<span class="chk-t">${esc(e.text)}: ${e.r}</span></div>`;
    case 'travel': return `<p class="f-travel"><span>${esc(e.text)}</span>${e.sub ? `<small>${esc(e.sub)}</small>` : ''}</p>`;
    case 'scene': return `<div class="f-scene"><span class="tag">${esc(e.title)}</span>${paras(e.text)}</div>`;
    case 'loot': return `<p class="f-loot">${esc(e.text)}</p>`;
    case 'sys': return `<p class="f-sys">${esc(e.text)}</p>`;
    default: return `<div class="f-nar">${paras(e.text)}</div>`;
  }
}
function viewExplore(){
  const n = NODES[G.node];
  const kinds = [{ town:'Town', route:'Route', cave:'Wilds', league:'League' }[n.k]];
  if (n.haven) kinds.push(n.haven === 'home' ? 'Home' : n.haven === 'lodge' ? 'Ranger lodge' : 'Haven');
  if (n.shop) kinds.push('Outfitter');
  const scenes = Object.values(SCENES).filter(sceneAvail);
  const tr = (n.trainers || []).filter(id => !G.beaten[id]);
  const svc = [];
  if (n.haven) { svc.push(`<button class="btn act" data-a="rest">${n.haven === 'home' ? 'Rest at home' : n.haven === 'lodge' ? 'Rest at the ranger lodge' : 'Rest at the Haven'}<span class="act-sub">Heal every partner</span></button>`); svc.push(`<button class="btn act" data-a="panel" data-v="ranch">Visit the daycare<span class="act-sub">${G.ranch.length} partner${G.ranch.length === 1 ? '' : 's'} waiting</span></button>`); }
  if (n.shop) svc.push(`<button class="btn act" data-a="panel" data-v="shop">${G.node === 'verdance' ? 'Verdance Department Store' : 'The Outfitter'}<span class="act-sub">Capsules and medicine</span></button>`);
  if (n.dice) svc.push(`<button class="btn act" data-a="panel" data-v="dice">Lucky Lantern dice table<span class="act-sub">Bet on 2d6</span></button>`);
  const adj = n.adj.map(id => { const m = NODES[id], open = canEnter(id), cross = m.rg !== n.rg; return `<button class="btn act${open ? '' : ' locked'}${cross ? ' story' : ''}" data-a="travel" data-v="${id}">${cross ? `<span class="act-k">${WAY_NAME[crossWay(G.node, id)]} to ${esc(REGIONS[m.rg].n)}</span>` : ''}${esc(m.n)}<span class="act-sub">${open ? (G.visited[id] ? 'Visited' : 'Not yet visited') : 'Locked'}</span></button>`; }).join('');
  return `<section class="explore">
    <header class="loc"><p class="eyebrow">${kinds.join(' · ')}</p><h2>${esc(n.n)}</h2><p class="loc-d">${esc(n.d)}</p></header>
    <div class="chron" id="chron" aria-live="polite">${G.feed.slice(-26).map(feedHTML).join('') || '<p class="f-sys">Your story starts here.</p>'}</div>
    <div class="acts">
      ${scenes.length ? `<div class="grp"><h3>Story</h3><div class="grp-b">${scenes.map(S => `<button class="btn act story" data-a="scene" data-v="${S.id}"><span class="act-k">${S.gym ? 'Gym' : 'Story'}</span>${esc(S.title)}</button>`).join('')}</div></div>` : ''}
      ${n.enc || tr.length ? `<div class="grp"><h3>Around here</h3><div class="grp-b">${n.enc ? `<button class="btn act" data-a="explore">${esc(n.encLabel || 'Explore')}<span class="act-sub">Roll a d20 and see what turns up</span></button>` : ''}${tr.map(id => `<button class="btn act" data-a="trainer" data-v="${id}">Battle ${esc(TRAINERS[id].name)}<span class="act-sub">${TRAINERS[id].team.length} partner${TRAINERS[id].team.length === 1 ? '' : 's'}</span></button>`).join('')}</div></div>` : ''}
      ${svc.length ? `<div class="grp"><h3>Services</h3><div class="grp-b">${svc.join('')}</div></div>` : ''}
      <div class="grp"><h3>Roads from here</h3><div class="grp-b">${adj}<button class="btn act" data-a="panel" data-v="map">Open the map<span class="act-sub">${nb(G) >= 2 ? 'Coach to any town you’ve visited' : 'The coach runs once you hold two badges'}</span></button></div></div>
    </div>
    ${viewDM()}
  </section>`;
}
function viewDM(){
  if (DM.state === 'pending') return `<div class="dm off"><h3>Free action</h3><p class="fine">Connecting to the Dungeon Master…</p></div>`;
  if (DM.state === 'off') return `<div class="dm off"><h3>Free action</h3><p class="fine">The AI Dungeon Master runs when this page is open on claude.ai. Everything scripted works without it.</p></div>`;
  if (DM.state === 'denied') return `<div class="dm off"><h3>Free action</h3><p class="fine">The AI Dungeon Master is off for this visit. Reload the page to be asked again.</p></div>`;
  return `<div class="dm"><label for="dmIn"><h3>Free action</h3><span class="fine">Describe anything you want to try. The AI Dungeon Master sets a DC if it needs one, and narrates.</span></label>
    <div class="dm-row"><textarea id="dmIn" rows="2" maxlength="300" placeholder="Ask the fisherman what he’s seen on the water" ${DM.busy ? 'disabled' : ''}>${esc(UI.dmDraft)}</textarea>${DM.busy ? '<button class="btn" data-a="dmstop">Stop</button>' : '<button class="btn primary" data-a="dmgo">Act</button>'}</div>
    <div class="chips">${DM_CHIPS.map(c => `<button class="chip" data-a="dmchip" data-v="${esc(c)}" ${DM.busy ? 'disabled' : ''}>${esc(c)}</button>`).join('')}</div>
    ${DM.busy ? '<p class="fine dm-wait">The Dungeon Master is thinking…</p>' : ''}</div>`;
}
function choiceBtn(c, i){
  let tag = '';
  if (c.chk) { const info = checkInfo(c.chk[0]); const adv = c.adv && c.adv(G); tag = `<span class="ctag">${esc(info.label)} ${sgn(info.bonus)} · DC ${c.chk[1]}${adv ? ' · advantage' : ''}</span>`; }
  else if (c.battle || c.wild) tag = `<span class="ctag battle">Battle</span>`;
  return `<button class="btn choice" data-a="choose" data-v="${i}"><span class="c-l">${esc(c.l)}</span>${tag}</button>`;
}
function viewScene(){
  const sc = G.scene, S = SCENES[sc.id], st = S.steps[sc.step];
  let first = true;
  const trail = sc.trail.map(t => {
    if (t.text) { const h = `<div class="s-text${first ? ' first' : ''}">${paras(t.text)}</div>`; first = false; return h; }
    if (t.choice) return `<p class="s-choice">${esc(t.choice)}</p>`;
    if (t.check) return checkHTML(t.check);
    if (t.sys) return `<p class="f-sys">${esc(t.sys)}</p>`;
    return '';
  }).join('');
  let ctrl;
  if (sc.pending) ctrl = `<div class="s-choices"><p class="fine">You have Inspiration. Spend it to reroll the check?</p><button class="btn primary" data-a="insp">Reroll with Inspiration</button><button class="btn" data-a="accept">Accept the failure</button></div>`;
  else if (sc.ended) ctrl = `<div class="s-choices"><button class="btn primary" data-a="closescene">Continue</button></div>`;
  else ctrl = `<div class="s-choices">${choicesOf(st).map(choiceBtn).join('')}</div>`;
  return `<section class="scene"><p class="eyebrow">${S.gym ? 'Gym' : 'Story'} · ${esc(NODES[S.node].n)}</p><h2>${esc(S.title)}</h2><div class="s-trail" id="trail">${trail}</div>${ctrl}</section>`;
}
function hpBar(hp, max){ const p = clamp(hp / max, 0, 1); return `<div class="hp"><i style="width:${(p * 100).toFixed(1)}%" class="${p <= .2 ? 'low' : p <= .5 ? 'mid' : ''}"></i></div>`; }
const ST_LABEL = { burn:'Burned', poison:'Poisoned', para:'Paralyzed', sleep:'Asleep' };
function viewBattle(){
  const B = G.B, s = B.cur ? B.cur.snap : snap();
  const P = findMon(s.pu) || actP(), Fo = B.foe.find(m => m.uid === s.fu) || actF();
  const lastDice = [...B.log].reverse().find(f => f.dice);
  const fresh = B.cur && B.cur.dice;
  const animating = !!ANIM || B.queue.length > 0;
  const T = B.trainer ? TRAINERS[B.trainer] : null;
  const foeLeft = B.kind === 'trainer' ? `<span class="pips" aria-label="Foe partners remaining">${B.foe.map(m => `<i class="${m.hp > 0 ? '' : 'out'}"></i>`).join('')}</span>` : '';
  const youLeft = `<span class="pips" aria-label="Your partners">${G.party.map(m => `<i class="${m.hp > 0 ? '' : 'out'}"></i>`).join('')}</span>`;
  const foeHit = B.cur && B.cur.hit === 'f', youHit = B.cur && B.cur.hit === 'p';
  let menu = '';
  if (animating) menu = `<button class="btn" data-a="skip">Skip ahead</button>`;
  else if (B.over) menu = `<button class="btn primary" data-a="bdone">Continue</button>`;
  else if (B.needSwitch) menu = `<p class="fine">Choose your next partner.</p><div class="bgrid">${G.party.map((m, i) => m.hp > 0 ? `<button class="btn" data-a="bswitch" data-v="${i}">${esc(mname(m))} <span class="fine">Lv ${m.lvl} · ${m.hp}/${maxHP(m)}</span></button>` : '').join('')}</div>`;
  else if (B.menu === 'fight') menu = `<div class="bgrid moves">${P.moves.map(mv => moveBtn(P, Fo, mv)).join('')}${canDamage(P, Fo) ? '' : moveBtn(P, Fo, 'struggle')}</div>${canDamage(P, Fo) ? '' : '<p class="fine">None of your moves can affect this foe. Struggle always lands as typeless damage.</p>'}<button class="btn sm" data-a="bmenu" data-v="main">Back</button>`;
  else if (B.menu === 'bag') {
    const its = Object.keys(G.items).filter(id => G.items[id] > 0 && ['ball', 'heal', 'cure', 'revive'].includes(ITEMS[id].kind) && (ITEMS[id].kind !== 'ball' || B.kind === 'wild'));
    menu = `<div class="bgrid">${its.map(id => `<button class="btn" data-a="bitem" data-v="${id}">${esc(ITEMS[id].n)} <span class="fine">×${G.items[id]}</span></button>`).join('') || '<p class="fine">Nothing useful in your bag.</p>'}</div>${B.kind === 'trainer' ? '<p class="fine">You can’t throw Capsules at another trainer’s partners.</p>' : ''}<button class="btn sm" data-a="bmenu" data-v="main">Back</button>`;
  } else if (B.menu.startsWith('target:')) {
    const id = B.menu.slice(7), it = ITEMS[id];
    const ok = m => it.kind === 'revive' ? m.hp <= 0 : it.kind === 'cure' ? m.hp > 0 && m.st : m.hp > 0 && m.hp < maxHP(m);
    menu = `<p class="fine">Use ${esc(it.n)} on…</p><div class="bgrid">${G.party.map(m => `<button class="btn" data-a="btarget" data-v="${id}|${m.uid}" ${ok(m) ? '' : 'disabled'}>${esc(mname(m))} <span class="fine">${m.hp}/${maxHP(m)}${m.st ? ' · ' + ST_LABEL[m.st] : ''}</span></button>`).join('')}</div><button class="btn sm" data-a="bmenu" data-v="bag">Back</button>`;
  } else if (B.menu === 'party') menu = `<div class="bgrid">${G.party.map((m, i) => i !== B.pi && m.hp > 0 ? `<button class="btn" data-a="bswap" data-v="${i}">${esc(mname(m))} <span class="fine">Lv ${m.lvl} · ${m.hp}/${maxHP(m)}</span></button>` : '').join('') || '<p class="fine">No one else can fight.</p>'}</div><button class="btn sm" data-a="bmenu" data-v="main">Back</button>`;
  else menu = `<div class="bgrid main"><button class="btn primary" data-a="bmenu" data-v="fight">Fight</button><button class="btn" data-a="bmenu" data-v="bag">Bag</button><button class="btn" data-a="bmenu" data-v="party">Switch</button>${B.kind === 'wild' ? '<button class="btn" data-a="brun">Run</button>' : ''}${canAscend() ? `<button class="btn apex" data-a="bascend">Ascend<span class="btn-sub">Once per battle</span></button>` : ''}</div>`;
  return `<section class="battle">
    <p class="eyebrow">${B.kind === 'wild' ? (B.legendary ? 'Legendary encounter' : 'Wild encounter') : 'Trainer battle · ' + esc(T.name)} · ${esc(NODES[G.node].n)}</p>
    <div class="mat">
      <div class="plate foe-p"><div class="pl-top"><b>${esc(nameOf('f', Fo))}</b><span class="lv">Lv ${Fo.lvl}</span></div><div class="pl-types">${SPECIES[Fo.sp].t.map(typeChip).join('')}${s.fst ? `<span class="stchip">${ST_LABEL[s.fst]}</span>` : ''}</div>${hpBar(s.fh, maxHP(Fo))}<div class="pl-foot">${foeLeft}<span class="fine">AC ${armorClass(Fo, B.st.f)}</span></div></div>
      <div class="mini foe-m${foeHit ? ' hit' : ''}${s.fh <= 0 ? ' down' : ''}">${sprite(Fo.sp)}</div>
      <div class="mini you-m${youHit ? ' hit' : ''}${s.ph <= 0 ? ' down' : ''}">${sprite(P.sp, { flip:true })}</div>
      <div class="plate you-p"><div class="pl-top"><b>${esc(mname(P))}</b><span class="lv">Lv ${P.lvl}</span></div><div class="pl-types">${SPECIES[P.sp].t.map(typeChip).join('')}${s.pst ? `<span class="stchip">${ST_LABEL[s.pst]}</span>` : ''}</div>${hpBar(s.ph, maxHP(P))}<div class="pl-foot">${youLeft}<span class="num">${s.ph}/${maxHP(P)} HP</span></div><div class="xp"><i style="width:${(P.xp / xpNeed(P.lvl) * 100).toFixed(1)}%"></i></div></div>
      <div class="tray" aria-hidden="true">${lastDice ? `${d20svg(lastDice.dice.v, lastDice.dice.kind + (fresh ? ' roll' : ''))}<span>${esc(lastDice.dice.label)}</span>` : d20svg(20, 'idle')}</div>
    </div>
    <div class="blog" id="blog" aria-live="polite">${B.log.slice(-40).map(f => `<p class="${f.cls}">${esc(f.text)}</p>`).join('')}</div>
    <div class="bmenu">${menu}</div>
  </section>`;
}
function moveBtn(P, Fo, mv){
  const M = MOVES[mv], dd = dmgDice(P, mv), e = M.p ? effOf(M.t, SPECIES[Fo.sp].t) : 1;
  const sub = M.p ? `${dd.n}d${dd.die}+${dd.flat}${M.acc ? ` · ${sgn(M.acc)} to hit` : ''}${M.prio ? ' · fast' : ''}` : (M.d || 'Status');
  const eff = M.p && e !== 1 ? `<span class="mv-e ${e > 1 ? 'up' : 'down'}">${e === 0 ? 'No effect' : e > 1 ? 'Super effective' : 'Not very effective'}</span>` : '';
  return `<button class="btn mv" data-a="bmove" data-v="${mv}"><span class="mv-n">${esc(M.n)}</span>${typeChip(M.t)}<span class="mv-d">${esc(sub)}</span>${eff}</button>`;
}
function viewMap(){
  const coach = Object.keys(NODES).filter(canCoach);
  const cur = NODES[G.node];
  return `<section class="mapv"><p class="eyebrow">${esc((REGIONS[cur.rg] || REGIONS.halcyon).n)}</p><h2>Where to?</h2>
    <div class="map-wrap">${mapSVG()}</div>
    <p class="fine">Highlighted places are one road away${nb(G) >= 2 ? ', or a coach ride to a town you’ve visited in this region' : ''}. Locked places show what’s stopping you.</p>
    <div class="grp"><h3>Roads from ${esc(cur.n)}</h3><div class="grp-b">${cur.adj.map(id => { const open = canEnter(id), cross = NODES[id].rg !== cur.rg; return `<button class="btn act${open ? '' : ' locked'}${cross ? ' story' : ''}" data-a="travel" data-v="${id}">${cross ? `<span class="act-k">${WAY_NAME[crossWay(G.node, id)]} to ${esc(REGIONS[NODES[id].rg].n)}</span>` : ''}${esc(NODES[id].n)}<span class="act-sub">${open ? 'Travel' : esc(NODES[id].lock || 'Locked')}</span></button>`; }).join('')}</div></div>
    ${coach.length ? `<div class="grp"><h3>Coach</h3><div class="grp-b">${coach.map(id => `<button class="btn act" data-a="travel" data-v="${id}">${esc(NODES[id].n)}<span class="act-sub">Ride the coach</span></button>`).join('')}</div></div>` : ''}
    <button class="btn" data-a="panel" data-v="explore">Close the map</button></section>`;
}
function viewShop(){
  const items = SHOP_ORDER.filter(id => { const it = ITEMS[id]; if (it.shopAt && it.shopAt !== G.node) return false; return nb(G) >= (it.minB || 0); });
  return `<section class="shop"><p class="eyebrow">${esc(NODES[G.node].n)}</p><h2>${G.node === 'verdance' ? 'Verdance Department Store' : 'The Outfitter'}</h2>
    <p class="fine">${G.bg === 'silver' ? 'Your silver tongue knocks 20% off every price.' : 'More stock appears as you earn badges.'} You have ${fmtMoney(G.money)}.</p>
    <div class="rows">${items.map(id => { const it = ITEMS[id], p = price(id); return `<div class="row"><div class="row-main"><b>${esc(it.n)}</b><span class="fine">${esc(it.d)}</span></div><span class="own num">Own ${G.items[id] || 0}</span><span class="price num">${fmtMoney(p)}</span><span class="row-btns"><button class="btn sm" data-a="buy" data-v="${id}:1" ${G.money < p ? 'disabled' : ''}>Buy 1</button><button class="btn sm" data-a="buy" data-v="${id}:5" ${G.money < p * 5 ? 'disabled' : ''}>Buy 5</button></span></div>`; }).join('')}</div>
    <button class="btn" data-a="panel" data-v="explore">Leave</button></section>`;
}
function monRow(m, btns){ return `<div class="mrow">${sprite(m.sp, { cls:'sm' })}<div class="mrow-main"><b>${esc(mname(m))}</b> <span class="fine">Lv ${m.lvl}</span><div class="pl-types">${SPECIES[m.sp].t.map(typeChip).join('')}</div></div>${btns}</div>`; }
function viewRanch(){
  const away = Object.entries(G.teams || {}).filter(([, t]) => t.party.length + t.ranch.length).map(([r, t]) => `Your ${REGIONS[r].n} team (${t.party.length + t.ranch.length} partner${t.party.length + t.ranch.length === 1 ? '' : 's'}) is waiting at the ${esc(teamRegion(r))} daycare. You’ll have them back when you return to ${REGIONS[r].n}.`);
  return `<section class="ranch"><p class="eyebrow">${esc(NODES[G.node].n)}</p><h2>The daycare</h2><p class="fine">Partners at the daycare are safe and fed. Your party holds up to six.</p>${away.map(a => `<p class="fine">${a}</p>`).join('')}
    <div class="two"><div><h3>Party (${G.party.length}/6)</h3>${G.party.map(m => monRow(m, `<button class="btn sm" data-a="deposit" data-v="${m.uid}" ${G.party.length <= 1 ? 'disabled' : ''}>Send to ranch</button>`)).join('')}</div>
    <div><h3>At the ranch (${G.ranch.length})</h3>${G.ranch.map(m => monRow(m, `<button class="btn sm" data-a="withdraw" data-v="${m.uid}" ${G.party.length >= 6 ? 'disabled' : ''}>Add to party</button>`)).join('') || '<p class="fine">Nobody here yet.</p>'}</div></div>
    <button class="btn" data-a="panel" data-v="explore">Leave</button></section>`;
}
function viewDice(){
  const L = UI.diceLast;
  return `<section class="dicev"><p class="eyebrow">The Lucky Lantern · Verdance City</p><h2>Lantern Dice</h2>
    <p>The dealer rolls 2d6. Bet on under seven or over seven at even money, or on exactly seven at four to one.</p>
    <div class="row-btns"><span class="fine">Stake:</span>${[100, 500, 1000].map(b => `<button class="btn sm${UI.bet === b ? ' on' : ''}" data-a="bet" data-v="${b}" aria-pressed="${UI.bet === b}">${fmtMoney(b)}</button>`).join('')}</div>
    <div class="row-btns"><button class="btn" data-a="dice" data-v="under">Under 7</button><button class="btn" data-a="dice" data-v="seven">Exactly 7</button><button class="btn" data-a="dice" data-v="over">Over 7</button></div>
    ${L ? `<div class="dice-res ${L.win ? 'ok' : 'bad'}"><span class="pips6">${L.a}</span><span class="pips6">${L.b}</span><span>= <b>${L.s}</b>. ${L.win ? `You win ${fmtMoney(L.net)}.` : `You lose ${fmtMoney(-L.net)}.`}</span></div>` : ''}
    <p class="fine">You have ${fmtMoney(G.money)}.</p>
    <button class="btn" data-a="panel" data-v="explore">Leave the table</button></section>`;
}
function viewSide(){
  const tabs = [['party', 'Party'], ['bag', 'Bag'], ['sheet', 'Trainer'], ['codex', 'Codex']];
  let pane = '';
  if (UI.tab === 'party') pane = viewParty();
  else if (UI.tab === 'bag') pane = viewBag();
  else if (UI.tab === 'sheet') pane = viewSheet();
  else pane = viewCodex();
  return `<nav class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${UI.tab === k}" class="tab${UI.tab === k ? ' on' : ''}" data-a="tab" data-v="${k}">${l}</button>`).join('')}</nav><div class="tabpane">${pane}</div>`;
}
function viewParty(){
  if (!G.party.length) return '<p class="fine">No partners yet. Professor Marr is waiting at the lab.</p>';
  const sn = G.B && G.B.cur ? G.B.cur.snap : null;
  return G.party.map((m, i) => {
    const mx = maxHP(m), hp = sn && sn.pu === m.uid ? sn.ph : m.hp;
    return `<div class="pcard${hp <= 0 ? ' out' : ''}">${sprite(m.sp, { cls:'sm', flip:true })}<div class="pc-main"><div class="pl-top"><b>${esc(mname(m))}</b><span class="lv">Lv ${m.lvl}</span></div><div class="pl-types">${SPECIES[m.sp].t.map(typeChip).join('')}${hp <= 0 ? '<span class="stchip">Fainted</span>' : ''}</div>${hpBar(hp, mx)}<div class="pl-foot"><span class="num fine">${hp}/${mx} HP</span><span class="num fine">${m.xp}/${xpNeed(m.lvl)} XP</span></div></div>
      <div class="pc-btns"><button class="btn xs" data-a="info" data-v="${m.uid}">Details</button>${i > 0 && !G.B ? `<button class="btn xs" data-a="lead" data-v="${m.uid}">Lead</button>` : ''}</div></div>`;
  }).join('');
}
function viewBag(){
  const ids = Object.keys(G.items).filter(id => G.items[id] > 0 && ITEMS[id]);
  const groups = [['Capsules', ['ball']], ['Medicine', ['heal', 'revive', 'cure']], ['Other', ['level', 'stone']]];
  const usable = it => ['heal', 'revive', 'level', 'stone'].includes(it.kind);
  let html = groups.map(([label, kinds]) => {
    const list = ids.filter(id => kinds.includes(ITEMS[id].kind));
    if (!list.length) return '';
    return `<h3>${label}</h3>${list.map(id => `<div class="irow"><div><b>${esc(ITEMS[id].n)}</b> <span class="num">×${G.items[id]}</span><span class="fine">${esc(ITEMS[id].d)}</span></div>${usable(ITEMS[id]) && !G.B ? `<button class="btn xs" data-a="use" data-v="${id}">Use</button>` : ''}</div>`).join('')}`;
  }).join('');
  const keys = Object.keys(G.keys).filter(k => KEYS[k]);
  if (keys.length) html += `<h3>Key items</h3>${keys.map(k => `<div class="irow"><div><b>${esc(KEYS[k][0])}</b><span class="fine">${esc(KEYS[k][1])}</span></div></div>`).join('')}`;
  return html || '<p class="fine">Your bag is empty.</p>';
}
function viewSheet(){
  const bg = BACKGROUNDS[G.bg];
  const abil = ABIL_ORDER.map(ab => `<div class="abox"><span class="ab">${ab.toUpperCase()}</span><span class="sv">${G.abil[ab]}</span><span class="sm">${sgn(amod(G.abil[ab]))}</span></div>`).join('');
  const skills = Object.keys(SKILLS).map(k => { const i = checkInfo(k); return `<li class="${i.prof ? 'prof' : ''}"><span>${i.prof ? '●' : '○'} ${i.label} <span class="fine">(${SKILLS[k][1].toUpperCase()})</span></span><span class="num">${sgn(i.bonus)}</span></li>`; }).join('');
  const badges = Object.keys(REGIONS).map(r => {
    if (r === WORLD_REGION || (r !== 'halcyon' && !F(G, r + '_arrived') && rb(G, r) === 0)) return '';
    const list = BADGES.filter(b => (b[5] || 'halcyon') === r);
    const champ = r === 'halcyon' ? F(G, 'champion') : F(G, 'champion_' + r);
    return `<h4>${esc(REGIONS[r].n)}${champ ? ' · Champion' : ''}</h4><div class="badges">${list.map(([id, n, leader, town, type]) => `<div class="badge${G.badges.includes(id) ? ' got' : ''}" title="${esc(n)} · ${esc(leader)}, ${esc(town)}"><i style="--bc:${TYPE_COLOR[type]}"></i><span>${esc(n.replace(' Badge', ''))}</span></div>`).join('')}</div>`;
  }).join('');
  const towerLine = (G.tower && (G.tower.sets || G.tower.best) ? `<p class="fine">Summit Tower: best streak ${G.tower.best}, ${G.tower.sets} set${G.tower.sets === 1 ? '' : 's'} cleared.</p>` : '')
    + (G.arena && G.arena.cups ? `<p class="fine">Aurelia Sun Arena: ${G.arena.cups} cup${G.arena.cups === 1 ? '' : 's'} won.</p>` : '')
    + (G.games && G.games.cups ? `<p class="fine">Midwinter Games: ${G.games.cups} crown${G.games.cups === 1 ? '' : 's'} won.</p>` : '')
    + (G.world && G.world.titles ? `<p class="fine">World Tournament: ${G.world.titles} title${G.world.titles === 1 ? '' : 's'}. World Champion.</p>` : '');
  return `<div class="sheet"><div class="sh-head"><b class="sh-name">${esc(G.name)}</b><span class="fine">${esc(bg.n)} · ${esc(DIFFS[G.diff].n)} pace</span><span class="fine">${esc(bg.perk)}</span></div>
    <div class="abil">${abil}</div>
    <p class="fine">Proficiency bonus ${sgn(profBonus())}. It grows with every three badges.</p>
    <h3>Skills</h3><ul class="skills">${skills}</ul>
    <h3>Badges</h3>${badges}${towerLine}
    ${G.hof.length ? `<h3>Hall of Fame</h3><p class="fine">Champion ${G.hof.length} time${G.hof.length === 1 ? '' : 's'}.</p>` : ''}</div>`;
}
function viewCodex(){
  const c = caughtCount(G), s = seenCount(G);
  return `<p class="fine">${s} seen · ${c} caught · ${CODEX_IDS.length} known</p><div class="codex">${CODEX_IDS.map(id => {
    const seen = G.codex.seen[id], got = G.codex.caught[id];
    return seen ? `<button class="cx${got ? ' got' : ''}" data-a="cxinfo" data-v="${id}" title="${esc(SPECIES[id].n)}">${sprite(id, { cls:'xs' })}<span>${esc(SPECIES[id].n)}</span></button>` : `<div class="cx unk" aria-label="Unknown"><span class="q">?</span><span>${String(CODEX_IDS.indexOf(id) + 1).padStart(3, '0')}</span></div>`;
  }).join('')}</div>`;
}

/* ================= Modals ================= */
function openModal(o){ UI.modal = o; render(); }
function closeModal(){ UI.modal = null; render(); }
function renderModal(){
  const el = $('#modal'); if (!el) return;
  const m = UI.modal;
  if (!m) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  el.innerHTML = `<div class="m-back" data-a="mdismiss"></div><div class="m-card" role="dialog" aria-modal="true" aria-labelledby="mTitle"><h2 id="mTitle">${esc(m.title)}</h2><div class="m-body">${m.html || ''}</div><div class="m-btns">${(m.buttons || []).map((b, i) => `<button class="btn${b.primary ? ' primary' : ''}" data-a="mbtn" data-v="${i}">${esc(b.label)}</button>`).join('')}</div></div>`;
  const f = el.querySelector('.m-btns .btn.primary') || el.querySelector('.m-btns .btn');
  if (f && !el.contains(document.activeElement)) f.focus();
}
function openLearn(m, mv, cb){
  const M = MOVES[mv];
  const desc = M.p ? `${M.t} attack, ${dmgDice(m, mv).n}d${DIE[M.p]}+${dmgDice(m, mv).flat} damage` : `${M.t} status move. ${M.d || ''}`;
  openModal({ title:`${mname(m)} wants to learn ${M.n}`, html:`<p>${esc(desc)}.</p><p>It already knows four moves. Forget one to make room?</p>`,
    buttons:[...m.moves.map(old => ({ label:`Forget ${MOVES[old].n}`, fn:() => { m.moves[m.moves.indexOf(old)] = mv; pushFeed({ k:'sys', text:`${mname(m)} forgot ${MOVES[old].n} and learned ${M.n}.` }); UI.modal = null; cb(); } })),
      { label:`Don’t learn ${M.n}`, primary:true, fn:() => { UI.modal = null; cb(); } }] });
}
function openEvo(m, into, cb){
  openModal({ title:'Something is happening…', html:`<div class="evo">${sprite(m.sp, { cls:'md' })}<span class="arrow">→</span>${sprite(into, { cls:'md glow' })}</div><p>${esc(mname(m))} is evolving into ${esc(SPECIES[into].n)}!</p>`,
    buttons:[{ label:'Let it evolve', primary:true, fn:() => { evolve(m, into); UI.modal = null; cb(); } }, { label:'Not now', fn:() => { UI.modal = null; cb(); } }] });
}
function openHof(){
  const last = G.hof[G.hof.length - 1] || {}, r = last.region || 'halcyon';
  const next = {
    halcyon:'The road goes on. The ferry at Port Saltmere now sails south to Solenne, the Summit Tower above the League is open, and something still waits in the Hollow Below.',
    solenne:'An airship now leaves Aurelia for Nordhaven, far to the north. Back in Solenne, the gym leaders want rematches and the Sun Arena is open.',
    nordhaven:'The Undersea Express at Skerrport now runs to Arclight, the city that never sleeps. In Nordhaven, the gym leaders want rematches and Highmark is holding the Midwinter Games.',
    arclight:'An invitation has arrived: the World Tournament on Zenith Isle, where any partner you have ever caught may fight. The Champions’ Liner sails from Arclight’s Harbor District.',
    zenith:'The rangers have opened Zenith Caldera to you, and the World Tournament will be waiting, a little tougher each time, whenever you want to defend your title.'
  }[r];
  openModal({ title:'Hall of Fame', html:`<p>${esc(G.name)}, ${r === WORLD_REGION ? 'World Champion' : 'Champion of ' + esc(REGIONS[r].n)}.</p><div class="hof">${G.party.map(m => `<div>${sprite(m.apexFrom || m.sp, { cls:'md' })}<b>${esc(mname(m))}</b><span class="fine">Lv ${m.lvl}</span></div>`).join('')}</div><p class="fine">${next}</p>`,
    buttons:[{ label:'Keep playing', primary:true, fn:closeModal }] });
}
function openMonInfo(uid){
  const m = findMon(uid); if (!m) return;
  const s = SPECIES[m.sp];
  const moves = m.moves.map(mv => { const M = MOVES[mv], dd = dmgDice(m, mv); return `<li>${typeChip(M.t)} <b>${esc(M.n)}</b> <span class="fine">${M.p ? `${dd.n}d${dd.die}+${dd.flat}${M.acc ? `, ${sgn(M.acc)} to hit` : ''}` : esc(M.d || '')}</span></li>`; }).join('');
  const evo = s.evo ? (typeof s.evo[0] === 'number' ? `Evolves into ${SPECIES[s.evo[1]].n} at level ${s.evo[0]}.` : `Evolves into ${SPECIES[s.evo[1]].n} with a ${ITEMS[s.evo[0]].n}.`) : 'Does not evolve.';
  const inParty = G.party.includes(m);
  openModal({ title:mname(m), html:`<div class="info-top">${sprite(m.sp, { cls:'md' })}<div><div class="pl-types">${s.t.map(typeChip).join('')}</div><p class="fine">${esc(s.d)}</p><p class="fine">${esc(evo)}</p></div></div>
    <div class="statline"><span>Lv <b>${m.lvl}</b></span><span>HP <b>${m.hp}/${maxHP(m)}</b></span><span>AC <b>${armorClass(m)}</b></span><span>To hit <b>${sgn(hitBonus(m, null, 'p'))}</b></span><span>Initiative <b>${sgn(spdMod(m))}</b></span></div>
    <h3>Moves</h3><ul class="mlist">${moves}</ul>`,
    buttons:[...(inParty && G.party.indexOf(m) > 0 && !G.B ? [{ label:'Make lead', fn:() => { G.party.splice(G.party.indexOf(m), 1); G.party.unshift(m); UI.modal = null; commit(); } }] : []), { label:'Close', primary:true, fn:closeModal }] });
}
function openSpeciesInfo(id){
  const s = SPECIES[id], got = G.codex.caught[id];
  openModal({ title:s.n, html:`<div class="info-top">${sprite(id, { cls:'md' })}<div><div class="pl-types">${s.t.map(typeChip).join('')}</div><p>${esc(s.d)}</p><p class="fine">${got ? 'Caught.' : 'Seen, not yet caught.'} Capture DC ${s.dc} plus a fifth of its level.</p></div></div>
    <div class="bars">${['HP', 'Attack', 'Defense', 'Speed'].map((l, i) => `<div class="bar-row"><span>${l}</span><div class="sbar"><i style="width:${Math.min(100, s.b[i] / 1.6)}%"></i></div><span class="num">${s.b[i]}</span></div>`).join('')}</div>`,
    buttons:[{ label:'Close', primary:true, fn:closeModal }] });
}
function openUseItem(id){
  const it = ITEMS[id];
  const ok = m => it.kind === 'heal' ? m.hp > 0 && m.hp < maxHP(m) : it.kind === 'revive' ? m.hp <= 0 : it.kind === 'level' ? m.lvl < 100 : it.kind === 'stone' ? !!(SPECIES[m.sp].evo && SPECIES[m.sp].evo[0] === id) : false;
  openModal({ title:`Use ${it.n}`, html:`<p class="fine">${esc(it.d)}</p><div class="pick">${G.party.map(m => `<button class="btn" data-a="useon" data-v="${id}|${m.uid}" ${ok(m) ? '' : 'disabled'}>${sprite(m.sp, { cls:'xs' })}<span>${esc(mname(m))} <span class="fine">Lv ${m.lvl} · ${m.hp}/${maxHP(m)}</span></span></button>`).join('')}</div>`,
    buttons:[{ label:'Cancel', primary:true, fn:closeModal }] });
}
function openMenu(){
  const t = G.settings.tier, sp = G.settings.speed;
  openModal({ title:'Menu', html:`<h3>Dungeon Master</h3><div class="row-btns"><button class="btn sm${t === 'quick' ? ' on' : ''}" data-a="set" data-v="tier:quick" aria-pressed="${t === 'quick'}">Quick replies</button><button class="btn sm${t === 'rich' ? ' on' : ''}" data-a="set" data-v="tier:rich" aria-pressed="${t === 'rich'}">Richer, slower replies</button></div>
    <h3>Battle speed</h3><div class="row-btns"><button class="btn sm${sp === 'normal' ? ' on' : ''}" data-a="set" data-v="speed:normal" aria-pressed="${sp === 'normal'}">Normal</button><button class="btn sm${sp === 'fast' ? ' on' : ''}" data-a="set" data-v="speed:fast" aria-pressed="${sp === 'fast'}">Fast</button></div>
    <h3>Save file</h3><p class="fine">${CLOUD.uid ? 'Saves go to your claude.ai account and this browser.' : 'Saves stay in this browser.'} Copy a backup, or paste one to restore it.</p>
    <div class="row-btns"><button class="btn sm" data-a="export">Copy save to clipboard</button></div>
    <label class="fine" for="importBox">Paste a save to restore it</label><textarea id="importBox" class="inp" rows="3">${esc(UI.importText)}</textarea><div class="row-btns"><button class="btn sm" data-a="import">Restore this save</button></div>`,
    buttons:[{ label:'Back to title', fn:() => { saveGame(); UI.modal = null; G = null; UI.view = 'title'; UI.save = metaOf(bestSave()); render(); } }, { label:'Close', primary:true, fn:closeModal }] });
}

/* ================= Toast ================= */
let TOAST_T = null;
function toast(text){ const el = $('#toast'); if (!el) return; el.textContent = text; el.hidden = false; clearTimeout(TOAST_T); TOAST_T = setTimeout(() => { el.hidden = true; }, 3200); }

/* ================= Events ================= */
const ACTIONS = {
  continue(){ const s = bestSave(); if (!s) return; G = migrate(JSON.parse(JSON.stringify(s))); G.B = null; UI.view = 'game'; UI.panel = 'explore'; render(); },
  new(){
    if (UI.save) return openModal({ title:'Start a new campaign?', html:'<p>Your current campaign will be replaced the first time the new one saves. Copy a backup from the in-game menu first if you want to keep it.</p>', buttons:[{ label:'Start a new campaign', fn:() => { UI.modal = null; newCreate(); UI.view = 'create'; render(); } }, { label:'Cancel', primary:true, fn:closeModal }] });
    newCreate(); UI.view = 'create'; render();
  },
  totitle(){ UI.view = 'title'; render(); },
  cbg(v){ UI.create.bg = v; render(); },
  cdiff(v){ UI.create.diff = v; render(); },
  cstat(v){ const c = UI.create, i = +v; if (c.sel === null) c.sel = i; else { const t = c.rolls[c.sel]; c.rolls[c.sel] = c.rolls[i]; c.rolls[i] = t; c.sel = null; } render(); },
  creroll(){ UI.create.rolls = rollSet(); UI.create.sel = null; arrangeFor(UI.create.bg); render(); },
  carrange(){ arrangeFor(UI.create.bg); UI.create.sel = null; render(); },
  begin(){
    const c = UI.create, abil = {};
    ABIL_ORDER.forEach((k, i) => { abil[k] = c.rolls[i].v; });
    newGame({ name:(c.name || '').trim().slice(0, 20) || 'Rowan', bg:c.bg, abil, diff:c.diff });
    UI.view = 'game'; UI.panel = 'explore'; UI.tab = 'party';
    pushFeed({ k:'travel', text:'Thistle Hollow' });
    startScene('intro'); commit(); window.scrollTo(0, 0);
  },
  scene(v){ if (!G.B && !G.scene && SCENES[v] && sceneAvail(SCENES[v])) { startScene(v); commit(); } },
  choose(v){ choose(+v); },
  insp(){ spendInspiration(); },
  accept(){ acceptFailure(); },
  closescene(){ closeScene(); },
  explore(){ explore(); },
  trainer(v){ if (!G.party.length) return toast('You have no partners with you yet.'); if (!G.B && !G.scene && !G.beaten[v]) { startTrainer(v, null); commit(); } },
  rest(){ rest(); },
  panel(v){ UI.panel = v; render(); },
  travel(v){ travel(v); },
  buy(v){ const [id, q] = v.split(':'); buy(id, +q); },
  bet(v){ UI.bet = +v; render(); },
  dice(v){ diceBet(v); },
  deposit(v){ if (G.party.length <= 1) return; const i = G.party.findIndex(m => m.uid === v); if (i < 0) return; G.ranch.push(G.party.splice(i, 1)[0]); commit(); },
  withdraw(v){ if (G.party.length >= 6) return; const i = G.ranch.findIndex(m => m.uid === v); if (i < 0) return; G.party.push(G.ranch.splice(i, 1)[0]); commit(); },
  tab(v){ UI.tab = v; render(); },
  info(v){ openMonInfo(v); },
  lead(v){ if (G.B) return; const i = G.party.findIndex(m => m.uid === v); if (i > 0) { G.party.unshift(G.party.splice(i, 1)[0]); commit(); } },
  use(v){ openUseItem(v); },
  useon(v){ const [id, uid] = v.split('|'); useItemOn(id, uid); },
  cxinfo(v){ openSpeciesInfo(v); },
  save(){ saveGame(true); },
  menu(){ openMenu(); },
  set(v){ const [k, val] = v.split(':'); G.settings[k] = val; saveGame(); openMenu(); },
  export(){
    const text = serialize();
    try { navigator.clipboard.writeText(text).then(() => toast('Save copied to your clipboard.'), () => { UI.importText = text; openMenu(); toast('Copy blocked here. The save is in the box below: select it and copy.'); }); }
    catch (e) { UI.importText = text; openMenu(); toast('Copy blocked here. The save is in the box below: select it and copy.'); }
  },
  import(){
    const box = $('#importBox'); const txt = box ? box.value.trim() : '';
    try { const g = JSON.parse(txt); if (!g || !g.party || !g.abil) throw new Error('bad'); G = migrate(g); G.B = null; UI.importText = ''; UI.modal = null; UI.view = 'game'; UI.panel = 'explore'; saveGame(); render(); toast('Save restored.'); }
    catch (e) { toast('That doesn’t look like a Halcyon Road save.'); }
  },
  mbtn(v){ const b = UI.modal && UI.modal.buttons[+v]; if (b && b.fn) b.fn(); },
  mdismiss(){ if (UI.modal && UI.modal.buttons && UI.modal.buttons.length === 1) closeModal(); },
  dmgo(){ const el = $('#dmIn'); dmAct(el ? el.value : UI.dmDraft); },
  dmchip(v){ dmAct(v); },
  dmstop(){ if (DM.ctl) DM.ctl.abort(); },
  skip(){ skipAnim(); },
  bdone(){ finishBattle(); },
  bmenu(v){ if (G.B) { G.B.menu = v; render(); } },
  bmove(v){ playerAction({ type:'move', id:v }); },
  bascend(){ const B = G.B; if (!B || B.over || B.queue.length || ANIM || B.needSwitch || !canAscend()) return; ascend('p'); play(); },
  brun(){ playerAction({ type:'run' }); },
  bswap(v){ playerAction({ type:'switch', idx:+v }); },
  bswitch(v){ playerAction({ type:'switch', idx:+v }); },
  bitem(v){ const it = ITEMS[v]; if (it.kind === 'ball') { if (G.B.kind !== 'wild') return; playerAction({ type:'catch', id:v }); } else { G.B.menu = 'target:' + v; render(); } },
  btarget(v){ const [id, uid] = v.split('|'); playerAction({ type:'item', id, uid }); }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.a]; if (!fn) return;
  e.preventDefault();
  fn(el.dataset.v, el);
});
document.addEventListener('keydown', e => {
  const t = e.target;
  if (t && t.id === 'dmIn' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); dmAct(t.value); return; }
  if (t && t.matches && t.matches('g[data-a]') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); const fn = ACTIONS[t.dataset.a]; if (fn) fn(t.dataset.v, t); return; }
  if (e.key === 'Escape' && UI.modal && UI.modal.buttons && UI.modal.buttons.length === 1) closeModal();
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'cName' && UI.create) UI.create.name = t.value;
  else if (t.id === 'dmIn') UI.dmDraft = t.value;
  else if (t.id === 'importBox') UI.importText = t.value;
});

/* ================= Boot ================= */
async function initCaps(){
  const C = window.claude;
  if (!C || typeof C.use !== 'function') { DM.state = 'off'; render(); return; }
  UI.cloudChecking = true; render();
  const safeUse = name => C.use(name).catch(() => null);
  const [sample, db, user] = await Promise.all([safeUse('sample'), safeUse('db'), safeUse('user')]);
  DM.sample = sample; DM.state = sample ? 'ready' : 'off';
  if (db && user) {
    try {
      const id = await user.id();
      if (id) {
        CLOUD.db = db; CLOUD.uid = id;
        const cs = await cloudRead();
        if (cs) { UI.cloudSave = cs; if (UI.view === 'title') UI.save = metaOf(bestSave()); }
      }
    } catch (e) { /* stay on the browser save */ }
  }
  UI.cloudChecking = false;
  render();
}
function registerHot(){
  try {
    const hot = window.claude && window.claude.hot;
    if (hot && typeof hot.snapshot === 'function') hot.snapshot(() => ({ G, ui:{ view:UI.view, panel:UI.panel, tab:UI.tab, create:UI.create } }));
  } catch (e) { /* hot updates are optional */ }
}
function start(data){
  UI.localSave = lsGet();
  UI.save = metaOf(UI.localSave);
  if (data && data.G) {
    G = migrate(data.G);
    const u = data.ui || {};
    UI.view = u.view || 'game'; UI.panel = u.panel || 'explore'; UI.tab = u.tab || 'party'; if (u.create) UI.create = u.create;
    if (UI.view === 'create' && !UI.create) UI.view = 'title';
  }
  render();
  if (G && G.B && G.B.queue.length) play();
  initCaps();
  registerHot();
}
(function boot(){
  const hot = window.claude && window.claude.hot;
  if (hot && typeof hot.ready === 'function') hot.ready(d0 => start(d0 || {}));
  else start((hot && hot.data) || {});
})();
