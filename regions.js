'use strict';
/* Halcyon Road: the regions beyond Halcyon, unlocked one league at a time, plus Apex Ascension. */

/* ---------------- Region maps ---------------- */
const REGIONS = {
  halcyon:{ n:'Halcyon Region', land:'M18,40 L60,22 L120,30 L160,12 L240,10 L300,8 L340,30 L370,60 L388,110 L380,160 L390,220 L385,268 L340,282 L285,276 L260,240 L230,222 L190,218 L140,222 L110,240 L100,280 L55,292 L40,262 L30,220 L10,180 L8,120 L12,70 Z', islands:[[205,283,22,11],[122,284,24,12],[226,251,16,9]] },
  solenne:{ n:'Solenne', land:'M20,30 L100,18 L200,15 L300,25 L370,45 L385,120 L370,200 L340,255 L260,240 L200,250 L130,262 L85,272 L40,262 L28,200 L15,130 Z', islands:[[330,282,20,8],[150,285,14,6]] },
  nordhaven:{ n:'Nordhaven', land:'M25,70 L70,25 L160,15 L260,18 L350,40 L385,100 L375,170 L390,230 L360,275 L300,262 L250,270 L190,262 L140,250 L95,240 L60,205 L30,180 L45,140 L15,110 Z', islands:[[220,195,14,7],[60,268,18,8],[370,285,16,7]] }
};

/* ---------------- Solenne creatures ---------------- */
S('sandsnip','Sandsnip',['ground','bug'],[52,70,72,54],12,90,[60,'duneskorp'],'insect',['stinger','antennae'],'Buries itself in the salt flats with only its stinger showing.');
S('duneskorp','Duneskorp',['ground','bug'],[86,112,108,74],16,220,null,'insect',['stinger','horn','claws'],'Its armor turns blades aside and its stinger changes minds.');
S('grapling','Grapling',['grass'],[56,54,58,50],11,88,[60,'vinocerus'],'bulb',['leaf','spots'],'A cluster of grapes that ripened into a creature. Vintners call it lucky and a little annoying.');
S('vinocerus','Vinocerus',['grass','fighting'],[96,114,92,70],16,225,null,'quad',['horn','leaf','mane'],'Guards the old vineyards with a horn of twisted vine wood.');
S('sunbloom','Sunbloom',['grass','fire'],[78,100,72,92],15,215,null,'bulb',['petals','topflame'],'Its petals catch the noon sun and throw it back as fire.');
S('dunekit','Dunekit',['ground'],[50,60,52,82],12,90,[60,'miragefen'],'quad',['ears','tail'],'A fennec kit with ears bigger than its sense. It can hear a beetle dig at fifty paces.');
S('miragefen','Miragefen',['ground','psychic'],[82,100,78,114],16,220,null,'quad',['ears','tail','eyes3'],'Shows travellers an oasis that isn’t there, then leads the honest ones to the one that is.');
S('brinewader','Brinewader',['water','flying'],[84,90,78,96],14,200,null,'bird',['crest','plume'],'Wades the salt flats on long pink legs and is extremely vain about them.');
S('crestram','Crestram',['rock','fighting'],[88,108,104,70],15,210,null,'quad',['horns','mane'],'Butts heads with its rivals so hard the canyon echoes for a minute.');
S('whirldust','Whirldust',['ground','flying'],[74,94,70,110],15,205,null,'ghost',['spots'],'A dust devil that wandered into being. It cannot stop spinning and has made peace with that.');
S('skinkle','Skinkle',['fire'],[52,64,54,74],12,90,[60,'heliskink'],'serpent',['spots'],'Basks on hot rocks until it glows. Do not pick it up when it glows.');
S('heliskink','Heliskink',['fire','electric'],[84,108,78,106],16,225,null,'serpent',['spots','bolt','crest'],'Stores the desert noon in its scales and lets it out as lightning at dusk.');
S('tombwrap','Tombwrap',['ghost','rock'],[84,98,108,50],15,210,null,'tall',['mask','stripes'],'Guards the sealed tombs of the Sunstone Ruins, wrapped in linen older than the city.');
S('helioserp','Helioserp',['ground','fire'],[110,124,106,100],26,340,null,'serpent',['horns','flame','crest','aura'],'The sun serpent of Solenne. The old kings built the Sunstone Ruins to keep it asleep.',{legend:true, ex:{1:'recover'}});

/* ---------------- Nordhaven creatures ---------------- */
S('frostmite','Frostmite',['bug','ice'],[54,66,70,58],12,95,[80,'rimewing'],'insect',['antennae','spikes'],'Burrows under pine bark in winter and comes out sparkling with frost.');
S('rimewing','Rimewing',['bug','ice'],[86,104,90,106],16,230,null,'insect',['antennae','wings'],'Its wings are thin as frost on a window. On clear nights it flies with the aurora.');
S('snowhorn','Snowhorn',['ice','normal'],[100,104,88,72],15,215,null,'quad',['antlers','mane'],'Leads its herd through blizzards by the warmth of its own breath.');
S('howlpup','Howlpup',['ice'],[56,70,54,80],12,95,[80,'fenrime'],'quad',['ears','tail'],'Howls at the aurora every night. The aurora has never answered, but it stays hopeful.');
S('fenrime','Fenrime',['ice','ghost'],[90,116,80,112],17,235,null,'quad',['ears','tail','mane','teeth'],'A wolf of frost and memory that runs the glacier ridges on moonless nights.');
S('barrowight','Barrowight',['ghost','fighting'],[92,116,96,74],16,230,null,'tall',['horns','mask'],'A barrow guardian still keeping its oath, though everyone it swore to is long gone.');
S('runegolem','Runegolem',['rock','electric'],[104,108,124,48],16,230,null,'round',['rocks','gem','bolt'],'The old runes carved into it glow whenever a storm is coming.');
S('driftmare','Driftmare',['water','ghost'],[90,98,82,96],16,225,null,'blob',['tentacles','eyesbig'],'Drifts under the fjord ice. Fishermen hear it singing through their hulls.');
S('tuskolith','Tuskolith',['ice','ground'],[120,118,104,52],16,235,null,'quad',['tusks','big','spikes'],'A woolly giant from the glacier’s heart. It remembers the last ice age fondly.');
S('mosstroll','Mosstroll',['grass','rock'],[110,108,112,40],15,225,null,'tall',['rocks','leaf','big'],'Sleeps as a mossy boulder beside the trail and wakes if you are rude to it.');
S('hollowcrow','Hollowcrow',['normal','ghost'],[78,100,72,110],15,215,null,'bird',['crest','mask'],'Carries messages for the dead and gossip for the living.');
S('voltwyrm','Voltwyrm',['dragon','electric'],[96,124,92,112],20,265,null,'serpent',['horns','bolt','fin'],'Rides storm fronts down the fjords and lands wherever lightning has just struck.');
S('aurorath','Aurorath',['ice','dragon'],[116,130,110,108],27,350,null,'serpent',['horns','wings','crest','aura'],'The dragon of the northern lights. When it sleeps the aurora fades; when it wakes, the whole sky sings.',{legend:true, ex:{1:'recover'}});

