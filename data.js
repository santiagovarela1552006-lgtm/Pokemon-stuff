'use strict';
/* Halcyon Road: campaign data. An original region, creatures and cast. */

/* ---------------- Types ---------------- */
const TYPES = ['normal','fire','water','grass','electric','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon'];
const TYPE_COLOR = {
  normal:'#a8a487', fire:'#e8743b', water:'#3f86d9', grass:'#4fae54', electric:'#e3bd22',
  ice:'#6fc6cf', fighting:'#b8442f', poison:'#9b4fb0', ground:'#c9a050', flying:'#8fa3e8',
  psychic:'#e4608f', bug:'#93ad2a', rock:'#a6915a', ghost:'#6b5d9e', dragon:'#5a4bd1', none:'#8b918d'
};
const CHART = {
  normal:{rock:.5, ghost:0},
  fire:{fire:.5, water:.5, grass:2, ice:2, bug:2, rock:.5, dragon:.5},
  water:{fire:2, water:.5, grass:.5, ground:2, rock:2, dragon:.5},
  grass:{fire:.5, water:2, grass:.5, poison:.5, ground:2, flying:.5, bug:.5, rock:2, dragon:.5},
  electric:{water:2, grass:.5, electric:.5, ground:0, flying:2, dragon:.5},
  ice:{fire:.5, water:.5, grass:2, ice:.5, ground:2, flying:2, dragon:2},
  fighting:{normal:2, ice:2, poison:.5, flying:.5, psychic:.5, bug:.5, rock:2, ghost:0},
  poison:{grass:2, poison:.5, ground:.5, rock:.5, ghost:.5},
  ground:{fire:2, grass:.5, electric:2, poison:2, flying:0, bug:.5, rock:2},
  flying:{grass:2, electric:.5, fighting:2, bug:2, rock:.5},
  psychic:{fighting:2, poison:2, psychic:.5},
  bug:{fire:.5, grass:2, fighting:.5, poison:.5, flying:.5, psychic:2, ghost:.5},
  rock:{fire:2, ice:2, fighting:.5, ground:.5, flying:2, bug:2},
  ghost:{normal:0, psychic:2, ghost:2},
  dragon:{dragon:2}
};
function effOf(moveType, defTypes){ let m = 1; const row = CHART[moveType] || {}; for (const t of defTypes) if (t in row) m *= row[t]; return m; }

/* ---------------- Moves ----------------
   p = power tier: 0 status, 1 d4, 2 d6, 3 d8, 4 d10, 5 d12
   acc = attack-roll modifier, sec = [status, natural roll needed], prio = initiative bonus */
const MOVES = {};
function M(id, n, t, p, o){ MOVES[id] = Object.assign({id, n, t, p}, o || {}); }
M('tackle','Tackle','normal',1);
M('quickstrike','Quick Strike','normal',2,{prio:6});
M('headbutt','Headbutt','normal',3);
M('bodyslam','Body Slam','normal',4,{acc:-1, sec:['para',18]});
M('hyperram','Hyper Ram','normal',5,{acc:-2});
M('growl','Growl','normal',0,{buff:[['atk',-1,'foe']], d:'Lowers the foe’s attack.'});
M('recover','Recover','normal',0,{heal:.5, d:'Restores half of max HP.'});
M('flop','Flop','water',0,{flop:true, d:'Flops around. Does nothing at all.'});
M('ember','Ember','fire',2,{sec:['burn',18]});
M('flamelash','Flame Lash','fire',3);
M('firestorm','Firestorm','fire',4,{acc:-1, sec:['burn',18]});
M('inferno','Inferno','fire',5,{acc:-2, sec:['burn',17]});
M('focus','Focus','fighting',0,{buff:[['atk',1,'self']], d:'Raises your attack.'});
M('bubblejet','Bubble Jet','water',2);
M('aquafang','Aqua Fang','water',3);
M('surge','Surge','water',4,{acc:-1});
M('riptide','Riptide Cannon','water',5,{acc:-2});
M('tideguard','Tide Guard','water',0,{buff:[['ac',1,'self']], d:'Raises your AC.'});
M('vinesnap','Vine Snap','grass',2);
M('sapdrain','Sap Drain','grass',3,{drain:.4});
M('razorleaf','Razor Leaf','grass',4,{acc:-1, crit:19});
M('solarlance','Solar Lance','grass',5,{acc:-2});
M('sleepspore','Sleep Spores','grass',0,{inflict:'sleep', d:'The foe must save or fall asleep.'});
M('spark','Spark','electric',2,{sec:['para',19]});
M('voltbite','Volt Bite','electric',3,{sec:['para',18]});
M('thundercrash','Thunder Crash','electric',4,{acc:-1, sec:['para',18]});
M('stormcall','Stormcall','electric',5,{acc:-2, sec:['para',17]});
M('staticwave','Static Wave','electric',0,{inflict:'para', d:'The foe must save or be paralyzed.'});
M('frostbreath','Frost Breath','ice',2);
M('icefang','Ice Fang','ice',3);
M('glacierlance','Glacier Lance','ice',4,{acc:-1});
M('blizzardhowl','Blizzard Howl','ice',5,{acc:-2});
M('frostmist','Frost Mist','ice',0,{buff:[['hit',-1,'foe']], d:'Lowers the foe’s attack rolls.'});
M('jab','Jab','fighting',2,{prio:3});
M('palmstrike','Palm Strike','fighting',3);
M('crosshook','Cross Hook','fighting',4,{acc:-1, crit:19});
M('titanfist','Titan Fist','fighting',5,{acc:-2});
M('acidspit','Acid Spit','poison',2,{sec:['poison',17]});
M('venomfang','Venom Fang','poison',3,{sec:['poison',16]});
M('sludgewave','Sludge Wave','poison',4,{acc:-1, sec:['poison',17]});
M('blightburst','Blight Burst','poison',5,{acc:-2, sec:['poison',16]});
M('toxicmist','Toxic Mist','poison',0,{inflict:'poison', d:'The foe must save or be poisoned.'});
M('mudslap','Mud Slap','ground',2);
M('digstrike','Dig Strike','ground',3);
M('quake','Quake','ground',4,{acc:-1});
M('earthsplitter','Earthsplitter','ground',5,{acc:-2});
M('sandveil','Sand Veil','ground',0,{buff:[['hit',-1,'foe']], d:'Lowers the foe’s attack rolls.'});
M('peck','Peck','flying',1);
M('gust','Gust','flying',2);
M('wingslash','Wing Slash','flying',3);
M('skydive','Sky Dive','flying',4,{acc:-1});
M('tempest','Tempest','flying',5,{acc:-2});
M('tailwind','Tailwind','flying',0,{buff:[['hit',1,'self']], d:'Raises your attack rolls.'});
M('mindjab','Mind Jab','psychic',2);
M('psybeam','Psybeam','psychic',3);
M('psystorm','Psy Storm','psychic',4,{acc:-1});
M('mindcrush','Mind Crush','psychic',5,{acc:-2});
M('hypnogaze','Hypnotic Gaze','psychic',0,{inflict:'sleep', d:'The foe must save or fall asleep.'});
M('calmmind','Calm Mind','psychic',0,{buff:[['atk',1,'self'],['ac',1,'self']], d:'Raises your attack and AC.'});
M('bugbite','Bug Bite','bug',2);
M('swarmrush','Swarm Rush','bug',3);
M('chitinlance','Chitin Lance','bug',4,{acc:-1});
M('hivestorm','Hive Storm','bug',5,{acc:-2});
M('silksnare','Silk Snare','bug',0,{buff:[['ac',-1,'foe']], d:'Lowers the foe’s AC.'});
M('pebbleshot','Pebble Shot','rock',2);
M('rockslide','Rockslide','rock',3);
M('stoneedge','Stone Edge','rock',4,{acc:-1, crit:19});
M('meteorfall','Meteorfall','rock',5,{acc:-2});
M('harden','Harden','rock',0,{buff:[['ac',1,'self']], d:'Raises your AC.'});
M('chilltouch','Chill Touch','ghost',1,{sec:['para',18]});
M('shadestrike','Shade Strike','ghost',2,{prio:5});
M('shadowbolt','Shadow Bolt','ghost',3);
M('nightterror','Night Terror','ghost',4,{acc:-1, vsSleep:true});
M('soulrend','Soul Rend','ghost',5,{acc:-2});
M('dreadglare','Dread Glare','ghost',0,{buff:[['atk',-1,'foe']], d:'Lowers the foe’s attack.'});
M('dragonbite','Dragon Bite','dragon',2);
M('dragonclaw','Dragon Claw','dragon',3);
M('drakepulse','Drake Pulse','dragon',4,{acc:-1});
M('wyrmfire','Wyrmfire','dragon',5,{acc:-2, sec:['burn',18]});
M('dragondance','Dragon Dance','dragon',0,{buff:[['atk',1,'self'],['hit',1,'self']], d:'Raises your attack and attack rolls.'});
M('struggle','Struggle','none',2,{recoil:.25, d:'A desperate, typeless attack for when nothing else lands. The user takes some recoil.'});

/* Move pools used to generate learnsets: tier -> move, s = signature status move */
const POOLS = {
  normal:{1:'tackle',2:'quickstrike',3:'headbutt',4:'bodyslam',5:'hyperram',s:'growl'},
  fire:{2:'ember',3:'flamelash',4:'firestorm',5:'inferno',s:'focus'},
  water:{2:'bubblejet',3:'aquafang',4:'surge',5:'riptide',s:'tideguard'},
  grass:{2:'vinesnap',3:'sapdrain',4:'razorleaf',5:'solarlance',s:'sleepspore'},
  electric:{2:'spark',3:'voltbite',4:'thundercrash',5:'stormcall',s:'staticwave'},
  ice:{2:'frostbreath',3:'icefang',4:'glacierlance',5:'blizzardhowl',s:'frostmist'},
  fighting:{2:'jab',3:'palmstrike',4:'crosshook',5:'titanfist',s:'focus'},
  poison:{2:'acidspit',3:'venomfang',4:'sludgewave',5:'blightburst',s:'toxicmist'},
  ground:{2:'mudslap',3:'digstrike',4:'quake',5:'earthsplitter',s:'sandveil'},
  flying:{1:'peck',2:'gust',3:'wingslash',4:'skydive',5:'tempest',s:'tailwind'},
  psychic:{2:'mindjab',3:'psybeam',4:'psystorm',5:'mindcrush',s:'hypnogaze'},
  bug:{2:'bugbite',3:'swarmrush',4:'chitinlance',5:'hivestorm',s:'silksnare'},
  rock:{2:'pebbleshot',3:'rockslide',4:'stoneedge',5:'meteorfall',s:'harden'},
  ghost:{1:'chilltouch',2:'shadestrike',3:'shadowbolt',4:'nightterror',5:'soulrend',s:'dreadglare'},
  dragon:{2:'dragonbite',3:'dragonclaw',4:'drakepulse',5:'wyrmfire',s:'dragondance'}
};

/* ---------------- Creatures ----------------
   b = base [hp, atk, def, spd]; dc = capture DC base; xp = XP base
   evo = [level, into] or [stoneItem, into]; sh = body plan; f = sprite features */
