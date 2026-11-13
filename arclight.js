'use strict';
/* Halcyon Road: Arclight, the fourth region. A city that never sleeps, reached by the Undersea
   Express from Skerrport once you are Nordhaven's champion. Another fresh start: your Nordhaven
   team waits at the daycare, and Professor Okoye lends you a city-born starter. */

REGIONS.arclight = { n:'Arclight', land:'M15,70 L70,25 L170,15 L280,20 L370,45 L392,120 L380,200 L385,245 L330,268 L250,262 L200,250 L150,268 L80,272 L30,255 L18,190 L28,130 Z', islands:[[300,284,18,8],[140,286,12,5]] };

/* ---------------- Starters ---------------- */
S('rinseling','Rinseling',['water'],[50,52,50,50],12,62,[16,'rinsecoon'],'quad',['mask','tail','whiskers'],'A raccoon kit that washes everything it finds in the nearest fountain, including things that did not need washing.');
S('rinsecoon','Rinsecoon',['water'],[68,72,66,64],14,142,[36,'floodbandit'],'quad',['mask','tail','whiskers','stripes'],'Raids food trucks at night and rinses its loot in the harbor before eating. It always leaves the truck spotless.');
S('floodbandit','Floodbandit',['water','fighting'],[92,106,86,86],18,240,null,'tall',['mask','tail','whiskers','stripes'],'The masked king of the storm drains. When it calls up a flood, it is always to wash something away.');
S('fizzlet','Fizzlet',['fire'],[44,56,42,64],12,62,[16,'flarequirrel'],'quad',['ears','tail','flame'],'A squirrel whose tail fizzes like a sparkler when it is excited. Park benches all over Arclight have little scorch marks.');
S('flarequirrel','Flarequirrel',['fire'],[60,78,56,82],14,142,[36,'pyrotechnix'],'quad',['ears','tail','flame','crest'],'Leaps between streetlights trailing sparks. On festival nights it races the fireworks home.');
S('pyrotechnix','Pyrotechnix',['fire','electric'],[78,108,72,106],18,240,null,'quad',['ears','tail','flame','crest','bolt'],'Bursts into a shower of colored fire when it leaps. Arclight’s New Year fireworks are mostly Pyrotechnix showing off.');
S('curbling','Curbling',['grass'],[52,50,58,42],12,62,[16,'mossgarg'],'round',['leaf','rocks'],'A seed that sprouted in a sidewalk crack and kept a piece of the sidewalk as a helmet.');
S('mossgarg','Mossgarg',['grass'],[70,68,84,52],14,142,[36,'ivygoyle'],'tall',['leaf','rocks','horns'],'Perches on old buildings dressed in moss. Pigeons mistake it for a statue until it sneezes.');
S('ivygoyle','Ivygoyle',['grass','rock'],[96,100,106,60],18,240,null,'tall',['leaf','rocks','horns','wings'],'The ivy-covered guardian of Old Town’s rooftops. It has watched over the city since before the city had a name.');

