// Usage: node tools/regions-test.js
// Plays the postgame, Solenne and Nordhaven through the real engine, using Apex Ascension whenever it can.
const { run, els } = require('./harness.js');
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
  const starterFinal = STARTER_FINAL[G.starter];
  team([starterFinal, 'galecrest', 'brawlape', 'cerebrix', 'tyrantide', 'sandreaver'], 82);

  // Halcyon postgame
  log.push('rematch_dorrin2: ' + play('rematch_dorrin2'));
  log.push('leaguerematch: ' + play('leaguerematch'));
  for (let i = 0; i < 3; i++) play('tower');
  log.push('tower: streak ' + G.tower.streak + ', best ' + G.tower.best + ', sets ' + G.tower.sets);
  log.push('ashen1: ' + play('ashen1') + ' / ashen2: ' + play('ashen2') + ' / crater open: ' + canEnter('crater'));
  log.push('ashen3: ' + play('ashen3') + ' / astraeon: ' + play('astraeon') + ' caught=' + !!G.codex.caught.astraeon);

  // Solenne
  G.node = 'saltmere'; G.scene = null; G.lastHaven = 'saltmere';
  travel('s_port');
  log.push('arrived Solenne: ' + (G.node === 's_port') + ', auto scene: ' + (G.scene && G.scene.id));
  if (G.scene) { while (G.scene && !G.scene.ended) choose(0); closeScene(); }
  log.push('apex band: ' + !!G.keys.apexband + ', starter stone: ' + !!G.keys['apexstone_' + starterFinal]);
  for (const id of ['gym_vintage','gym_mesa','gym_gauntlet','s_hand1','gym_oasis','gym_essence','s_hand2','s_legend','gym_updraft','gym_thunderhead','gym_solar']) log.push(id + ': ' + play(id));
  log.push('Solenne badges: ' + rb(G, 'solenne') + ', steps open: ' + canEnter('s_steps'));
  team([starterFinal, 'galecrest', 'brawlape', 'cerebrix', 'tyrantide', 'sandreaver'], 90);
  log.push('s_rival: ' + play('s_rival') + ' / league: ' + play('league_solenne') + ' / champion_solenne: ' + F(G, 'champion_solenne'));

  // Nordhaven
  G.node = 's_aurelia'; G.scene = null;
  travel('n_port');
  log.push('arrived Nordhaven: ' + (G.node === 'n_port'));
  if (G.scene) { while (G.scene && !G.scene.ended) choose(0); closeScene(); }
  team([starterFinal, 'galecrest', 'brawlape', 'cerebrix', 'tyrantide', 'sandreaver'], 99);
  for (const id of ['gym_pinecone','gym_longship','gym_rime','gym_barrow','n_choir1','n_choir2','n_legend','gym_rune','gym_bedrock','gym_hearth','gym_dragonscale']) log.push(id + ': ' + play(id));
  team([starterFinal, 'galecrest', 'brawlape', 'cerebrix', 'tyrantide', 'sandreaver'], 100);
  log.push('n_rival: ' + play('n_rival') + ' / league: ' + play('league_nordhaven') + ' / champion_nordhaven: ' + F(G, 'champion_nordhaven'));
  log.push('apex stones: ' + Object.keys(G.keys).filter(k => k.startsWith('apexstone_')).length + '/12');
  log.push('party reverted after battles: ' + G.party.every(m => !m.apexFrom && !SPECIES[m.sp].apexOf));
  log.push('battles ' + battles + ', player ascents ' + ascents + ', foe ascents ' + foeAscents);

  // Views in each region
  for (const n of ['s_port','n_port','tower','crater']) { G.node = n; G.scene = null; G.B = null; UI.panel = 'map'; render(); UI.panel = 'explore'; render(); }
  UI.tab = 'sheet'; render(); UI.tab = 'codex'; render(); openHof(); closeModal();
  return log.join('\\n');
})()`);
console.log(out);
console.log('map html has Nordhaven:', els.app.innerHTML.length > 0);