/* ---------------- Apex Ascension ---------------- */
const APEX = {
  solvixen:{t:['fire','psychic'], f:['crest']}, tidalrus:{t:['water','ice'], f:['horns']}, elderthorn:{t:['grass','dragon'], f:['petals']},
  galecrest:{t:['flying','fighting'], f:['plume']}, voltail:{t:['electric','dragon'], f:['crest']}, tyrantide:{t:['water','dragon'], f:['spikes']},
  gloomreaper:{t:['ghost','poison'], f:['mane']}, blazehound:{t:['fire','fighting'], f:['horns']}, cerebrix:{t:['psychic','fighting'], f:['mane']},
  bouldrock:{t:['rock','ground'], f:['crest','gem']}, sandreaver:{t:['ground','dragon'], f:['wings']}, brawlape:{t:['fighting','fire'], f:['flame']}
};
for (const [id, a] of Object.entries(APEX)) {
  const s = SPECIES[id];
  S('apex_' + id, 'Apex ' + s.n, a.t, [s.b[0], s.b[1] + 24, s.b[2] + 18, s.b[3] + 12], 99, s.xp, null, s.sh, [...new Set([...s.f, ...a.f, 'aura'])],
    `${s.n} at the height of its bond with its trainer. The form lasts until the battle ends.`, { nocodex:true, apexOf:id });
  KEYS['apexstone_' + id] = [`Apex Stone (${s.n})`, `Lets ${s.n} ascend once per battle while you wear the Apex Band.`];
}
KEYS.apexband = ['Apex Band', 'A woven band set with a pale stone. Once per battle, a partner whose Apex Stone you carry can ascend.'];
const STARTER_FINAL = { emberkit:'solvixen', rippup:'tidalrus', budling:'elderthorn' };

/* ---------------- Solenne map ---------------- */
const SN = (id, o) => N(id, Object.assign({ rg:'solenne', tier:6 }, o));
SN('s_port',{n:'Port Calder', k:'town', x:60, y:240, haven:'haven', shop:true, adj:['saltmere','s_flats'],
  req:g=>F(g,'champion'), lock:'The ferry to Solenne only takes Halcyon’s champion.',
  d:'A whitewashed harbor town under red cliffs, where the ferry from Halcyon ties up at sunset and the air smells of salt and hot stone.'});
SN('s_flats',{n:'Saltglass Flats', k:'route', x:112, y:205, adj:['s_port','s_vinara'],
  d:'A white salt pan so flat and bright you can see the curve of the world. Creatures shimmer in the heat haze.',
  enc:[['sandsnip',55,59,16],['dunekit',55,59,14],['brinewader',56,60,12],['whirldust',56,60,10],['skinkle',55,59,12],['pelicrane',56,59,8],['duneclaw',56,60,10],['strutfowl',56,59,8]], rare:['miragefen',62,62]});
SN('s_vinara',{n:'Vinara', k:'town', x:165, y:170, haven:'haven', shop:true, adj:['s_flats','s_canyon','s_aurelia'],
  d:'A hill town of vineyards and stone wine cellars. Every doorway has a grapevine growing over it.',
  encLabel:'Wander the vineyards', enc:[['grapling',56,60,22],['sunbloom',57,60,10],['thistlette',56,59,10],['buzzbug',56,59,10],['antlet',56,59,10],['whiskit',56,59,10],['cubbun',56,59,8]], rare:['vinocerus',62,62]});
SN('s_canyon',{n:'Redcut Canyon', k:'cave', x:232, y:196, adj:['s_vinara','s_mesa'],
  d:'A deep red canyon cut by a river that dried up a thousand years ago. The walls are carved with old sun-signs.',
  enc:[['crestram',58,63,14],['tombwrap',58,62,10],['sandsnip',58,61,10],['skinkle',58,61,10],['quarrion',58,62,10],['magmite',58,62,10],['roundhoof',58,62,8],['dunekit',58,61,8]], rare:['cragwyrm',66,66]});
SN('s_mesa',{n:'Mesa Alta', k:'town', x:300, y:168, haven:'haven', shop:true, adj:['s_canyon','s_duneway'],
  d:'A town built on top of a mesa, reached by switchback stairs. It has two gyms and an opinion about both.'});
SN('s_duneway',{n:'Duneway', k:'route', x:332, y:105, adj:['s_mesa','s_mirrow'],
  d:'An old caravan road through rolling dunes, marked with cairns every mile.',
  enc:[['duneskorp',60,64,10],['miragefen',60,64,10],['whirldust',60,64,12],['sunbloom',60,63,10],['heliskink',61,64,6],['dunemaw',60,63,10],['saguaroar',60,64,10],['rhynox',60,63,8],['brinewader',60,63,8]], rare:['sandreaver',68,68]});
SN('s_mirrow',{n:'Mirrowell Oasis', k:'town', x:274, y:62, haven:'haven', shop:true, adj:['s_duneway','s_ruins'],
  d:'Palms and blue water in the middle of the desert, and two gyms built over the water.',
  encLabel:'Fish the oasis', enc:[['brinewader',60,64,14],['bogmaw',60,64,12],['kelpling',60,63,10],['seadrop',60,63,8],['skyfin',60,64,10],['salamance',60,64,10],['conchord',60,64,8]], rare:['tidepearl',66,66]});
SN('s_ruins',{n:'Sunstone Ruins', k:'cave', x:200, y:44, adj:['s_mirrow','s_cliff'],
  d:'The half-buried palace of Solenne’s first kings, its halls lined with sun-discs and sealed tombs.',
  enc:[['tombwrap',62,67,18],['glimmet',62,66,10],['dreadsail',62,66,10],['dollkin',62,66,8],['ossuarch',62,66,10],['comethyst',64,67,6],['zenfist',62,66,8],['miragefen',62,66,8]], rare:['comethyst',70,70]});
SN('s_cliff',{n:'Cliffhaven', k:'town', x:118, y:72, haven:'haven', shop:true, adj:['s_ruins','s_aurelia'],
  d:'Houses carved into a canyon wall and joined by rope bridges. The wind never stops here, so neither do the windchimes.'});
SN('s_aurelia',{n:'Aurelia', k:'town', x:178, y:118, haven:'haven', shop:true, adj:['s_cliff','s_vinara','s_steps','n_port'],
  d:'Solenne’s capital: gold domes, a sun temple, and a mooring mast where airships leave for the north.'});
SN('s_steps',{n:'Skyreach Steps', k:'cave', x:62, y:128, haven:'lodge', shop:true, adj:['s_aurelia','s_league'],
  req:g=>rb(g,'solenne') >= 8, lock:'The steps to the Sunspire League open for trainers with all eight Solenne badges.',
  d:'Ten thousand stone steps up a red mountain to the Sunspire League. Pilgrims rest at a lodge halfway.',
  enc:[['crestram',66,70,10],['duneskorp',66,70,10],['heliskink',66,70,10],['titanus',66,70,8],['talonstorm',66,70,8],['sandreaver',67,70,6],['vinocerus',66,70,8],['tombwrap',66,70,8]], rare:['cragwyrm',72,72]});