/* ---------------- Arclight creatures ---------------- */
S('coolet','Coolet',['normal','flying'],[40,44,38,60],7,45,[20,'plazadove'],'bird',['crest'],'Struts around Grand Central like it owns the place. It has never once paid for a ticket.');
S('plazadove','Plazadove',['normal','flying'],[72,84,66,96],13,170,null,'bird',['crest','plume','wings'],'Leads flocks of hundreds over the city squares at dawn. Tourists feed it, and it lets them.');
S('scurrat','Scurrat',['normal','poison'],[42,54,40,66],8,50,[24,'sewerking'],'quad',['ears','tail','teeth'],'Scurries along the subway rails and knows every train schedule by heart.');
S('sewerking','Sewerking',['poison','normal'],[84,96,74,90],14,180,null,'quad',['ears','tail','teeth','crest'],'Rules a kingdom of tunnels under the city. It wears a bottle cap as a crown and dares anyone to laugh.');
S('cablegrub','Cablegrub',['bug','electric'],[46,48,56,40],8,50,[22,'neonmoth'],'insect',['antennae','bolt'],'Chews through power cables and comes out glowing. Electricians are not fond of it.');
S('neonmoth','Neonmoth',['bug','electric'],[70,90,64,104],13,170,null,'insect',['antennae','wings','bolt'],'Flutters around the signs on Neon Row. Its wings glow in whatever color it last landed on.');
S('ducklet','Ducklet',['water'],[46,46,44,54],8,50,[22,'parkdrake'],'bird',['crest'],'Paddles around the Greenway Park pond in a neat little line with its siblings.');
S('parkdrake','Parkdrake',['water','flying'],[80,86,74,92],13,175,null,'bird',['crest','plume','spots'],'Guards the park pond with surprising violence. Joggers take the long way round.');
S('clipling','Clipling',['grass'],[46,50,52,48],9,55,[26,'topiarion'],'quad',['leaf','ears'],'A hedge that trimmed itself into the shape of a cat and refuses to be trimmed into anything else.');
S('topiarion','Topiarion',['grass','normal'],[92,98,90,80],14,190,null,'quad',['leaf','mane','tail'],'A hedge lion that guards the city’s gardens. Gardeners trim its mane every Sunday, very carefully.');
S('alleykit','Alleykit',['normal'],[44,56,40,70],8,50,[26,'rooftom'],'quad',['ears','tail','stripes'],'A scrappy stray that knows which restaurants leave scraps out back, and when.');
S('rooftom','Rooftom',['normal','fighting'],[80,102,70,104],14,185,null,'quad',['ears','tail','stripes','teeth'],'The boss of every rooftop in Old Town. It has lost an ear and none of its pride.');
S('smoglet','Smoglet',['poison'],[44,56,50,52],9,55,[28,'smogshade'],'ghost',['spots'],'A puff of exhaust that drifted out of a tailpipe and decided to stay together.');
S('smogshade','Smogshade',['poison','ghost'],[82,100,80,94],15,200,null,'ghost',['spots','mask','eyes3'],'Haunts the Ironworks on still nights. Where it drifts, the streetlights turn the color of rust.');
S('plugpup','Plugpup',['electric'],[48,54,44,66],9,55,[28,'amperrier'],'quad',['ears','tail','bolt'],'A puppy with a plug-shaped tail. It wags so hard it shorts out the lights.');
S('amperrier','Amperrier',['electric'],[84,104,74,110],15,200,null,'quad',['ears','tail','bolt','mane'],'Sprints along power lines to carry messages across the city. It is faster than the mail and much louder.');
S('sparrowatt','Sparrowatt',['electric','flying'],[70,88,62,108],13,175,null,'bird',['crest','bolt'],'Perches on power lines in rows of hundreds. When they all take off at once, the lights flicker.');
S('harborpup','Harborpup',['water'],[56,54,54,46],9,55,[28,'harborlion'],'round',['whiskers','fin'],'Sunbathes on the pier and barks at every ferry as if it has never seen one before.');
S('harborlion','Harborlion',['water','normal'],[104,100,90,72],15,205,null,'round',['whiskers','fin','mane'],'The harbor’s self-appointed lifeguard. It has hauled hundreds of swimmers out of the water and scolded every one.');
S('slickeel','Slickeel',['water','poison'],[76,94,70,92],13,180,null,'serpent',['fin','spots'],'Thrives in the oily water under the docks. Its slime leaves rainbows on the surface.');
S('raileel','Raileel',['electric','water'],[80,100,72,100],14,190,null,'serpent',['fin','bolt'],'Rides the subway’s third rail like a current. Maintenance crews hear it humming in the tunnels.');
S('farewisp','Farewisp',['ghost'],[42,54,46,62],10,58,[30,'lastrider'],'ghost',['eyesbig'],'Drifts through subway cars after midnight, looking for a stop that closed fifty years ago.');
S('lastrider','Lastrider',['ghost','normal'],[82,100,78,96],15,200,null,'tall',['mask','eyesbig','crest'],'Rides the last train every night and never gets off. Passengers who sit beside it miss their stop.');
S('mannequirk','Mannequirk',['ghost','psychic'],[78,96,82,90],15,200,null,'tall',['mask','eyes3'],'Stands in shop windows, always in a slightly different pose than it was a minute ago.');
S('bricklet','Bricklet',['rock'],[52,62,72,30],9,55,[30,'brickbrute'],'round',['rocks'],'A loose brick that fell off an old building and walked away rather than be put back.');
S('brickbrute','Brickbrute',['rock','fighting'],[98,116,112,44],15,210,null,'tall',['rocks','big','horns'],'Built itself out of every loose brick in Old Town. Builders hire it, and it insists on being paid in bricks.');
S('jackhamster','Jackhamster',['ground'],[70,92,74,78],13,175,null,'round',['ears','teeth','claws'],'Drills through pavement at dawn. The whole block wakes up, and the hamster does not care.');
S('hootlet','Hootlet',['psychic','flying'],[48,50,48,56],10,58,[32,'professowl'],'bird',['eyesbig','crest'],'Sits in on university lectures and hoots at the wrong answers.');
S('professowl','Professowl',['psychic','flying'],[90,104,84,96],16,220,null,'bird',['eyesbig','crest','plume','eyes3'],'Has tenure at Arclight University. Nobody remembers hiring it, and nobody dares to fire it.');
S('slagling','Slagling',['fire','rock'],[58,62,66,38],10,60,[34,'slagtitan'],'blob',['topflame','rocks'],'A blob of molten slag from the foundry floor. It cools off in puddles and steams for hours.');
S('slagtitan','Slagtitan',['fire','rock'],[108,118,110,52],16,225,null,'tall',['topflame','rocks','big'],'A walking furnace that keeps the Ironworks running all night. Its footprints are still warm in the morning.');
S('grillhound','Grillhound',['fire','normal'],[84,102,72,98],14,195,null,'quad',['ears','tail','flame'],'Guards the food trucks of Neon Row and gets paid in sausages.');
S('wokling','Wokling',['fire','fighting'],[78,104,82,84],14,195,null,'round',['topflame','claws'],'Tosses noodles with such skill that the night markets let it cook for free.');
S('parkouri','Parkouri',['fighting','normal'],[74,98,66,118],14,195,null,'quad',['tail','ears','stripes'],'A lemur that runs the rooftops of Arclight without ever touching the street.');
S('drakit','Drakit',['dragon'],[44,62,48,58],15,80,[30,'spiredrake'],'quad',['horns','tail'],'Hatches on the ledges of the tallest towers and spends its first year falling off them.');
S('spiredrake','Spiredrake',['dragon'],[68,90,74,82],17,170,[50,'crowndrake'],'serpent',['horns','tail','wings'],'Coils around skyscraper spires at night and watches the city lights like a hoard.');
S('crowndrake','Crowndrake',['dragon','flying'],[94,126,94,104],19,260,null,'serpent',['horns','tail','wings','crest'],'Lands on the tallest tower in Arclight and claims the whole skyline as its own. The city has never argued.');
S('subwyrm','Subwyrm',['dragon','ground'],[96,112,96,82],18,240,null,'serpent',['horns','claws'],'Tunnels beside the subway lines. Engineers suspect it dug half of them before the city did.');
S('rinkseal','Rinkseal',['ice','water'],[82,84,80,82],13,180,null,'round',['whiskers','fin','spots'],'Glides around the park’s skating rink all winter and steals hats.');
S('tagleon','Tagleon',['normal','poison'],[76,92,72,100],13,180,null,'quad',['tail','stripes','spots','eyesbig'],'A chameleon that changes color to match whatever wall it just spray-painted.');
S('roachling','Roachling',['bug','poison'],[46,54,58,64],9,55,[28,'armoroach'],'insect',['antennae'],'Survives everything. Nobody has ever seen one die of anything.');
S('armoroach','Armoroach',['bug','rock'],[86,98,118,76],15,205,null,'insect',['antennae','shell','spikes'],'Its shell can take a falling piano. Someone has checked.');
S('snatchgull','Snatchgull',['water','flying'],[72,86,62,108],13,175,null,'bird',['crest','spots'],'Steals the fries out of your hand in a single dive and is back on its lamppost before you notice.');
S('crackweed','Crackweed',['grass','poison'],[72,86,74,84],12,170,null,'bulb',['leaf','spikes'],'Grows through every crack in every sidewalk in Arclight. The city gave up on it years ago.');
S('potholem','Potholem',['ground','rock'],[98,98,112,40],14,195,null,'round',['rocks','teeth'],'Lies in the road looking exactly like a pothole. Cyclists have a word for it, and it is not polite.');
S('glitchling','Glitchling',['electric','psychic'],[46,60,46,70],10,60,[32,'glitchgeist'],'ghost',['bolt','eyes3'],'Lives in old screens. When a picture flickers for no reason, it is usually saying hello.');
S('glitchgeist','Glitchgeist',['electric','ghost'],[82,108,76,110],16,220,null,'ghost',['bolt','eyes3','crest'],'Jumps from screen to screen across the city. Every billboard on Neon Row has hosted it at least once.');
S('pupparazzi','Pupparazzi',['normal','electric'],[68,82,62,104],12,170,null,'quad',['ears','tail','eyesbig','bolt'],'Follows celebrities around Neon Row and flashes its eyes at them like a camera.');
S('bouncerilla','Bouncerilla',['fighting'],[112,118,96,60],15,210,null,'tall',['big','mane'],'Works the door at every club in Crown Heights. If it says you are not on the list, you are not on the list.');
S('fumebat','Fumebat',['poison','flying'],[72,90,64,110],13,180,null,'bird',['ears','wings','teeth'],'Roosts in factory chimneys and comes out at dusk in clouds of soot.');
S('arcwyrm','Arcwyrm',['electric','dragon'],[114,132,104,112],27,350,null,'serpent',['horns','bolt','crest','wings','aura'],'The dragon asleep in Arclight’s power grid. The old stories say the city’s first lights were its dreams.',{legend:true, ex:{1:'recover'}});

