'use strict';
/* Halcyon Road: Zenith Isle, the fifth region. A volcanic island in the open ocean that hosts the
   World Tournament, reached on the Champions' Liner once you have won all four regional leagues.
   There is no fresh start here: every partner you have ever caught, in any region, comes along
   (see gatherTeams and scatterTeams in game.js). */

REGIONS.zenith = { n:'Zenith Isle', land:'M70,160 L95,90 L160,45 L250,38 L325,70 L360,140 L340,210 L270,252 L185,262 L110,238 L72,205 Z', islands:[[40,62,16,7],[365,252,20,8],[36,258,14,6],[330,28,12,5]] };

/* ---------------- Island creatures ---------------- */
S('coconaut','Coconaut',['rock','grass'],[96,108,120,56],16,230,null,'crab',['claws','leaf'],'A crab that lives inside a coconut and cracks open other coconuts to see if they are nicer.');
S('parrotune','Parrotune',['normal','flying'],[84,96,74,112],15,225,null,'bird',['crest','plume','wings'],'Repeats the World Stadium announcer word for word, and is usually a few seconds faster.');
S('lagoonray','Lagoonray',['water','psychic'],[92,102,88,104],16,230,null,'fish',['wings','spots','gem'],'Glides through Zenith’s lagoon so slowly that the fish forget it is there.');
S('calderon','Calderon',['fire','ground'],[118,112,124,46],17,240,null,'quad',['shell','rocks','topflame','big'],'Sleeps on the caldera rim under a shell of cooling lava. When it wakes up, so does the volcano.');
S('zenithar','Zenithar',['psychic','dragon'],[118,134,110,112],27,350,null,'serpent',['horns','wings','crest','aura','gem'],'Every World Tournament trophy is cast in its likeness. It is said to show itself only to a trainer who has beaten the whole world.',{legend:true, ex:{1:'recover'}});

/* ---------------- Map ---------------- */
const WN = (id, o) => N(id, Object.assign({ rg:'zenith', tier:6 }, o));
WN('w_port',{n:'Zenith Harbor', k:'town', x:115, y:215, haven:'haven', shop:true, adj:['a_harbor','w_village'],
  req:g=>F(g,'champion_arclight'), lock:'The Champions’ Liner only carries trainers who have won all four regional leagues.',
  d:'A white harbor town under a smoking volcano, its quays strung with flags from every region. The Champions’ Liner docks here.',
  encLabel:'Fish the lagoon', enc:[['lagoonray',60,64,12],['parrotune',60,64,8],['harborlion',60,64,6],['krakenmaw',60,64,4],['axoltide',60,64,4],['narwhallow',60,64,4],['tyrantide',62,64,2]], rare:['lagoonray',70,70]});
WN('w_village',{n:'Champions’ Village', k:'town', x:200, y:190, haven:'haven', shop:true, adj:['w_port','w_stadium','w_jungle'],
  d:'Where the world’s best trainers stay during the tournament: practice courts, food stalls from every region, and a great deal of friendly trash talk.'});
WN('w_stadium',{n:'World Stadium', k:'league', x:205, y:105, adj:['w_village'],
  d:'A stadium carved into the volcano’s slope, so big it makes the mountain look small. The flags of every region fly from its rim.'});
WN('w_jungle',{n:'Emberleaf Jungle', k:'route', x:285, y:180, adj:['w_village','w_caldera'],
  d:'A steaming jungle on the volcano’s flank where creatures from every region have drifted ashore over the centuries and stayed.',
  enc:[['coconaut',62,66,12],['parrotune',62,66,12],['lagoonray',62,66,8],['calderon',64,67,5],['brawlape',62,66,5],['solscarab',62,66,4],['borealynx',62,66,4],['topiarion',62,66,5],['pyrocobra',62,66,5],['gulotooth',62,66,5],['crowndrake',64,67,2]], rare:['calderon',70,70]});
WN('w_caldera',{n:'Zenith Caldera', k:'cave', x:300, y:100, adj:['w_jungle'],
  req:g=>F(g,'world_champion'), lock:'The rangers keep the caldera closed to everyone but the World Champion.',
  d:'The volcano’s smoking crater, ringed with black glass. Something vast circles in the smoke above it.',
  enc:[['calderon',66,70,10],['slagtitan',66,70,6],['frostflame',66,70,4],['drakonarch',66,70,4],['sandreaver',66,70,4],['voltwyrm',66,70,5],['fjorddrake',66,70,4],['crowndrake',66,70,4],['subwyrm',66,70,5],['sunmane',66,70,5]], rare:['drakonarch',75,75]});