SN('s_league',{n:'Sunspire League', k:'league', x:46, y:66, adj:['s_steps'],
  req:g=>rb(g,'solenne') >= 8, lock:'The Sunspire League admits only trainers with all eight Solenne badges.',
  d:'A gold-roofed hall on the mountain’s peak, where the sun is first to rise and last to set.'});
NODES.saltmere.adj.push('s_port');

/* ---------------- Nordhaven map ---------------- */
const NN = (id, o) => N(id, Object.assign({ rg:'nordhaven', tier:6 }, o));
NN('n_port',{n:'Skerrport', k:'town', x:330, y:248, haven:'haven', shop:true, adj:['s_aurelia','n_trail'],
  req:g=>F(g,'champion_solenne'), lock:'The airship north only flies for Solenne’s champion.',
  d:'A snowy harbor where the airship from the south moors beside fishing boats. Every roof has a carved dragon on its ridge.'});
NN('n_trail',{n:'Pinewood Trail', k:'route', x:268, y:224, adj:['n_port','n_pinewick'],
  d:'A trail through dark pines heavy with snow. Something always seems to be watching from between the trunks.',
  enc:[['frostmite',75,79,16],['howlpup',75,79,14],['snowhorn',76,80,10],['hollowcrow',76,80,12],['mosstroll',76,80,8],['arborelk',76,80,8],['prowlynx',76,80,8],['blizzowl',76,80,8]], rare:['fenrime',82,82]});
NN('n_pinewick',{n:'Pinewick', k:'town', x:205, y:236, haven:'haven', shop:true, adj:['n_trail','n_fjordmere'],
  d:'A logging village in a clearing, smelling of sap and woodsmoke.'});
NN('n_fjordmere',{n:'Fjordmere', k:'town', x:130, y:214, haven:'haven', shop:true, adj:['n_pinewick','n_glacier'],
  d:'A fishing town at the head of a long fjord, with a longship gym in the harbor and a frozen waterfall gym across the water.',
  encLabel:'Fish the fjord', enc:[['driftmare',77,81,14],['tidalrus',78,81,6],['kelplord',77,81,10],['pelicrane',77,81,10],['conchord',77,81,10],['ampeel',77,81,8],['skyfin',77,81,8]], rare:['tyrantide',84,84]});
NN('n_glacier',{n:'Glacier Pass', k:'cave', x:90, y:160, adj:['n_fjordmere','n_hollow'],
  d:'A pass through blue ice, where the glacier groans like a sleeping animal.',
  enc:[['tuskolith',78,83,14],['snowhorn',78,83,12],['fenrime',79,83,8],['howlpup',78,82,10],['polarok',78,83,10],['frostmite',78,82,8],['rimewing',80,83,6],['crystallus',78,83,8]], rare:['voltwyrm',86,86]});
NN('n_hollow',{n:'Hollowfrost', k:'town', x:120, y:105, haven:'haven', shop:true, adj:['n_glacier','n_whisper','n_peak'],
  d:'A quiet town of turf-roofed houses around a barrow field. People leave bread on the barrows, just in case.'});
NN('n_whisper',{n:'Whisperwood', k:'route', x:192, y:90, adj:['n_hollow','n_runestad'],
  d:'A forest where the wind in the branches sounds almost like voices. Lately it sounds like singing.',
  enc:[['hollowcrow',80,85,14],['barrowight',80,85,10],['mosstroll',80,85,12],['runegolem',81,85,6],['hollowgourd',80,85,10],['somnivore',80,85,10],['fenrime',81,85,8]], rare:['umbradrake',88,88]});
NN('n_peak',{n:'Aurora Peak', k:'cave', x:50, y:98, adj:['n_hollow'],
  req:g=>F(g,'choir_known'), lock:'The path up Aurora Peak is buried in snow. Someone in Whisperwood knows another way.',
  d:'A summit above the clouds where the northern lights hang so low you could almost touch them.',
  enc:[['rimewing',84,89,12],['fenrime',84,89,10],['tuskolith',84,89,10],['runegolem',84,89,10],['auroracle',84,89,10],['blizzowl',84,89,10],['voltwyrm',86,89,4]], rare:['aurorwyrm',90,90]});
NN('n_runestad',{n:'Runestad', k:'town', x:262, y:122, haven:'haven', shop:true, adj:['n_whisper','n_highmark'],
  d:'A town among standing stones carved with runes, home to a library of stone and a quarry gym.'});
NN('n_highmark',{n:'Highmark', k:'town', x:332, y:94, haven:'haven', shop:true, adj:['n_runestad','n_drakenspire'],
  d:'A walled hill town with a great mead hall where the whole town watches every gym battle.'});
NN('n_drakenspire',{n:'Drakenspire', k:'town', x:288, y:46, haven:'haven', shop:true, adj:['n_highmark','n_steps'],
  d:'A basalt tower town where dragons have nested for a thousand years. The gym is at the very top.'});
NN('n_steps',{n:'Aurora Steps', k:'cave', x:200, y:36, haven:'lodge', shop:true, adj:['n_drakenspire','n_league'],
  req:g=>rb(g,'nordhaven') >= 8, lock:'The Aurora Steps open for trainers with all eight Nordhaven badges.',
  d:'An ice stair to the Aurora League, lit from above by the northern lights.',
  enc:[['barrowight',86,90,10],['tuskolith',86,90,10],['runegolem',86,90,10],['titanus',86,90,8],['cragwyrm',86,90,8],['verdrake',86,90,8],['fenrime',86,90,8]], rare:['voltwyrm',94,94]});
NN('n_league',{n:'Aurora League', k:'league', x:122, y:40, adj:['n_steps'],
  req:g=>rb(g,'nordhaven') >= 8, lock:'The Aurora League admits only trainers with all eight Nordhaven badges.',
  d:'A hall of pale stone under a sky that never quite goes dark, where the north’s best trainers wait.'});

/* ---------------- Gyms ---------------- */
function GYM(o){
  const top = Math.max(...o.team.map(t => t[1]));
  T(o.leader, o.name, 120, o.team, '', o.outro, { ai:'smart', heals:2, leader:true, apex:o.apex || null });
  T(o.leader + '_gt', o.tname, 40, o.tteam.map(sp => [sp, top - 4]), o.tline || '“You’ll have to get past me first!”', '“Go on, then.”', { ai:'smart' });
  BADGES.push([o.badge, o.badgeName, o.name.replace('Leader ', ''), NODES[o.node].n, o.type, o.region]);
  SC('gym_' + o.badge, { node:o.node, title:o.title, gym:true, req:g=>!hasBadge(g, o.badge), steps:{
    start:{ t:o.text, c:[{ l:o.pl, chk:o.chk, go:'leader', fail:'fail' }, { l:'Battle ' + o.tname + ' instead', battle:o.leader + '_gt', go:'leader' }] },
    fail:{ t:o.failText, c:[{ l:'Battle ' + o.tname, battle:o.leader + '_gt', go:'leader' }] },
    leader:{ t:o.intro, c:[{ l:'Challenge ' + o.name, battle:o.leader, go:'win' }] },
    win:{ t:g => o.win + rewardText(g, o.reward), do:g => { badge(g, o.badge); giveReward(g, o.reward); }, end:true }
  }});
}
function rewardStone(g, reward){
  if (!reward) return null;
  if (reward === 'starter') { const left = Object.values(STARTER_FINAL).filter(sp => !g.keys['apexstone_' + sp]); return left.length ? left[0] : null; }
  return g.keys['apexstone_' + reward] ? null : reward;
}
function rewardText(g, reward){
  const sp = rewardStone(g, reward);
  if (sp) return `\n\nWith the badge comes a second gift: an Apex Stone that hums when you hold it near a ${SPECIES[sp].n}.`;
  return '\n\nWith the badge comes a pouch of three Wisdom Fruits.';
}
function giveReward(g, reward){
  const sp = rewardStone(g, reward);
  if (sp) giveKey(g, 'apexstone_' + sp);
  else give(g, 'wisdomfruit', 3);
}