/* ---------------- Apex Ascension ---------------- */
const APEX_ARCLIGHT = {
  floodbandit:{t:['water','fighting'], f:['horns']}, pyrotechnix:{t:['fire','electric'], f:['spikes']}, ivygoyle:{t:['grass','rock'], f:['petals']},
  harborlion:{t:['water','fighting'], f:['crest']}, amperrier:{t:['electric','fighting'], f:['horns']}, slagtitan:{t:['fire','rock'], f:['crest']},
  professowl:{t:['psychic','flying'], f:['horns']}, crowndrake:{t:['dragon','flying'], f:['spikes']}
};
for (const [id, a] of Object.entries(APEX_ARCLIGHT)) {
  APEX[id] = a;
  const s = SPECIES[id];
  S('apex_' + id, 'Apex ' + s.n, a.t, [s.b[0], s.b[1] + 24, s.b[2] + 18, s.b[3] + 12], 99, s.xp, null, s.sh, [...new Set([...s.f, ...a.f, 'aura'])],
    `${s.n} at the height of its bond with its trainer. The form lasts until the battle ends.`, { nocodex:true, apexOf:id });
  KEYS['apexstone_' + id] = [`Apex Stone (${s.n})`, `Lets ${s.n} ascend once per battle while you wear the Apex Band.`];
}
REGION_STARTERS.arclight = ['rinseling','fizzlet','curbling'];
Object.assign(REGION_FINAL, { rinseling:'floodbandit', fizzlet:'pyrotechnix', curbling:'ivygoyle' });
REGION_RIVAL.arclight = { rinseling:['curbling','mossgarg','ivygoyle'], fizzlet:['rinseling','rinsecoon','floodbandit'], curbling:['fizzlet','flarequirrel','pyrotechnix'] };

/* ---------------- Map ---------------- */
const AN = (id, o) => N(id, Object.assign({ rg:'arclight', tier:3 }, o));
AN('a_station',{n:'Grand Central', k:'town', x:55, y:240, tier:1, haven:'haven', shop:true, adj:['n_port','a_park'],
  req:g=>F(g,'champion_nordhaven'), lock:'The Undersea Express to Arclight only runs for Nordhaven’s champion.',
  d:'A train station so big it has its own weather, under a glass roof with towers climbing out of sight above it. The Undersea Express from Nordhaven pulls in here.',
  encLabel:'Search the platforms', enc:[['coolet',3,6,16],['scurrat',3,6,16],['roachling',3,6,12],['alleykit',4,6,8],['harborpup',4,6,6]], rare:['pupparazzi',8,8]});
AN('a_park',{n:'Greenway Park', k:'route', x:110, y:205, tier:1, adj:['a_station','a_oldtown'],
  d:'A long green park threaded between the towers, with a duck pond, a skating rink, and joggers who never stop.',
  enc:[['coolet',3,6,12],['ducklet',3,6,14],['clipling',3,6,12],['cablegrub',3,6,12],['alleykit',4,7,10],['scurrat',3,6,8],['crackweed',6,7,4],['hootlet',5,7,6]], rare:['sparrowatt',10,10]});