NODES.a_harbor.adj.push('w_port');

/* ---------------- The World Tournament ----------------
   Four knockout rounds with healing between them. The first three opponents are drawn from the
   elites and champions of every region, the final is always Corin, and each title won makes the
   next tournament two levels tougher. */
const WORLD_ENTRANTS = [['r_wren','halcyon'],['r_brann','halcyon'],['r_morwen','halcyon'],['r_draven','halcyon'],
  ['s_e1','solenne'],['s_e2','solenne'],['s_e3','solenne'],['s_e4','solenne'],['s_champ','solenne'],
  ['n_e1','nordhaven'],['n_e2','nordhaven'],['n_e3','nordhaven'],['n_e4','nordhaven'],['n_champ','nordhaven'],
  ['a_e1','arclight'],['a_e2','arclight'],['a_e3','arclight'],['a_e4','arclight'],['a_champ','arclight']];
const WORLD_ROUNDS = ['first round','quarterfinal','semifinal','final'];
function worldState(g){ return g.world || (g.world = { titles:0, round:1, foe:null, used:[] }); }
function ensureWorldFoe(g){
  const f = worldState(g).foe || { name:'World Tournament Entrant', team:[['sunmane',75]], intro:'', outro:'“What a match.”', apex:null };
  Object.assign(TRAINERS.world_foe, { name:f.name, team:f.team, intro:f.intro, outro:f.outro, apex:f.apex });
}
function corinWorldTeam(g, lvl){
  const halcyon = (RIVAL_LINE[g.starter] || RIVAL_LINE.emberkit)[2];
  const regional = ['solenne','nordhaven','arclight'].map(r => { const lines = REGION_RIVAL[r]; return (lines[g.starters && g.starters[r]] || Object.values(lines)[0])[2]; });
  return { team:[['galecrest',lvl],['drakonarch',lvl], ...regional.map(s => [s, lvl + 1]), [halcyon, lvl + 3]], apex:[halcyon, ...regional] };
}
function worldRound(g, n){
  const s = worldState(g);
  if (n === 1) s.used = [];
  if (n > 1) healParty();
  s.round = n;
  const lvl = Math.min(95, 74 + 2 * s.titles) + (n - 1) * 2;
  if (n < 4) {
    const [id, rg] = pick(WORLD_ENTRANTS.filter(([e]) => !s.used.includes(e))); s.used.push(id);
    const T0 = TRAINERS[id], sp = [...new Set(T0.team.map(t => t[0]))].slice(-6);
    s.foe = { name:`${T0.name} of ${REGIONS[rg].n}`, team:sp.map((x, i) => [x, lvl + (i === sp.length - 1 ? 2 : 0)]), intro:T0.intro, outro:T0.outro, apex:T0.apex || null };
  } else {
    const c = corinWorldTeam(g, lvl);
    s.foe = { name:'Corin', team:c.team, intro:'“Every region. Every partner. Everything we’ve got.”', outro:'“...Okay. World Champion. I can live with that. For now.”', apex:c.apex };
  }
  ensureWorldFoe(g);
  const who = n < 4 ? `${s.foe.name} walks out to meet you` : 'Corin walks out of the far tunnel, grinning like it is the first day all over again,';
  return (n > 1 ? 'Between rounds, the tournament medics restore your whole team.\n\n' : '') + `The ${WORLD_ROUNDS[n - 1]}. ${who} with ${s.foe.team.length} partners around level ${lvl}.`;
}
function worldWon(g){
  const s = worldState(g); s.titles++;
  const first = !F(g, 'world_champion'); setF(g, 'world_champion');
  const cash = 10000 + 1000 * s.titles;
  g.items.absolute = (g.items.absolute || 0) + 2; g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 5; g.items.maxsalve = (g.items.maxsalve || 0) + 3; g.money += cash;
  g.hof.push({ at:Date.now(), region:'zenith', team:g.party.map(m => ({ sp:m.apexFrom || m.sp, lvl:m.lvl })) }); UI.pendingHof = true;
  const prize = `Prize: 2 Absolute Capsules, 5 Wisdom Fruits, 3 Max Salves and ${fmtMoney(cash)}.`;
  return first
    ? `Confetti pours down over the World Stadium. Corin is flat on their back on the field, laughing. “The whole world,” they say to the sky. “You beat the whole world.”\n\nThe tournament chair hands you a trophy cast in the shape of a winged serpent. “World Champion. The rangers will open Zenith Caldera for you. Something up there has been waiting for this.”\n\n${prize}`
    : `The stadium roars as you lift the trophy again: your ${ordinal(s.titles)} world title. Corin shakes your hand. “Next year,” they say. “Definitely next year.”\n\n${prize} Next year’s tournament will be tougher.`;
}
T('world_foe','World Tournament Entrant',150,[['sunmane',75]],'','“What a match.”',{ ai:'smart', heals:2, dyn:ensureWorldFoe });
const worldBattle = next => ({ l:'Battle', battle:'world_foe', rematch:true, soft:true, lose:'lost', go:next });
SC('worldcup',{ node:'w_stadium', title:'The World Tournament', repeat:true, steps:{
  start:{ t:g => `The World Stadium is full to the rim, and the noise comes down on you like weather. The champions and elites of every region are here, and every one of them wants the trophy.\n\nThe tournament chair, a tiny woman with a very large voice, reads out the rules. “Four rounds, knockout. Medics between rounds. Any partners you have ever caught, six at a time.”\n\nWorld titles won: ${worldState(g).titles}.`,
    c:[{ l:'Enter the World Tournament', go:'r1' }, { l:'Not today', go:'leave' }] },
  leave:{ t:'You head back down to the Champions’ Village. The tournament runs every day.', end:true },
  r1:{ t:g => worldRound(g, 1), c:[worldBattle('r2')] },
  r2:{ t:g => worldRound(g, 2), c:[worldBattle('r3')] },
  r3:{ t:g => worldRound(g, 3), c:[worldBattle('r4')] },
  r4:{ t:g => worldRound(g, 4), c:[worldBattle('won')] },
  won:{ t:g => worldWon(g), end:true },
  lost:{ t:g => `Knocked out in the ${WORLD_ROUNDS[(worldState(g).round || 1) - 1]}. The crowd gives you a standing ovation anyway. “Come back tomorrow,” the tournament chair says. “The world will still be here.”`, end:true }
}});