GYM({ region:'solenne', node:'s_vinara', badge:'vintage', badgeName:'Vintage Badge', type:'grass', title:'Vinara Gym', name:'Leader Ines', leader:'ines', reward:'galecrest',
  team:[['vinocerus',58],['sunbloom',58],['thornova',59],['arborelk',60]],
  text:'Vinara Gym is a terraced vineyard under glass. The paths between the vines twist back on themselves, and somewhere in the middle a bell rings every few minutes.',
  pl:'Follow the sound of the bell through the vines', chk:['survival',15], failText:'The vines all look the same. A vintner in a straw hat steps out of the rows, amused.',
  tname:'Vintner Paolo', tteam:['grapling','fungrove'],
  intro:'Leader Ines is pressing grapes barefoot in a wooden vat. She climbs out, wipes her feet on her apron and grins. “Halcyon’s champion, in my vineyard! Let’s see if your roots go deep.”',
  outro:'“Deep roots.”', win:'“Deep roots,” Ines says, and pins the Vintage Badge to your collar: a tiny enamel cluster of grapes.' });
GYM({ region:'solenne', node:'s_mesa', badge:'mesa', badgeName:'Mesa Badge', type:'rock', title:'Mesa Alta Climbing Gym', name:'Leader Tomas', leader:'tomas', reward:'bouldrock',
  team:[['crestram',60],['tombwrap',60],['comethyst',61],['bouldrock',62]],
  text:'Mesa Alta’s first gym is a sheer climbing wall three hundred feet high. The leader waits at the top.',
  pl:'Climb the wall', chk:['athletics',16], failText:'Halfway up, your grip slips. A climber on a belay rope swings over. “Battle me and I’ll show you the easy route.”',
  tname:'Climber Rosa', tteam:['crestram','tombwrap'],
  intro:'Leader Tomas sits on the lip of the mesa with his legs dangling over three hundred feet of air. “Good view, eh? Let’s make it a good battle.”',
  outro:'“Solid as the mesa.”', win:'“Solid as the mesa,” Tomas says. The Mesa Badge is a disc of red sandstone.' });
GYM({ region:'solenne', node:'s_mesa', badge:'gauntlet', badgeName:'Gauntlet Badge', type:'fighting', title:'Mesa Alta Boxing Gym', name:'Leader Brigid', leader:'brigid', reward:'brawlape',
  team:[['roundhoof',62],['salamance',62],['zenfist',63],['titanus',64]],
  text:'The second gym in Mesa Alta is a boxing hall carved into the rock, loud with the thud of gloves on bags.',
  pl:'Square up and stare down the whole hall', chk:['intimidation',16], failText:'Nobody is impressed. A sparring partner taps you on the shoulder.',
  tname:'Boxer Dario', tteam:['roundhoof','salamance'],
  intro:'Leader Brigid tapes her knuckles without looking up. “Champions talk a lot. Show me.”',
  outro:'“Good hands.”', win:'“Good hands,” Brigid says, which from her is a speech. The Gauntlet Badge is a tiny bronze fist.' });
GYM({ region:'solenne', node:'s_mirrow', badge:'oasis', badgeName:'Oasis Badge', type:'water', title:'Mirrowell Water Gym', name:'Leader Sefa', leader:'sefa', reward:'tyrantide', apex:['tyrantide'],
  team:[['brinewader',64],['conchord',64],['kraggler',65],['tyrantide',66]],
  text:'Mirrowell’s first gym floats on the oasis itself: a ring of wooden platforms over water so clear you can see the fish thinking.',
  pl:'Read the ripples for the hidden stepping stones', chk:['perception',16], failText:'Splash. A swimmer surfaces beside you, laughing.',
  tname:'Swimmer Kalani', tteam:['brinewader','skyfin'],
  intro:'Leader Sefa stands on the water. It takes you a moment to see the glass platform under her feet. “The desert teaches you to respect water. Let me teach you the rest.”',
  outro:'“You flow well.”', win:'“You flow well,” Sefa says. The Oasis Badge is a drop of blue glass on a gold pin.' });
GYM({ region:'solenne', node:'s_mirrow', badge:'essence', badgeName:'Essence Badge', type:'poison', title:'Mirrowell Perfumery Gym', name:'Leader Nadir', leader:'nadir', reward:'gloomreaper', apex:['gloomreaper'],
  team:[['coilvenom',66],['muckmire',66],['spinequill',67],['gloomreaper',68]],
  text:'The oasis’s second gym is a perfumery, all copper stills and tiny bottles. Some of the bottles say DO NOT SMELL.',
  pl:'Mix the antidote the door lock asks for', chk:['nature',16], failText:'The lock puffs purple smoke. A perfumer steps out, coughing politely.',
  tname:'Perfumer Amira', tteam:['coilvenom','muckmire'],
  intro:'Leader Nadir corks a vial and smiles thinly. “Every poison is a perfume in the right dose.”',
  outro:'“The right dose.”', win:'“The right dose,” Nadir murmurs, and hands over the Essence Badge, a tiny glass bottle on a chain.' });
GYM({ region:'solenne', node:'s_cliff', badge:'updraft', badgeName:'Updraft Badge', type:'flying', title:'Cliffhaven Sky Gym', name:'Leader Aria', leader:'aria', reward:'starter', apex:['galecrest'],
  team:[['brinewader',68],['whirldust',68],['talonstorm',69],['galecrest',70]],
  text:'Cliffhaven Gym is a run of rope bridges strung between the cliff houses, swaying in the canyon wind.',
  pl:'Cross the bridges in time with the wind', chk:['acrobatics',16], failText:'A gust nearly takes you. A sky diver catches your collar. “Battle first. Then I’ll walk you across.”',
  tname:'Sky Diver Teo', tteam:['talonstorm','whirldust'],
  intro:'Leader Aria balances on a single rope over the canyon, arms out. “Up here, you either fly or you learn to.”',
  outro:'“You flew.”', win:'“You flew,” Aria says, and drops the Updraft Badge into your palm: a little silver feather.' });
