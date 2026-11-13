// Usage: node tools/regions-test.js
// Plays the postgame, then starts fresh in Solenne and Nordhaven, checking the daycare swap,
// regional starters, Apex Ascension and both leagues through the real engine.
const { run } = require('./harness.js');
const out = run(`(function(){
  const log = []; let ascents = 0, foeAscents = 0, battles = 0;
  function fight(){
    let guard = 0; battles++;
    while (G.B && guard++ < 900) {
      skipAnim(); const B = G.B;
      if (B.queue.length) continue;
      if (B.over) { for (const f of B.log) if (/Apex Band flares/.test(f.text)) foeAscents++; const r = B.result; finishBattle(); handleModals(); return r; }
      if (B.needSwitch) { playerAction({type:'switch', idx:G.party.findIndex(m => m.hp > 0)}); continue; }
      if (canAscend()) { ACTIONS.bascend(); ascents++; skipAnim(); if (!actP().apexFrom) throw new Error('ascend did nothing'); continue; }
      const P = actP(), Fo = actF();
      if (B.kind === 'wild' && SPECIES[Fo.sp].legend && Fo.hp < maxHP(Fo) * .5) { playerAction({type:'catch', id: G.items.absolute ? 'absolute' : 'hypercapsule'}); continue; }
      if (P.hp < maxHP(P) * .3 && G.items.hypersalve) { playerAction({type:'item', id:'hypersalve', uid:P.uid}); continue; }
      playerAction({type:'move', id:bestMove(P, Fo)});
    }
    throw new Error('battle stuck');
  }
  function play(id, tries){
    tries = tries || 20;
    for (let t = 0; t < tries; t++) {
      const S = SCENES[id]; G.node = S.node; G.visited[S.node] = true; G.scene = null; G.B = null; healParty();
      if (!sceneAvail(S)) return t === 0 ? 'unavailable' : 'done';
      startScene(id); let g = 0;
      while (G.scene && g++ < 300) {
        if (G.B) { fight(); continue; }
        const sc = G.scene;
        if (sc.pending) { acceptFailure(); continue; }
        for (const m of G.party) { if (m.hp <= 0 && G.items.revive) { consume('revive'); m.hp = Math.floor(maxHP(m) / 2); } if (m.hp > 0 && m.hp < maxHP(m) * .5 && G.items.hypersalve) { consume('hypersalve'); m.hp = Math.min(maxHP(m), m.hp + 120); } }
        if (sc.ended) { closeScene(); handleModals(); break; }
        const ch = choicesOf(SCENES[sc.id].steps[sc.step]);
        let i = ch.findIndex(c => c.battle || c.wild);
        if (i < 0) i = ch.findIndex(c => !/^(Leave|Not now|Not today|Not yet|Leave it be)/.test(c.l));
        choose(i < 0 ? 0 : i);
      }
      G.node = SCENES[id].node;
      if (G.done[id] || (SCENES[id].repeat && !sceneAvail(SCENES[id]))) return 'done' + (t ? ' after ' + (t + 1) + ' tries' : '');
      if (SCENES[id].repeat && /^(tower|leaguerematch|rematch_|league_.*_rematch)/.test(id)) return 'played';
      G.items.hypersalve = Math.max(G.items.hypersalve || 0, 30); G.items.revive = Math.max(G.items.revive || 0, 10);
    }
    return 'kept after ' + tries + ' tries';
  }
  function team(list, lvl){ G.party = list.map(s => makeMon(s, lvl)); for (const m of G.party) markCaught(m.sp); }

  newGame({name:'Tester', bg:'ace', abil:{str:14,dex:14,con:12,int:12,wis:14,cha:12}, diff:'adventurer'}); UI.view = 'game';
  play('intro');
  for (const b of BADGES.filter(b => !b[5])) G.badges.push(b[0]);
  setF(G, 'champion'); setF(G, 'revived'); setF(G, 'vane_final');
  G.items.hypersalve = 60; G.items.hypercapsule = 40; G.items.revive = 20; G.money = 100000;
  team([STARTER_FINAL[G.starter], 'galecrest', 'brawlape', 'cerebrix', 'tyrantide', 'sandreaver'], 82);
  const halcyonUids = G.party.map(m => m.uid).join(',');

  // Halcyon postgame
  log.push('rematch_dorrin2: ' + play('rematch_dorrin2') + ', Bouldrock stone: ' + !!G.keys.apexstone_bouldrock);
  log.push('leaguerematch: ' + play('leaguerematch') + ', four stones: ' + ['galecrest','brawlape','solvixen','tidalrus'].every(s => G.keys['apexstone_' + s]));
  for (let i = 0; i < 3; i++) play('tower');
  log.push('tower: best ' + G.tower.best + ', sets ' + G.tower.sets);
  log.push('ashen arc: ' + play('ashen1') + ' / ' + play('ashen2') + ' / ' + play('ashen3') + ' / astraeon caught=' + (play('astraeon'), !!G.codex.caught.astraeon));

  // Solenne: fresh start
  G.node = 'saltmere'; G.scene = null;
  travel('s_port');
  log.push('Solenne: party after ferry ' + G.party.length + ', Halcyon team at daycare ' + (G.teams.halcyon && G.teams.halcyon.party.length) + ', auto scene ' + (G.scene && G.scene.id) + ', lastHaven ' + G.lastHaven);
  log.push('s_arrive: ' + play('s_arrive') + ', starter ' + G.starters.solenne + ' Lv' + (G.party[0] && G.party[0].lvl) + ', band ' + !!G.keys.apexband + ', starter stone ' + !!G.keys['apexstone_' + REGION_FINAL[G.starters.solenne]]);
  G.node = 's_port'; travel('saltmere');
  log.push('sailed home: Halcyon team restored ' + (G.party.map(m => m.uid).join(',') === halcyonUids) + ', Solenne team waiting ' + (G.teams.solenne && G.teams.solenne.party.length));
  G.node = 'saltmere'; travel('s_port');
  log.push('back in Solenne with ' + G.party.map(m => SPECIES[m.sp].n).join(','));
  const sTeam = [REGION_FINAL[G.starters.solenne], 'sunmane', 'terraknight', 'sphinxara', 'stormkite', 'dromedune'];
  team(sTeam, 30);
  for (const id of ['gym_vintage','gym_mesa','gym_gauntlet','s_hand1','gym_oasis','s_rival1']) log.push(id + ': ' + play(id));
  team(sTeam, 50);
  for (const id of ['gym_essence','s_hand2','s_legend','gym_updraft','gym_thunderhead','gym_solar']) log.push(id + ': ' + play(id));
  team(sTeam, 60);
  log.push('s_rival: ' + play('s_rival') + ' / league: ' + play('league_solenne') + ' / champion_solenne: ' + F(G, 'champion_solenne'));

  // Nordhaven: fresh start again
  G.node = 's_aurelia'; G.scene = null;
  travel('n_port');
  log.push('Nordhaven: party after airship ' + G.party.length + ', Solenne team at daycare ' + (G.teams.solenne && G.teams.solenne.party.length));
  log.push('n_arrive: ' + play('n_arrive') + ', starter ' + G.starters.nordhaven + ', stone ' + !!G.keys['apexstone_' + REGION_FINAL[G.starters.nordhaven]]);
  const nTeam = [REGION_FINAL[G.starters.nordhaven], 'glacibear', 'polarvixen', 'krakenmaw', 'runebreaker', 'borealynx'];
  team(nTeam, 32);
  for (const id of ['gym_pinecone','gym_longship','gym_rime','gym_barrow','n_choir1','n_rival1']) log.push(id + ': ' + play(id));
  team(nTeam, 52);
  for (const id of ['n_choir2','n_legend','gym_rune','gym_bedrock','gym_hearth','gym_dragonscale']) log.push(id + ': ' + play(id));
  team(nTeam, 62);
  log.push('n_rival: ' + play('n_rival') + ' / league: ' + play('league_nordhaven') + ' / champion_nordhaven: ' + F(G, 'champion_nordhaven'));
  log.push('apex stones: ' + Object.keys(G.keys).filter(k => k.startsWith('apexstone_')).length + '/' + Object.keys(APEX).length);
  log.push('party reverted after battles: ' + G.party.every(m => !m.apexFrom && !SPECIES[m.sp].apexOf));
  log.push('battles ' + battles + ', player ascents ' + ascents + ', foe ascents ' + foeAscents);

  for (const n of ['s_port','n_port','tower','crater']) { G.node = n; G.scene = null; G.B = null; UI.panel = 'map'; render(); UI.panel = 'explore'; render(); UI.panel = 'ranch'; render(); }
  UI.tab = 'sheet'; render(); UI.tab = 'codex'; render(); openHof(); closeModal();

  // Old-save migration: a save already standing in Solenne with its Halcyon team
  const old = JSON.parse(JSON.stringify(G)); delete old.teams; delete old.starters; old.node = 's_mirrow'; old.done.s_arrive = true;
  const mg = migrate(old);
  log.push('migration: party ' + mg.party.length + ', Halcyon team saved ' + !!(mg.teams.halcyon && mg.teams.halcyon.party.length) + ', arrival scene replayable ' + !mg.done.s_arrive);
  return log.join('\\n');
})()`);
console.log(out);