const SPECIES = {};
function S(id, n, t, b, dc, xp, evo, sh, f, d, more){ SPECIES[id] = Object.assign({id, n, t, b, dc, xp, evo, sh, f, d}, more || {}); }
S('emberkit','Emberkit',['fire'],[44,56,40,62],12,62,[16,'flarevix'],'quad',['ears','tail','flame'],'A fox kit whose tail-tip smoulders when it is curious, which is always.');
S('flarevix','Flarevix',['fire'],[60,76,56,80],14,142,[36,'solvixen'],'quad',['ears','tail','flame','mane'],'Runs the ridgelines at dusk, leaving a ribbon of sparks that takes an hour to fade.');
S('solvixen','Solvixen',['fire','psychic'],[78,104,74,100],18,240,null,'quad',['ears','tail','flame','mane','eyes3'],'Its third eye opens only in battle. Old shepherds swore it could see a fire before it was lit.',{ex:{40:'calmmind'}});
S('rippup','Rippup',['water'],[50,48,56,46],12,62,[16,'surgeal'],'round',['fin','whiskers'],'A harbor pup that naps on fishing boats and is always forgiven for it.');
S('surgeal','Surgeal',['water'],[68,64,74,58],14,142,[36,'tidalrus'],'round',['fin','whiskers','tusks'],'Holds its breath for an hour, and its grudges for longer.');
S('tidalrus','Tidalrus',['water','ice'],[92,88,98,62],18,240,null,'round',['fin','whiskers','tusks','spikes'],'Breaks pack ice with its chest. Its tusks never stop growing.');
S('budling','Budling',['grass'],[48,50,52,48],12,62,[16,'thornback'],'round',['leaf','spikes'],'Sleeps buried to its eyes in warm soil. Do not water it unless it asks.');
S('thornback','Thornback',['grass'],[64,68,70,56],14,142,[36,'elderthorn'],'quad',['leaf','spikes'],'Each thorn on its back is a year it has survived.');
S('elderthorn','Elderthorn',['grass','ground'],[86,98,92,70],18,240,null,'quad',['leaf','spikes','horns'],'When an Elderthorn lies down to rest, a meadow grows over it.');
S('pipwing','Pipwing',['normal','flying'],[38,42,36,58],7,45,[18,'gustail'],'bird',['wings','crest'],'Chatters at dawn on every fencepost in Halcyon.');
S('gustail','Gustail',['normal','flying'],[60,62,56,74],11,112,[36,'galecrest'],'bird',['wings','crest','tail'],'Rides sea gusts for miles without a single flap.');
S('galecrest','Galecrest',['normal','flying'],[80,86,74,98],15,190,null,'bird',['wings','crest','tail'],'Kite-makers prize its crest feathers, and must wait for them to fall.');
S('nibbit','Nibbit',['normal'],[32,50,34,64],6,40,[20,'gnawrat'],'quad',['ears','tail','teeth'],'Gnaws on anything, including the fences built to keep it out.');
S('gnawrat','Gnawrat',['normal'],[56,80,60,92],11,112,null,'quad',['ears','tail','teeth'],'Can chew through a cellar door in one night. Umbra grunts love them.');
S('silkgrub','Silkgrub',['bug'],[40,30,34,40],5,30,[7,'cocoonix'],'serpent',['antennae'],'Spins silk so fine that Brightwater tailors pay for it by the gram.',{ls:[[1,'tackle'],[1,'silksnare'],[5,'bugbite']]});
S('cocoonix','Cocoonix',['bug'],[50,24,64,26],7,60,[12,'lumimoth'],'blob',['shell'],'Hangs perfectly still for days. Poke it and it will remember you.',{ls:[[1,'tackle'],[1,'silksnare'],[5,'bugbite'],[7,'harden']]});
S('lumimoth','Lumimoth',['bug','psychic'],[62,64,54,72],11,150,null,'bird',['wings','antennae'],'Its wing-scales glow faintly blue. Lost hikers follow them home.');
S('stingle','Stingle',['bug','poison'],[40,46,36,52],6,40,[14,'waspear'],'serpent',['antennae','stinger'],'The barb on its tail is barely a pinprick. The rash lasts a week.');
S('waspear','Waspear',['bug','poison'],[64,84,46,78],11,140,null,'bird',['wings','stinger','antennae'],'Defends its nest in formation. You will hear them before you see them.');
S('sparkit','Sparkit',['electric'],[36,56,36,92],13,82,['sparkstone','voltail'],'quad',['ears','tail','bolt'],'Stores static in its cheeks by rolling on wool rugs.');
S('voltail','Voltail',['electric'],[60,90,56,110],16,182,null,'quad',['ears','tail','bolt','mane'],'A grown Voltail can light a farmhouse for a winter, if it likes you.');
S('pebblin','Pebblin',['rock','ground'],[42,72,92,24],9,60,[25,'bouldrock'],'round',['rocks'],'Mistaken for a stone about once a day. It does not mind.');
S('bouldrock','Bouldrock',['rock','ground'],[80,106,126,40],14,172,null,'round',['rocks','spikes'],'Rolls downhill on purpose. Quarry workers time their lunch around it.');
S('dusklet','Dusklet',['poison','flying'],[42,48,36,64],7,48,[22,'nocturne'],'bird',['wings','ears'],'Hangs from cave ceilings in clusters and navigates by its own echo.');
S('nocturne','Nocturne',['poison','flying'],[76,82,70,94],12,152,null,'bird',['wings','ears','teeth'],'Drinks moonlit dew from mountain flowers and is unbearably smug about it.');
S('moonpuff','Moonpuff',['normal','psychic'],[72,42,48,38],12,72,['moonstone','lunapuff'],'round',['ears','curl'],'Floats a hand’s width off the ground on full-moon nights.',{ex:{20:'recover'}});
S('lunapuff','Lunapuff',['normal','psychic'],[106,70,76,60],16,172,null,'round',['ears','curl','crest'],'Hums a single note that puts quarrelsome children to sleep.',{ex:{20:'recover'}});
S('spiralith','Spiralith',['rock','water'],[72,82,102,42],18,162,[40,'spiralord'],'round',['shell','fin'],'Revived from a fossil. It seems puzzled by how much the sea has changed.');
S('raptoryx','Raptoryx',['rock','flying'],[76,102,64,110],18,182,null,'bird',['wings','teeth','crest'],'An ancient hunter with stone-grey feathers. It screams at airships.');
S('glubfin','Glubfin',['water'],[26,14,52,72],4,22,[20,'tyrantide'],'fish',['fin','whiskers'],'Famously useless. Fishermen throw them back out of pity.',{ls:[[1,'flop'],[15,'tackle']]});
S('tyrantide','Tyrantide',['water','dragon'],[96,122,82,84],18,212,null,'serpent',['fin','horns','teeth','whiskers'],'Every Tyrantide remembers being a Glubfin, and holds it against the world.',{ex:{20:'dragonbite',30:'dragondance'}});
S('frothtoad','Frothtoad',['water'],[52,54,46,62],9,66,[25,'brawltoad'],'round',['eyesbig'],'Blows froth bubbles when happy and much larger ones when it isn’t.');
S('brawltoad','Brawltoad',['water','fighting'],[86,94,86,72],14,172,null,'tall',['eyesbig'],'Trains by punching waterfalls. The waterfalls are losing.');
S('jellune','Jellune',['water','poison'],[46,44,38,74],10,72,null,'blob',['tentacles'],'Drifts into harbors on warm tides. Swimmers learn its shape quickly.');
S('coilbit','Coilbit',['electric'],[34,42,74,48],10,66,[30,'dynacoil'],'round',['antenna','bolt'],'A copper-shelled creature that clicks when it is thinking.');
S('dynacoil','Dynacoil',['electric'],[58,74,98,74],14,168,null,'round',['antenna','bolt','spikes'],'Clings to power lines and hums along with them.');
S('scrapup','Scrapup',['fighting'],[46,74,40,66],10,72,[28,'brawlape'],'tall',['ears'],'Picks fights with its own reflection and wins about half of them.');
S('brawlape','Brawlape',['fighting'],[74,110,64,94],14,172,null,'tall',['ears','mane'],'Its knuckles are calloused smooth as river stones.');
S('wisplet','Wisplet',['ghost','poison'],[32,38,30,84],10,70,[25,'shadewisp'],'ghost',[],'A curl of violet smoke with eyes. It giggles at funerals.');
S('shadewisp','Shadewisp',['ghost','poison'],[50,58,48,100],14,142,[40,'gloomreaper'],'ghost',['ears'],'Slips under doors to steal the warmth from sleeping rooms.');
S('gloomreaper','Gloomreaper',['ghost','poison'],[66,78,64,114],18,222,null,'ghost',['ears','horns'],'Where it passes, candles gutter and clocks lose a minute.');
S('fawnlet','Fawnlet',['normal'],[52,52,48,62],10,72,[30,'hearthstag'],'quad',['ears','antlers'],'A spotted fawn that never strays from those it trusts.');
S('hearthstag','Hearthstag',['normal','psychic'],[94,94,78,96],16,202,null,'quad',['ears','antlers','mane'],'Its antlers glow like banked embers. Travellers once lit lamps from them.');
S('spordle','Spordle',['grass','poison'],[44,54,54,32],8,62,[24,'fungrove'],'round',['cap'],'Puffs sleepy spores when startled, then falls asleep itself.');
S('fungrove','Fungrove',['grass','poison'],[78,88,84,46],13,162,null,'round',['cap','spikes'],'A walking grove of mushrooms. Foragers follow it at a respectful distance.');
S('bloomaw','Bloomaw',['grass'],[64,88,62,64],12,150,null,'tall',['leaf','teeth'],'A flower with a mouth. It smells wonderful, which is the problem.');
S('mindmote','Mindmote',['psychic'],[40,60,32,74],12,76,[30,'cerebrix'],'tall',['eyes3'],'Floats in libraries. The books it reads come back slightly warm.',{ex:{25:'calmmind'}});
S('cerebrix','Cerebrix',['psychic'],[62,106,58,108],16,202,null,'tall',['eyes3','crest'],'Solves puzzles for fun, and people for less fun.',{ex:{25:'calmmind',35:'recover'}});
S('slumberoth','Slumberoth',['normal'],[160,110,68,30],15,202,null,'round',['ears','big'],'Sleeps nineteen hours a day and eats for the other five.',{ex:{30:'recover'}});
S('wyrmlet','Wyrmlet',['dragon'],[42,64,46,54],16,82,[30,'skywyrm'],'serpent',['horns'],'Long believed a myth. Wildreach wardens count them every spring.');
S('skywyrm','Skywyrm',['dragon'],[62,86,66,74],18,162,[55,'aurorwyrm'],'serpent',['horns','fin'],'It can turn the clouds above a lake the color of its scales.');
S('aurorwyrm','Aurorwyrm',['dragon','flying'],[92,126,98,84],20,262,null,'serpent',['horns','wings'],'Circles the region once a year. Town halls keep a record of every sighting.');
S('rhynox','Rhynox',['ground','rock'],[88,98,100,34],13,152,null,'quad',['horn'],'Charges in a straight line and forgets why halfway.');
S('frostling','Frostling',['ice'],[58,60,58,72],12,112,null,'round',['spikes','ears'],'Its breath freezes on contact. It cannot bring itself to stop sneezing.');
S('rimeclaw','Rimeclaw',['ice','fighting'],[80,106,80,92],14,172,null,'tall',['spikes','claws'],'Carves seal-holes in sea ice with a single swipe.');
S('ashpony','Ashpony',['fire'],[52,84,58,92],11,92,[40,'blazemane'],'quad',['mane','flame','tail'],'Its hooves leave scorch marks for the first hour of every morning.');
S('blazemane','Blazemane',['fire'],[72,102,72,108],15,192,null,'quad',['mane','flame','tail','horn'],'Gallops fast enough to outrun its own smoke.');
S('magmole','Magmole',['fire','ground'],[66,84,72,58],12,122,null,'round',['claws'],'Tunnels through warm rock and surfaces in people’s hot springs.');
S('dunemaw','Dunemaw',['ground'],[62,76,68,54],13,92,[32,'sandreaver'],'serpent',['teeth','fin'],'Swims through dunes with only its back fin showing.');
S('sandreaver','Sandreaver',['ground','dragon'],[88,110,94,88],18,222,null,'serpent',['teeth','fin','horns'],'Sandstorms follow it the way gulls follow a ship.');
S('frostwing','Frostwing',['ice','flying'],[90,92,100,90],22,282,null,'bird',['wings','crest','tail','aura'],'A legend of the Rimefrost Isles. Its passing turns rain to snow.',{legend:true});
S('stormcrest','Stormcrest',['electric','flying'],[90,104,86,104],22,282,null,'bird',['wings','crest','bolt','aura'],'A legend of the Old Stormworks. It nests where lightning has struck twice.',{legend:true});
S('pyreon','Pyreon',['fire','flying'],[90,108,90,94],22,282,null,'bird',['wings','crest','flame','aura'],'A legend of Summit Pass. Its feathers fall as embers that never cool.',{legend:true});
S('nyxion','Nyxion',['psychic','dragon'],[106,130,90,126],25,330,null,'tall',['tail','eyes3','crest','aura'],'Grown on Cinderisle from a fragment nobody can now explain. It does not want to be found.',{legend:true, ex:{1:'recover'}});
/* ---- Expanded roster ---- */
S('pudgepup','Pudgepup',['normal'],[46,48,40,52],7,45,[20,'barkhound'],'quad',['ears','tail','spots'],'Follows mail carriers home and refuses to leave.');
S('barkhound','Barkhound',['normal'],[72,80,62,82],12,150,null,'quad',['ears','tail','spots','mane'],'Its bark carries across two valleys. Shepherds trust it with whole flocks.');
S('whiskit','Whiskit',['normal'],[40,46,36,74],9,55,[24,'prowlynx'],'quad',['ears','tail','whiskers'],'Sleeps in sunbeams and follows them around the house as they move.');
S('prowlynx','Prowlynx',['normal'],[64,76,56,104],13,155,null,'quad',['ears','tail','whiskers','stripes'],'Hunts at dusk on silent paws. Only its tufted ears give it away.');
S('snoutle','Snoutle',['normal'],[54,50,48,36],7,45,[26,'hogsnort'],'round',['ears','spots'],'Roots for truffles and finds them, then eats them before anyone can stop it.');
S('hogsnort','Hogsnort',['normal','ground'],[94,88,78,42],13,160,null,'quad',['ears','tusks','horn'],'Plows a furrow with its snout when it is cross, which is often.');
S('cubbun','Cubbun',['normal'],[56,58,46,40],9,55,[30,'ursaroar'],'round',['ears','curl'],'Hugs anything it can reach. Honey is its only weakness, and its only interest.');
S('ursaroar','Ursaroar',['normal','fighting'],[100,104,78,56],14,185,null,'tall',['ears','claws','mane'],'Can stand nine feet tall. Usually chooses not to.');
S('wickit','Wickit',['fire'],[36,44,40,52],9,52,[28,'lanternox'],'blob',['topflame','eyesbig'],'A candle stub that walked away from its candlestick. It flickers when it laughs.');
S('lanternox','Lanternox',['fire','ghost'],[56,70,58,72],13,140,[42,'pyrewraith'],'ghost',['topflame','ears'],'Lights the way for travellers it likes, and leads the rest in circles.');
S('pyrewraith','Pyrewraith',['fire','ghost'],[76,108,72,96],17,230,null,'ghost',['topflame','horns','mane'],'Its fire burns blue and cold. What it touches is not burned so much as forgotten.');
S('scorchpup','Scorchpup',['fire'],[48,62,42,64],11,70,['emberstone','blazehound'],'quad',['ears','tail','flame','spots'],'Its paw prints smoke for a minute after it passes.');
S('blazehound','Blazehound',['fire'],[86,108,78,94],15,210,null,'quad',['ears','tail','flame','mane','stripes'],'A loyal, enormous hound. The Cinderisle fire brigade keeps three.');
S('magmite','Magmite',['fire','rock'],[62,82,94,40],12,130,null,'round',['rocks','topflame'],'A lump of lava that has decided it would rather not cool down.');
S('clawdle','Clawdle',['water'],[40,64,72,40],9,60,[28,'kraggler'],'crab',[],'Waves its claws at gulls, boats and the moon.');
S('kraggler','Kraggler',['water','rock'],[70,104,112,58],14,175,null,'crab',['spikes'],'Its claws can crack a ship’s hull. It mostly uses them on clams.');
S('seadrop','Seadrop',['water'],[42,48,52,78],11,70,['tidestone','tidepearl'],'blob',['gem'],'A droplet the size of a fist that never evaporates. Children keep them in jars.');
S('tidepearl','Tidepearl',['water','psychic'],[72,90,80,104],15,200,null,'blob',['gem','crest','spots'],'The pearl at its center glows on the nights the tide runs highest.');
S('kelpling','Kelpling',['water','grass'],[48,46,50,50],10,62,[34,'kelplord'],'serpent',['leaf','fin'],'Wraps itself around swimmers’ ankles out of friendliness, which is not how it feels.');
S('kelplord','Kelplord',['water','grass'],[90,92,88,72],15,200,null,'serpent',['leaf','fin','horns'],'Whole kelp forests sway in time with its breathing.');
S('finnel','Finnel',['water'],[42,52,40,76],10,60,[30,'skyfin'],'fish',['fin'],'Leaps clean out of the water for no reason anyone has found.');
S('skyfin','Skyfin',['water','flying'],[72,86,64,110],14,175,null,'fish',['fin','wings'],'Glides over the waves a mile at a time. Sailors call it good luck.');
S('mudmouth','Mudmouth',['water','ground'],[60,56,56,30],9,60,[30,'bogmaw'],'round',['whiskers','eyesbig'],'Lies in shallow mud with its mouth open and waits for dinner to wander in.');
S('bogmaw','Bogmaw',['water','ground'],[104,92,90,42],14,180,null,'round',['whiskers','teeth','spots'],'Its yawn can be heard across the whole marsh.');
S('pipseed','Pipseed',['grass'],[44,46,48,52],10,55,[18,'vinelope'],'bulb',['leaf'],'Plants itself in sunny windows and won’t move until it is watered.');
S('vinelope','Vinelope',['grass'],[62,64,62,72],13,140,[36,'arborelk'],'quad',['leaf','antlers'],'Its legs are woven vines. It can sprint across a meadow without bending a stalk.');
S('arborelk','Arborelk',['grass','normal'],[90,98,84,90],16,225,null,'quad',['antlers','mane','leaf'],'Moss grows on its antlers, and birds nest in the moss.');
S('thistlette','Thistlette',['grass','poison'],[44,54,46,56],10,62,['leafstone','thornova'],'bulb',['petals'],'Its purple bloom is lovely and its leaves sting for an hour.');
S('thornova','Thornova',['grass','poison'],[74,98,72,80],15,195,null,'bulb',['petals','spikes'],'It blooms once a year, and the scent carries for miles.');
S('gourdlet','Gourdlet',['grass','ghost'],[46,50,58,40],11,68,[30,'hollowgourd'],'bulb',['leaf','eyesbig'],'A small gourd with a face nobody carved. It rolls when it thinks you aren’t looking.');
S('hollowgourd','Hollowgourd',['grass','ghost'],[78,90,88,58],15,190,null,'bulb',['leaf','teeth','topflame'],'Lights itself from within on long nights and sings like wind in a chimney.');
S('cactling','Cactling',['grass','ground'],[48,60,62,34],10,64,[28,'saguaroar'],'bulb',['spikes'],'Stores a week of water in its body and will not share a drop.');
S('saguaroar','Saguaroar',['grass','ground'],[88,100,92,44],14,185,null,'tall',['spikes','petals'],'Stands so still in the desert that birds nest in its arms.');
S('buzzbug','Buzzbug',['bug','electric'],[40,50,46,64],9,58,[26,'voltbeetle'],'insect',['antennae','wings'],'Swarms around lamps at night, and now and then becomes the lamp.');
S('voltbeetle','Voltbeetle',['bug','electric'],[70,92,84,76],14,175,null,'insect',['antennae','horn','bolt'],'Its shell holds a charge for a week. Farmers use them to start tractors.');
S('joltling','Joltling',['electric'],[42,58,42,80],11,68,[30,'ampeel'],'serpent',['bolt'],'A ribbon of static that swims through puddles after a storm.');
S('ampeel','Ampeel',['electric','water'],[80,100,70,92],15,195,null,'serpent',['bolt','fin','whiskers'],'Coils in river mouths and lights them blue when startled.');
S('fluffzap','Fluffzap',['electric'],[50,46,52,42],9,60,[32,'stormwool'],'round',['wool','ears'],'Its wool crackles. Knitting with it is not recommended.');
S('stormwool','Stormwool',['electric'],[92,90,80,62],14,180,null,'round',['wool','ears','bolt','horns'],'When a flock gathers on a hilltop, the hilltop gets struck by lightning.');
S('snowpip','Snowpip',['ice','flying'],[42,48,44,62],10,60,[30,'blizzowl'],'bird',['crest'],'Puffs up into a perfect snowball on cold mornings.');
S('blizzowl','Blizzowl',['ice','flying'],[78,92,74,94],15,190,null,'bird',['crest','wings','plume'],'Hunts in whiteouts, when nothing else can see at all.');
S('glacub','Glacub',['ice'],[56,60,56,40],10,64,[34,'polarok'],'round',['ears','spikes'],'Slides everywhere on its belly. It has never once walked.');
S('polarok','Polarok',['ice','rock'],[100,104,104,50],15,200,null,'quad',['ears','spikes','rocks'],'Its fur is fused with old glacier ice. It is warm inside, it promises.');
S('chillkin','Chillkin',['ice','psychic'],[44,54,40,70],12,70,[36,'auroracle'],'tall',['gem','curl'],'Its breath draws pictures in the frost on windows.');
S('auroracle','Auroracle',['ice','psychic'],[78,104,72,98],16,210,null,'tall',['gem','crest','mane'],'Dances under the northern lights. Some say it is the reason for them.');
S('kickit','Kickit',['fighting'],[48,66,44,62],10,64,[30,'roundhoof'],'tall',['ears','tail'],'Kicks first and apologizes never.');
S('roundhoof','Roundhoof',['fighting'],[82,108,72,90],14,185,null,'tall',['ears','tail','horns'],'Its roundhouse kick has been clocked faster than a train.');
S('brawnling','Brawnling',['fighting'],[62,74,52,36],9,60,[28,'brawnback'],'tall',['stripes'],'Lifts rocks heavier than itself to show off. It is mostly showing off.');
S('brawnback','Brawnback',['fighting'],[82,96,72,46],13,150,[40,'titanus'],'tall',['stripes','mane'],'Moves furniture for anyone who asks, and some who don’t.');
S('titanus','Titanus',['fighting'],[102,124,86,56],17,230,null,'tall',['stripes','mane','horns'],'Can stop a runaway cart with one hand. Uses two, to be polite.');
S('sludgle','Sludgle',['poison'],[74,62,46,26],9,64,[35,'muckmire'],'blob',['spots'],'Lives in drainpipes and is mostly harmless. Mostly.');
S('muckmire','Muckmire',['poison'],[110,98,74,46],14,190,null,'blob',['spots','teeth'],'Leaves a trail no flower will grow in for a year.');
S('viperling','Viperling',['poison'],[42,56,40,62],10,58,[24,'coilvenom'],'serpent',['teeth'],'Rattles its tail like a seed pod to warn you. Listen to it.');
S('coilvenom','Coilvenom',['poison'],[70,96,66,86],14,180,null,'serpent',['teeth','horns','stripes'],'Its hood bears a pattern like an eye that looks through you rather than at you.');
S('quillet','Quillet',['poison'],[46,54,58,42],10,60,[30,'spinequill'],'round',['spikes','ears'],'Raises its quills when startled, and is startled by everything.');
S('spinequill','Spinequill',['poison','ground'],[82,96,94,56],14,185,null,'quad',['spikes','horn'],'Its quills can pin a boot to the ground. Hikers wear thick soles in its hills.');
S('burrowl','Burrowl',['ground'],[44,58,50,46],9,58,[26,'tunnelord'],'round',['claws','eyesbig'],'Digs a new burrow every night and forgets where the old ones were.');
S('tunnelord','Tunnelord',['ground'],[74,96,74,88],14,175,null,'round',['claws','mask'],'A single Tunnelord can riddle a hillside like cheese in a week.');
S('sandkit','Sandkit',['ground'],[48,60,70,46],10,60,[22,'duneclaw'],'quad',['ears','claws'],'Curls into a perfect ball when threatened, then rolls downhill on purpose.');
S('duneclaw','Duneclaw',['ground'],[76,96,104,60],14,175,null,'quad',['ears','claws','spikes'],'Its armored back turns sandstorms aside.');
S('ossling','Ossling',['ground','ghost'],[46,56,62,44],11,66,[32,'ossuarch'],'round',['horns','mask'],'Wears a skull it found and will not say whose.');
S('ossuarch','Ossuarch',['ground','ghost'],[78,98,96,58],15,195,null,'tall',['horns','mask','mane'],'Guards old burial grounds and lets the respectful pass.');
S('kestrix','Kestrix',['flying'],[44,62,40,82],10,62,[30,'talonstorm'],'bird',['crest','plume'],'Hovers perfectly still in a gale, then drops like a stone.');
S('talonstorm','Talonstorm',['flying','fighting'],[74,108,66,112],15,195,null,'bird',['crest','plume','mask'],'Strikes with both talons fast enough to crack the air.');
S('gullop','Gullop',['water','flying'],[44,50,50,62],9,58,[28,'pelicrane'],'bird',['wings'],'Steals chips from harbor tourists with great skill and no shame.');
S('pelicrane','Pelicrane',['water','flying'],[86,88,82,70],14,175,null,'bird',['wings','crest'],'Its bill pouch holds three days of fish, or one very surprised trainer.');
S('strutfowl','Strutfowl',['normal','flying'],[70,84,62,80],12,150,null,'bird',['crest','plume','spots'],'Struts the Skyway at dawn crowing at bikers. The bikers crow back.');
S('dreamlet','Dreamlet',['psychic'],[56,48,52,44],10,64,[26,'somnivore'],'quad',['ears','eyesbig'],'Snuffles around sleepers to taste their dreams. It prefers the happy ones.');
S('somnivore','Somnivore',['psychic'],[92,88,78,62],14,180,null,'quad',['ears','mask','spots'],'It eats nightmares. Sleepers near one wake rested and slightly confused.',{ex:{30:'calmmind'}});
S('runelet','Runelet',['psychic'],[40,60,40,70],12,72,[32,'glyphowl'],'bird',['eyes3','crest'],'Scratches symbols into tree bark that no scholar has managed to read.');
S('glyphowl','Glyphowl',['psychic','flying'],[72,104,66,100],16,205,null,'bird',['eyes3','crest','wings','plume'],'The runes on its wings rearrange themselves when it is about to be right.');
S('antlet','Antlet',['bug'],[36,52,48,56],7,45,[22,'antmarch'],'insect',['antennae'],'Never alone. Where there is one Antlet, there are forty.');
S('antmarch','Antmarch',['bug','fighting'],[70,96,82,70],13,170,null,'insect',['antennae','horn'],'Leads columns of Antlets across whole valleys, carrying ten times its weight.');
S('mantiscythe','Mantiscythe',['bug','flying'],[70,110,70,104],15,190,null,'insect',['antennae','wings','claws'],'Moves so fast that grass falls over a second after it passes.');
S('hornbeetle','Hornbeetle',['bug','fighting'],[74,112,92,72],15,185,null,'insect',['horn','horns'],'Lifts and throws rivals twice its size, then poses.');
S('sporemite','Sporemite',['bug','grass'],[40,58,52,30],8,50,[24,'fungalisk'],'insect',['shell','spots'],'Carries a mushroom on its back that does most of the thinking.');
S('fungalisk','Fungalisk',['bug','grass'],[72,96,86,40],13,170,null,'insect',['shell','spots','antennae'],'The mushroom has taken over completely. The bug underneath seems fine with it.');
S('shardling','Shardling',['rock'],[40,56,72,52],10,62,[34,'crystallus'],'round',['gem','spikes'],'A shard of quartz that hums when you tap it.');
S('crystallus','Crystallus',['rock','ice'],[76,94,116,70],15,195,null,'round',['gem','spikes','crest'],'Splits sunlight into rainbows to dazzle anything that hunts it.');
S('cragwyrm','Cragwyrm',['rock','dragon'],[88,112,108,66],18,240,null,'serpent',['horns','rocks','spikes'],'Sleeps coiled inside mountains. Rockslides are just it rolling over.');
S('spiralord','Spiralord',['rock','water'],[92,104,120,46],18,230,null,'round',['shell','fin','spikes'],'Its spiral shell has grown heavy enough to anchor it to the seabed in any storm.');
S('quarrion','Quarrion',['rock','ground'],[70,72,124,58],12,150,null,'serpent',['rocks'],'A chain of boulders that slithers. Miners follow it to find new seams.');
S('sheetling','Sheetling',['ghost'],[38,46,40,66],10,62,[34,'dreadsail'],'ghost',[],'Borrows bedsheets from washing lines and is very sorry about it.');
S('dreadsail','Dreadsail',['ghost','flying'],[70,98,64,104],15,195,null,'ghost',['wings','horns'],'Rides the night winds over the sea. Ships that see it reef their sails.');
S('dollkin','Dollkin',['ghost'],[62,90,64,62],14,170,null,'tall',['eyesbig','curl'],'An old rag doll that wants to be played with. It will wait as long as it takes.');
S('cinderdrake','Cinderdrake',['dragon','fire'],[84,116,84,94],19,250,null,'quad',['horns','wings','tail','flame'],'Nests in volcanic vents. Its breath turns sand to glass.');
S('paddlet','Paddlet',['water'],[44,46,44,58],7,45,[22,'mallarch'],'bird',['crest'],'A downy duckling that paddles in circles until someone notices it.');
S('mallarch','Mallarch',['water','flying'],[76,82,70,84],13,160,null,'bird',['crest','wings','plume'],'Leads its flock over the millponds in a perfect arrowhead.');
S('newtlet','Newtlet',['water'],[42,52,44,60],8,50,[24,'salamance'],'quad',['tail','spots'],'Hides under wet stones, pops out to look at you, then hides again.');
S('salamance','Salamance',['water','fighting'],[80,96,74,78],14,180,null,'tall',['tail','spots','fin'],'Stands on its hind legs to box anything that comes too near its pond.');
S('shelldrip','Shelldrip',['water','bug'],[44,42,66,30],8,50,[30,'conchord'],'round',['shell','antennae'],'A pond snail that leaves a trail of bubbles. It is in no hurry at all.');
S('conchord','Conchord',['water','bug'],[82,84,108,44],14,175,null,'round',['shell','antennae','spikes'],'Its spiral shell hums a low note whenever the tide turns.');
S('glimmet','Glimmet',['rock','psychic'],[50,60,80,60],14,90,[58,'comethyst'],'round',['gem','rocks'],'A pebble of meteor glass that floats when it is pleased with itself.');
S('comethyst','Comethyst',['rock','psychic'],[90,110,120,80],18,240,null,'round',['gem','spikes','crest'],'It remembers the sky it fell from and hums the shape of the stars at night.');
S('polarion','Polarion',['electric','ice'],[80,104,86,108],17,230,null,'round',['bolt','spikes','antenna'],'Charges itself on the crater’s strange magnetism. Compasses spin when it passes.');
S('verdrake','Verdrake',['grass','dragon'],[96,112,94,82],18,245,null,'quad',['leaf','horns','tail','wings'],'Moss and vines grow along its scales. It sleeps for a season at a time.');
S('zenfist','Zenfist',['fighting','psychic'],[84,112,80,104],17,235,null,'tall',['eyes3','mane'],'Meditates under the falling dust of the crater and strikes before you see it move.');
S('umbradrake','Umbradrake',['dragon','ghost'],[92,120,86,100],20,260,null,'serpent',['horns','wings','teeth'],'A dragon’s shadow that outlived its dragon. It coils in the crater’s darkest folds.');
S('astraeon','Astraeon',['psychic','electric'],[108,128,100,120],26,340,null,'tall',['crest','gem','tail','aura'],'It rode the skyfall down to Halcyon ten thousand years ago and has been listening ever since.',{legend:true, ex:{1:'recover'}});
S('lumin','Lumin',['psychic'],[100,100,100,100],24,300,null,'round',['ears','tail','curl','aura'],'A light over the black lake that the Cinderisle scientists only ever glimpsed. Everything Nyxion is, it once was.',{legend:true, ex:{1:'recover'}});
S('stagspirit','Restless Spirit',['ghost','psychic'],[90,80,80,90],99,180,null,'quad',['ears','mane','aura'],'The grieving spirit of a Hearthstag.',{nocodex:true, ghostly:true});