AN('a_oldtown',{n:'Old Town', k:'town', x:180, y:228, tier:1, haven:'haven', shop:true, adj:['a_park','a_harbor','a_underline'],
  d:'The oldest part of the city: brick streets, iron fire escapes, a corner diner that never closes, and gargoyles on every roof.',
  encLabel:'Wander the brick alleys', enc:[['alleykit',6,10,14],['scurrat',6,10,12],['bricklet',6,10,14],['coolet',6,10,10],['smoglet',7,10,8],['tagleon',9,11,4]], rare:['rooftom',14,14]});
AN('a_harbor',{n:'Harbor District', k:'town', x:270, y:245, tier:2, haven:'haven', shop:true, adj:['a_oldtown','a_powerworks'],
  d:'Piers, fish markets, container cranes and the city aquarium, all crowded along the water.',
  encLabel:'Fish off the pier', enc:[['harborpup',10,14,14],['ducklet',10,14,10],['slickeel',11,14,8],['snatchgull',11,14,8],['rinkseal',12,15,4],['smoglet',10,14,6]], rare:['harborlion',20,20]});
AN('a_underline',{n:'The Underline', k:'cave', x:220, y:170, tier:2, adj:['a_oldtown','a_neon'],
  d:'The subway, and the older tunnels under the subway, and the even older ones under those. Trains rumble past every few minutes.',
  enc:[['scurrat',12,16,12],['roachling',12,16,12],['farewisp',12,16,12],['raileel',14,17,6],['jackhamster',13,16,8],['glitchling',12,16,10],['smoglet',12,16,8],['potholem',14,17,5],['subwyrm',16,17,2]], rare:['lastrider',22,22]});
AN('a_neon',{n:'Neon Row', k:'town', x:300, y:165, tier:3, haven:'haven', shop:true, adj:['a_underline','a_campus','a_powerworks'],
  d:'A street of arcades, food trucks and theaters under a ceiling of signs, and the brightest place in the city, until the blackouts started.',
  encLabel:'Prowl the arcades', enc:[['plugpup',18,22,14],['cablegrub',18,22,10],['glitchling',18,22,10],['pupparazzi',19,23,6],['sparrowatt',19,23,6],['tagleon',18,22,8],['grillhound',20,23,4]], rare:['amperrier',28,28]});
AN('a_powerworks',{n:'Powerworks', k:'cave', x:355, y:215, tier:4, adj:['a_neon','a_harbor'], lp:[-9, 3.2, 'end'],
  req:g=>F(g,'blackout_known'), lock:'The old power station is locked tight. You would need a keycard.',
  d:'The city’s first power station, all brick chimneys and humming turbines, still feeding half of Arclight. The air tastes like a battery.',
  enc:[['amperrier',30,34,8],['glitchgeist',30,34,6],['raileel',30,34,8],['neonmoth',30,34,10],['smogshade',30,34,8],['armoroach',30,34,8],['sparrowatt',30,34,8],['plugpup',28,32,8]], rare:['glitchgeist',40,40]});
AN('a_campus',{n:'Arclight University', k:'town', x:345, y:95, tier:4, haven:'haven', shop:true, adj:['a_neon','a_ironworks'], lp:[-9, 3.2, 'end'],
  d:'Ivy-covered halls around a green quad, where half the students are studying creatures and the other half are studying how to avoid them.',
  encLabel:'Wander the quad', enc:[['hootlet',26,30,14],['glitchling',26,30,10],['clipling',26,30,10],['mannequirk',28,32,4],['plazadove',28,32,6],['topiarion',28,32,4],['drakit',27,30,3]], rare:['professowl',38,38]});
AN('a_ironworks',{n:'Ironworks', k:'route', x:260, y:62, tier:4, haven:'haven', shop:true, adj:['a_campus','a_rooftops'],
  d:'Foundries, rail yards and chimneys that never stop smoking. The whole district glows orange at night.',
  enc:[['slagling',30,34,12],['bricklet',30,34,10],['brickbrute',32,36,4],['roachling',30,34,8],['armoroach',32,36,4],['smoglet',30,34,8],['fumebat',31,35,8],['grillhound',31,35,6],['wokling',31,35,6],['jackhamster',30,34,6],['potholem',31,35,5]], rare:['slagtitan',40,40]});
AN('a_rooftops',{n:'Skyline Rooftops', k:'route', x:180, y:90, tier:5, adj:['a_ironworks','a_heights'],
  d:'A second city forty stories up, of rooftop gardens, water towers and planks laid between buildings.',
  enc:[['plazadove',36,40,10],['snatchgull',36,40,8],['fumebat',36,40,8],['sparrowatt',36,40,8],['parkouri',36,40,8],['rooftom',36,40,8],['drakit',36,38,6],['spiredrake',38,40,3],['neonmoth',36,40,6]], rare:['crowndrake',46,46]});
AN('a_heights',{n:'Crown Heights', k:'town', x:110, y:125, tier:5, haven:'haven', shop:true, adj:['a_rooftops','a_spire'],
  d:'The richest district in Arclight, all glass towers, doormen and penthouse gardens. Dragons nest on the highest balconies.',
  encLabel:'Explore the penthouse gardens', enc:[['topiarion',38,42,8],['bouncerilla',38,42,6],['plazadove',38,42,8],['drakit',38,40,6],['professowl',40,42,3],['mannequirk',38,42,6],['pupparazzi',38,42,6]], rare:['subwyrm',46,46]});