GYM({ region:'solenne', node:'s_cliff', badge:'thunderhead', badgeName:'Thunderhead Badge', type:'electric', title:'Cliffhaven Lightning Gym', name:'Leader Kade', leader:'kade', reward:'voltail', apex:['voltail'],
  team:[['heliskink',70],['polarion',70],['stormwool',71],['voltail',72]],
  text:'The second Cliffhaven gym is a lightning farm: copper rods along the cliff edge, humming with stored storms.',
  pl:'Reroute the charge so the door opens', chk:['investigation',16], failText:'The door sparks and stays shut. An engineer in rubber boots sighs and sets down her clipboard.',
  tname:'Engineer Lucia', tteam:['polarion','stormwool'],
  intro:'Leader Kade is halfway up a lightning rod in a thunderstorm, holding on with one hand. “Perfect weather! Let’s go!”',
  outro:'“What a jolt!”', win:'“What a jolt!” Kade slides down the rod and hands over the Thunderhead Badge, still faintly warm.' });
GYM({ region:'solenne', node:'s_aurelia', badge:'solar', badgeName:'Solar Badge', type:'fire', title:'Aurelia Sun Temple Gym', name:'Leader Calix', leader:'calix', reward:'blazehound', apex:['blazehound'],
  team:[['heliskink',72],['sunbloom',72],['blazemane',73],['blazehound',74]],
  text:'Aurelia’s gym is the old sun temple at the heart of the capital, its floor polished brass that throws the noon light everywhere at once.',
  pl:'Read the sundial to find the true door', chk:['investigation',17], failText:'You choose wrong. A temple guard steps out of the glare.',
  tname:'Temple Guard Ilario', tteam:['heliskink','blazemane'],
  intro:'Leader Calix, in white robes hemmed with gold, turns from the altar fire. “Solenne was built by the sun. Let me show you why it still stands.”',
  outro:'“The sun approves.”', win:'“The sun approves,” Calix says, and places the Solar Badge in your hand. “The Sunspire League waits at the top of Skyreach Steps.”' });

GYM({ region:'nordhaven', node:'n_pinewick', badge:'pinecone', badgeName:'Pinecone Badge', type:'bug', title:'Pinewick Gym', name:'Leader Linnea', leader:'linnea', reward:null,
  team:[['frostmite',80],['rimewing',81],['fungalisk',81],['mantiscythe',82]],
  text:'Pinewick Gym is a hollow pine the size of a house, its walls alive with the soft clicking of a thousand beetles.',
  pl:'Follow the beetle trails to the leader’s room', chk:['survival',17], failText:'The trails split and split again. A bug catcher pops out of a knot-hole.',
  tname:'Bug Catcher Nils', tteam:['frostmite','mantiscythe'],
  intro:'Leader Linnea is cupping a moth in her hands. She lets it go. “The forest is small things, champion. Thousands of them. Shall I show you?”',
  outro:'“Thousands of small things.”', win:'“Thousands of small things,” Linnea says, and pins the Pinecone Badge to your coat.' });
GYM({ region:'nordhaven', node:'n_fjordmere', badge:'longship', badgeName:'Longship Badge', type:'water', title:'Fjordmere Longship Gym', name:'Leader Haakon', leader:'haakon', reward:null, apex:['tidalrus'],
  team:[['driftmare',82],['kelplord',83],['conchord',83],['tidalrus',84]],
  text:'Fjordmere’s first gym is a longship moored in the fjord, its deck cleared for battle and the leader waiting at the prow.',
  pl:'Row out to the ship through the swell', chk:['athletics',17], failText:'The swell takes your oar. A sailor hauls you aboard, dripping.',
  tname:'Sailor Bjorn', tteam:['driftmare','kelplord'],
  intro:'Leader Haakon, enormous and red-bearded, laughs from the prow. “A southerner on my ship! Let us see your sea legs!”',
  outro:'“Sea legs!”', win:'“Sea legs!” Haakon roars, and claps the Longship Badge into your hand hard enough to sting.' });
GYM({ region:'nordhaven', node:'n_fjordmere', badge:'rime', badgeName:'Rime Badge', type:'ice', title:'Fjordmere Ice Gym', name:'Leader Solvi', leader:'solvi', reward:null,
  team:[['snowhorn',84],['fenrime',84],['tuskolith',85],['polarok',86]],
  text:'Across the harbor, Fjordmere’s second gym is a frozen waterfall with a door cut into the ice.',
  pl:'Find the warm draft that marks the true passage', chk:['perception',17], failText:'Every passage is cold. A skater glides out of the ice.',
  tname:'Skater Ingrid', tteam:['fenrime','snowhorn'],
  intro:'Leader Solvi skates a slow circle on the frozen pool. “Ice is patient. Let’s see how long you last on it.”',
  outro:'“Steady on the ice.”', win:'“Steady on the ice,” Solvi says. The Rime Badge is as clear as the waterfall.' });
GYM({ region:'nordhaven', node:'n_hollow', badge:'barrow', badgeName:'Barrow Badge', type:'ghost', title:'Hollowfrost Barrow Gym', name:'Leader Eirik', leader:'eirik', reward:null, apex:['gloomreaper'],
  team:[['barrowight',86],['hollowcrow',86],['driftmare',87],['gloomreaper',88]],
  text:'Hollowfrost Gym is a barrow mound under the snow, with a stone door and old runes for keeping the dead in. Or out.',
  pl:'Read the warding runes before you enter', chk:['investigation',17], failText:'You read a rune wrong. Every candle inside turns to face you. A mourner rises from a bench.',
  tname:'Mourner Hedda', tteam:['barrowight','hollowcrow'],
  intro:'Leader Eirik sits on a stone coffin, whittling. “The dead here are friendly. Mostly. Let’s see if they like you.”',
  outro:'“They like you.”', win:'“They like you,” Eirik decides, and hands over the Barrow Badge, a ring of grey iron.' });
GYM({ region:'nordhaven', node:'n_runestad', badge:'rune', badgeName:'Rune Badge', type:'psychic', title:'Runestad Stone Library Gym', name:'Leader Ragna', leader:'ragna', reward:'cerebrix', apex:['cerebrix'],
  team:[['runegolem',88],['comethyst',88],['zenfist',89],['cerebrix',90]],
  text:'Runestad’s first gym is a library of standing stones, carved with runes that rearrange themselves when you look away.',
  pl:'Read the stones in the order they want to be read', chk:['insight',17], failText:'The runes laugh at you. Quite audibly. A seer steps out from behind a stone.',
  tname:'Seer Eldrid', tteam:['runegolem','zenfist'],
  intro:'Leader Ragna does not open her eyes. “You have been reading my stones for an hour. I have been reading you.”',
  outro:'“Clearer now.”', win:'“Clearer now,” Ragna says. The Rune Badge is a small carved stone, warm in your hand.' });
GYM({ region:'nordhaven', node:'n_runestad', badge:'bedrock', badgeName:'Bedrock Badge', type:'ground', title:'Runestad Quarry Gym', name:'Leader Torvald', leader:'torvald', reward:'sandreaver', apex:['sandreaver'],
  team:[['tuskolith',89],['duneclaw',89],['bogmaw',90],['sandreaver',91]],
  text:'Runestad’s second gym is a quarry pit where the ground itself is the arena and the walls lean in.',
  pl:'Brace yourself on the shifting floor', chk:['str',17], failText:'The floor slides out from under you. A quarryman offers a hand, then a battle.',
  tname:'Quarryman Leif', tteam:['tuskolith','duneclaw'],
  intro:'Leader Torvald plants a shovel in the dirt. “The earth was here before the runes and before the people. It will be here after. Shall we?”',
  outro:'“Good footing.”', win:'“Good footing,” Torvald says. The Bedrock Badge is a rough cube of granite.' });