/* ---------------- Items ---------------- */
const ITEMS = {
  capsule:{n:'Capsule', price:200, kind:'ball', bonus:0, d:'Standard capture capsule. +0 to capture rolls.'},
  supercapsule:{n:'Super Capsule', price:600, kind:'ball', bonus:3, minB:2, d:'+3 to capture rolls.'},
  hypercapsule:{n:'Hyper Capsule', price:1200, kind:'ball', bonus:6, minB:4, d:'+6 to capture rolls.'},
  absolute:{n:'Absolute Capsule', price:0, kind:'ball', bonus:99, d:'Silvane’s prototype. It never fails.'},
  salve:{n:'Salve', price:300, kind:'heal', amt:25, d:'Restores 25 HP.'},
  supersalve:{n:'Super Salve', price:700, kind:'heal', amt:60, minB:2, d:'Restores 60 HP.'},
  hypersalve:{n:'Hyper Salve', price:1200, kind:'heal', amt:120, minB:4, d:'Restores 120 HP.'},
  maxsalve:{n:'Max Salve', price:2500, kind:'heal', amt:99999, minB:6, d:'Restores all HP.'},
  tonic:{n:'Cure Tonic', price:250, kind:'cure', d:'Cures a condition in battle. Conditions also clear when a battle ends.'},
  revive:{n:'Revival Herb', price:1500, kind:'revive', minB:3, d:'Revives a fainted partner at half HP.'},
  wisdomfruit:{n:'Wisdom Fruit', price:0, kind:'level', d:'A partner who eats it gains one level.'},
  sparkstone:{n:'Spark Stone', price:2100, kind:'stone', shopAt:'verdance', d:'Makes certain creatures evolve.'},
  moonstone:{n:'Moon Stone', price:2100, kind:'stone', shopAt:'verdance', d:'Makes certain creatures evolve.'},
  emberstone:{n:'Ember Stone', price:2100, kind:'stone', shopAt:'verdance', d:'Makes certain creatures evolve.'},
  tidestone:{n:'Tide Stone', price:2100, kind:'stone', shopAt:'verdance', d:'Makes certain creatures evolve.'},
  leafstone:{n:'Leaf Stone', price:2100, kind:'stone', shopAt:'verdance', d:'Makes certain creatures evolve.'}
};
const SHOP_ORDER = ['capsule','supercapsule','hypercapsule','salve','supersalve','hypersalve','maxsalve','tonic','revive','sparkstone','moonstone','emberstone','tidestone','leafstone'];
const KEYS = {
  codex:['Field Codex','Professor Marr’s record of every creature you meet.'],
  trailblade:['Trail Blade','Cuts through thornbrush and hedges.'],
  ticket:['Meridian Gala Ticket','Admits one to the gala aboard the S.S. Meridian.'],
  umbrapin:['Umbra Pin','A gold lantern pin. Umbra’s grunts might mistake you for one of their own.'],
  lens:['Lens of Sight','Smoky glass in a brass frame. Shows what is hidden.'],
  bell:['Waking Bell','Its note wakes anything that has slept too long.'],
  pass:['Elder’s Gate Pass','A note for the guards at the Aurum City gates.'],
  compass:['Warden’s Compass','Warden Okono’s brass compass.'],
  tidecharm:['Tide Charm','Calls a ferry current across any sea channel.'],
  cardkey:['Silvane Card Key','Opens doors in the Silvane tower.'],
  mansionkey:['Mansion Key','An iron key on a ring labelled GYM.'],
  fossil_spiral:['Spiral Fossil','A coiled shell, two hundred thousand years old.'],
  fossil_talon:['Talon Fossil','A hooked claw, two hundred thousand years old.']
};
const BADGES = [
  ['cairn','Cairn Badge','Dorrin','Cairnstone','rock'],
  ['tide','Tide Badge','Maris','Brightwater','water'],
  ['volt','Volt Badge','Voss','Port Saltmere','electric'],
  ['bloom','Bloom Badge','Liora','Verdance City','grass'],
  ['marsh','Marsh Badge','Sable','Fenmarsh','poison'],
  ['mind','Mind Badge','Seren','Aurum City','psychic'],
  ['cinder','Cinder Badge','Blaise','Cinderisle','fire'],
  ['earth','Earth Badge','Vane','Greenspire','ground']
];

/* ---------------- Trainer backgrounds & skills ---------------- */
const ABIL = {str:'Strength', dex:'Dexterity', con:'Constitution', int:'Intelligence', wis:'Wisdom', cha:'Charisma'};
const SKILLS = {
  athletics:['Athletics','str'], acrobatics:['Acrobatics','dex'], stealth:['Stealth','dex'],
  investigation:['Investigation','int'], nature:['Nature','int'],
  insight:['Insight','wis'], survival:['Survival','wis'], perception:['Perception','wis'],
  persuasion:['Persuasion','cha'], deception:['Deception','cha'], intimidation:['Intimidation','cha']
};
const BACKGROUNDS = {
  ace:{n:'Ace Trainer', skills:['athletics','intimidation','insight'], perk:'Your partners get +1 on attack rolls.', d:'You grew up on radio broadcasts of the Summit League and drilled battle formations in the schoolyard.', pri:['str','cha','con','wis','dex','int']},
  researcher:{n:'Field Researcher', skills:['investigation','nature','perception'], perk:'Your partners earn 25% more XP.', d:'You have filled three notebooks with sketches of creatures nobody else bothered to look at twice.', pri:['int','wis','dex','con','cha','str']},
  ranger:{n:'Wildlands Ranger', skills:['survival','stealth','perception'], perk:'+2 on capture rolls and on running away.', d:'You learned to read tracks before you learned to read, and you can sleep anywhere.', pri:['wis','dex','con','str','int','cha']},
  silver:{n:'Silver Tongue', skills:['persuasion','deception','insight'], perk:'Outfitters charge you 20% less and trainers pay you 25% more.', d:'You could talk a Gnawrat out of a cheese shop, and on one occasion did.', pri:['cha','dex','wis','int','con','str']}
};
const DIFFS = {
  story:{n:'Story', xp:2.2, lvl:.9, d:'XP ×2.2 and opponents a little weaker. For enjoying the tale.'},
  adventurer:{n:'Adventurer', xp:1.3, lvl:1, d:'XP ×1.3. Some training between gyms. The intended pace.'},
  veteran:{n:'Veteran', xp:1, lvl:1, d:'XP ×1. Expect to train, and to lose sometimes.'}
};

/* ---------------- Map ---------------- */
const NODES = {};
function N(id, o){ NODES[id] = Object.assign({id}, o); }
N('thistle',{n:'Thistle Hollow', k:'town', x:70, y:262, tier:1, haven:'home', adj:['route1','cinderisle'],
  encLabel:'Fish in the millpond', enc:[['paddlet',2,5,26],['newtlet',3,5,22],['glubfin',2,5,16],['finnel',3,5,14],['shelldrip',3,5,14],['mudmouth',4,5,8]], rare:['seadrop',6,6],
  d:'A ring of slate-roofed cottages around a millpond at the southern tip of the Halcyon Region. Wind off the sea combs the thistle fields flat.'});
N('route1',{n:'Bramble Path', k:'route', x:70, y:222, tier:1, adj:['thistle','greenspire'],
  d:'A rutted cart track between hedges, and on either side the tall grass that every child in Thistle Hollow is told not to walk into.',
  enc:[['pipwing',2,4,24],['nibbit',2,4,22],['pudgepup',2,4,16],['snoutle',3,4,10],['newtlet',3,5,12],['burrowl',3,5,9],['kickit',3,5,7]], rare:['whiskit',5,5]});
N('greenspire',{n:'Greenspire', k:'town', x:70, y:182, tier:1, haven:'haven', shop:true, adj:['route1','greenwood','summitpass'],
  d:'A market town under the old Greenspire, a bell tower so overgrown it is more tree than stone. The town gym has been chained shut for as long as anyone can remember.'});
N('greenwood',{n:'Greenspire Woods', k:'route', x:70, y:135, tier:1, adj:['greenspire','cairnstone'], trainers:['bug_wim','bug_ada','lass_fen'],
  d:'Old oaks, dim green light, and the constant click of insect wings.',
  enc:[['silkgrub',3,5,15],['stingle',3,5,13],['cocoonix',5,6,4],['antlet',3,6,9],['sporemite',4,6,8],['buzzbug',5,6,6],['pipwing',4,6,7],['nibbit',4,6,5],['pipseed',4,6,10],['clawdle',4,6,9],['shelldrip',4,6,7],['mudmouth',5,6,5],['paddlet',4,6,6]], rare:['sparkit',5,6]});
N('cairnstone',{n:'Cairnstone', k:'town', x:70, y:85, tier:1, haven:'haven', shop:true, adj:['greenwood','moonwell'],
  d:'A quarry town of grey stone and grey dust. Its museum is the town’s pride; its gym is the town’s muscle.'});
N('moonwell',{n:'Moonwell Caves', k:'cave', x:135, y:60, tier:2, adj:['cairnstone','brightwater','crater'], trainers:['hiker_ulf','spelunker_nell','youngster_tad'],
  req:g=>nb(g)>=1, lock:'Dorrin’s apprentices only let badge-holders into the caves.',
  d:'The ceiling glitters where meteor dust has seeped into the rock. Somewhere deep in, a pickaxe rings.',
  enc:[['dusklet',7,10,28],['pebblin',8,11,24],['scrapup',8,10,12],['moonpuff',9,11,7],['shardling',8,11,10],['burrowl',8,11,11],['sandkit',8,10,8]], rare:['quarrion',13,13]});
N('brightwater',{n:'Brightwater', k:'town', x:215, y:58, tier:2, haven:'haven', shop:true, adj:['moonwell','capethorn','underpass','gloomrock','aurum','hollowbelow'],
  d:'A city of canals and bridges where everybody owns a boat and nobody used to lock their door.'});
N('capethorn',{n:'Cape Thorn', k:'route', x:290, y:25, tier:2, adj:['brightwater'], trainers:['youngster_pim','camper_sol','picnicker_bea'],
  d:'A wind-bent headland north of Brightwater, reached by the long span of Lantern Bridge. A lighthouse cottage stands at its tip.',
  enc:[['frothtoad',12,15,12],['glubfin',10,15,8],['spordle',12,14,12],['pipwing',12,14,8],['jellune',12,14,7],['mindmote',12,14,6],['clawdle',12,14,9],['seadrop',12,14,6],['gullop',12,14,9],['kickit',12,14,8],['pudgepup',12,14,7],['buzzbug',12,14,6]], rare:['mindmote',15,15]});
N('hollowbelow',{n:'The Hollow Below', k:'cave', x:168, y:22, tier:6, adj:['brightwater'],
  req:g=>F(g,'champion'), lock:'A flooded cave under Cape Thorn. The League seals it to everyone but the champion.',
  d:'A cathedral of wet stone under Cape Thorn, with a black lake at its heart. Only the strongest creatures in Halcyon live down here.',
  enc:[['cerebrix',50,58,20],['gloomreaper',50,56,15],['tyrantide',52,58,15],['dynacoil',50,55,15],['lunapuff',52,56,10],['rimeclaw',50,55,10],['sandreaver',52,56,10],['skywyrm',52,56,5],['kraggler',50,55,8],['pyrewraith',50,56,7],['auroracle',50,56,7],['muckmire',50,55,7],['glyphowl',50,56,7],['kelplord',50,55,7],['coilvenom',50,55,7],['dreadsail',50,56,7]], rare:['aurorwyrm',58,58]});
N('underpass',{n:'Old Underpass', k:'route', x:150, y:115, tier:2, adj:['brightwater','saltmere'], trainers:['busker_remy','jogger_kit'],
  req:g=>F(g,'burglar_caught'), lock:'Police tape seals the Underpass road. A constable mutters about a burglary and a thief still at large.',
  d:'A road that dips under Aurum City’s old walls, then runs on through scrub and salt grass toward the sea.',
  enc:[['nibbit',14,17,10],['gnawrat',16,18,5],['pipwing',14,16,8],['scrapup',14,16,8],['mindmote',14,16,7],['whiskit',14,17,9],['snoutle',14,16,6],['viperling',14,17,10],['cubbun',14,16,7],['quillet',14,16,8],['fluffzap',14,16,8],['sandkit',14,16,7],['paddlet',14,16,7]], rare:['sparkit',15,16]});
N('saltmere',{n:'Port Saltmere', k:'town', x:160, y:185, tier:3, haven:'haven', shop:true, adj:['underpass','aurum','stormworks'], trainers:['gentleman_hale'],
  encLabel:'Fish off the pier', enc:[['glubfin',14,20,18],['clawdle',15,19,14],['finnel',15,19,14],['jellune',15,19,10],['gullop',15,18,10],['mudmouth',15,19,10],['shelldrip',15,19,9],['kelpling',15,19,8],['joltling',15,18,7]], rare:['seadrop',20,20],
  d:'Cranes, gulls and stacked cargo. The S.S. Meridian sits in the harbor, lit up like a birthday cake.'});
N('stormworks',{n:'Old Stormworks', k:'cave', x:226, y:250, tier:4, adj:['saltmere'],
  req:g=>hasKey(g,'tidecharm'), lock:'The Stormworks stand on an island across a fast channel. You’d need a way across the water.',
  d:'A power station on an island off Saltmere, dead for a decade. Something in the turbine hall still crackles.',
  enc:[['coilbit',30,33,18],['dynacoil',32,35,10],['sparkit',30,32,12],['wisplet',30,32,8],['voltail',33,35,3],['joltling',30,33,15],['buzzbug',30,32,8],['voltbeetle',32,35,6],['fluffzap',30,33,8],['sludgle',30,33,7],['muckmire',35,36,5],['shardling',30,33,6],['sheetling',30,33,6],['ampeel',32,35,4]], rare:['voltail',36,36]});
N('gloomrock',{n:'Gloomrock Tunnel', k:'cave', x:305, y:70, tier:3, adj:['brightwater','ashgrove'], trainers:['hiker_gus','spelunker_ivy'],
  req:g=>hasKey(g,'trailblade'), lock:'A wall of thornbrush chokes the road east of Brightwater. You’d need a blade to get through.',
  d:'Pitch black a few steps in. Water drips, wings rustle, and the air tastes of iron.',
  enc:[['pebblin',15,18,22],['dusklet',15,18,20],['scrapup',16,18,10],['coilbit',16,18,10],['quarrion',16,18,10],['burrowl',15,18,8],['brawnling',15,18,10],['shardling',15,18,6],['magmite',16,18,4]], rare:['rhynox',18,18]});
N('ashgrove',{n:'Ashgrove', k:'town', x:355, y:120, tier:3, haven:'haven', shop:true, adj:['gloomrock','lanternroad'],
  req:g=>F(g,'tunnel_through'), lock:'You haven’t found a way through Gloomrock Tunnel yet.',
  d:'A quiet town of chimney smoke and gravestones. The Hollow Spire, a tower of remembrance, rises over the cemetery. People here speak in low voices.',
  encLabel:'Wander the graveyard', enc:[['wisplet',18,22,30],['dusklet',18,20,7],['shadewisp',24,25,4],['sheetling',18,22,18],['gourdlet',18,22,13],['ossling',18,22,11],['wickit',18,21,8],['whiskit',18,21,8],['dreamlet',18,21,6]], rare:['dollkin',26,26]});
N('lanternroad',{n:'Lantern Road', k:'route', x:315, y:165, tier:3, adj:['ashgrove','verdance','aurum'], trainers:['ace_juno','birdkeeper_ola'],
  d:'Paper lanterns hang from the cherry trees all the way to Verdance.',
  enc:[['gnawrat',20,24,12],['gustail',20,24,12],['spordle',20,23,8],['ashpony',20,23,8],['mindmote',20,22,6],['dreamlet',20,23,12],['runelet',20,22,6],['fluffzap',20,23,10],['kestrix',20,23,10],['thistlette',20,23,9],['scorchpup',20,23,7]], rare:['bloomaw',24,24]});
N('verdance',{n:'Verdance City', k:'town', x:262, y:190, tier:4, haven:'haven', shop:true, dice:true, adj:['lanternroad','aurum','skyway'],
  d:'Greenhouses, perfume shops, a department store eight floors tall, and the Lucky Lantern casino, open all night.'});