AN('a_spire',{n:'The Spire', k:'cave', x:55, y:165, tier:5, haven:'lodge', shop:true, adj:['a_heights','a_league'],
  req:g=>rb(g,'arclight') >= 8, lock:'The Spire opens for trainers with all eight Arclight badges.',
  d:'A glass stairway spiralling up the outside of the tallest tower in the city. A coffee bar halfway up serves trainers who stop for breath.',
  enc:[['brickbrute',42,46,5],['bouncerilla',42,46,5],['slagtitan',42,46,4],['harborlion',42,46,5],['amperrier',42,46,5],['professowl',42,46,4],['glitchgeist',42,46,4],['sewerking',42,46,5],['smogshade',42,46,5],['armoroach',42,46,5],['spiredrake',42,46,4],['subwyrm',42,46,4],['potholem',42,46,4],['lastrider',42,46,4]], rare:['crowndrake',48,48]});
AN('a_league',{n:'Arclight Stadium', k:'league', x:55, y:70, tier:5, adj:['a_spire'],
  req:g=>rb(g,'arclight') >= 8, lock:'Arclight Stadium admits only trainers with all eight Arclight badges.',
  d:'A stadium on the roof of the tallest tower in the city, open to the sky, with a hundred thousand seats and floodlights you can see from Nordhaven.'});
NODES.n_port.adj.push('a_station');

/* ---------------- Gyms ---------------- */
GYM({ region:'arclight', node:'a_oldtown', badge:'corner', badgeName:'Corner Badge', type:'normal', title:'Old Town Diner Gym', name:'Leader Marisol', leader:'marisol', reward:'starter',
  team:[['coolet',12],['alleykit',13],['scurrat',14]],
  text:'Old Town’s gym is a corner diner that never closes, with the booths pushed back to make an arena. The jukebox is playing, and the regulars are already placing bets.',
  pl:'Order the secret off-menu special to be shown through', chk:['persuasion',12], failText:'The waitress raises an eyebrow. “Nice try, hon.” A short-order cook vaults the counter.',
  tname:'Cook Benny', tteam:['coolet','scurrat'],
  intro:'Leader Marisol slides a plate of pancakes across the counter to you, then cracks her knuckles. “Champion of three regions, huh? In Arclight, everybody starts at the corner diner. Eat up. Then we fight.”',
  outro:'“Order up!”', win:'“Order up!” Marisol laughs, and pins the Corner Badge to your jacket: a tiny enamel coffee cup.' });
GYM({ region:'arclight', node:'a_harbor', badge:'aquarium', badgeName:'Aquarium Badge', type:'water', title:'Harbor Aquarium Gym', name:'Leader Dex', leader:'dex', reward:'harborlion',
  team:[['ducklet',17],['harborpup',18],['slickeel',19],['rinkseal',20]],
  text:'Harbor District’s gym is the city aquarium after closing time: glass tunnels through the tanks, with sharks gliding overhead.',
  pl:'Find your way through the tunnels by following the schools of fish', chk:['nature',13], failText:'You walk past the same jellyfish tank three times. A diver in a wetsuit knocks on the glass.',
  tname:'Diver Marina', tteam:['harborpup','ducklet'],
  intro:'Leader Dex is feeding the sea lions from a bucket. “Most people come here to look at the water. Let me show you what it can do.”',
  outro:'“You make waves.”', win:'“You make waves,” Dex says, and hands over the Aquarium Badge: a glass bead with a tiny fish inside.' });
GYM({ region:'arclight', node:'a_neon', badge:'neon', badgeName:'Neon Badge', type:'electric', title:'Neon Row Arcade Gym', name:'Leader Vivi', leader:'vivi', reward:'amperrier',
  team:[['cablegrub',21],['plugpup',22],['sparrowatt',23],['raileel',25]],
  text:'Neon Row’s first gym is an arcade three floors tall, every cabinet blinking and chiming at once.',
  pl:'Beat the high score on the rhythm game that guards the door', chk:['dex',14], failText:'GAME OVER flashes across the door. A gamer in headphones spins around in her chair. “My turn.”',
  tname:'Gamer Pixel', tteam:['cablegrub','plugpup'],
  intro:'Leader Vivi is streaming to forty thousand people and doesn’t look up from her screen. “Chat says you’re a three-region champion. Chat also says you’re going to lose. Let’s find out who’s right.”',
  outro:'“GG.”', win:'“GG,” Vivi says, and means it. Her chat goes wild. The Neon Badge is a little lightning bolt that glows in the dark.' });
GYM({ region:'arclight', node:'a_neon', badge:'curtain', badgeName:'Curtain Badge', type:'ghost', title:'The Midnight Theater Gym', name:'Leader Lucien', leader:'lucien', reward:null,
  team:[['farewisp',26],['smogshade',28],['mannequirk',28],['lastrider',30]],
  text:'Across the street, Neon Row’s second gym is the Midnight Theater, a crumbling old playhouse where the show starts at midnight and nobody sells tickets.',
  pl:'Find your seat in the dark without stepping on anything that moves', chk:['perception',14], failText:'Something in the dark is already sitting in your seat. An usher with a flashlight shows you out, then turns around.',
  tname:'Usher Florence', tteam:['farewisp','smoglet'],
  intro:'The curtain rises on Leader Lucien, in a top hat, sawing a Mannequirk in half. It waves at you with both halves. “Welcome to the show. Tonight’s trick: making a champion disappear.”',
  outro:'“And for my next trick...”', win:'The audience, every one of them a ghost, applauds politely. “Bravo,” Lucien says, and produces the Curtain Badge from behind your ear: a scrap of red velvet on a pin.' });