GYM({ region:'nordhaven', node:'n_highmark', badge:'hearth', badgeName:'Hearth Badge', type:'normal', title:'Highmark Mead Hall Gym', name:'Leader Hilde', leader:'hilde', reward:null, apex:['galecrest'],
  team:[['snowhorn',90],['ursaroar',90],['hollowcrow',91],['galecrest',92]],
  text:'Highmark Gym is a mead hall with the long tables pushed back, a fire roaring, and the whole town on the benches to watch.',
  pl:'Win the crowd over with a toast', chk:['persuasion',17], failText:'The crowd boos good-naturedly. A shieldmaiden stands up from the benches.',
  tname:'Shieldmaiden Tove', tteam:['snowhorn','ursaroar'],
  intro:'Leader Hilde raises a horn cup to you from the high table. “Every warrior of the north has battled in this hall. Welcome, southerner. Now fight.”',
  outro:'“You will always have a seat at my table.”', win:'The hall erupts. Hilde hands you the Hearth Badge, a tiny bronze shield. “You will always have a seat at my table.”' });
GYM({ region:'nordhaven', node:'n_drakenspire', badge:'dragonscale', badgeName:'Dragonscale Badge', type:'dragon', title:'Drakenspire Gym', name:'Leader Sigurd', leader:'sigurd', reward:'starter',
  team:[['voltwyrm',92],['verdrake',92],['umbradrake',93],['aurorwyrm',94]],
  text:'Drakenspire Gym is the top of a basalt tower where dragons have nested for a thousand years. The wind up here could knock a person flat.',
  pl:'Climb the outer stair without looking down', chk:['wis',17], failText:'You look down. A dragon tamer catches your elbow.',
  tname:'Dragon Tamer Asa', tteam:['voltwyrm','skywyrm'],
  intro:'Leader Sigurd stands at the edge with an Aurorwyrm coiled around his shoulders like a cloak. “Every trainer in the north ends here, or stops here. Which are you?”',
  outro:'“Ends here.”', win:'“Ends here,” Sigurd says, and hands you the Dragonscale Badge. “The Aurora League waits beyond the Aurora Steps.”' });

/* ---------------- Leagues ---------------- */
function LEAGUE(o){
  const ids = [];
  for (const e of o.elites) { T(e.id, e.name, 150, e.team, e.line, e.outro, { ai:'smart', heals:1, apex:e.apex || null }); ids.push(e); }
  T(o.champ.id, o.champ.name, 200, o.champ.team, o.champ.line, o.champ.outro, { ai:'smart', heals:2, apex:o.champ.apex || null });
  const steps = { start:{ t:o.intro, c:[{ l:'Open the first door', go:'e1' }, { l:'Not yet', go:'notyet' }] }, notyet:{ t:'The doors will wait.', end:true } };
  o.elites.forEach((e, i) => { steps['e' + (i + 1)] = { t:e.text, c:[{ l:'Battle ' + e.name, battle:e.id, go:i === o.elites.length - 1 ? 'champ' : 'e' + (i + 2), rematch:true }] }; });
  steps.champ = { t:o.champ.text, c:[{ l:'Battle ' + o.champ.name, battle:o.champ.id, go:'hof', rematch:true }] };
  steps.hof = { t:o.hof, do:g => becomeRegionChampion(g, o.region), end:true };
  SC('league_' + o.region, { node:o.node, title:o.title, repeat:true, req:g => !F(g, 'champion_' + o.region), steps });
  SC('league_' + o.region + '_rematch', { node:o.node, title:o.title + ' again', repeat:true, req:g => F(g, 'champion_' + o.region), steps:Object.assign({}, steps, { hof:{ t:'Your name goes up on the wall of champions a second time.', do:g => { g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 3; becomeRegionChampion(g, o.region); }, end:true } }) });
}
LEAGUE({ region:'solenne', node:'s_league', title:'Challenge the Sunspire League',
  intro:'The Sunspire League’s doors are beaten gold. Behind them wait four elites and Solenne’s champion. There is no rest between them.',
  elites:[
    { id:'s_e1', name:'Elite Saffi', team:[['duneskorp',76],['miragefen',76],['duneclaw',77],['sandreaver',78]], apex:['sandreaver'], line:'“Sand gets everywhere. Especially into a losing team.”', outro:'“Fine. It’s in my teeth now.”', text:'SAFFI. A hall knee-deep in warm sand. Saffi lounges on a dune, sunglasses on. “Ready to get sand in your shoes?”' },
    { id:'s_e2', name:'Elite Ottavio', team:[['duneskorp',77],['mantiscythe',77],['hornbeetle',78],['voltbeetle',78],['antmarch',79]], line:'“My bugs have been waiting all morning.”', outro:'“They’ll want a rematch.”', text:'OTTAVIO. A glass hall humming with insect wings. Ottavio adjusts his monocle. “My bugs have been waiting all morning.”' },
    { id:'s_e3', name:'Elite Mireille', team:[['miragefen',77],['tidepearl',78],['glyphowl',78],['auroracle',79],['cerebrix',80]], apex:['cerebrix'], line:'“I’ve already seen how this goes.”', outro:'“I saw that too. I hoped I was wrong.”', text:'MIREILLE. Mirrors on every wall, and a dozen of you in each. Mireille does not turn around. “I have already seen how this goes.”' },
    { id:'s_e4', name:'Elite Basilio', team:[['tombwrap',78],['crestram',78],['crystallus',79],['cragwyrm',80],['bouldrock',80]], apex:['bouldrock'], line:'“Mountains do not move for anyone.”', outro:'“Well. This one did.”', text:'BASILIO. A hall of raw red stone. Basilio sits on a boulder, enormous and calm. “Mountains do not move for anyone.”' }
  ],
  champ:{ id:'s_champ', name:'Champion Seraphine', team:[['heliskink',80],['brinewader',80],['vinocerus',80],['duneskorp',81],['galecrest',81],['blazehound',83]], apex:['blazehound'], line:'“Solenne’s sun has been waiting for you.”', outro:'“The sun sets on me, for once.”', text:'The last door opens onto a terrace above the clouds. Champion Seraphine, all gold and white, rises from a sun-throne. “Halcyon’s champion. Solenne’s sun has been waiting for you.”' },
  hof:'Seraphine laughs, a warm sound, and takes your hand. “Solenne has a new champion.” Your partners’ names are written in gold leaf on the Sunspire wall.\n\nOutside, Corin is waiting with two airship tickets. “There’s a region up north. Nordhaven. They say the sky sings there. Coming?” The airship leaves from Aurelia.' });