N('aurum',{n:'Aurum City', k:'town', x:215, y:125, tier:4, haven:'haven', shop:true, adj:['brightwater','saltmere','lanternroad','verdance'],
  req:g=>F(g,'elder_rescued'), lock:'Black-coated guards at the Aurum gates: “City’s closed. Orders.”',
  d:'Glass towers, the gleaming headquarters of Silvane Corporation, and a hush that feels wrong for a city this size.'});
N('skyway',{n:'Skyway Road', k:'route', x:335, y:218, tier:4, adj:['verdance','fenmarsh'], trainers:['biker_rook','biker_vex','ace_mira'],
  req:g=>F(g,'slumberoth_cleared'), lock:'Something enormous is asleep across the Skyway Road.',
  d:'A raised causeway over the wetlands, beloved of bikers and hated by everyone who lives beside it.',
  enc:[['dusklet',25,28,8],['nocturne',27,29,10],['gnawrat',26,29,14],['gustail',26,30,12],['scrapup',25,28,8],['brawlape',29,30,6],['strutfowl',26,30,12],['sludgle',25,29,12],['kestrix',25,28,8],['talonstorm',30,31,4],['roundhoof',30,31,4],['prowlynx',26,30,6],['voltbeetle',26,30,5],['duneclaw',26,30,5],['thistlette',25,28,6],['mallarch',26,30,5]], rare:['slumberoth',32,32]});
N('fenmarsh',{n:'Fenmarsh', k:'town', x:292, y:255, tier:4, haven:'haven', shop:true, adj:['skyway','wildreach','rimefrost'],
  d:'Stilt houses over a wide, warm marsh. The town lives off the Wildreach Preserve, a fenced wilderness where rare creatures still roam.'});
N('wildreach',{n:'Wildreach Preserve', k:'route', x:362, y:252, tier:4, adj:['fenmarsh'],
  d:'Tall grass, reed beds and shallow lagoons, all of it moving. The wardens count every creature here twice a year.',
  enc:[['rhynox',25,30,9],['frothtoad',24,28,6],['spordle',24,27,5],['bloomaw',26,29,7],['dunemaw',25,29,8],['nibbit',24,26,4],['glubfin',20,26,5],['wyrmlet',22,26,4],['moonpuff',25,27,5],['cactling',24,28,8],['mantiscythe',26,29,5],['hornbeetle',26,29,5],['hogsnort',26,29,5],['kelpling',24,28,7],['mudmouth',24,28,6],['ursaroar',30,31,3],['cubbun',24,27,5],['salamance',26,29,4]], rare:['wyrmlet',28,28]});
N('rimefrost',{n:'Rimefrost Isles', k:'cave', x:205, y:282, tier:5, adj:['fenmarsh','cinderisle'], trainers:['swimmer_dov'],
  req:g=>hasKey(g,'tidecharm'), lock:'The Rimefrost Isles lie across open water. You’d need a way across.',
  d:'Ice caves on a scatter of islands. The current through the channels is strong enough to pull a swimmer under.',
  enc:[['frostling',30,34,16],['jellune',30,33,10],['dusklet',30,32,5],['nocturne',32,34,5],['rimeclaw',32,34,9],['glubfin',25,30,8],['snowpip',30,33,14],['glacub',30,33,12],['chillkin',30,33,9],['kelpling',30,33,7],['finnel',30,33,5],['conchord',30,33,6],['pelicrane',30,33,5]], rare:['tyrantide',32,32]});
N('cinderisle',{n:'Cinderisle', k:'town', x:122, y:283, tier:5, haven:'haven', shop:true, adj:['rimefrost','thistle'], trainers:['scientist_orin'],
  req:g=>hasKey(g,'tidecharm'), lock:'Cinderisle lies across open water. You’d need a way across.',
  d:'A volcanic island with one town, a burnt-out mansion, and a research lab that would rather you didn’t ask about the mansion.',
  enc:[['magmole',32,36,18],['ashpony',32,35,14],['coilbit',32,34,6],['wisplet',32,34,6],['shadewisp',34,35,8],['wickit',32,34,10],['lanternox',33,36,8],['magmite',32,36,12],['scorchpup',32,35,10],['blazemane',40,40,3],['quarrion',32,35,6],['ossuarch',33,36,5],['mallarch',32,35,6]], rare:['cinderdrake',36,36]});
N('summitpass',{n:'Summit Pass', k:'cave', x:30, y:140, tier:5, haven:'lodge', shop:true, adj:['greenspire','league'], trainers:['ace_hollis','ace_rue','blackbelt_kenji'],
  req:g=>nb(g)>=8, lock:'The badge gate at Summit Pass opens only for trainers with all eight badges.',
  d:'The badge gates, a ranger lodge, and then a climb through boulder-choked caves to the plateau where the League stands.',
  enc:[['bouldrock',40,44,12],['brawlape',40,44,10],['nocturne',40,44,8],['rhynox',40,43,8],['magmole',40,43,6],['dunemaw',40,42,6],['cerebrix',41,43,6],['quarrion',40,44,8],['brawnback',40,43,8],['crystallus',40,44,7],['polarok',40,44,5],['tunnelord',40,43,6],['ossuarch',40,44,5],['duneclaw',40,43,5],['skywyrm',42,43,3]], rare:['cragwyrm',44,44]});
N('league',{n:'Summit League', k:'league', x:32, y:88, tier:6, adj:['summitpass','tower'],
  req:g=>F(g,'pass_cleared'), lock:'Boulders block the way up to the plateau.',
  d:'Five doors in a row, a champion’s hall at the top, and the whole region spread out below the windows.'});

N('crater',{n:'Starfall Crater', k:'cave', x:118, y:38, tier:6, adj:['moonwell'],
  req:g=>F(g,'crater_open'), lock:'There is no way down past the deepest part of Moonwell Caves. Yet.',
  d:'A cathedral-sized cavern far below Moonwell, floored with glassy black rock from the ancient skyfall. Every stone glows faintly, the way Moon Stones do.',
  enc:[['glimmet',56,60,20],['polarion',58,62,11],['zenfist',58,62,11],['verdrake',58,62,9],['comethyst',60,62,6],['cerebrix',58,62,8],['gloomreaper',58,62,8],['skywyrm',58,62,6],['crystallus',58,62,8],['dynacoil',58,62,6]], rare:['umbradrake',64,64]});
N('tower',{n:'Summit Tower', k:'league', x:40, y:52, tier:6, haven:'haven', shop:true, adj:['league'],
  req:g=>F(g,'champion'), lock:'The Summit Tower admits only champions.',
  d:'A tower of white stone above the League, where champions test how long a winning streak can last.'});

/* ---------------- Trainers ---------------- */
const TRAINERS = {};
function T(id, name, mult, team, intro, outro, more){ TRAINERS[id] = Object.assign({id, name, mult, team, intro, outro, ai:'normal', heals:0}, more || {}); }
const RIVAL_LINE = { emberkit:['rippup','surgeal','tidalrus'], rippup:['budling','thornback','elderthorn'], budling:['emberkit','flarevix','solvixen'] };
const RIVAL_TEAMS = {
  rival1:[[0,5]],
  rival2:[['pipwing',13],['sparkit',12],[0,15]],
  rival3:[['gustail',19],['sparkit',17],['frothtoad',17],[1,21]],
  rival4:[['gustail',25],['voltail',24],['tyrantide',24],[1,27]],
  rival5:[['gustail',37],['voltail',36],['tyrantide',36],['cerebrix',36],[2,40]],
  rival6:[['galecrest',47],['voltail',45],['tyrantide',46],['cerebrix',46],['rhynox',45],[2,50]],
  champion:[['galecrest',59],['voltail',57],['tyrantide',58],['cerebrix',58],['rhynox',57],[2,62]],
  r_champion:[['galecrest',74],['voltail',72],['tyrantide',73],['cerebrix',73],['rhynox',72],[2,77]]
};
T('rival1','Corin',30,null,'“Let’s see what a type edge is worth.”','“Huh. Beginner’s luck.”',{rival:true});
T('rival2','Corin',40,null,'“Don’t hold back. I won’t.”','“Fine. You got lucky with the matchups.”',{rival:true});
T('rival3','Corin',45,null,'“Quick one. The pastries won’t eat themselves.”','“Okay, okay. You’re getting good.”',{rival:true});
T('rival4','Corin',50,null,'“I need to hit something. Sorry.”','“...Thanks. I think I needed that.”',{rival:true});
T('rival5','Corin',55,null,'“If you can’t beat me, you can’t beat Vane.”','“You’re ready. Go.”',{rival:true, ai:'smart', heals:1});
T('rival6','Corin',60,null,'“Last time before the League. Make it count.”','“See you at the top.”',{rival:true, ai:'smart', heals:1});
T('champion','Champion Corin',160,null,'“I’ve been waiting for you specifically.”','“...Yeah. Yeah, that’s fair.”',{rival:true, ai:'smart', heals:2});
T('bug_wim','Bug Catcher Wim',10,[['silkgrub',6],['antlet',6]],'“My bugs are the best bugs!”','“My bugs need a nap.”');
T('bug_ada','Bug Catcher Ada',10,[['cocoonix',7],['silkgrub',7],['stingle',8]],'“You walked right into my web. Metaphorically.”','“Bug out!”');
T('lass_fen','Lass Fen',15,[['pudgepup',8],['paddlet',8]],'“You look new. Let me show you how it’s done.”','“Okay, you didn’t need showing.”');
T('mason_tobin','Mason Tobin',25,[['pebblin',9],['nibbit',10]],'“Mind your footing on the way down!”','“Solid. Dorrin’ll like you.”');
T('dorrin','Leader Dorrin',100,[['pebblin',11],['quarrion',13]],'“Stone doesn’t hurry.”','“You’ve got grit. That’s what this is.”',{ai:'smart', heals:1, leader:true});
T('hiker_ulf','Hiker Ulf',25,[['pebblin',10],['pebblin',11]],'“These caves are older than your grandparents!”','“Ha! Fair enough.”');
T('spelunker_nell','Spelunker Nell',20,[['dusklet',10],['moonpuff',11]],'“Lamps off. Let’s see how you do in the dark.”','“You’ve got good eyes.”');
T('youngster_tad','Youngster Tad',12,[['nibbit',11],['kickit',11]],'“My Nibbit is in the top percentage of Nibbits!”','“Top percentage of something, anyway.”');
T('grunt_moon','Umbra Grunt',30,[['dusklet',11],['viperling',12]],'“Umbra business. Scram.”','“The Admin’s gonna kill me.”');
T('swimmer_lia','Swimmer Lia',15,[['newtlet',15],['frothtoad',16]],'“Splash fight!”','“I’m drenched. Wait, I was already drenched.”');
T('maris','Leader Maris',100,[['seadrop',18],['tidepearl',21]],'“Water’s soft until it isn’t!”','“Smooth! You flowed with it.”',{ai:'smart', heals:1, leader:true});
T('youngster_pim','Youngster Pim',12,[['nibbit',13],['pipwing',13]],'“First of five on the bridge! You’ll never make it across!”','“Okay, maybe you will.”');
T('camper_sol','Camper Sol',15,[['frothtoad',14],['clawdle',14]],'“The view from the bridge is the best part! Also, battle!”','“Still a great view.”');
T('picnicker_bea','Picnicker Bea',15,[['spordle',13],['moonpuff',14]],'“Battle me and I’ll share my sandwiches. Lose and I won’t.”','“Fine. Have a sandwich anyway.”');
T('umbra_recruiter','Umbra Recruiter',40,[['gnawrat',15],['wisplet',15]],'“Such a waste of talent.”','“The offer will not be repeated.”');
T('grunt_burglar','Umbra Grunt',30,[['dusklet',14],['sludgle',15]],'“Finders keepers!”','“Ugh. Keep your stupid fruit.”');
T('busker_remy','Busker Remy',18,[['frothtoad',15],['mindmote',15]],'“A battle! I’ll write a song about it.”','“It’s going to be a sad song.”');
T('jogger_kit','Jogger Kit',15,[['pipwing',16],['whiskit',17]],'“Keep pace with me!”','“Out of breath. Good battle.”');
T('gentleman_hale','Gentleman Hale',60,[['sparkit',19],['moonpuff',19]],'“A spot of sport before the gala, perhaps?”','“Splendid! Absolutely splendid.”');
T('sailor_brisk','Sailor Brisk',25,[['scrapup',18],['jellune',18]],'“Sea legs versus land legs!”','“Land legs win. Disgusting.”');
T('sailor_duke','Sailor Duke',25,[['coilbit',20],['scrapup',20]],'“The Major says I’m not allowed to give hints. Unless I lose.”','“Fine. Here’s your hint.”');
T('voss','Leader Voss',100,[['coilbit',21],['joltling',22],['voltail',24]],'“Lightning doesn’t negotiate, recruit!”','“Ha! You’ve got a spark!”',{ai:'smart', heals:1, leader:true});
T('hiker_gus','Hiker Gus',25,[['pebblin',19],['rhynox',20]],'“Can’t see a thing in here. Battle anyway!”','“Felt that one.”');
T('spelunker_ivy','Spelunker Ivy',20,[['dusklet',18],['coilbit',19],['pebblin',18]],'“My Coilbit’s my lantern. It’s also my fist.”','“Lights out for me.”');
T('ace_juno','Ace Trainer Juno',50,[['gustail',23],['frothtoad',23],['sparkit',24]],'“I’ve beaten four gym leaders. Have you?”','“...Okay, you have.”');
T('birdkeeper_ola','Bird Keeper Ola',25,[['kestrix',21],['gustail',23],['dusklet',22]],'“My birds own this road!”','“My birds are sulking now.”');
T('grunt_casino1','Umbra Grunt',30,[['gnawrat',22],['nocturne',23]],'“No kids in the back room.”','“Ugh. The key! I dropped the key!”');
T('grunt_casino2','Umbra Grunt',30,[['wisplet',22],['waspear',23]],'“The lift is staff only.”','“Whatever. Not paid enough.”');
T('lisk1','Admin Lisk',60,[['nocturne',24],['coilbit',24],['shadewisp',26]],'“Let’s keep you busy.”','“Huh. Pell was right about you.”',{ai:'smart', heals:1});
T('vane1','Director Vane',120,[['pebblin',25],['rhynox',26],['brawlape',29]],'“A short lesson.”','“Interesting.”',{ai:'smart', heals:1});
T('gardener_ivy','Gardener Ivy',20,[['spordle',23],['bloomaw',24]],'“Shh. They’re sleeping. Well, they were.”','“Now they’re all awake and grumpy.”');
T('liora','Leader Liora',100,[['thistlette',25],['bloomaw',27],['fungrove',29]],'“Mind the roses. They bite.”','“Lovely. Truly.”',{ai:'smart', heals:1, leader:true});
T('grunt_spire','Umbra Grunts',30,[['wisplet',24],['ossling',25],['nocturne',25]],'“We were told this would be an easy job!”','“Run! Run!”');
T('stagspirit_t','Restless Spirit',0,[['stagspirit',30]],'The spirit lowers its head.','The spirit fades into the candlelight.',{ai:'smart', nomoney:true});
T('biker_rook','Biker Rook',25,[['gnawrat',28],['nocturne',28]],'“This is our road, kid.”','“Okay. Shared road.”');
T('biker_vex','Biker Vex',25,[['sludgle',27],['jellune',28],['gnawrat',29]],'“Nice shoes. Shame if they got muddy.”','“My shoes got muddy.”');
T('ace_mira','Ace Trainer Mira',50,[['roundhoof',30],['gustail',30]],'“I train on this road every morning. You’re in my lane.”','“Take the lane.”');
T('juggler_nym','Juggler Nym',25,[['jellune',33],['wisplet',33]],'“Now you see me...”','“...now I’m sitting down.”');
T('sable','Leader Sable',100,[['coilvenom',36],['waspear',37],['muckmire',38],['shadewisp',40]],'“Poison is patience.”','“You waited well.”',{ai:'smart', heals:2, leader:true});
T('grunt_silvane1','Umbra Grunt',30,[['gnawrat',32],['nocturne',33]],'“Visitors sign in. With me.”','“Sign out. Sure. Whatever.”');
T('guard_silvane','Umbra Guard',30,[['dynacoil',33],['waspear',33]],'“Wha— I wasn’t asleep!”','“...I’m going back to sleep.”');
T('lisk2','Admin Lisk',60,[['nocturne',35],['dynacoil',35],['shadewisp',37]],'“Fine.”','“He’s going to burn it all down, you know.”',{ai:'smart', heals:1});
T('vane2','Director Vane',120,[['rhynox',37],['bouldrock',37],['brawlape',39],['sandreaver',41]],'“Let me show you why it doesn’t matter.”','“Umbra is patient.”',{ai:'smart', heals:2});
T('psychic_ora','Psychic Ora',25,[['mindmote',34],['lumimoth',35]],'“I knew you’d come through that pad.”','“I didn’t know that, though.”');
T('seren','Leader Seren',100,[['somnivore',37],['lumimoth',38],['lunapuff',38],['cerebrix',42]],'“I am curious.”','“Ah. That is how it ends.”',{ai:'smart', heals:2, leader:true});
T('swimmer_dov','Swimmer Dov',15,[['finnel',30],['jellune',32],['kelpling',32]],'“Cold water builds character!”','“My character is frozen.”');
T('scientist_orin','Scientist Orin',40,[['joltling',34],['dynacoil',36]],'“You’re not cleared for this island.”','“Fine. Clearance granted.”');
T('burglar_tess','Burglar Tess',70,[['ashpony',34],['magmole',34]],'“Finders keepers!”','“Take the key. It’s cursed anyway. Probably.”');
T('fire_jo','Firebreather Jo',30,[['ashpony',36],['magmole',36]],'“Wrong answer! Hot answer!”','“Ouch. Correct answer.”');
T('fire_al','Firebreather Al',30,[['magmole',37]],'“Hah! Wrong!”','“Okay, you’re smarter in battle.”');
T('fire_mo','Firebreather Mo',30,[['ashpony',36],['ashpony',37]],'“Blaise wrote that question himself!”','“Don’t tell Blaise.”');
T('blaise','Leader Blaise',100,[['magmite',40],['blazehound',42],['magmole',43],['blazemane',45]],'“Did you bring burn salve? No? Too bad!”','“Hot! HOT! You burned me right up!”',{ai:'smart', heals:2, leader:true});
T('vane3','Leader Vane',120,[['tunnelord',44],['rhynox',45],['spinequill',46],['duneclaw',46],['sandreaver',49]],'“Enough.”','“So that is what it looks like.”',{ai:'smart', heals:2, leader:true});
T('ace_hollis','Ace Trainer Hollis',50,[['cerebrix',42],['glyphowl',42],['galecrest',43]],'“Only the best make it this far.”','“And you’re one of them.”');
T('ace_rue','Ace Trainer Rue',50,[['brawlape',43],['nocturne',43],['tyrantide',44]],'“The League will eat you alive.”','“Maybe not, actually.”');
T('blackbelt_kenji','Black Belt Kenji',30,[['brawnback',44],['roundhoof',44]],'“HAI!”','“...hai.”');
T('e_wren','Elite Wren',120,[['polarok',53],['rimeclaw',54],['auroracle',54],['tidalrus',56]],'“Cold makes everything honest.”','“Honest indeed.”',{ai:'smart', heals:2});
T('e_brann','Elite Brann',120,[['roundhoof',53],['ursaroar',54],['hornbeetle',54],['brawlape',55],['titanus',57]],'“No tricks. Just hands.”','“Good hands.”',{ai:'smart', heals:2});
T('e_morwen','Elite Morwen',120,[['dreadsail',55],['pyrewraith',56],['ossuarch',55],['gloomreaper',58]],'“Sit with the dead a while.”','“You may go. The living are waiting.”',{ai:'smart', heals:2});
T('e_draven','Elite Draven',120,[['skywyrm',56],['cragwyrm',57],['tyrantide',57],['cinderdrake',58],['aurorwyrm',60]],'“Dragons are older than you.”','“...And yet.”',{ai:'smart', heals:2});
T('dorrin2','Leader Dorrin',110,[['bouldrock',62],['quarrion',62],['crystallus',63],['rhynox',63],['cragwyrm',65]],'“Stone remembers.”','“Still got that grit.”',{ai:'smart', heals:2});
T('maris2','Leader Maris',110,[['tidepearl',62],['brawltoad',62],['kraggler',63],['ampeel',63],['tyrantide',65]],'“The tide came back in!”','“Smooth as ever, champion.”',{ai:'smart', heals:2});
T('voss2','Leader Voss',110,[['voltail',62],['dynacoil',62],['stormwool',63],['voltbeetle',63],['ampeel',65]],'“Back for more lightning, recruit?”','“Ha! Still a spark!”',{ai:'smart', heals:2});
T('liora2','Leader Liora',110,[['thornova',62],['fungrove',62],['arborelk',63],['hollowgourd',63],['saguaroar',65]],'“The garden has grown since you left.”','“Lovely. Still lovely.”',{ai:'smart', heals:2});
T('sable2','Leader Sable',110,[['coilvenom',63],['muckmire',63],['gloomreaper',64],['spinequill',64],['waspear',66]],'“Patience, again.”','“You waited better than I did.”',{ai:'smart', heals:2});
T('seren2','Leader Seren',110,[['somnivore',63],['glyphowl',63],['auroracle',64],['lunapuff',64],['cerebrix',67]],'“I still cannot see how it ends.”','“Ah. The same way.”',{ai:'smart', heals:2});
T('blaise2','Leader Blaise',110,[['magmite',64],['blazehound',64],['pyrewraith',65],['magmole',65],['blazemane',68]],'“HOTTER this time!”','“Scorched again! Wonderful!”',{ai:'smart', heals:2});
T('vane5','Leader Vane',130,[['tunnelord',65],['duneclaw',65],['spinequill',66],['rhynox',66],['bogmaw',66],['sandreaver',70]],'“Again, then.”','“You still mean it. Good.”',{ai:'smart', heals:2});
T('r_wren','Elite Wren',140,[['polarok',68],['rimeclaw',69],['auroracle',69],['crystallus',69],['blizzowl',70],['tidalrus',72]],'“Colder now.”','“Honest as ever.”',{ai:'smart', heals:2});
T('r_brann','Elite Brann',140,[['roundhoof',68],['ursaroar',69],['hornbeetle',69],['salamance',69],['brawlape',70],['titanus',72]],'“Hands up.”','“Good hands, still.”',{ai:'smart', heals:2});
T('r_morwen','Elite Morwen',140,[['dreadsail',70],['pyrewraith',70],['ossuarch',70],['hollowgourd',70],['dollkin',71],['gloomreaper',73]],'“Another dinner for the dead.”','“The living keep winning.”',{ai:'smart', heals:2});
T('r_draven','Elite Draven',140,[['skywyrm',71],['cragwyrm',72],['tyrantide',72],['cinderdrake',73],['sandreaver',73],['aurorwyrm',75]],'“The dragons wanted a rematch.”','“...And yet. Again.”',{ai:'smart', heals:2});
T('r_champion','Champion Corin',180,null,'“Title defense. My turn to chase you.”','“Okay. You’re really good. Again sometime?”',{rival:true, ai:'smart', heals:3});
T('ashen_grunts','Ashen Lantern Guards',60,[['nocturne',60],['muckmire',61],['coilvenom',61]],'“Quill said you might come.”','“Tell Quill we tried.”',{ai:'smart'});
T('quill','Dr. Hesper Quill',150,[['comethyst',70],['polarion',70],['gloomreaper',71],['cerebrix',71],['sandreaver',72],['umbradrake',74]],'“We will let it decide who it listens to.”','“It never wanted me either.”',{ai:'smart', heals:2});
T('tower_foe','Tower Challenger',60,[['comethyst',60]],'','“Good battle. Keep climbing.”',{ai:'smart'});
T('vane4','Cassius Vane',0,[['rhynox',58],['bouldrock',58],['brawlape',59],['magmole',58],['sandreaver',62]],'“It was ours. That has to mean something.”','“Go on, then.”',{ai:'smart', heals:2, nomoney:true});