GYM({ region:'arclight', node:'a_campus', badge:'thesis', badgeName:'Thesis Badge', type:'psychic', title:'University Lecture Hall Gym', name:'Leader Anaya', leader:'anaya', reward:'starter',
  team:[['hootlet',32],['glitchling',33],['mannequirk',34],['professowl',36]],
  text:'Arclight University’s gym is the old lecture hall, its seats rising in rings around a stage and a blackboard covered in equations nobody has erased in years.',
  pl:'Solve the equation on the blackboard to open the stage door', chk:['investigation',15], failText:'Your answer is wrong in a way the blackboard finds hilarious. A grad student sighs and puts down her coffee.',
  tname:'Grad Student Priya', tteam:['hootlet','glitchling'],
  intro:'Leader Anaya, in a lab coat with a Professowl on her shoulder, taps the blackboard. “My hypothesis: experience across three regions makes a trainer predictable. Let’s test it.”',
  outro:'“Hypothesis rejected.”', win:'“Hypothesis rejected,” Anaya says happily, and makes a note. The Thesis Badge is a tiny brass owl.' });
GYM({ region:'arclight', node:'a_ironworks', badge:'foundry', badgeName:'Foundry Badge', type:'fire', title:'Ironworks Foundry Gym', name:'Leader Magda', leader:'magda', reward:'slagtitan', apex:['slagtitan'],
  team:[['slagling',37],['grillhound',38],['wokling',39],['slagtitan',41]],
  text:'The Ironworks gym is a working foundry. Molten metal pours from crucibles overhead, and the arena floor is a grate over a river of slag.',
  pl:'Cross the catwalks while the crucibles tip', chk:['athletics',15], failText:'A crucible tips early and you jump back. A foundry worker in a heat suit waves you over. “The long way round goes through me.”',
  tname:'Smelter Gus', tteam:['slagling','grillhound'],
  intro:'Leader Magda lifts her welding mask. “This city was built out of what we pour here. Let’s see what you’re made of.”',
  outro:'“Good metal.”', win:'“Good metal,” Magda says, and presses the Foundry Badge into your palm, still warm from the mold.' });
GYM({ region:'arclight', node:'a_rooftops', badge:'skyline', badgeName:'Skyline Badge', type:'flying', title:'Skyline Rooftop Gym', name:'Leader Rio', leader:'rio', reward:'professowl', apex:['professowl'],
  team:[['plazadove',41],['snatchgull',42],['fumebat',43],['parkdrake',43],['professowl',45]],
  text:'The Skyline gym has no building. It is the rooftops themselves: forty stories up, joined by planks, ziplines and a great deal of nerve.',
  pl:'Take the zipline across the gap', chk:['acrobatics',16], failText:'You freeze at the edge. A courier on a skateboard rolls up beside you. “First time? Battle me and I’ll show you the stairs.”',
  tname:'Courier Jet', tteam:['plazadove','snatchgull'],
  intro:'Leader Rio lands beside you from the next roof over, without a rope. “Everybody looks up at this city. I like looking down. Let’s fly.”',
  outro:'“Nice landing.”', win:'“Nice landing,” Rio grins. The Skyline Badge is a tiny silver wing shaped like the city skyline.' });
GYM({ region:'arclight', node:'a_heights', badge:'penthouse', badgeName:'Penthouse Badge', type:'dragon', title:'Crown Heights Penthouse Gym', name:'Leader Valentina', leader:'valentina', reward:'crowndrake', apex:['crowndrake'],
  team:[['spiredrake',46],['subwyrm',47],['spiredrake',47],['crowndrake',49]],
  text:'The last gym in Arclight is the penthouse of the tallest tower in Crown Heights. The elevator only goes up if the building decides it likes you.',
  pl:'Talk your way past the front desk', chk:['persuasion',16], failText:'The receptionist smiles and calls security. Security is a dragon tamer in a very nice suit.',
  tname:'Dragon Tamer Sterling', tteam:['spiredrake','subwyrm'],
  intro:'Leader Valentina Crowne turns from the window, where a Crowndrake is curled around the balcony rail. “I own half this skyline. The dragons own the other half. Let’s see if you can claim a little of it.”',
  outro:'“Sold.”', win:'“Sold,” Valentina says, and hands you the Penthouse Badge, a gold key on a chain. “Arclight Stadium waits at the top of the Spire.”' });