LEAGUE({ region:'nordhaven', node:'n_league', title:'Challenge the Aurora League',
  intro:'The Aurora League is a hall of pale stone under a sky that never quite goes dark. Four elites and Nordhaven’s champion wait inside.',
  elites:[
    { id:'n_e1', name:'Elite Frida', team:[['fenrime',89],['tuskolith',89],['rimewing',89],['auroracle',90],['tidalrus',91]], apex:['tidalrus'], line:'“Southerners always feel the cold first.”', outro:'“You did not feel it at all.”', text:'FRIDA. A hall of blue ice and blowing snow. Frida smiles without warmth. “Southerners always feel the cold first.”' },
    { id:'n_e2', name:'Elite Arne', team:[['barrowight',89],['zenfist',90],['titanus',90],['brawlape',91]], apex:['brawlape'], line:'“No runes. No tricks. Fists.”', outro:'“Good fists.”', text:'ARNE. A stone ring under the open sky. Arne cracks his knuckles one at a time. “No runes. No tricks. Fists.”' },
    { id:'n_e3', name:'Elite Liv', team:[['driftmare',90],['hollowcrow',90],['umbradrake',91],['gloomreaper',92]], apex:['gloomreaper'], line:'“The dead of the north have heard of you.”', outro:'“They will talk about you for a long time.”', text:'LIV. A barrow hall lit by green flames. Liv sits with a raven on each shoulder. “The dead of the north have heard of you.”' },
    { id:'n_e4', name:'Elite Gunnar', team:[['voltwyrm',91],['verdrake',92],['cinderdrake',92],['sandreaver',93]], apex:['sandreaver'], line:'“The dragons came north first. They will be here last.”', outro:'“...They bow to you. I have never seen that.”', text:'GUNNAR. A ledge on the open mountainside, dragons circling below. Gunnar does not raise his voice. “The dragons came north first. They will be here last.”' }
  ],
  champ:{ id:'n_champ', name:'Champion Astrid', team:[['runegolem',92],['fenrime',92],['voltwyrm',93],['aurorwyrm',94],['tyrantide',94]], apex:['tyrantide'], line:'“Three regions. Let’s see if it shows.”', outro:'“It shows.”', text:'The last door opens onto the sky itself: a platform of glass under the singing aurora. Champion Astrid stands at its edge in a cloak of white fur. “Three regions. Let’s see if it shows.”' },
  hof:'Astrid bows, deep and slow. Behind her the aurora brightens until the whole sky is singing. “Nordhaven has a new champion. So does the sky.”\n\nCorin throws an arm around your shoulders and doesn’t say anything for once. Then: “There are more regions out there, you know. Somewhere.”' });

/* ---------------- Rivals ---------------- */
RIVAL_TEAMS.rival_solenne = [['galecrest',78],['voltail',76],['tyrantide',77],['cerebrix',77],['rhynox',76],[2,80]];
RIVAL_TEAMS.rival_nordhaven = [['galecrest',95],['voltail',94],['tyrantide',95],['cerebrix',95],['rhynox',94],[2,98]];
T('rival_solenne','Corin',90,null,'“Let’s see whose bond is stronger.”','“...Okay. Yours. This time.”',{ rival:true, ai:'smart', heals:2, apex:['starter'] });
T('rival_nordhaven','Corin',110,null,'“Last one. Probably. Best one.”','“Best one.”',{ rival:true, ai:'smart', heals:3, apex:['starter'] });

/* ---------------- Villains ---------------- */
T('hand_grunts','Gilded Hand Smugglers',70,[['duneskorp',64],['tombwrap',64],['heliskink',65]],'“These relics are spoken for.”','“Crane won’t like this.”',{ ai:'smart' });
T('silas','Silas Crane',160,[['miragefen',70],['tombwrap',70],['duneskorp',71],['crestram',71],['gloomreaper',72],['sandreaver',74]],'“Everything old is for sale.”','“Not everything, apparently.”',{ ai:'smart', heals:2, apex:['sandreaver'] });
T('choir_singers','Pale Choir Singers',80,[['hollowcrow',84],['barrowight',84],['driftmare',85]],'“Do not interrupt the song.”','“The song goes on without us.”',{ ai:'smart' });
T('cantor','Cantor Ylva',180,[['fenrime',90],['runegolem',90],['driftmare',91],['auroracle',91],['gloomreaper',92],['tidalrus',94]],'“Sing with us, or be silent.”','“The sky does not need us to sing. I see that now.”',{ ai:'smart', heals:2, apex:['tidalrus'] });