/* ---------------- Scenes ----------------
   step: t (text or g=>text), do (effect), c (choices), next (single Continue), end (closes; keep = don't mark done)
   choice: l label, go, chk [skill, dc], fail, adv g=>bool, req g=>bool, battle trainerId, soft, wild [sp,lvl]|'node', fled */
const SCENES = {};
function SC(id, o){ SCENES[id] = Object.assign({id}, o); }

SC('intro',{node:'thistle', title:'The Professor’s Lab', auto:true, steps:{
  start:{t:g=>`Morning. Your mother calls up the stairs: Professor Marr has been asking for you since dawn. Today is the day the professor promised you, ${g.name}. A first partner, and a Field Codex to fill.\n\nYou step out into the lane. At the edge of town, where the tall grass of Bramble Path begins, something rustles.`,
    c:[{l:'Walk straight into the tall grass', go:'grass'},{l:'Go to the lab first', go:'lab'}]},
  grass:{t:'Three steps in, the grass erupts: a wild Nibbit, teeth bared. Before you can backpedal, a hand grabs your collar. Professor Linden Marr, out of breath, hauls you back onto the path.\n\n“Not without a partner, you won’t. Come on.”', next:'lab', nl:'Follow the professor'},
  lab:{t:'The lab smells of cedar shavings and ozone. On the bench sit three capsules, each humming faintly. Leaning against the bench, arms folded, is Corin Marr, the professor’s grandchild.\n\n“Took you long enough. Gramps made me wait so you could pick first. Generous of him.”\n\n“Choose carefully,” the professor says. “A partner is for the whole road.”',
    c:[{l:'Read the three creatures’ temperaments first', chk:['insight',10], go:'temper', fail:'temperfail'},
       {l:'Choose Emberkit, the fire fox kit', go:'rival', do:g=>pickStarter(g,'emberkit')},
       {l:'Choose Rippup, the water pup', go:'rival', do:g=>pickStarter(g,'rippup')},
       {l:'Choose Budling, the grass hedgehog', go:'rival', do:g=>pickStarter(g,'budling')}]},
  temper:{t:'You crouch to eye level. Emberkit’s ears swivel toward every sound: curious, impatient, brave before it is wise. Rippup rolls onto its back, entirely unbothered by anything. Budling watches you without blinking, very still, the way a seed waits for rain.',
    c:[{l:'Choose Emberkit', go:'rival', do:g=>pickStarter(g,'emberkit')},{l:'Choose Rippup', go:'rival', do:g=>pickStarter(g,'rippup')},{l:'Choose Budling', go:'rival', do:g=>pickStarter(g,'budling')}]},
  temperfail:{t:'All three stare back at you. One of them sneezes. You learn nothing, except that you are being watched by three creatures and one smirking Corin.',
    c:[{l:'Choose Emberkit', go:'rival', do:g=>pickStarter(g,'emberkit')},{l:'Choose Rippup', go:'rival', do:g=>pickStarter(g,'rippup')},{l:'Choose Budling', go:'rival', do:g=>pickStarter(g,'budling')}]},
  rival:{t:g=>`The ${SPECIES[g.starter].n} tumbles out of its capsule and looks up at you. That’s that, then.\n\nCorin snatches the capsule beside yours without reading the label, then reads it, and grins. A ${SPECIES[RIVAL_LINE[g.starter][0]].n}. “Mine’s got the type edge. Let’s see what that means.”`,
    c:[{l:'Battle Corin', battle:'rival1', soft:true, go:'after'}]},
  after:{t:g=>(g.lastBattle==='win' ? '“Huh,” Corin says, recalling their partner. “Beginner’s luck.”' : 'Corin pumps a fist. “Type edge! Told you.”') +
    '\n\nThe professor clears their throat. “Both of you, listen. Nobody has ever fully catalogued the Halcyon Region. This Field Codex records every creature you see and catch. Fill it.”\n\nCorin is already at the door. “Eight badges, then the Summit League. I’ll be champion before you’ve caught a bug.” The door bangs.\n\nThe professor presses five Capsules and the Field Codex into your hands. “Mind Bramble Path. And come home sometimes.”',
    do:g=>{ give(g,'capsule',5); giveKey(g,'codex'); }, end:true}
}});

SC('profcodex',{node:'thistle', title:'Show the Professor your Codex', repeat:true, req:g=>F(g,'intro_done')||!!g.done.intro, steps:{
  start:{t:g=>codexTalk(g), c:[{l:'Ask about rewards', req:g=>codexRewardsDue(g).length>0, go:'reward'},{l:'Say goodbye', go:'bye'}]},
  reward:{t:g=>claimCodexRewards(g), do:g=>flushGifts(g), end:true},
  bye:{t:'“Mind the tall grass,” the professor says, already back in a book.', end:true}
}});

SC('oldcatcher',{node:'route1', title:'The Old Catcher', auto:true, steps:{
  start:{t:'Halfway up Bramble Path, an old man in a straw hat sits on a fence rail watching the grass sway against the wind.\n\n“First time out? I can tell. Listen: a creature at full strength shrugs off a Capsule. Wear it down first. Put it to sleep if you can, and the throw gets easier.” He taps his wrist. “And a steady hand helps. Dexterity, the manuals call it.”',
    c:[{l:'Thank him and ask for spare supplies', chk:['persuasion',8], go:'gift', fail:'nogift'},{l:'Thank him and move on', go:'bye'}]},
  gift:{t:'He chuckles and digs in his coat. “Two Salves. Don’t tell my wife.”', do:g=>give(g,'salve',2), end:true},
  nogift:{t:'“Supplies? At my age, I am the supplies.” He waves you off, not unkindly.', end:true},
  bye:{t:'“Mind the Nibbits. They go for ankles.”', end:true}
}});

SC('lockedgym',{node:'greenspire', title:'The chained gym', req:g=>nb(g)<7, steps:{
  start:{t:'The Greenspire Gym’s doors are chained shut. A hand-lettered notice reads: LEADER ABSENT ON BUSINESS. CHALLENGERS, KINDLY GO ELSEWHERE.\n\nThe ground-floor shutters don’t quite meet.',
    c:[{l:'Peer through the gap in the shutters', chk:['investigation',13], go:'peek', fail:'caught'},{l:'Leave it be', go:'leave'}]},
  peek:{t:'Through the gap: an arena of packed red earth, and a desk stacked with letters. The top one is sealed with black wax pressed into the shape of a lantern. Someone here keeps strange correspondence.', do:g=>setF(g,'saw_lantern'), end:true},
  caught:{t:'“Oi.” A gate guard in a grey coat. “Gym’s closed. Move along.” He watches until you do.', end:true, keep:true},
  leave:{t:'You leave the chained doors to their business.', end:true, keep:true}
}});

SC('glint',{node:'greenwood', title:'Something glinting', steps:{
  start:{t:'Old oaks crowd the path. Off to the left, something catches the light between two roots.',
    c:[{l:'Search the roots carefully', chk:['perception',11], go:'found', fail:'stung'}]},
  found:{t:'Wedged under a root: a dropped trainer’s pouch with two Capsules and a Super Salve still inside.', do:g=>{ give(g,'capsule',2); give(g,'supersalve',1); }, end:true},
  stung:{t:'You reach in, and a Stingle reaches back.', c:[{l:'Fight it off', wild:['stingle',6], go:'found2'}]},
  found2:{t:'Once the Stingle is dealt with, you find what was glinting: a dropped pouch with a single Capsule in it.', do:g=>give(g,'capsule',1), end:true}
}});

SC('museum',{node:'cairnstone', title:'The Cairnstone Museum', steps:{
  start:{t:'The Cairnstone Museum of Natural History is mostly bones and one very proud meteorite. The curator, a thin woman in half-moon glasses, hovers beside it.\n\n“Skyfall, from Moonwell Caves,” she says. “There’s been digging in the caves these past weeks. Strangers in black coats with little lantern pins. They say they’re surveyors. Surveyors don’t carry crowbars.”',
    c:[{l:'Ask what they might be after', chk:['nature',10], go:'lore', fail:'nolore'},{l:'Thank her', go:'bye'}]},
  lore:{t:'“Fossils,” she says, “and meteor glass. Moon Stones, the old miners called them. Certain creatures change when they touch one.” She lowers her voice. “There are stories of older things in the deep caves, too. Things the lab on Cinderisle was very interested in, once.”', do:g=>setF(g,'lore_moon'), end:true},
  nolore:{t:'She launches into a forty-minute lecture on sediment. You learn a great deal about sediment.', end:true},
  bye:{t:'“Do come back. Nobody ever comes back.”', end:true}
}});

SC('gym1',{node:'cairnstone', title:'Cairnstone Gym', gym:true, req:g=>!hasBadge(g,'cairn'), steps:{
  start:{t:'Cairnstone Gym is a quarry pit with a roof. Boulders are arranged like seats in an amphitheatre. A gym trainer in a dusty apron blocks the way down.',
    c:[{l:'Battle the gym trainer', battle:'mason_tobin', go:'leader'},{l:'Talk your way past', chk:['persuasion',13], go:'leader', fail:'fight'}]},
  fight:{t:'“Nice try. Everybody battles their way down.”', c:[{l:'Battle the gym trainer', battle:'mason_tobin', go:'leader'}]},
  leader:{t:'At the bottom of the pit, Leader Dorrin sets down a chisel. Broad shoulders, chalk-white hands, and a face like a cliff that has just been told a mild joke.\n\n“Stone doesn’t hurry,” Dorrin says. “Let’s see if you can.”', c:[{l:'Challenge Leader Dorrin', battle:'dorrin', go:'win'}]},
  win:{t:'Dorrin nods slowly, the way mountains might. “You’ve got grit. That’s what this is.” The Cairn Badge is a chip of polished granite, warm from Dorrin’s pocket.\n\n“Moonwell Caves are east. My apprentices let badge-holders through. Mind the diggers.”', do:g=>badge(g,'cairn'), end:true}
}});

SC('diggers',{node:'moonwell', title:'Pickaxes in the deep', steps:{
  start:{t:'Deep in Moonwell Caves, two grunts in black coats are prying fossils out of the wall while a researcher in a torn lab coat flaps at them.\n\n“Those are two hundred thousand years old!”\n\n“Then they won’t mind a short trip,” says a grunt. Both wear little black lantern pins.',
    c:[{l:'Step in and challenge them', battle:'grunt_moon', go:'fossils'},
       {l:'Sneak behind them and grab the fossils', chk:['stealth',13], go:'sneak', fail:'spotted'},
       {l:'“Admin Lisk sent me. You’re late for shift change.”', chk:['deception',14], go:'bluff', fail:'spotted'}]},
  spotted:{t:'A grunt spins around. “Hey! It’s a kid!” He whistles, and a Dusklet drops from the ceiling.', c:[{l:'Battle the grunt', battle:'grunt_moon', go:'fossils'}]},
  sneak:{t:'You edge along the wall while the grunts argue about whose turn it is to carry the crowbar. When they look round, both fossils are gone, and so are you. The researcher scurries after you.', next:'fossils'},
  bluff:{t:'The grunts exchange a look. “Lisk? Ugh.” They shoulder their picks and trudge off toward the exit, leaving the fossils on a crate.', next:'fossils'},
  fossils:{t:'The researcher, Dr. Pell, gathers up the two fossils with shaking hands: a coiled shell and a hooked claw.\n\n“They wanted these for Umbra’s collectors,” he says. He pushes one toward you. “Take one. The other belongs in the Cairnstone museum. The lab on Cinderisle can revive fossils, if you ever get that far south.”',
    c:[{l:'Take the Spiral Fossil (a coiled shell)', go:'end', do:g=>giveKey(g,'fossil_spiral')},{l:'Take the Talon Fossil (a hooked claw)', go:'end', do:g=>giveKey(g,'fossil_talon')}]},
  end:{t:'Dr. Pell tucks the other fossil into his coat. “They call themselves Umbra. If you meet them again, be careful.”', do:g=>setF(g,'umbra_met'), end:true}
}});

SC('moonseam',{node:'moonwell', title:'A glittering seam', steps:{
  start:{t:'In a side passage, a seam of glassy rock glitters in the wall, pale as frost.',
    c:[{l:'Pry it loose', chk:['athletics',12], go:'got', fail:'fall'},{l:'Tap along it for the weak point first', chk:['investigation',12], go:'got', fail:'fall'}]},
  got:{t:'A chunk the size of your fist comes free, cool and faintly glowing. A Moon Stone.', do:g=>give(g,'moonstone',1), end:true},
  fall:{t:'A shower of loose rock comes down. Your lead partner shields you and takes the worst of it. When the dust clears, the seam has crumbled to nothing.', do:g=>hurt(g,8), end:true}
}});

SC('rival2',{node:'brightwater', title:'Lantern Bridge', auto:true, steps:{
  start:{t:'At the foot of Lantern Bridge, someone whistles. Corin, of course, sitting on the rail with a Pipwing on one shoulder.\n\n“Look who made it through the caves. I’ve got my second badge lined up already. Let’s see if you’ve learned anything.”',
    c:[{l:'Battle Corin', battle:'rival2', soft:true, go:'after'}]},
  after:{t:g=>(g.lastBattle==='win' ? 'Corin recalls their last partner and laughs a little too loudly. “Fine! Fine. You got lucky with the matchups.”' : 'Corin pockets the win with a grin. “Told you. You’re not bad. You’re just slower than me.”') +
    '\n\nThey lean in. “Heard Umbra’s been poking around Cape Thorn, north of the bridge. Some weirdo up there builds teleporters.” And they’re gone, jogging across the bridge.', end:true}
}});

SC('burglary',{node:'brightwater', title:'A burglary on Canal Row', steps:{
  start:{t:'Canal Row is in uproar. A houseboat’s cabin door hangs off one hinge. Its owner, a big man in a cardigan, is close to tears.\n\n“They took my Wisdom Fruits! A whole crate, grown from my grandmother’s tree! Black coats, little lantern pins. They ran north across Lantern Bridge.”',
    c:[{l:'Look for clues', chk:['investigation',11], go:'clue', fail:'promise'},{l:'Promise to get them back', go:'promise'}]},
  clue:{t:'Muddy bootprints, a dropped lantern pin, and a trail of crushed fruit leaves heading north. Whoever it was is on Cape Thorn, and in no particular hurry.', next:'promise'},
  promise:{t:'“That tree’s gone now,” he says. “Those fruits are all I have left of it. Please.”', do:g=>setF(g,'burglary_known'), end:true}
}});

SC('returnfruit',{node:'brightwater', title:'Return the Wisdom Fruits', req:g=>F(g,'burglar_caught'), steps:{
  start:{t:'You set the crate down on Canal Row. The owner opens it, sees the fruit, and sits down hard on his own doorstep.\n\n“Grandmother would insist,” he says, pressing two of them into your hands. “She always said they make a creature wiser. Faster to learn.”', do:g=>give(g,'wisdomfruit',2), end:true}
}});

SC('gym2',{node:'brightwater', title:'Brightwater Gym', gym:true, req:g=>!hasBadge(g,'tide'), steps:{
  start:{t:'Brightwater Gym is a long glass hall over a swimming pool. Floating platforms bob between you and the far end, where a figure in a racing swimsuit sits with her feet in the water.',
    c:[{l:'Hop across the platforms', chk:['acrobatics',11], go:'leader', fail:'splash'},{l:'Swim for it, and battle whoever stops you', battle:'swimmer_lia', go:'leader'}]},
  splash:{t:'The platform tips. You go in with a spectacular splash. A gym swimmer surfaces beside you, grinning. “Now you have to battle me.”', c:[{l:'Battle the swimmer', battle:'swimmer_lia', go:'leader'}]},
  leader:{t:'Leader Maris stands, dripping and delighted. “I love a splashy entrance! Water’s soft until it isn’t. Let’s see how you handle the current.”', c:[{l:'Challenge Leader Maris', battle:'maris', go:'win'}]},
  win:{t:'Maris laughs as her last partner returns to its capsule. “Smooth! You flowed with it.” The Tide Badge is a little blue enamel wave.\n\n“South of the city, the Underpass road runs down to Saltmere. Keep your eyes open. Umbra came through here last week.”', do:g=>badge(g,'tide'), end:true}
}});