/* ---------------- League ---------------- */
LEAGUE({ region:'arclight', node:'a_league', title:'Challenge the Arclight League', heals:2,
  intro:'Arclight Stadium seats a hundred thousand people, and tonight every seat is full. Four elites and the city’s champion wait under the floodlights, with no rest between them.',
  elites:[
    { id:'a_e1', name:'Elite Juno', team:[['neonmoth',56],['glitchgeist',56],['raileel',57],['pupparazzi',57],['amperrier',59]], apex:['amperrier'], line:'“The whole city’s watching. Try to look good.”', outro:'“You looked good.”', text:'JUNO. A stage of light panels, every one flashing. Juno twirls a microphone. “The whole city’s watching. Try to look good.”' },
    { id:'a_e2', name:'Elite Tank', team:[['brickbrute',57],['bouncerilla',57],['rooftom',58],['parkouri',58],['potholem',60]], line:'“No tricks. Just the street.”', outro:'“Respect.”', text:'TANK. A boxing ring under a single bare bulb. Tank wraps his hands slowly. “No tricks. Just the street.”' },
    { id:'a_e3', name:'Elite Vesper', team:[['smogshade',58],['lastrider',58],['mannequirk',59],['sewerking',59],['fumebat',60]], line:'“The city has a night side. Welcome to it.”', outro:'“Dawn comes early tonight.”', text:'VESPER. A dark platform where the last train never leaves. Vesper sits on a bench under a flickering light. “The city has a night side. Welcome to it.”' },
    { id:'a_e4', name:'Elite Augustin', team:[['subwyrm',59],['spiredrake',59],['plazadove',60],['crowndrake',62]], apex:['crowndrake'], line:'“The skyline belongs to the dragons.”', outro:'“...And now, it seems, to you.”', text:'AUGUSTIN. A helipad on the stadium roof, with dragons circling the floodlights. Augustin doesn’t turn around. “The skyline belongs to the dragons.”' }
  ],
  champ:{ id:'a_champ', name:'Champion Lucinda Bright', team:[['harborlion',61],['slagtitan',61],['topiarion',62],['professowl',62],['glitchgeist',63],['crowndrake',65]], apex:['crowndrake'], line:'“Arclight never sleeps, and neither do I.”', outro:'“The city has a new favorite.”', text:'The last door opens onto the middle of the stadium floor, under a hundred thousand cheering people. Champion Lucinda Bright, who is also the mayor, waves to the crowd and then to you. “Arclight never sleeps, and neither do I. Let’s give them a show.”' },
  hof:'The stadium explodes. Lucinda Bright raises your hand to the crowd like a boxing referee. “Arclight has a new champion!” Your partners’ names scroll across every screen on Neon Row.\n\nLater, Corin finds you in the tunnel under the stands and hands you a soda. “Four regions. Four fresh starts.” They clink their can against yours, then pull a gold envelope out of their jacket. “Oh, and this came for you. Well, for both of us.”\n\nIt is an invitation to the World Tournament on Zenith Isle, where the champions of every region meet, and where any partner you have ever caught may fight. “The Champions’ Liner sails from the Harbor District,” Corin says. “See you in the final.”' });

/* ---------------- Rival ---------------- */
RIVAL_TEAMS.rival_a0 = [[0,5]];
RIVAL_TEAMS.rival_a1 = [['plazadove',30],['plugpup',29],['bricklet',29],['hootlet',30],[1,33]];
RIVAL_TEAMS.rival_arclight = [['sparrowatt',55],['professowl',55],['brickbrute',56],['harborlion',55],['spiredrake',55],[2,59]];
T('rival_a0','Corin',30,null,'“Same deal as always. Type edge.”','“How do you keep doing that?”',{ rival:true, rline:'arclight' });
T('rival_a1','Corin',50,null,'“Four badges each. Let’s see who’s ahead in the big city.”','“Okay. You. Still.”',{ rival:true, rline:'arclight', heals:1 });
T('rival_arclight','Corin',70,null,'“Four regions. One more battle.”','“Okay. Okay. You win. Again.”',{ rival:true, rline:'arclight', ai:'smart', heals:2, apex:['starter'] });

/* ---------------- Villains ---------------- */
T('blackout_grunts','Blackout Hackers',40,[['glitchling',22],['smoglet',22],['plugpup',23]],'“Nothing personal. We’re just turning the city off.”','“Null is not going to like this.”');
T('null','Null',120,[['glitchgeist',36],['smogshade',36],['raileel',37],['lastrider',37],['amperrier',38]],'“A city that never sleeps can’t dream. I’m going to let it dream.”','“...Fine. Then you wake it.”',{ ai:'smart', heals:2, apex:['amperrier'] });