/* ---------------- Region stories ---------------- */
SC('s_arrive',{ node:'s_port', title:'Port Calder', auto:true, steps:{
  start:{ t:'The ferry from Saltmere noses into Port Calder at sunset. The air smells of salt and hot stone, and red cliffs glow behind the town. Corin leans on the rail beside you, eating a fig. “New region, new league. Race you.”\n\nOn the dock, a woman in a dusty field coat waves a wide hat: Professor Odalys Reyne. “Halcyon’s champion! Linden wrote to me. Come, there is something you need.”', c:[{ l:'Follow the professor', go:'band' }] },
  band:{ t:g => `In a cluttered dig office, Professor Reyne opens a velvet box. Inside: a woven band set with a pale stone, and a second, warmer stone.\n\n“Solenne’s ruins taught us Apex Ascension. When a trainer and a fully grown partner trust each other completely, an Apex Stone lets that partner become everything it could be, for one battle. Once per battle. The band is yours. This stone answers ${SPECIES[STARTER_FINAL[g.starter] || 'solvixen'].n}.”\n\nShe frowns. “The Gilded Hand have been looting the old ruins for stones and selling them in the north. Be careful who you trust.”`,
    do:g => { giveKey(g, 'apexband'); giveKey(g, 'apexstone_' + (STARTER_FINAL[g.starter] || 'solvixen')); setF(g, 'solenne_arrived'); }, end:true }
}});
SC('s_hand1',{ node:'s_mesa', title:'The dig above Mesa Alta', req:g => !F(g, 'hand_known'), steps:{
  start:{ t:'At a dig site above Mesa Alta, three figures in gold-trimmed masks are crating up carved stone tablets while the archaeologists are tied up in their own tent.', c:[{ l:'Battle the smugglers', battle:'hand_grunts', go:'manifest' }, { l:'Free the archaeologists quietly first', chk:['stealth',16], go:'freed', fail:'seen' }] },
  seen:{ t:'A masked smuggler turns. “Champion. We were told you might be trouble.”', c:[{ l:'Battle the smugglers', battle:'hand_grunts', go:'manifest' }] },
  freed:{ t:'You cut the archaeologists loose. Outnumbered and suddenly surrounded by angry academics, the smugglers flee without their crates.', next:'manifest' },
  manifest:{ t:'Among the crates is a shipping manifest in gold ink: every crate bound for the Sunstone Ruins, and a buyer called Silas Crane.', do:g => setF(g, 'hand_known'), end:true }
}});
SC('s_hand2',{ node:'s_ruins', title:'Silas Crane', req:g => F(g, 'hand_known') && !F(g, 'hand_beaten'), steps:{
  start:{ t:'In the Sunstone Ruins’ throne room, a tall man in a gold-trimmed coat is directing workers around an enormous sealed sun-disc. Silas Crane, head of the Gilded Hand.\n\n“The champion of somewhere else,” he says pleasantly. “Everything old is for sale. Including whatever the kings sealed in here.”', c:[{ l:'Battle Silas Crane', battle:'silas', go:'after' }] },
  after:{ t:'Crane’s last partner falls. He tips his hat, a little stiffly. “Not everything, apparently.” His workers scatter.\n\nBehind him, the sun-disc has cracked down the middle. Heat pours out of it like a held breath.', do:g => setF(g, 'hand_beaten'), end:true }
}});
SC('s_legend',{ node:'s_ruins', title:'The cracked sun-disc', repeat:true, req:g => F(g, 'hand_beaten') && !F(g, 'legend_helioserp'), steps:{
  start:{ t:'The sun-disc splits apart. A serpent of living sunlight uncoils from the dark behind it, crowned in fire, and turns its gold eyes on you. Helioserp.', c:[{ l:'Face Helioserp', wild:['helioserp',80], go:'gone', fled:'flee' }, { l:'Leave it be for now', go:'flee' }] },
  flee:{ t:'Helioserp coils back into the dark behind the disc. The heat lingers.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule glows like a coal for an hour. Helioserp is yours.' : 'Helioserp bursts up through the ruined roof in a column of light. It will return to the dark of the ruins to rest.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_helioserp'); }, end:true }
}});
SC('s_rival',{ node:'s_steps', title:'Corin on the steps', auto:true, req:g => rb(g, 'solenne') >= 8, steps:{
  start:{ t:'On the first of the Skyreach Steps, Corin is waiting, an Apex Band on their wrist. “Professor Reyne gave me one too. Let’s see whose bond is stronger.”', c:[{ l:'Battle Corin', battle:'rival_solenne', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? '“Yours,” Corin admits. “This time.”' : '“Mine!” Corin crows, then helps you up.') + ' They start up the steps two at a time. “See you at the top!”', end:true }
}});
SC('n_arrive',{ node:'n_port', title:'Skerrport', auto:true, steps:{
  start:{ t:'The airship settles onto its mast above Skerrport in a swirl of snow. Every roof in the town has a carved dragon on its ridge. Corin is already down the gangplank, throwing snowballs at nothing.\n\nA ranger in a fur-lined coat meets you at the bottom: Ranger Sigrid. “Southerners. Champions, I hear. Good. Something is wrong in the north. A choir has been singing in Whisperwood, night after night, and the aurora is answering. They call themselves the Pale Choir. They want to wake something that should stay asleep.”', do:g => setF(g, 'nordhaven_arrived'), end:true }
}});
SC('n_choir1',{ node:'n_whisper', title:'The singing in the woods', req:g => !F(g, 'choir_known'), steps:{
  start:{ t:'Deep in Whisperwood, robed figures stand in a ring around a carved stone, singing a single held note. The air shivers with it. Above the trees, the aurora pulses in time.', c:[{ l:'Break up the ritual', battle:'choir_singers', go:'path' }, { l:'Join the song, and listen for what it’s calling', chk:['insight',18], go:'heard', fail:'noticed' }] },
  noticed:{ t:'The note falters. Every hooded face turns toward you.', c:[{ l:'Battle the singers', battle:'choir_singers', go:'path' }] },
  heard:{ t:'Under the singing you hear the words, and the words are a name. Aurorath. The singers drift away one by one as the note fades.', next:'path' },
  path:{ t:'Beside the stone, a map is scratched into the bark of a pine: a hidden path from Hollowfrost up to Aurora Peak, and a name. Cantor Ylva.', do:g => setF(g, 'choir_known'), end:true }
}});
SC('n_choir2',{ node:'n_peak', title:'Cantor Ylva', req:g => F(g, 'choir_known') && !F(g, 'choir_beaten'), steps:{
  start:{ t:'On Aurora Peak, under lights so low you could touch them, a woman in white robes sings alone at the edge of the cliff. Cantor Ylva. She stops when she sees you.\n\n“You hear it too,” she says. “The sky has been singing for ten thousand years, and nobody has sung back. Sing with us, or be silent.”', c:[{ l:'“It isn’t asking for an answer.”', chk:['persuasion',19], go:'doubt', fail:'fight' }, { l:'Battle Cantor Ylva', go:'fight' }] },
  doubt:{ t:'Ylva is quiet for a long moment. “Perhaps. Then let it decide.”', next:'fight', nl:'Face her' },
  fight:{ t:'Ylva raises a hand, and the aurora flares.', c:[{ l:'Battle Cantor Ylva', battle:'cantor', go:'after' }] },
  after:{ t:'Ylva sits down in the snow. “The sky does not need us to sing,” she says. “I see that now.”\n\nAbove you, the aurora gathers itself into a shape. Wings. A long neck. Eyes like cold stars.', do:g => setF(g, 'choir_beaten'), end:true }
}});
SC('n_legend',{ node:'n_peak', title:'The dragon of the aurora', repeat:true, req:g => F(g, 'choir_beaten') && !F(g, 'legend_aurorath'), steps:{
  start:{ t:'The aurora comes down. Aurorath lands on the peak in a rush of cold light, wings spread across half the sky, and looks at you with eyes like the stars behind it.', c:[{ l:'Face Aurorath', wild:['aurorath',95], go:'gone', fled:'flee' }, { l:'Leave it be for now', go:'flee' }] },
  flee:{ t:'Aurorath lifts back into the sky and becomes light again. It will come down when you return.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule fills with shifting green light. Aurorath is yours, and the sky over Nordhaven goes quiet for the first time in ten thousand years.' : 'Aurorath scatters into ribbons of light across the sky. It will gather itself again.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_aurorath'); }, end:true }
}});
SC('n_rival',{ node:'n_steps', title:'Corin in the snow', auto:true, req:g => rb(g, 'nordhaven') >= 8, steps:{
  start:{ t:'At the foot of the Aurora Steps, snow in their hair, Corin grins. “Last one. Probably. Let’s make it the best one.”', c:[{ l:'Battle Corin', battle:'rival_nordhaven', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? 'Corin laughs until they have to sit down in the snow. “Best one.”' : '“Best one,” Corin says, and pulls you to your feet.') + ' They look up at the steps. “Go on. I’ll be right behind you. Like always.”', end:true }
}});

MILESTONES.push(
  ['solenne_arrived','The player has travelled to Solenne, a sunny southern region; Professor Odalys Reyne gave them an Apex Band. The Gilded Hand smuggle relics there.'],
  ['hand_beaten','The player defeated Silas Crane of the Gilded Hand in the Sunstone Ruins.'],
  ['champion_solenne','The player is Champion of Solenne.'],
  ['nordhaven_arrived','The player has travelled to Nordhaven, a northern region of fjords and aurora, where the Pale Choir sings to wake a sleeping legend.'],
  ['choir_beaten','The player defeated Cantor Ylva of the Pale Choir on Aurora Peak.'],
  ['champion_nordhaven','The player is Champion of Nordhaven.']
);
for (const n of Object.values(NODES)) n.rg = n.rg || 'halcyon';