SC('recruiter',{node:'capethorn', title:'The man in the good coat', steps:{
  start:{t:'At the far end of Lantern Bridge, a smiling man in a very good coat steps out from behind a signpost and presses a gold lantern pin into your palm before you can stop him.\n\n“Talent like yours, wasted on badges? Umbra pays. Benefits. Very flexible hours. Think about it.”',
    c:[{l:'Refuse, and battle him', battle:'umbra_recruiter', go:'refused'},
       {l:'Pretend to accept, and pocket the pin', chk:['deception',13], go:'pin', fail:'pinfail'},
       {l:'“Leave. Now.”', chk:['intimidation',14], go:'scared', fail:'pinfail'}]},
  refused:{t:'He straightens his coat. “A pity. The offer will not be repeated.” He drops the pin in the mud and walks off.', end:true},
  pin:{t:'“Wonderful!” He shakes your hand with both of his. “Someone will be in touch.” You now own an Umbra membership pin. It might open doors that are meant to stay shut.', do:g=>giveKey(g,'umbrapin'), end:true},
  pinfail:{t:'His smile doesn’t move, but his eyes do. “Ah. One of those.” He reaches for a capsule.', c:[{l:'Battle him', battle:'umbra_recruiter', go:'refused'}]},
  scared:{t:'Something in your voice makes him reconsider his entire career. He walks away quickly, then faster.', end:true}
}});

SC('burglar',{node:'capethorn', title:'Behind the lighthouse', steps:{
  start:{t:'Behind the lighthouse cottage, a grunt in a black coat sits on a crate, eating a very large, very purple fruit.',
    c:[{l:'“Those aren’t yours.”', battle:'grunt_burglar', go:'won'},{l:'Sneak up and make off with the crate', chk:['stealth',14], go:'stolen', fail:'caughtb'}]},
  caughtb:{t:'The grunt spits out a seed. “Hey! Get your own!”', c:[{l:'Battle the grunt', battle:'grunt_burglar', go:'won'}]},
  stolen:{t:'You’re three steps away with the crate before the grunt notices. He chases you twenty yards, gets winded, and gives up.', next:'won'},
  won:{t:'The grunt flees down the cliff path. Most of the Wisdom Fruits are still in the crate. With the thief gone, the Brightwater police will lift the tape on the Underpass road to the south. The owner on Canal Row will want his fruit back.', do:g=>setF(g,'burglar_caught'), end:true}
}});

SC('bram',{node:'capethorn', title:'The lighthouse cottage', steps:{
  start:{t:'The lighthouse cottage door is open. Inside, among cables and brass cylinders, a creature-shaped heap of fur and goggles waves at you frantically.\n\n“Oh, thank goodness! I’m Bram! I study capsule teleportation! I was testing my transfer pod with my Moonpuff and, well.” He gestures at himself: mostly Moonpuff. “When I step into the pod, pull the big lever. But set the dials first, please. Carefully.”',
    c:[{l:'Read the dials and set them correctly', chk:['investigation',11], go:'fixed', fail:'zap'},{l:'Just pull the lever and hope', chk:['luck',11], go:'fixed', fail:'zap'}]},
  zap:{t:'The pod sparks. Something smells of singed fur. Your lead partner, standing too close, yelps.', do:g=>hurt(g,6),
    c:[{l:'Try the dials again', chk:['investigation',9], go:'fixed', fail:'zap'}]},
  fixed:{t:'The pod hums, flashes, and Bram stumbles out: human, singed, and ecstatic. A very relieved Moonpuff tumbles out after him.\n\n“Marvellous! Here, I’ve no use for this. A ticket to the gala aboard the S.S. Meridian in Port Saltmere. Too many people. You go. Eat the little pastries.”', do:g=>giveKey(g,'ticket'), end:true}
}});

SC('meridian',{node:'saltmere', title:'The S.S. Meridian', req:g=>hasKey(g,'ticket'), steps:{
  start:{t:'The Meridian’s deck is strung with lanterns. A string quartet saws through a waltz while trainers from all over the region trade stories at every table. The captain is supposedly hosting, somewhere below decks.\n\nA steward checks your ticket and waves you aboard.',
    c:[{l:'Challenge the sailor bragging by the rail', battle:'sailor_brisk', go:'deck'},{l:'Head below decks to find the captain', go:'corridor'}]},
  deck:{t:'The sailor salutes, grudgingly. “Captain’s below. He’s been seasick since we docked. In harbor! Don’t tell him I said so.”', next:'corridor', nl:'Go below decks'},
  corridor:{t:'In the narrow corridor, someone blocks the way: Corin, in a borrowed jacket two sizes too big.\n\n“They let anyone on this boat, huh? Quick battle, then I’m going back for more pastries.”',
    c:[{l:'Battle Corin', battle:'rival3', soft:true, go:'captain'}]},
  captain:{t:'The captain’s cabin smells of brine and misery. The captain, a great bearded heap, lies groaning in his bunk.\n\n“Can’t stand the stillness. Thirty years at sea and a harbor does me in.”',
    c:[{l:'Brew him a ginger tonic in the galley', chk:['nature',12], go:'cured', fail:'rub'},{l:'Rub his back and tell him a sea story', chk:['persuasion',10], go:'cured', fail:'rub'}]},
  rub:{t:'It takes the whole evening and most of your patience, but eventually the captain sits up, pale but upright.', next:'cured'},
  cured:{t:'“Ahh. Better. Much better.” The captain fishes in a sea chest and presses something into your hands: a short, heavy machete in an oilskin sheath.\n\n“A Trail Blade. Cuts thornbrush like butter. You’ll want it east of Brightwater, and for the hedge round the Saltmere Gym. Don’t tell the harbormaster where you got it.”', do:g=>giveKey(g,'trailblade'), end:true}
}});

SC('gym3',{node:'saltmere', title:'Saltmere Gym', gym:true, req:g=>!hasBadge(g,'volt'), steps:{
  start:{t:g=>hasKey(g,'trailblade') ? 'Your Trail Blade bites through the thorn hedge around Saltmere Gym. Inside: a hangar of humming coils and a row of identical metal bins. A sign: THE DOOR OPENS WHEN BOTH SWITCHES ARE FOUND. HAVE FUN. — MAJOR VOSS.' : 'Saltmere Gym is walled in by a thorn hedge as thick as a ship’s rope. The entrance is somewhere on the other side. You’ll need something sharp.',
    c:[{l:'Work out the wiring pattern', req:g=>hasKey(g,'trailblade'), chk:['investigation',13], go:'leader', fail:'shock'},
       {l:'Battle the sailor guarding the bins for a hint', req:g=>hasKey(g,'trailblade'), battle:'sailor_duke', go:'hint'},
       {l:'Leave for now', req:g=>!hasKey(g,'trailblade'), go:'leave'}]},
  leave:{t:'The hedge rustles smugly behind you.', end:true, keep:true},
  shock:{t:'You flip the first switch, then the second. The first resets with a loud CLACK and a jolt that makes your partner’s fur stand on end.', do:g=>hurt(g,6),
    c:[{l:'Try again', chk:['investigation',12], go:'leader', fail:'shock'},{l:'Battle the sailor for a hint', battle:'sailor_duke', go:'hint'}]},
  hint:{t:'“The second switch is always next to the first one. Always.” The sailor shrugs. “The Major says that’s character building.”', next:'leader', nl:'Find the switches'},
  leader:{t:'The door hisses open. Major Voss fills most of the room: ex-navy, shoulders like a cargo crate, a voice that could call ships in through fog.\n\n“A kid with a badge collection! Lightning doesn’t negotiate, recruit. Let’s see you stand in it!”', c:[{l:'Challenge Leader Voss', battle:'voss', go:'win'}]},
  win:{t:'Voss roars with laughter. “Ha! You’ve got a spark! Take it!” The Volt Badge is a brass zigzag. “The road east of Brightwater runs through Gloomrock Tunnel. Dark as a coal sack in there. Bring patience.”', do:g=>badge(g,'volt'), end:true}
}});

SC('tunnel',{node:'gloomrock', title:'Find the way through', req:g=>!F(g,'tunnel_through'), steps:{
  start:{t:'Gloomrock Tunnel swallows the light a few steps in. Water drips. Wings rustle. Somewhere ahead is Ashgrove, if you can find it.',
    c:[{l:'Follow the draft of air on your face', chk:['survival',12], go:'through', fail:'lost'},{l:'Feel your way along the wall, step by step', chk:['perception',12], go:'through', fail:'lost'}]},
  lost:{t:'You take a wrong turn, then another. Something with far too many legs decides you are in its way.', c:[{l:'Fight your way out', wild:'node', go:'through2'}]},
  through2:{t:'Past the scuffle, the air changes: cooler, with a faint smell of chimney smoke. Light, ahead.', next:'through'},
  through:{t:'You come out blinking onto a hillside. Below lies Ashgrove: grey roofs, a cemetery, and a dark tower like a held breath.', do:g=>setF(g,'tunnel_through'), end:true}
}});

SC('fawn',{node:'ashgrove', title:'The fawn at the door', auto:true, steps:{
  start:{t:'Ashgrove is quiet in the way of places that have had to learn it. In the Haven, a small spotted fawn lies curled against the door, refusing food.\n\n“Fawnlet,” the nurse says softly. “Its mother was a Hearthstag who lived in the Hollow Spire. Umbra poachers killed her for her antlers. Elder Tamsin went up the Spire two days ago to talk them out of it. She hasn’t come down.”',
    c:[{l:'Kneel and try to comfort the Fawnlet', chk:['nature',11], go:'calm', fail:'shy'},{l:'Ask about the Spire', go:'spire'}]},
  calm:{t:'You keep low and still and let it come to you. After a long minute, Fawnlet presses its nose into your palm. The nurse blinks. “It hasn’t done that for anyone.”', do:g=>setF(g,'fawn_trust'), next:'spire'},
  shy:{t:'Fawnlet scrambles behind the nurse’s desk. “Give it time,” the nurse says.', next:'spire'},
  spire:{t:'“The Spire is a tower of remembrance,” the nurse says. “People say it’s haunted. Lately they say it louder. Something on the third floor won’t let anyone pass. You can’t see it. You can only feel it.”', do:g=>setF(g,'spire_known'), end:true}
}});

SC('spire',{node:'ashgrove', title:'Climb the Hollow Spire', req:g=>F(g,'spire_known') && !F(g,'elder_rescued'), steps:{
  start:{t:g=>hasKey(g,'lens') ? 'The Hollow Spire’s lower floors are crowded with old stones and older candles. You climb with the Lens of Sight in your hand.' : 'The Hollow Spire’s lower floors are crowded with old stones and older candles. On the third floor the air turns cold enough to sting. Something is standing on the stairs. You can’t see it. You can only feel it staring.',
    c:[{l:'Push past it', req:g=>!hasKey(g,'lens'), chk:['wis',15], go:'pushed', fail:'fled'},
       {l:'Retreat', req:g=>!hasKey(g,'lens'), go:'fled'},
       {l:'Climb on', req:g=>hasKey(g,'lens'), go:'rival'}]},
  pushed:{t:'You force one foot onto the stair, then another. The cold doesn’t stop you. It simply doesn’t let you see. You stumble on the landing and lose all sense of which way is up. Whatever it is, you’ll need a way to see it.', end:true, keep:true},
  fled:{t:'You back down the stairs. Your partners are shivering. Whatever is up there, you’ll need a way to see it.', end:true, keep:true},
  rival:{t:'On the second floor, Corin is crouched beside a small grave marker with their sleeves rolled up, scrubbing moss off the stone. They stand up fast when they see you.\n\n“Don’t. It’s my first partner. A Pipwing. Ages ago.” A breath. “Whatever. You’re here for the ghost thing? Battle me first. I need to hit something.”',
    c:[{l:'Battle Corin', battle:'rival4', soft:true, go:'ghost'},{l:'Sit with them a moment instead', chk:['insight',12], go:'quiet', fail:'battlequiet'}]},
  quiet:{t:'You sit on the cold step beside them and say nothing at all. After a while, Corin laughs, wet-eyed. “You’re weird.” They stand. “Go on. Go get the Elder. I’ll battle you some other time.”', do:g=>setF(g,'corin_bond'), next:'ghost'},
  battlequiet:{t:'Corin waves you off. “Don’t look at me like that. Battle.”', c:[{l:'Battle Corin', battle:'rival4', soft:true, go:'ghost'}]},
  ghost:{t:'On the third floor, the Lens of Sight shows you what the cold was: a Hearthstag made of smoke and grief, antlers gone, eyes like banked coals. It lowers its head at you.',
    c:[{l:'“Your fawn is safe. You can rest now.”', chk:['persuasion',14], adv:g=>F(g,'fawn_trust'), go:'rest', fail:'angry'},{l:'Battle the spirit to free it', battle:'stagspirit_t', go:'rest2'}]},
  angry:{t:'The spirit rears, and every candle in the room goes out at once.', c:[{l:'Battle the spirit', battle:'stagspirit_t', go:'rest2'}]},
  rest:{t:'The spirit looks at you for a long moment. Then it bows its head, and is simply gone. The candles flicker back to life, one by one.', do:g=>gainInsp(g), next:'top', nl:'Climb to the top'},
  rest2:{t:'The spirit falters, sways, and dissolves into the candlelight. It doesn’t feel like winning. It feels like something being allowed to stop.', next:'top', nl:'Climb to the top'},
  top:{t:'At the top of the Spire, two Umbra grunts have Elder Tamsin backed against a window. She is very old, very small, and visibly unimpressed.\n\n“Look, lady,” says a grunt, “we’re just here for the antlers, okay? Where are the antlers?”\n\n“You took them already,” says the Elder. “Idiots.”',
    c:[{l:'Battle the grunts', battle:'grunt_spire', go:'saved'},{l:'Flash the Umbra pin: “Director wants you downstairs. Now.”', req:g=>hasKey(g,'umbrapin'), chk:['deception',12], go:'bluffed', fail:'bluffail'}]},
  bluffail:{t:'“The Director’s in Verdance, genius.” Out come the capsules.', c:[{l:'Battle the grunts', battle:'grunt_spire', go:'saved'}]},
  bluffed:{t:'They’re down the stairs before either of them thinks to ask why the Director would send a child.', next:'saved'},
  saved:{t:'Elder Tamsin dusts off her shawl. “Took your time. Thank you, dear.” She takes your hand in both of hers, light as paper.\n\n“Two things. This bell: ring it near anything that’s been sleeping too long. And this note, for the guards at the Aurum City gates. They owe me a favor, the poor dears.”', do:g=>{ giveKey(g,'bell'); giveKey(g,'pass'); setF(g,'elder_rescued'); }, next:'fawnjoin', nl:'Walk the Elder home'},
  fawnjoin:{t:'Back at the Haven, Fawnlet is standing by the door. When it sees you, it walks over, sits at your feet, and does not leave.\n\n“Well,” says the nurse. “That’s decided, then.”', do:g=>gift(g,'fawnlet',25), end:true}
}});

SC('hideout',{node:'verdance', title:'The Lucky Lantern’s back room', req:g=>!hasKey(g,'lens'), steps:{
  start:{t:'The Lucky Lantern never closes. Dice clatter, bells ring, and at the back a grunt in a black coat stands guard beside a poster that is very slightly crooked.',
    c:[{l:'Watch the grunt and the poster', chk:['perception',12], go:'switch', fail:'noticed'},{l:'Walk up and battle the grunt', battle:'grunt_casino1', go:'switch2'}]},
  noticed:{t:'The grunt notices you noticing. “Can I help you?” He doesn’t wait for an answer.', c:[{l:'Battle the grunt', battle:'grunt_casino1', go:'switch2'}]},
  switch:{t:'When the grunt steps out for some air, you lift the poster. Behind it: a switch. A section of wall slides away onto a stairwell.', next:'stairs', nl:'Go down'},
  switch2:{t:'The grunt drops a keyring as he runs. One key fits a lock hidden behind the crooked poster. A section of wall slides away onto a stairwell.', next:'stairs', nl:'Go down'},
  stairs:{t:'The hideout below is all concrete and humming strip lights. A second grunt guards a lift, and the lift only goes down.',
    c:[{l:'Battle the lift guard', battle:'grunt_casino2', go:'lisk'},{l:'Slip past while she checks her phone', chk:['stealth',14], go:'lisk', fail:'guard'}]},
  guard:{t:'“Nope.”', c:[{l:'Battle the lift guard', battle:'grunt_casino2', go:'lisk'}]},
  lisk:{t:'At the bottom of the lift, a lean figure in a long grey coat leans against a crate of stolen capsules, peeling an orange. A silver lantern on the lapel: Admin Lisk.\n\n“The kid from Moonwell. Pell wouldn’t shut up about you.” A segment of orange. “The Director’s busy. Let’s keep you busy too.”',
    c:[{l:'Battle Admin Lisk', battle:'lisk1', go:'vane'}]},
  vane:{t:'Behind a heavy door, an office carved out of black stone. A man in a charcoal suit sits at the desk, writing. He doesn’t look up.\n\n“A child in my basement,” says Cassius Vane, Director of Umbra. “My people have become very poor at their jobs.” He caps his pen. “Very well. A short lesson.”',
    c:[{l:'Battle Director Vane', battle:'vane1', go:'after'}]},
  after:{t:'Vane recalls his last partner without a flicker of expression. “Interesting.” He slides a velvet case across the desk. Inside: a lens of smoky glass in a brass frame.\n\n“The Lens of Sight. We borrowed it from Silvane for the Ashgrove business. Keep it. Consider it a loan.” He rises, steps through a door you are sure was not there a moment ago, and is gone.', do:g=>giveKey(g,'lens'), end:true}
}});

SC('gym4',{node:'verdance', title:'Verdance Gym', gym:true, req:g=>!hasBadge(g,'bloom'), steps:{
  start:{t:g=>hasKey(g,'trailblade') ? 'Verdance Gym is a glasshouse thick with perfume. Your Trail Blade makes short work of the thornbush over the door. Inside, trainers in gardening aprons tend rows of sleeping flowers.' : 'Verdance Gym is a glasshouse thick with perfume, and a thornbush has grown right over its door. You’ll need a blade.',
    c:[{l:'Tiptoe through the flowerbeds without waking anything', req:g=>hasKey(g,'trailblade'), chk:['stealth',12], go:'leader', fail:'wake'},
       {l:'Battle the gardener at the gate', req:g=>hasKey(g,'trailblade'), battle:'gardener_ivy', go:'leader'},
       {l:'Leave for now', req:g=>!hasKey(g,'trailblade'), go:'leave'}]},
  leave:{t:'The thornbush stays exactly where it is.', end:true, keep:true},
  wake:{t:'A flower opens. Then all of them open. A gardener sighs and puts down her watering can.', c:[{l:'Battle the gardener', battle:'gardener_ivy', go:'leader'}]},
  leader:{t:'Leader Liora is pruning a tiny tree with tiny scissors. She looks up and smiles, unhurried.\n\n“Oh, a challenger. Mind the roses, they bite. Shall we?”', c:[{l:'Challenge Leader Liora', battle:'liora', go:'win'}]},
  win:{t:'“Lovely. Truly.” Liora presses the Bloom Badge into your palm, a little enamel flower. “If you’re heading for Fenmarsh, the Skyway Road starts east of here. Though last I heard, something very large was asleep on it.”', do:g=>badge(g,'bloom'), end:true}
}});

SC('slumber',{node:'verdance', title:'The sleeper on the Skyway', req:g=>!F(g,'slumberoth_cleared'), steps:{
  start:{t:'At the foot of the Skyway Road lies a Slumberoth the size of a cottage, snoring gently across both lanes. A small crowd has gathered to complain about it.',
    c:[{l:'Try to shove it out of the way', req:g=>!hasKey(g,'bell'), chk:['athletics',25], go:'wake', fail:'nope'},{l:'Ring the Waking Bell', req:g=>hasKey(g,'bell'), go:'wake'}]},
  nope:{t:'You push. It sighs contentedly. Somewhere in the crowd, someone mentions an old bell the Elder of Ashgrove keeps.', end:true, keep:true},
  wake:{t:'The bell’s note is thin and clear. One enormous eye opens, then the other. The Slumberoth stands, yawns a yawn you can feel in your teeth, and looks at you with tremendous annoyance.',
    c:[{l:'Battle it', wild:['slumberoth',30], go:'cleared'}]},
  cleared:{t:g=>(g.lastBattle==='caught' ? 'The capsule rocks once and goes still. The crowd applauds, then disperses to complain about something else.' : 'The Slumberoth lumbers off the road into the trees and lies down there instead.') + ' The Skyway Road is clear.', do:g=>setF(g,'slumberoth_cleared'), end:true}
}});