/* ---------------- Story ---------------- */
SC('w_arrive',{ node:'w_port', title:'Zenith Isle', auto:true, steps:{
  start:{ t:'The Champions’ Liner rounds a headland, and Zenith Isle rises out of the sea: a green volcano wearing a crown of cloud, and on its slope a stadium so big it makes the mountain look small. Flags from every region snap along the quay.\n\nCorin is at the rail beside you and, for once, not saying anything. Then: “Every champion in the world is here. Every single one.”\n\nOn the dock, a tournament official in a white blazer checks your invitation. “Welcome, champion. The World Tournament has one rule the regional leagues don’t: you may bring any partner you have ever caught. Your teams from every region came over on the morning boat. Choose your six at the ranch in any haven on the island.”',
    do:g => setF(g, 'zenith_arrived'), end:true }
}});
SC('w_legend',{ node:'w_caldera', title:'The crest of the world', repeat:true, req:g => F(g, 'world_champion') && !F(g, 'legend_zenithar'), steps:{
  start:{ t:'At the lip of the caldera the smoke parts, and something long and silver-gold rises out of the crater on wide wings: the creature on the World Tournament’s crest. Zenithar.', c:[{ l:'Face Zenithar', wild:['zenithar',80], go:'gone', fled:'flee' }, { l:'Leave it be for now', go:'flee' }] },
  flee:{ t:'Zenithar sinks back into the smoke. It will rise again for the World Champion.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule shines like the trophy on your mantel. Zenithar is yours. Down the mountain, the whole island is cheering, though nobody down there could possibly have seen.' : 'Zenithar climbs into the sky and circles the island once, so high it looks like a star. It will come back to the caldera.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_zenithar'); }, end:true }
}});

MILESTONES.push(
  ['zenith_arrived','The player reached Zenith Isle for the World Tournament, where any partner they have ever caught, from any region, may fight.'],
  ['world_champion','The player is World Champion: they won the World Tournament on Zenith Isle, beating Corin in the final.']
);