/* ---------------- Story ---------------- */
SC('a_arrive',{ node:'a_station', title:'A fresh start in Arclight', auto:true, steps:{
  start:{ t:'The Undersea Express slides out of its tunnel under the sea and into Grand Central, a station so big it has its own weather. Above the glass roof, towers climb out of sight, and every one of them is lit.\n\nCorin presses their face to the window. “Okay. This is the biggest place I have ever seen.” They grin at you. “Left my team with Sigrid. Fresh start number four?”\n\nOn the platform, a woman in a bright orange raincoat is holding up a sign with your name spelled wrong: Professor Dana Okoye. “Champion of three regions! I study how creatures adapt to cities, and you, frankly, are a fascinating data point.”', c:[{ l:'Follow the professor into the concourse', go:'lab' }] },
  lab:{ t:'Her lab is a converted newsstand in the middle of the concourse. Three capsules sit beside the cash register. “Arclight’s starters,” Okoye says. “Rinseling, from the storm drains. Fizzlet, from the parks. Curbling, from the sidewalks. Every one of them grew up dodging traffic.”',
    c:[{ l:'Choose Rinseling, the storm-drain raccoon (Water)', go:'rival', do:g => pickRegionStarter(g, 'arclight', 'rinseling') },
       { l:'Choose Fizzlet, the sparkler squirrel (Fire)', go:'rival', do:g => pickRegionStarter(g, 'arclight', 'fizzlet') },
       { l:'Choose Curbling, the sidewalk sprout (Grass)', go:'rival', do:g => pickRegionStarter(g, 'arclight', 'curbling') }] },
  rival:{ t:g => `Corin snatches the capsule that beats yours, ${SPECIES[REGION_RIVAL.arclight[g.starters.arclight][0]].n}, before Okoye can finish her sentence. “Same deal as always. Type edge.”`, c:[{ l:'Battle Corin', battle:'rival_a0', soft:true, go:'warn' }] },
  warn:{ t:g => (g.lastBattle === 'win' ? '“How do you keep doing that?” Corin groans.' : 'Corin does a victory lap around the newsstand.') + `\n\nProfessor Okoye hands you an Apex Stone in a plastic evidence bag. “For ${SPECIES[REGION_FINAL[g.starters.arclight]].n}, eventually.” Then the lights in the concourse flicker, die, and come back. Nobody else even looks up. “Rolling blackouts,” Okoye says. “Every night this month. The power company blames a hacker crew that calls itself Blackout. If you run into them, don’t be a hero. Well. Be a little bit of a hero.”`,
    do:g => { giveKey(g, 'apexstone_' + REGION_FINAL[g.starters.arclight]); give(g, 'capsule', 5); setF(g, 'arclight_arrived'); }, end:true }
}});
SC('a_rival1',{ node:'a_campus', title:'Corin on campus', auto:true, req:g => rb(g, 'arclight') >= 4, steps:{
  start:{ t:'On the university quad, Corin is sitting on the library steps behind a stack of books they are clearly not reading. “Four badges each. Let’s see who’s ahead in the big city.”', c:[{ l:'Battle Corin', battle:'rival_a1', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? '“Okay. You. Still,” Corin sighs.' : '“Me! Finally! Somebody write it down!”') + ' They nod at the skyline, where a whole district has just gone dark. “Third blackout today. Somebody should do something.” They look at you meaningfully.', end:true }
}});
SC('a_bo1',{ node:'a_neon', title:'Lights out on Neon Row', req:g => !F(g, 'blackout_known'), steps:{
  start:{ t:'Every screen on Neon Row goes black at once. A second later each one shows the same white circle and a single word: BLACKOUT. In the sudden dark, three figures in hoodies are prying open a power junction box.', c:[{ l:'Battle the hackers', battle:'blackout_grunts', go:'card' }, { l:'Trace the signal on the screens back to its source first', chk:['investigation',14], go:'traced', fail:'spotted' }] },
  spotted:{ t:'One of the hackers looks up from the junction box. “It’s the tourist champion. Get them.”', c:[{ l:'Battle the hackers', battle:'blackout_grunts', go:'card' }] },
  traced:{ t:'You follow the flicker of the screens down the street to a van with blacked-out windows. The hackers inside scatter when you knock, leaving a laptop open on the seat.', next:'card' },
  card:{ t:'Among what the hackers left behind is a keycard stamped POWERWORKS and a note in plain white type on black: “Midnight. The grid dreams. —Null.”\n\nThe Powerworks is the old power station on the east side of the city, past Neon Row.', do:g => setF(g, 'blackout_known'), end:true }
}});
SC('a_bo2',{ node:'a_powerworks', title:'Null', req:g => F(g, 'blackout_known') && !F(g, 'blackout_beaten'), steps:{
  start:{ t:'Deep in the Powerworks the turbines are screaming. At the main console, a slight figure in a plain white mask has both hands on the controls. Null.\n\n“The first lights in this city weren’t built,” Null says without turning around. “They were dreamed. Something sleeps in these wires, and every night the city drains it a little more to keep the lights on. I’m going to switch the city off and let it wake up.”', c:[{ l:'“You’ll black out the hospitals too.”', chk:['persuasion',17], go:'doubt', fail:'fight' }, { l:'Battle Null', go:'fight' }] },
  doubt:{ t:'Null’s hands stop on the controls. “The hospitals have generators,” they say, more quietly. “Mostly.” They turn around. “Fine. Then stop me.”', next:'fight', nl:'Face Null' },
  fight:{ t:'Null steps away from the console and snaps their fingers. Every screen in the Powerworks shows the white circle.', c:[{ l:'Battle Null', battle:'null', go:'after' }] },
  after:{ t:'Null’s last partner falls, and they pull off the mask. Underneath is someone younger than you expected, and very tired. “Too late anyway,” they say. “Look.”\n\nEvery light in Arclight goes out at once. Then the grid hums back to life, brighter than before, and in the turbine hall a coil of living lightning lifts its head.', do:g => setF(g, 'blackout_beaten'), end:true }
}});
SC('a_legend',{ node:'a_powerworks', title:'The dragon in the wires', repeat:true, req:g => F(g, 'blackout_beaten') && !F(g, 'legend_arcwyrm'), steps:{
  start:{ t:'The turbine hall crackles. Arcwyrm uncoils from the generators, a dragon made of the city’s own light, and every bulb in the Powerworks brightens as it opens its eyes.', c:[{ l:'Face Arcwyrm', wild:['arcwyrm',55], go:'gone', fled:'flee' }, { l:'Leave it be for now', go:'flee' }] },
  flee:{ t:'Arcwyrm sinks back into the generators, and the lights dim to normal. It will wake again when you return.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule hums like a power line. Arcwyrm is yours, and all across the city the lights steady. No more blackouts.' : 'Arcwyrm crackles away through the power lines, lighting up street after street across the city. It will come back to the Powerworks to rest.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_arcwyrm'); }, end:true }
}});
SC('a_rival',{ node:'a_spire', title:'Corin at the Spire', auto:true, req:g => rb(g, 'arclight') >= 8, steps:{
  start:{ t:'At the foot of the Spire, the glass stairway up to Arclight Stadium, Corin is waiting under a streetlight. “Four regions. One more battle. Then the big one.”', c:[{ l:'Battle Corin', battle:'rival_arclight', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? '“Okay. Okay. You win. Again,” Corin laughs.' : '“Ha! Finally!” Corin runs a lap of the plaza.') + ' Then they bump your shoulder. “Go on. I’ll be in the stands, yelling.”', end:true }
}});

MILESTONES.push(
  ['arclight_arrived','The player started over a fourth time in Arclight, a huge modern city reached by the Undersea Express, with a starter from Professor Dana Okoye. Rolling blackouts are blamed on a hacker crew called Blackout.'],
  ['blackout_known','The player found a Powerworks keycard and a note from Null, the leader of Blackout.'],
  ['blackout_beaten','The player defeated Null in the Powerworks, and the legendary Arcwyrm woke in the city’s power grid.'],
  ['champion_arclight','The player is Champion of Arclight.']
);