SC('warden',{node:'fenmarsh', title:'Warden Okono', req:g=>!hasKey(g,'tidecharm'), steps:{
  start:{t:g=>hasKey(g,'compass') ? 'Warden Okono sees the compass in your hand and is on his feet before you can say anything.' : 'Warden Okono of the Wildreach Preserve is sitting on the steps of the ranger station, turning out his pockets for the third time.\n\n“My compass. My father’s compass. Lost it somewhere in the Preserve. Can’t run the Preserve without it. Can’t find it without running the Preserve.”',
    c:[{l:'Offer to search the Preserve for it', req:g=>!hasKey(g,'compass') && !F(g,'compass_quest'), go:'ok'},{l:'Hand over the compass', req:g=>hasKey(g,'compass'), go:'reward'},{l:'Leave', req:g=>!hasKey(g,'compass') && F(g,'compass_quest'), go:'later'}]},
  ok:{t:'“You would? Bless you. If you find it, there’s something in it for you. Something for crossing water.”', do:g=>setF(g,'compass_quest'), end:true, keep:true},
  later:{t:'“Any luck? No? Keep looking. It’s brass. It’s the only brass thing in there.”', end:true, keep:true},
  reward:{t:'Okono turns the compass over in his hands and has to sit back down. “Thank you.”\n\nHe unhooks a charm from his belt: a curl of shell on a cord. “A Tide Charm. Hold it over the water and the current will carry you where you need to go. The Rimefrost Isles, Cinderisle, the old Stormworks. Go carefully.”', do:g=>{ delete g.keys.compass; giveKey(g,'tidecharm'); }, end:true}
}});

SC('compass',{node:'wildreach', title:'Search for the warden’s compass', req:g=>F(g,'compass_quest') && !hasKey(g,'compass') && !hasKey(g,'tidecharm'), steps:{
  start:{t:'The Preserve is tall grass, reed beds and shallow lagoons, all of it moving. Somewhere in here is one brass compass.',
    c:[{l:'Track the warden’s route from this morning', chk:['survival',13], go:'found', fail:'rustle'},{l:'Search the reed beds by the lagoon', chk:['perception',14], go:'found', fail:'rustle'}]},
  rustle:{t:'Something in the grass rustles toward you. Fast.', c:[{l:'Face it', wild:'node', go:'retry'}]},
  retry:{t:'The trail’s gone cold here. You’ll have to keep looking.', end:true, keep:true},
  found:{t:'Half-buried in the mud by a lagoon: a brass compass, its needle swinging hard toward the ranger station.', do:g=>giveKey(g,'compass'), end:true}
}});

SC('gym5',{node:'fenmarsh', title:'Fenmarsh Gym', gym:true, req:g=>!hasBadge(g,'marsh'), steps:{
  start:{t:'Fenmarsh Gym looks empty: one wide hall with a polished floor. You take three steps and walk face-first into a wall that isn’t there.',
    c:[{l:'Watch for the faint shimmer of the hidden walls', chk:['perception',13], go:'leader', fail:'bump'},{l:'Battle the trainer in the corner for directions', battle:'juggler_nym', go:'leader'}]},
  bump:{t:'You find every single wall with your nose. A gym trainer, unable to bear it any longer, steps out of hiding to challenge you.', c:[{l:'Battle the trainer', battle:'juggler_nym', go:'leader'}]},
  leader:{t:'Leader Sable steps out of a shadow you would have sworn was empty. Grey scarf, quiet voice.\n\n“Poison is patience. Let’s see if you have any.”', c:[{l:'Challenge Leader Sable', battle:'sable', go:'win'}]},
  win:{t:'Sable inclines their head. “You waited well.” The Marsh Badge is a dark green bead on a silver pin.', do:g=>badge(g,'marsh'), end:true}
}});

SC('silvane',{node:'aurum', title:'The Silvane tower', req:g=>!F(g,'silvane_freed'), steps:{
  start:{t:'The Silvane Corporation tower has a black lantern banner hanging down its face. Umbra grunts stand at every corner of the plaza.\n\nIn the lobby, a receptionist whispers without moving her lips: “They’ve locked the staff on the upper floors. They want the president’s prototype. The Absolute Capsule.”',
    c:[{l:'Take the service stairs', chk:['stealth',14], go:'floor5', fail:'lobby'},{l:'Fight through the lobby', battle:'grunt_silvane1', go:'floor5'},{l:'Flash the Umbra pin and walk in like you own the place', req:g=>hasKey(g,'umbrapin'), chk:['deception',12], go:'floor5', fail:'lobby'}]},
  lobby:{t:'A grunt blocks the stairwell. “Visitors sign in. With me.”', c:[{l:'Battle the grunt', battle:'grunt_silvane1', go:'floor5'}]},
  floor5:{t:'On the fifth floor, a guard dozes against a locked door with a card key clipped to his belt.',
    c:[{l:'Lift the card key without waking him', chk:['dex',13], go:'card', fail:'wakes'},{l:'Wake him and take it the hard way', battle:'guard_silvane', go:'card'}]},
  wakes:{t:'He wakes mid-snore with a hand already on a capsule.', c:[{l:'Battle the guard', battle:'guard_silvane', go:'card'}]},
  card:{t:'The card key opens the stairwell to the upper floors. On seven, you hear shouting.', do:g=>giveKey(g,'cardkey'), next:'floor7', nl:'Run up'},
  floor7:{t:g=>'Corin is pinned in a corridor by two grunts, holding them off with one tired partner. When you round the corner, the grunts decide they would rather not face two of you.\n\n' + (F(g,'corin_bond') ? 'Corin wipes their forehead. “Had it handled.” A pause. “Thanks. Look, Vane’s upstairs. Battle me first. I need to know if you’re ready. I need to know if I am.”' : 'Corin wipes their forehead. “Had it handled. Battle me. Now. If you can’t beat me, you can’t beat Vane.”'),
    c:[{l:'Battle Corin', battle:'rival5', soft:true, go:'floor11'}]},
  floor11:{t:'The eleventh floor is a humming server room. Admin Lisk sits on top of a rack, swinging their legs.\n\n“You again. Vane said you’d come. Vane says a lot of things.” A sigh. “Fine.”', c:[{l:'Battle Admin Lisk', battle:'lisk2', go:'lisk'}]},
  lisk:{t:'Lisk recalls their partner and, for a moment, looks very tired. “He’s going to burn this region down for one creature, you know. The thing from the Cinderisle lab.” They toss you a keycard. “Boardroom. Top floor. I was never here.”', do:g=>setF(g,'lisk_turned'), next:'boardroom', nl:'Go to the top floor'},
  boardroom:{t:'The president of Silvane is tied to his own chair. Cassius Vane stands at the window, looking north.\n\n“Silvane was a convenience,” he says, without turning. “The Absolute Capsule was built for something nothing else can hold. You wouldn’t understand.” He turns. “Let me show you why it doesn’t matter.”',
    c:[{l:'Battle Director Vane', battle:'vane2', go:'after'}]},
  after:{t:'Vane’s last partner falls. He straightens his cuffs. “Umbra is patient,” he says, and walks out onto the roof, where a helicopter is already lifting.\n\nThe president of Silvane, freed, presses a small white capsule into your hands. “The Absolute Capsule. It never fails. Use it on something that deserves it.”', do:g=>{ give(g,'absolute',1); setF(g,'silvane_freed'); }, end:true}
}});

SC('gym6',{node:'aurum', title:'Aurum Gym', gym:true, req:g=>!hasBadge(g,'mind'), steps:{
  start:{t:g=>F(g,'silvane_freed') ? 'Aurum Gym is a maze of identical rooms joined by teleport pads. Hum. Flash. You’re back where you started.' : 'The doors of Aurum Gym are shut. A note in careful handwriting: CLOSED UNTIL MY STUDENTS ARE RETURNED. Umbra grunts lounge on the steps outside.',
    c:[{l:'Map the pads and find the pattern', req:g=>F(g,'silvane_freed'), chk:['investigation',14], go:'leader', fail:'lostpads'},
       {l:'Battle the psychic who keeps appearing behind you', req:g=>F(g,'silvane_freed'), battle:'psychic_ora', go:'leader'},
       {l:'Leave', req:g=>!F(g,'silvane_freed'), go:'leave'}]},
  leave:{t:'Whatever is happening in the Silvane tower, the gym is waiting on it.', end:true, keep:true},
  lostpads:{t:'Flash. Flash. Flash. You meet the same gym trainer three times. On the fourth, she challenges you out of pity.', c:[{l:'Battle the psychic', battle:'psychic_ora', go:'leader'}]},
  leader:{t:'Leader Seren sits cross-legged in the air, a hand’s width off the floor. Pale, still, unblinking.\n\n“I saw you coming three days ago. Umbra held my students until you climbed that tower.” A tilt of the head. “I did not see how this ends. I am curious.”', c:[{l:'Challenge Leader Seren', battle:'seren', go:'win'}]},
  win:{t:'Seren lowers to the floor. “Ah. That is how it ends.” The Mind Badge is a disc of gold, warm to the touch. “Something on Cinderisle dreams very loudly. Be careful when you go.”', do:g=>badge(g,'mind'), end:true}
}});

SC('mansion',{node:'cinderisle', title:'The burnt mansion', req:g=>!hasKey(g,'mansionkey') && !hasBadge(g,'cinder'), steps:{
  start:{t:'The Cinderisle mansion burned twenty years ago and nobody rebuilt it. The roof is gone. The stairs are not. Journals lie where they fell, swollen with damp.',
    c:[{l:'Read the journals', chk:['investigation',12], go:'journal', fail:'journalpart'},{l:'Skip them and search the study', go:'key'}]},
  journal:{t:'July 10. We found the fragment in the caves under Cape Thorn. It is alive, in its way.\n\nFebruary 6. The creature grown from the fragment is stronger than anything we can measure. We have named it Nyxion.\n\nSeptember 1. Umbra’s money has run out, and their Director is impatient. Nyxion is too strong. We cannot hold it.\n\nSeptember 9. It is gone. It went north, under the water.', do:g=>setF(g,'lore_nyxion'), next:'key', nl:'Search the study'},
  journalpart:{t:'Most of the ink has run. You make out one word, over and over: Nyxion.', next:'key', nl:'Search the study'},
  key:{t:'In the ashes of the study, something glints in a burnt desk drawer.',
    c:[{l:'Force the drawer', chk:['athletics',12], go:'gotkey', fail:'burglar'},{l:'Pick the lock', chk:['dex',12], go:'gotkey', fail:'burglar'}]},
  burglar:{t:'The drawer screeches. “Hey! That’s my drawer!” A burglar who was clearly here first steps out of the shadows.', c:[{l:'Battle the burglar', battle:'burglar_tess', go:'gotkey'}]},
  gotkey:{t:'Inside the drawer: an old iron key on a ring labelled GYM.', do:g=>giveKey(g,'mansionkey'), end:true}
}});

SC('fossil',{node:'cinderisle', title:'The fossil lab', repeat:true, req:g=>hasKey(g,'fossil_spiral')||hasKey(g,'fossil_talon'), steps:{
  start:{t:'The Cinderisle Lab hums with refrigerators. A researcher sees the fossil in your hands and her eyes light up. “Oh, we can revive that. It takes a little while.”', c:[{l:'Hand over the fossil and wait', go:'done'}]},
  done:{t:g=>`“A little while” turns out to be about an hour. The researcher comes back with a capsule. Inside, blinking at a world two hundred thousand years newer, is a living ${hasKey(g,'fossil_spiral') ? 'Spiralith' : 'Raptoryx'}.`,
    do:g=>{ const k = hasKey(g,'fossil_spiral') ? 'spiral' : 'talon'; delete g.keys['fossil_' + k]; setF(g,'revived'); setF(g,'revived_' + k); gift(g, k === 'spiral' ? 'spiralith' : 'raptoryx', 30); }, end:true}
}});

SC('gym7',{node:'cinderisle', title:'Cinderisle Gym', gym:true, req:g=>!hasBadge(g,'cinder'), steps:{
  start:{t:g=>hasKey(g,'mansionkey') ? 'The iron key from the mansion turns in the gym’s lock. Inside, a door blocks the way, with a brass speaking-tube beside it. A voice crackles out: “QUIZ TIME! Answer right and the door opens! Answer wrong and you battle my students! HA!”' : 'Cinderisle Gym is locked. A sign: KEY IS IN THE MANSION. I FORGET WHERE. — BLAISE',
    c:[{l:'Lean in to the speaking-tube', req:g=>hasKey(g,'mansionkey'), go:'q1'},{l:'Leave', req:g=>!hasKey(g,'mansionkey'), go:'leave'}]},
  leave:{t:'The burnt mansion stands on the hill above the town.', end:true, keep:true},
  q1:{t:'“Question one! Which type of attack is strong against Fire?”', c:[{l:'Water', go:'q2'},{l:'Grass', go:'q1x'},{l:'Ice', go:'q1x'}]},
  q1x:{t:'“WRONG!” A trainer in a fireproof suit steps out of a side door.', c:[{l:'Battle the firebreather', battle:'fire_jo', go:'q2'}]},
  q2:{t:'“Question two! Which type is completely unaffected by Electric attacks?”', c:[{l:'Flying', go:'q2x'},{l:'Ground', go:'q3'},{l:'Rock', go:'q2x'}]},
  q2x:{t:'“WRONG AGAIN!” Another firebreather.', c:[{l:'Battle the firebreather', battle:'fire_al', go:'q3'}]},
  q3:{t:'“Final question! What does a Hyper Capsule add to your capture roll?”', c:[{l:'+3', go:'q3x'},{l:'+6', go:'leader'},{l:'+10', go:'q3x'}]},
  q3x:{t:'“So close! Not really!”', c:[{l:'Battle the firebreather', battle:'fire_mo', go:'leader'}]},
  leader:{t:'The last door opens onto a crater floor of black glass. Leader Blaise, bald, mirrored goggles, coat smoking slightly, throws his arms wide.\n\n“HA! You made it! Did you bring burn salve? No? Too bad! Let’s GO!”', c:[{l:'Challenge Leader Blaise', battle:'blaise', go:'win'}]},
  win:{t:'“Hot! HOT! You burned me right up!” Blaise slaps the Cinder Badge into your hand, a chip of black volcanic glass. “I hear the Greenspire Gym opened its doors this week. Odd. Nobody’s seen its leader in years.”', do:g=>badge(g,'cinder'), end:true}
}});

SC('gym8',{node:'greenspire', title:'Greenspire Gym', gym:true, req:g=>nb(g)>=7 && !hasBadge(g,'earth'), steps:{
  start:{t:'The chains are gone from the Greenspire Gym. The doors stand open. Inside is the arena of red earth you glimpsed once through a shutter, and on a dais at the far end, a man in a charcoal suit.\n\n“I did tell you Umbra was patient,” says Cassius Vane. “I am also the eighth gym leader of Halcyon. Did you never wonder why nobody had seen me?”',
    c:[{l:'“Why?”', chk:['insight',13], go:'why', fail:'nowhy'},{l:'Challenge him', go:'fight'}]},
  why:{t:'He is quiet a moment. “Because I helped build this region’s League,” he says, “and it hands children ribbons while the strongest creature ever made hides under a lake. I wanted to hold it. Just once.” He removes his jacket and folds it neatly over the dais rail. “Enough.”', next:'fight', nl:'Face him'},
  nowhy:{t:'“Enough talk.” He removes his jacket and folds it neatly over the dais rail.', next:'fight', nl:'Face him'},
  fight:{t:'Vane steps down onto the red earth.', c:[{l:'Challenge Leader Vane', battle:'vane3', go:'win'}]},
  win:{t:'Vane looks at his fallen partners for a long moment. “So that is what it looks like. Being beaten by someone who means it.” He holds out the Earth Badge, a disc of red clay. “Umbra is finished. I’ll tell them myself.”\n\nAt the door he pauses. “The creature from Cinderisle is in the Hollow Below, under Cape Thorn. You’ll want to be champion before you go looking. So will I.”', do:g=>badge(g,'earth'), end:true}
}});

SC('rival6',{node:'summitpass', title:'The badge gate', auto:true, steps:{
  start:{t:'At the badge gate, Corin is waiting, sitting on a boulder with their feet dangling. They look older than they did in the lab. So, probably, do you.\n\n“Eight badges,” they say. “Me too. Last time before the League. Make it count.”', c:[{l:'Battle Corin', battle:'rival6', soft:true, go:'after'}]},
  after:{t:g=>(g.lastBattle==='win' ? '“Yeah,” Corin says quietly. “Yeah, you’re good.”' : '“Still got it,” Corin says, but they don’t sound as pleased as they used to.') + ' They hop off the boulder. “See you at the top.” And they’re gone up the pass.', end:true}
}});

SC('boulder',{node:'summitpass', title:'The boulder on the switch', req:g=>!F(g,'pass_cleared'), steps:{
  start:{t:'Summit Pass is a cave climb choked with boulders. One sits squarely across the path to the upper level, beside a floor switch that looks like it wants a boulder on it.',
    c:[{l:'Shove the boulder onto the switch yourself', chk:['athletics',15], go:'done', fail:'strain'},{l:'Have your strongest partner push it', req:g=>topLevel(g)>=40, go:'partner'}]},
  strain:{t:'You strain until your vision sparkles. The boulder considers moving, then decides against it.',
    c:[{l:'Try again', chk:['athletics',13], go:'done', fail:'strain'},{l:'Have your strongest partner push it', req:g=>topLevel(g)>=40, go:'partner'},{l:'Come back later', go:'later'}]},
  later:{t:'The boulder will still be there.', end:true, keep:true},
  partner:{t:g=>`${strongestName(g)} puts its shoulder to the rock and walks it onto the switch like it’s nothing.`, next:'done'},
  done:{t:'Somewhere above, a gate grinds open. The path to the plateau is clear.', do:g=>setF(g,'pass_cleared'), end:true}
}});

SC('pyreon',{node:'summitpass', title:'A heat shimmer', repeat:true, req:g=>F(g,'pass_cleared') && !F(g,'legend_pyreon'), steps:{
  start:{t:'Deep in a side tunnel the air ripples with heat. Embers drift upward against the draft.', c:[{l:'Follow the embers', go:'nest'},{l:'Leave it', go:'leave'}]},
  leave:{t:'You leave the embers to their drifting.', end:true, keep:true},
  nest:{t:'In a cavern lit orange from within, a great bird of flame lifts its head from a nest of cinders. Pyreon. It regards you with something like curiosity.', c:[{l:'Approach it', wild:['pyreon',50], go:'gone', fled:'flee'}]},
  flee:{t:'You back away. Pyreon settles, watching you go. It will still be here.', end:true, keep:true},
  gone:{t:g=>g.lastBattle==='caught' ? 'Pyreon is yours. Its capsule stays warm for days.' : 'Pyreon bursts upward through a crack in the ceiling. Embers drift down for an hour. It will come back to its nest.', do:g=>{ if (g.lastBattle==='caught') setF(g,'legend_pyreon'); }, end:true}
}});

SC('frostwing',{node:'rimefrost', title:'The inner grotto', repeat:true, req:g=>!F(g,'legend_frostwing'), steps:{
  start:{t:'The innermost grotto of the Rimefrost Isles lies behind a channel where the current runs like a river.',
    c:[{l:'Swim the channel with your partners', chk:['athletics',14], go:'grotto', fail:'swept'},{l:'Read the tides and wait for slack water', chk:['survival',13], go:'grotto', fail:'swept'}]},
  swept:{t:'The current takes you, rolls you, and spits you out on a beach a hundred yards back. Your lead partner drags you ashore, exhausted.', do:g=>hurt(g,12), end:true, keep:true},
  grotto:{t:'In a cave of blue ice, a bird made of frost and light unfolds its wings. Frostwing. The air around it glitters with snow that hasn’t fallen yet.', c:[{l:'Approach it', wild:['frostwing',50], go:'gone', fled:'flee'}]},
  flee:{t:'You retreat across the channel. Frostwing watches you all the way.', end:true, keep:true},
  gone:{t:g=>g.lastBattle==='caught' ? 'Frostwing is yours. Frost forms on its capsule even in the sun.' : 'Frostwing rises through a shaft in the ice and is gone. Outside, it begins to snow. It will return to the grotto.', do:g=>{ if (g.lastBattle==='caught') setF(g,'legend_frostwing'); }, end:true}
}});

SC('stormcrest',{node:'stormworks', title:'The turbine hall', repeat:true, req:g=>!F(g,'legend_stormcrest'), steps:{
  start:{t:'The Old Stormworks has been dead for a decade. Dead, except for the crackle in the turbine hall.',
    c:[{l:'Restore power to the main circuit', chk:['investigation',13], go:'hall', fail:'sparks'},{l:'Climb the gantry to the turbine hall', chk:['athletics',13], go:'hall', fail:'sparks'}]},
  sparks:{t:'A junction box explodes in a shower of sparks. Your lead partner takes the jolt meant for you.', do:g=>hurt(g,10), end:true, keep:true},
  hall:{t:'The turbines spin up with a roar, and at the top of the great coil something wakes: a bird of storm-blue feathers, crackling with light. Stormcrest.', c:[{l:'Approach it', wild:['stormcrest',50], go:'gone', fled:'flee'}]},
  flee:{t:'You back out of the hall. The coil goes on crackling.', end:true, keep:true},
  gone:{t:g=>g.lastBattle==='caught' ? 'Stormcrest is yours. Its capsule makes your hair stand on end.' : 'Stormcrest bursts through the skylight in a sheet of lightning. The turbines wind down behind it. The coil will call it back.', do:g=>{ if (g.lastBattle==='caught') setF(g,'legend_stormcrest'); }, end:true}
}});

SC('league',{node:'league', title:'Challenge the Summit League', repeat:true, req:g=>!F(g,'champion'), steps:{
  start:{t:'The Summit League stands on the plateau like a lighthouse. Inside are five doors in a row, each with a name above it. There is no Haven between them. Whatever you carry in, you carry all the way.', c:[{l:'Open the first door', go:'e1'},{l:'Not yet', go:'notyet'}]},
  notyet:{t:'You step back outside. The doors will wait.', end:true},
  e1:{t:'WREN. The room is a sheet of blue ice. Wren, wrapped in white furs, smiles thinly. “Cold makes everything honest. Show me.”', c:[{l:'Battle Elite Wren', battle:'e_wren', go:'e2', rematch:true}]},
  e2:{t:'BRANN. A sparring hall that smells of sweat and liniment. Brann cracks his neck. “No tricks. Just hands.”', c:[{l:'Battle Elite Brann', battle:'e_brann', go:'e3', rematch:true}]},
  e3:{t:'MORWEN. Candles, and a long table set for a dinner nobody came to. Morwen does not stand. “Sit with the dead a while.”', c:[{l:'Battle Elite Morwen', battle:'e_morwen', go:'e4', rematch:true}]},
  e4:{t:'DRAVEN. A hall open to the sky, the wind howling across it. Draven doesn’t turn from the edge. “Dragons are the oldest thing in Halcyon. Older than the League. Older than you.”', c:[{l:'Battle Elite Draven', battle:'e_draven', go:'champ', rematch:true}]},
  champ:{t:g=>'The last door. At the top of the stair, in the champion’s chair, swinging their legs: Corin.\n\n“Took you long enough. I beat all four of them last week. I’ve been sitting here ever since, waiting for you specifically.” A grin, older than the ones before. ' + (F(g,'corin_bond') ? '“Thanks, by the way. For the Spire. Now let’s do this properly.”' : '“Gramps always said you’d be the one to beat. Let’s find out.”'),
    c:[{l:'Battle Champion Corin', battle:'champion', go:'hof', rematch:true}]},
  hof:{t:'Corin stares at their last fallen partner, then laughs. Not the too-loud laugh. A real one.\n\nProfessor Marr is somehow there, out of breath as ever. “Both of you. Come. The Hall of Fame.”\n\nYour partners’ names are carved into the stone wall of the Hall, beside every champion of Halcyon. You are the champion of the Halcyon Region.', do:g=>becomeChampion(g), end:true}
}});

SC('vanefinal',{node:'hollowbelow', title:'The black lake', req:g=>!F(g,'vane_final'), steps:{
  start:{t:'At the edge of the black lake stands Cassius Vane, without his jacket, holding a capsule he doesn’t throw.\n\n“It’s here,” he says. “Under the water. It has been listening the whole time.” He looks at you. “Umbra made it. That has to mean something.”',
    c:[{l:'“It means you owe it peace, not a capsule.”', chk:['persuasion',16], adv:g=>F(g,'lisk_turned'), go:'peace', fail:'fight'},{l:'Battle him for the right to approach', go:'fight'}]},
  fight:{t:'Vane closes his eyes for a moment. Then he throws the capsule after all, at you.', c:[{l:'Battle Cassius Vane', battle:'vane4', go:'after'}]},
  after:{t:'Vane sits down heavily on a rock. “Go on, then,” he says. “I’d only have disappointed it too.”', do:g=>setF(g,'vane_final'), end:true},
  peace:{t:'Vane is quiet for a long time. Then he sets the capsule down on the rock and walks back the way he came, and does not look back.', do:g=>{ setF(g,'vane_final'); gainInsp(g); }, end:true}
}});

SC('nyxion',{node:'hollowbelow', title:'What rises from the lake', repeat:true, req:g=>F(g,'vane_final') && !F(g,'legend_nyxion'), steps:{
  start:{t:'The lake’s surface goes perfectly still. Then it bulges, and something rises out of it without a splash: tall, pale, its tail coiled in the air, three eyes open. Nyxion. It looks at you, and you feel it read every page of you at once.', c:[{l:'Face Nyxion', wild:['nyxion',70], go:'gone', fled:'flee'}]},
  flee:{t:'Nyxion sinks back beneath the black water. It will be here.', end:true, keep:true},
  gone:{t:g=>g.lastBattle==='caught' ? 'The capsule rocks once, twice, and is still. Nyxion is yours. Whatever it chose to see in you, it chose.' : 'Nyxion folds into the dark water and is gone. It will rise again when it is ready to be found.', do:g=>{ if (g.lastBattle==='caught') setF(g,'legend_nyxion'); }, end:true}
}});

SC('lumin',{node:'hollowbelow', title:'A light over the lake', repeat:true, req:g=>F(g,'vane_final') && caughtCount(g) >= 100 && !F(g,'legend_lumin'), steps:{
  start:{t:'A small light is dancing over the black lake, the way the professor described: no bigger than a lantern, and somehow laughing.', c:[{l:'Hold out your hand', go:'meet'},{l:'Leave it in peace for now', go:'leave'}]},
  leave:{t:'The light drifts away across the water. It will be back.', end:true},
  meet:{t:'The light comes closer and becomes a small, pale creature with a long tail and enormous, curious eyes. Lumin. It looks at your Field Codex, then at you, as if it would like to be in it.', c:[{l:'Battle it', wild:['lumin',55], go:'gone', fled:'leave'}]},
  gone:{t:g=>g.lastBattle==='caught' ? 'Lumin curls up in its capsule and goes to sleep at once, like it has been waiting a very long time to rest.' : 'Lumin zips away across the lake, giggling. It wants to play again.', do:g=>{ if (g.lastBattle==='caught') setF(g,'legend_lumin'); }, end:true}
}});

SC('museum2',{node:'cairnstone', title:'The curator’s gift', req:g=>F(g,'champion') && F(g,'revived') && !F(g,'museum_gift'), steps:{
  start:{t:g=>'The curator in the half-moon glasses spots the champion’s pin on your coat and hurries over.\n\n“Dr. Pell’s other fossil has sat in a drawer since the day you saved it. A museum is a fine place for bones, but not for something that could live again. Take it to Cinderisle. Please.” She presses a ' + (g.codex.caught.spiralith ? 'hooked claw' : 'coiled shell') + ' into your hands.',
    do:g=>{ setF(g,'museum_gift'); giveKey(g, g.codex.caught.spiralith ? 'fossil_talon' : 'fossil_spiral'); }, end:true}
}});

/* ---- Postgame ---- */
SC('leaguerematch',{node:'league', title:'Rematch the Summit League', repeat:true, req:g=>F(g,'champion'), steps:{
  start:{t:'The Summit League has called the Elite Four back, and they have been training since the day you beat them. Five doors again. No Haven between them.', c:[{l:'Open the first door', go:'e1'},{l:'Not today', go:'notyet'}]},
  notyet:{t:'The doors will wait. They always do.', end:true},
  e1:{t:'WREN. The ice is thicker this time. “Colder now. Show me.”', c:[{l:'Battle Elite Wren', battle:'r_wren', go:'e2', rematch:true}]},
  e2:{t:'BRANN. He has taped his knuckles fresh. “Hands up.”', c:[{l:'Battle Elite Brann', battle:'r_brann', go:'e3', rematch:true}]},
  e3:{t:'MORWEN. The table is set for two this time. “Sit. Eat. Lose.”', c:[{l:'Battle Elite Morwen', battle:'r_morwen', go:'e4', rematch:true}]},
  e4:{t:'DRAVEN. The wind is worse. “The dragons asked for this.”', c:[{l:'Battle Elite Draven', battle:'r_draven', go:'champ', rematch:true}]},
  champ:{t:'Corin is sitting in the champion’s chair again, which is technically your chair. “Title defense,” they say, grinning. “My turn to chase you.”', c:[{l:'Battle Champion Corin', battle:'r_champion', go:'hof', rematch:true}]},
  hof:{t:g=>'Corin laughs and shakes your hand. “Okay. Again sometime?” Your name goes up on the Hall of Fame wall again, and the League adds three Wisdom Fruits and an Absolute Capsule to your bag.' + (F(g,'rm_league') ? '' : '\n\nProfessor Marr is waiting at the bottom of the stairs with four Apex Stones, for Galecrest, Brawlape, Solvixen and Tidalrus. “Found them in a drawer at the lab. I think they were always meant for you.”'), do:g=>{ g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 3; g.items.absolute = (g.items.absolute || 0) + 1; if (!F(g,'rm_league')) { setF(g,'rm_league'); for (const s of ['galecrest','brawlape','solvixen','tidalrus']) g.keys['apexstone_' + s] = true; } becomeChampion(g); }, end:true}
}});

const REMATCHES = [
  ['cairnstone','dorrin2','Leader Dorrin','Dorrin is chiselling a new boulder seat into the pit wall. “Champion. The stone’s been asking about you.”'],
  ['brightwater','maris2','Leader Maris','Maris surfaces at the end of the pool and waves. “The champion! Rematch? Say yes. Say yes!”'],
  ['saltmere','voss2','Leader Voss','Major Voss is rewiring the hangar coils with his bare hands. “Back for more lightning, recruit?”'],
  ['verdance','liora2','Leader Liora','Liora sets down her tiny scissors. “The garden has grown since you left. So have I.”'],
  ['fenmarsh','sable2','Leader Sable','Sable is already standing behind you. “Again?”'],
  ['aurum','seren2','Leader Seren','Seren opens one eye. “I saw you coming. I still cannot see how it ends.”'],
  ['cinderisle','blaise2','Leader Blaise','Blaise slaps his goggles down. “The CHAMPION! In MY volcano! HA!”'],
  ['greenspire','vane5','Leader Vane','Vane is back on the dais, jacket folded on the rail. Leading a gym is the one thing he kept. “Again, then.”']
];
const REMATCH_STONE = { dorrin2:'bouldrock', maris2:'tyrantide', voss2:'voltail', liora2:'elderthorn', sable2:'gloomreaper', seren2:'cerebrix', blaise2:'blazehound', vane5:'sandreaver' };
for (const [node, tid, name, intro] of REMATCHES) SC('rematch_' + tid, {node, title:'Rematch: ' + name, gym:true, repeat:true, req:g=>F(g,'champion'), steps:{
  start:{t:intro, c:[{l:'Battle ' + name, battle:tid, rematch:true, soft:true, go:'won', lose:'lost'},{l:'Not today', go:'leave'}]},
  won:{t:g=>TRAINERS[tid].outro + (F(g,'rm_' + tid) ? '' : ` Your first rematch win here earns you two Wisdom Fruits and an Apex Stone for ${SPECIES[REMATCH_STONE[tid]].n}. You’ll need an Apex Band to use it.`), do:g=>{ if (!F(g,'rm_' + tid)) { setF(g,'rm_' + tid); g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 2; g.keys['apexstone_' + REMATCH_STONE[tid]] = true; } }, end:true},
  lost:{t:'“Come back when you’re ready. I’ll be here.”', end:true},
  leave:{t:'Another time.', end:true}
}});

SC('tower',{node:'tower', title:'Summit Tower challenge', repeat:true, steps:{
  start:{t:g=>towerIntro(g), c:[{l:'Begin a set of five battles', go:'b1'},{l:'Not now', go:'leave'}]},
  leave:{t:'The attendant bows you back down the stairs.', end:true},
  b1:{t:g=>towerRound(g, 1), c:[{l:'Battle', battle:'tower_foe', rematch:true, soft:true, lose:'lost', go:'b2'}]},
  b2:{t:g=>towerWon(g) + towerRound(g, 2), c:[{l:'Battle', battle:'tower_foe', rematch:true, soft:true, lose:'lost', go:'b3'}]},
  b3:{t:g=>towerWon(g) + towerRound(g, 3), c:[{l:'Battle', battle:'tower_foe', rematch:true, soft:true, lose:'lost', go:'b4'}]},
  b4:{t:g=>towerWon(g) + towerRound(g, 4), c:[{l:'Battle', battle:'tower_foe', rematch:true, soft:true, lose:'lost', go:'b5'}]},
  b5:{t:g=>towerWon(g) + towerRound(g, 5), c:[{l:'Battle', battle:'tower_foe', rematch:true, soft:true, lose:'lost', go:'done'}]},
  done:{t:g=>towerWon(g) + towerSetClear(g), end:true},
  lost:{t:g=>towerLost(g), end:true}
}});

SC('ashen1',{node:'brightwater', title:'An old acquaintance', req:g=>F(g,'champion') && !F(g,'ashen_started'), steps:{
  start:{t:'On Lantern Bridge, a lean figure in a long grey coat leans on the rail, peeling an orange. Admin Lisk. Or whatever Lisk is now.\n\n“Champion.” A segment of orange. “Umbra’s finished. Mostly. Hesper Quill didn’t get the memo. She ran the Cinderisle lab. She made Nyxion. Now she has a new name for what’s left of us: the Ashen Lantern.”',
    c:[{l:'“What does she want?”', go:'want'},{l:'“Why tell me?”', chk:['insight',14], go:'honest', fail:'want'}]},
  honest:{t:'Lisk looks at the water for a long time. “Because I helped her once. I’d like to have helped somebody else since.”', next:'want'},
  want:{t:'“The skyfall. The meteor that came down in Moonwell before Cairnstone had a name. The museum thinks it was only rock. Quill thinks something rode it down.” Lisk flicks the peel into the canal. “She’s been digging under the deepest caves for a month. Go soon.”', do:g=>setF(g,'ashen_started'), end:true}
}});
SC('ashen2',{node:'moonwell', title:'The square shaft', req:g=>F(g,'ashen_started') && !F(g,'crater_open'), steps:{
  start:{t:'Below the deepest part of Moonwell Caves, someone has cut a new shaft, square and neat, lit with grey lanterns. Two guards in ash-colored coats stand at the top of it.',
    c:[{l:'Battle the Ashen guards', battle:'ashen_grunts', go:'shaft'},{l:'Slip past them in the dark', chk:['stealth',16], go:'shaft', fail:'spotted'}]},
  spotted:{t:'A lantern swings toward you. “Champion! Quill said you might come.”', c:[{l:'Battle the Ashen guards', battle:'ashen_grunts', go:'shaft'}]},
  shaft:{t:'The shaft opens onto a cavern the size of a cathedral, its floor a shallow bowl of glassy black rock. Starfall Crater. The air hums, and every stone glows faintly, the way Moon Stones do. Strange creatures move at the edges of the light.', do:g=>setF(g,'crater_open'), end:true}
}});
SC('ashen3',{node:'crater', title:'Dr. Hesper Quill', req:g=>F(g,'crater_open') && !F(g,'quill_beaten'), steps:{
  start:{t:'At the center of the crater, scaffolding surrounds a lump of dark glass the size of a house. A woman in a white coat over an ash-grey suit reads instruments with her back to you: Dr. Hesper Quill.\n\n“The champion,” she says. “Vane always said you would be somebody’s problem. I made the strongest creature in Halcyon once. It left. This one will not leave. It has slept for ten thousand years, waiting for someone to listen.”',
    c:[{l:'“Or it’s waiting for you to leave it alone.”', chk:['persuasion',18], adv:g=>F(g,'lisk_turned'), go:'doubt', fail:'fight'},{l:'Challenge her', go:'fight'}]},
  doubt:{t:'Quill’s hand stops on a dial. For a moment she looks very tired. “Perhaps. Then we will let it decide who it listens to.”', next:'fight', nl:'Face her'},
  fight:{t:'Quill turns, and the grey lanterns on the scaffolding all brighten at once.', c:[{l:'Battle Dr. Quill', battle:'quill', go:'after'}]},
  after:{t:'Quill’s last partner falls. She sits down on the scaffolding stairs. “It never wanted me either,” she says. She takes a small white capsule from her pocket and holds it out. “The last Absolute Capsule I ever built. I made it for this. Don’t waste it.”\n\nBehind her, the dark glass begins to glow.', do:g=>{ g.items.absolute = (g.items.absolute || 0) + 1; setF(g,'quill_beaten'); }, end:true}
}});
SC('astraeon',{node:'crater', title:'The heart of the skyfall', repeat:true, req:g=>F(g,'quill_beaten') && !F(g,'legend_astraeon'), steps:{
  start:{t:'The glass at the crater’s heart cracks like an egg. Something unfolds from it: tall, star-pale, crowned with light, its eyes the color of the sky before dawn. Astraeon. It looks at you as if it has been listening to you for a long time.', c:[{l:'Face Astraeon', wild:['astraeon',75], go:'gone', fled:'flee'},{l:'Leave it be for now', go:'flee'}]},
  flee:{t:'Astraeon settles back into the light of the glass. It will wait. It is very good at waiting.', end:true},
  gone:{t:g=>g.lastBattle==='caught' ? 'Astraeon fits into the capsule like starlight into a jar. The crater goes dark and quiet.' : 'Astraeon rises through a crack in the crater roof and is gone among the stars. You have a feeling it will come back down.', do:g=>{ if (g.lastBattle==='caught') setF(g,'legend_astraeon'); }, end:true}
}});

/* Story milestones the AI Dungeon Master is told about. */
const MILESTONES = [
  ['umbra_met','Team Umbra (black lantern pins) has been seen digging for fossils in Moonwell Caves.'],
  ['burglar_caught','The player recovered stolen Wisdom Fruits from an Umbra thief on Cape Thorn.'],
  ['tunnel_through','The player has crossed Gloomrock Tunnel to Ashgrove.'],
  ['spire_known','In Ashgrove, Umbra poached a Hearthstag; its fawn waits at the Haven and Elder Tamsin is missing in the Hollow Spire.'],
  ['elder_rescued','The player rescued Elder Tamsin from the Hollow Spire and adopted Fawnlet.'],
  ['corin_bond','The player comforted Corin at their first partner’s grave; the rivalry has softened into friendship.'],
  ['silvane_freed','The player freed the Silvane tower in Aurum City and defeated Director Vane there.'],
  ['lore_nyxion','The player read the Cinderisle journals about Nyxion, a creature grown in the lab that escaped north.'],
  ['champion','The player is Champion of the Halcyon Region.'],
  ['ashen_started','Lisk warned the champion about the Ashen Lantern, an Umbra splinter led by Dr. Hesper Quill, who made Nyxion.'],
  ['quill_beaten','The champion defeated Dr. Hesper Quill in Starfall Crater, deep under Moonwell Caves.']
];
