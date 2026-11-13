'use strict';
/* Halcyon Road: the regions beyond Halcyon. Each one is a fresh start: your team waits at the
   daycare back home, a local professor lends you a new starter, and you work up from level 5. */

/* ---------------- Region maps ---------------- */
const REGIONS = {
  halcyon:{ n:'Halcyon Region', land:'M18,40 L60,22 L120,30 L160,12 L240,10 L300,8 L340,30 L370,60 L388,110 L380,160 L390,220 L385,268 L340,282 L285,276 L260,240 L230,222 L190,218 L140,222 L110,240 L100,280 L55,292 L40,262 L30,220 L10,180 L8,120 L12,70 Z', islands:[[205,283,22,11],[122,284,24,12],[226,251,16,9]] },
  solenne:{ n:'Solenne', land:'M20,30 L100,18 L200,15 L300,25 L370,45 L385,120 L370,200 L340,255 L260,240 L200,250 L130,262 L85,272 L40,262 L28,200 L15,130 Z', islands:[[330,282,20,8],[150,285,14,6]] },
  nordhaven:{ n:'Nordhaven', land:'M25,70 L70,25 L160,15 L260,18 L350,40 L385,100 L375,170 L390,230 L360,275 L300,262 L250,270 L190,262 L140,250 L95,240 L60,205 L30,180 L45,140 L15,110 Z', islands:[[220,195,14,7],[60,268,18,8],[370,285,16,7]] }
};

/* ---------------- Regional starters ---------------- */
S('axlet','Axlet',['water'],[50,48,54,46],12,62,[16,'axolance'],'round',['fin','whiskers','spots'],'An oasis axolotl with frilly gills. It smiles at everything, including danger.');
S('axolance','Axolance',['water'],[66,66,72,58],14,142,[36,'axoltide'],'serpent',['fin','whiskers','spots'],'Its gill-frills stiffen into spines when it is cornered.');
S('axoltide','Axoltide',['water','psychic'],[90,90,96,64],18,240,null,'serpent',['fin','whiskers','crest','gem'],'Calls springwater up through the desert sand. The oasis towns honor it as a guardian.');
S('scorchick','Scorchick',['fire'],[42,56,40,64],12,62,[16,'flarewing'],'bird',['crest','flame'],'A desert chick that pecks sparks off sun-hot rocks. Its crest smoulders when it is hungry.');
S('flarewing','Flarewing',['fire','flying'],[58,76,54,82],14,142,[36,'solfalcon'],'bird',['crest','flame','wings'],'Rides the canyon thermals with its wings trailing embers.');
S('solfalcon','Solfalcon',['fire','flying'],[78,106,72,104],18,240,null,'bird',['crest','flame','wings','plume'],'Dives out of the noon sun so fast that its target sees only a flash of gold.');
S('aloelet','Aloelet',['grass'],[50,50,54,46],12,62,[16,'aloespine'],'bulb',['leaf','spikes'],'A succulent sprout that stores water in its plump leaves and shares it with no one.');
S('aloespine','Aloespine',['grass'],[68,68,74,54],14,142,[36,'aloeking'],'tall',['leaf','spikes'],'Its sap heals cuts and its spines cause them. It considers this fair.');
S('aloeking','Aloeking',['grass','ground'],[92,98,100,62],18,240,null,'tall',['leaf','spikes','crest','big'],'Rooted in the desert for a hundred years, it can drink a whole rainstorm in an hour.');
S('waddlet','Waddlet',['water'],[50,48,52,48],12,62,[16,'fjordguin'],'bird',['crest'],'A penguin chick that toboggans down every slope it can find.');
S('fjordguin','Fjordguin',['water'],[68,66,70,60],14,142,[36,'emperice'],'bird',['crest','spots'],'Shoots through the fjord like a torpedo and walks on land like it has been tricked.');
S('emperice','Emperice',['water','ice'],[92,96,94,68],18,240,null,'bird',['crest','spots','spikes'],'Wears a crown of ice that never melts. The colonies of the north follow it everywhere.');
S('forgling','Forgling',['fire'],[46,56,46,58],12,62,[16,'forgehorn'],'quad',['horn','topflame'],'A little salamander that sleeps in forge coals. Smiths leave the fire burning for it.');
S('forgehorn','Forgehorn',['fire'],[62,78,62,74],14,142,[36,'forgejarl'],'tall',['horn','topflame','mane'],'Hammers glowing ore with its tail and is very particular about the result.');
S('forgejarl','Forgejarl',['fire','fighting'],[82,108,82,90],18,240,null,'tall',['horn','topflame','mane','horns'],'The smith-lord of the north. Its armor is forged from its own scales.');
S('birchling','Birchling',['grass'],[48,50,52,50],12,62,[16,'birchstag'],'quad',['leaf','antlers'],'A fawn with birch-bark spots and leaves sprouting from its tiny antlers.');
S('birchstag','Birchstag',['grass'],[66,70,68,66],14,142,[36,'worldstag'],'quad',['leaf','antlers','spots'],'Its antlers grow new leaves every spring and turn gold every autumn.');
S('worldstag','Worldstag',['grass','psychic'],[92,100,90,88],18,240,null,'quad',['leaf','antlers','mane','aura'],'The sagas say a whole forest grows from its antlers. The sagas exaggerate, but not by much.');

/* ---------------- Solenne creatures ---------------- */
S('sandsnip','Sandsnip',['ground','bug'],[52,70,72,54],12,90,[28,'duneskorp'],'insect',['stinger','antennae'],'Buries itself in the salt flats with only its stinger showing.');
S('duneskorp','Duneskorp',['ground','bug'],[86,112,108,74],16,220,null,'insect',['stinger','horn','claws'],'Its armor turns blades aside and its stinger changes minds.');
S('grapling','Grapling',['grass'],[56,54,58,50],11,88,[22,'vinocerus'],'bulb',['leaf','spots'],'A cluster of grapes that ripened into a creature. Vintners call it lucky and a little annoying.');
S('vinocerus','Vinocerus',['grass','fighting'],[96,114,92,70],16,225,null,'quad',['horn','leaf','mane'],'Guards the old vineyards with a horn of twisted vine wood.');
S('sunbloom','Sunbloom',['grass','fire'],[78,100,72,92],15,215,null,'bulb',['petals','topflame'],'Its petals catch the noon sun and throw it back as fire.');
S('dunekit','Dunekit',['ground'],[50,60,52,82],12,90,[26,'miragefen'],'quad',['ears','tail'],'A fennec kit with ears bigger than its sense. It can hear a beetle dig at fifty paces.');
S('miragefen','Miragefen',['ground','psychic'],[82,100,78,114],16,220,null,'quad',['ears','tail','eyes3'],'Shows travellers an oasis that isn’t there, then leads the honest ones to the one that is.');
S('brinewader','Brinewader',['water','flying'],[84,90,78,96],14,200,null,'bird',['crest','plume'],'Wades the salt flats on long pink legs and is extremely vain about them.');
S('crestram','Crestram',['rock','fighting'],[88,108,104,70],15,210,null,'quad',['horns','mane'],'Butts heads with its rivals so hard the canyon echoes for a minute.');
S('whirldust','Whirldust',['ground','flying'],[74,94,70,110],15,205,null,'ghost',['spots'],'A dust devil that wandered into being. It cannot stop spinning and has made peace with that.');
S('skinkle','Skinkle',['fire'],[52,64,54,74],12,90,[30,'heliskink'],'serpent',['spots'],'Basks on hot rocks until it glows. Do not pick it up when it glows.');
S('heliskink','Heliskink',['fire','electric'],[84,108,78,106],16,225,null,'serpent',['spots','bolt','crest'],'Stores the desert noon in its scales and lets it out as lightning at dusk.');
S('tombwrap','Tombwrap',['ghost','rock'],[84,98,108,50],15,210,null,'tall',['mask','stripes'],'Guards the sealed tombs of the Sunstone Ruins, wrapped in linen older than the city.');
S('helioserp','Helioserp',['ground','fire'],[110,124,106,100],26,340,null,'serpent',['horns','flame','crest','aura'],'The sun serpent of Solenne. The old kings built the Sunstone Ruins to keep it asleep.',{legend:true, ex:{1:'recover'}});
S('scarablet','Scarablet',['bug','psychic'],[46,56,60,52],10,90,[18,'scarabsun'],'insect',['antennae','shell'],'Rolls balls of dung into perfect spheres. It thinks of them as small suns.');
S('scarabsun','Scarabsun',['bug','psychic'],[70,86,88,70],14,170,[36,'solscarab'],'insect',['antennae','shell','gem'],'Pushes a glowing sphere of light across the dunes from dawn to dusk.');
S('solscarab','Solscarab',['bug','fire'],[96,112,116,92],18,250,null,'insect',['antennae','shell','gem','wings'],'The old kings carved it on every temple door. Some say it pushes the sun itself.');
S('camelump','Camelump',['normal','ground'],[82,62,66,40],10,95,[28,'dromedune'],'quad',['ears','spots'],'Stores a week of water and a month of opinions.');
S('dromedune','Dromedune',['ground','normal'],[118,102,94,64],15,220,null,'quad',['ears','mane','big'],'Caravans follow it across the deep desert because it has never once got lost.');
S('vintling','Vintling',['grass','poison'],[52,60,54,52],11,90,[24,'vintoxin'],'bulb',['spots'],'A grape that fermented in the sun until it got ideas.');
S('vintoxin','Vintoxin',['grass','poison'],[88,100,86,78],15,215,null,'bulb',['spots','petals'],'Its perfume is delicious. Its vapors are not. Vintners keep their distance at harvest.');
S('gecklit','Gecklit',['normal','rock'],[50,62,56,78],11,90,[26,'gecklord'],'quad',['tail','spots'],'Climbs sheer canyon walls and waves at climbers going the slow way.');
S('gecklord','Gecklord',['rock','normal'],[86,100,94,106],15,220,null,'quad',['tail','spots','crest'],'Basks on the hottest rock in the canyon and dares anyone to move it.');
S('sphinxit','Sphinxit',['psychic','normal'],[56,62,56,70],12,95,[32,'sphinxara'],'quad',['ears','tail','gem'],'Asks riddles of travellers and sulks if they get them right.');
S('sphinxara','Sphinxara',['psychic','rock'],[94,108,98,98],17,240,null,'quad',['ears','tail','gem','wings'],'Guards the inner tombs of the Sunstone Ruins with a riddle nobody has answered in a thousand years.');
S('tumbleroot','Tumbleroot',['grass','ground'],[78,90,80,98],13,200,null,'round',['spikes','leaf'],'Rolls across the flats with the wind and settles wherever the soil is good.');
S('shimmeray','Shimmeray',['water','psychic'],[88,94,86,102],15,215,null,'fish',['fin','wings'],'Glides through the oasis so smoothly that the surface never ripples.');
S('claylet','Claylet',['ground'],[54,62,68,40],11,90,[20,'clayguard'],'tall',['mask'],'A clay figurine from the ruins that woke up and decided to stay awake.');
S('clayguard','Clayguard',['ground','fighting'],[80,98,98,56],15,180,[38,'terraknight'],'tall',['mask','stripes'],'Marches the ruins in perfect step, guarding kings who are long gone.');
S('terraknight','Terraknight',['ground','fighting'],[106,122,120,66],18,255,null,'tall',['mask','stripes','horns'],'The captain of the clay army. It has never retreated, and never will.');
S('palmkit','Palmkit',['grass','normal'],[48,56,50,78],10,88,[22,'palmquill'],'quad',['leaf','tail'],'Scurries up palm trees to throw dates at people it likes.');
S('palmquill','Palmquill',['grass','normal'],[82,94,74,110],14,210,null,'quad',['leaf','tail','spikes'],'Its tail fans open like a palm frond. It uses it as a parasol.');
S('kitelet','Kitelet',['electric','flying'],[44,58,46,82],12,95,[30,'stormkite'],'bird',['bolt'],'Rides the canyon updrafts and crackles when it catches a good one.');
S('stormkite','Stormkite',['electric','flying'],[78,100,70,120],16,230,null,'bird',['bolt','plume'],'Hangs on thunderheads above Cliffhaven and drops when lightning strikes.');
S('sentrilith','Sentrilith',['rock','psychic'],[102,106,122,50],16,230,null,'tall',['gem','rocks'],'A guardian statue whose eyes follow you. It only moves when someone breaks a rule.');
S('brinegator','Brinegator',['water','ground'],[106,114,98,60],15,225,null,'serpent',['teeth','spikes'],'Lies still as a log in the oasis shallows. It is not a log.');
S('ibisage','Ibisage',['psychic','flying'],[78,94,76,106],14,215,null,'bird',['crest','eyes3'],'The temple scribes say it taught them to write.');
S('sunasp','Sunasp',['poison','fire'],[52,66,50,74],12,95,[28,'pyrocobra'],'serpent',['teeth','spots'],'Coils on warm stones and hisses sparks.');
S('pyrocobra','Pyrocobra',['poison','fire'],[86,110,76,106],16,230,null,'serpent',['teeth','horns','flame'],'Spreads a hood of flame when it is angry, which is most of the day.');
S('djinnspark','Djinnspark',['electric','ghost'],[82,106,72,112],16,230,null,'ghost',['bolt','crest'],'Lives in old brass lamps. Rub one and it will grant you a static shock.');
S('vinebeetle','Vinebeetle',['bug','grass'],[80,98,94,64],13,200,null,'insect',['horn','leaf'],'Vintners hate it and admire it in equal measure. It only eats the best grapes.');
S('cliffswift','Cliffswift',['flying','normal'],[44,58,40,92],10,88,[22,'canyonswift'],'bird',['crest'],'Nests in cliff cracks no wider than a finger.');
S('canyonswift','Canyonswift',['flying','normal'],[74,94,66,126],14,215,null,'bird',['crest','plume'],'The fastest flier in Solenne. It races the airships for fun and usually wins.');
S('sunmane','Sunmane',['fire','normal'],[98,114,84,98],17,240,null,'quad',['mane','flame','tail'],'Its mane blazes at noon. The temple guards say it is the sun’s own hound.');
S('tarling','Tarling',['poison','ground'],[66,58,64,30],11,90,[30,'tarmaw'],'blob',['spots'],'Bubbles up from tar seeps in the deep desert and smells exactly as you would expect.');
S('tarmaw','Tarmaw',['poison','ground'],[112,102,94,40],15,220,null,'blob',['spots','teeth'],'Anything that steps in its pool stays there until it decides otherwise.');
S('urnling','Urnling',['ghost'],[48,56,64,50],12,90,[30,'amphorite'],'round',['stripes'],'An old clay urn that rattles when it is lonely.');
S('amphorite','Amphorite',['ghost','rock'],[86,100,110,70],16,225,null,'round',['stripes','crest'],'Keeps the memories of whoever filled it last, and will tell them to you, slowly.');
S('jackalith','Jackalith',['ghost','ground'],[88,110,82,106],17,235,null,'quad',['ears','mask','tail'],'Walks souls lost in the ruins back to the light.');
S('pearlclam','Pearlclam',['water'],[60,48,92,30],10,88,[28,'pearlord'],'round',['shell','gem'],'Hides a pearl the size of a fist and will not tell you where it got it.');
S('pearlord','Pearlord',['water','psychic'],[98,94,124,52],15,225,null,'round',['shell','gem','crest'],'The oasis folk ask it questions. Its pearl glows for yes and stays dark for no.');
S('mesashell','Mesashell',['rock','ground'],[66,64,98,30],11,90,[32,'plateaurtle'],'quad',['shell','rocks'],'Carries a little mesa on its back, complete with a tiny cactus.');
S('plateaurtle','Plateaurtle',['rock','ground'],[112,98,128,40],15,225,null,'quad',['shell','rocks','big'],'Its shell is a whole plateau. Birds nest on it and it lets them.');
S('palmtoad','Palmtoad',['water','grass'],[58,56,58,58],10,88,[24,'lilyhopper'],'round',['eyesbig','leaf'],'Sits on lily pads at the oasis and croaks the hour.');
S('lilyhopper','Lilyhopper',['water','grass'],[92,94,88,94],14,210,null,'round',['eyesbig','leaf','petals'],'Leaps from pad to pad without ever touching the water.');
S('pricklet','Pricklet',['grass'],[46,62,54,86],10,88,[24,'pricklemaw'],'quad',['spikes','ears','tail'],'A cactus mouse that is ninety percent spines and ten percent attitude.');
S('pricklemaw','Pricklemaw',['grass','normal'],[82,98,80,102],14,210,null,'quad',['spikes','ears','tail','teeth'],'Defends its burrow with a mouthful of needles.');
S('dustquail','Dustquail',['normal','ground'],[46,54,48,76],9,85,[20,'duneplume'],'bird',['crest'],'Bathes in dust instead of water and is very clean, by its own standards.');
S('duneplume','Duneplume',['ground','flying'],[80,94,72,108],14,210,null,'bird',['crest','plume'],'Its plumes are the color of the dunes at sunset.');

/* ---------------- Nordhaven creatures ---------------- */
S('frostmite','Frostmite',['bug','ice'],[54,66,70,58],12,95,[26,'rimewing'],'insect',['antennae','spikes'],'Burrows under pine bark in winter and comes out sparkling with frost.');
S('rimewing','Rimewing',['bug','ice'],[86,104,90,106],16,230,null,'insect',['antennae','wings'],'Its wings are thin as frost on a window. On clear nights it flies with the aurora.');
S('snowhorn','Snowhorn',['ice','normal'],[100,104,88,72],15,215,null,'quad',['antlers','mane'],'Leads its herd through blizzards by the warmth of its own breath.');
S('howlpup','Howlpup',['ice'],[56,70,54,80],12,95,[30,'fenrime'],'quad',['ears','tail'],'Howls at the aurora every night. The aurora has never answered, but it stays hopeful.');
S('fenrime','Fenrime',['ice','ghost'],[90,116,80,112],17,235,null,'quad',['ears','tail','mane','teeth'],'A wolf of frost and memory that runs the glacier ridges on moonless nights.');
S('barrowight','Barrowight',['ghost','fighting'],[92,116,96,74],16,230,null,'tall',['horns','mask'],'A barrow guardian still keeping its oath, though everyone it swore to is long gone.');
S('runegolem','Runegolem',['rock','electric'],[104,108,124,48],16,230,null,'round',['rocks','gem','bolt'],'The old runes carved into it glow whenever a storm is coming.');
S('driftmare','Driftmare',['water','ghost'],[90,98,82,96],16,225,null,'blob',['tentacles','eyesbig'],'Drifts under the fjord ice. Fishermen hear it singing through their hulls.');
S('tuskolith','Tuskolith',['ice','ground'],[120,118,104,52],16,235,null,'quad',['tusks','big','spikes'],'A woolly giant from the glacier’s heart. It remembers the last ice age fondly.');
S('mosstroll','Mosstroll',['grass','rock'],[110,108,112,40],15,225,null,'tall',['rocks','leaf','big'],'Sleeps as a mossy boulder beside the trail and wakes if you are rude to it.');
S('hollowcrow','Hollowcrow',['normal','ghost'],[78,100,72,110],15,215,null,'bird',['crest','mask'],'Carries messages for the dead and gossip for the living.');
S('voltwyrm','Voltwyrm',['dragon','electric'],[96,124,92,112],20,265,null,'serpent',['horns','bolt','fin'],'Rides storm fronts down the fjords and lands wherever lightning has just struck.');
S('aurorath','Aurorath',['ice','dragon'],[116,130,110,108],27,350,null,'serpent',['horns','wings','crest','aura'],'The dragon of the northern lights. When it sleeps the aurora fades; when it wakes, the whole sky sings.',{legend:true, ex:{1:'recover'}});
S('conelet','Conelet',['grass'],[48,58,60,50],11,95,[16,'sprucekit'],'round',['spikes','leaf'],'A pinecone that sprouted legs and a great deal of curiosity.');
S('sprucekit','Sprucekit',['grass','ice'],[76,94,82,96],15,180,[34,'borealynx'],'quad',['ears','leaf','spikes'],'Frost clings to its needle fur all year round.');
S('borealynx','Borealynx',['grass','ice'],[98,118,98,118],19,260,null,'quad',['ears','leaf','spikes','mane'],'The spirit of the northern forest. Where it walks, the pines grow taller.');
S('puffling','Puffling',['water','flying'],[52,54,52,62],11,95,[24,'puffinarch'],'bird',['crest'],'Waddles on land, flies like a dart, and swims like it has somewhere to be.');
S('puffinarch','Puffinarch',['water','flying'],[88,96,86,98],15,220,null,'bird',['crest','plume','spots'],'Leads colonies of thousands on the sea cliffs. They all agree to ignore its singing.');
S('narwhelp','Narwhelp',['water','ice'],[64,66,62,60],12,100,[30,'narwhallow'],'fish',['horn','fin'],'Its little horn grows a ring every winter. Fishermen count them for luck.');
S('narwhallow','Narwhallow',['water','ice'],[102,114,94,92],16,235,null,'fish',['horn','fin','spots'],'Breaks through sea ice with its horn to let the fjord breathe.');
S('rimefawn','Rimefawn',['ice','psychic'],[58,58,58,74],12,100,[30,'aurorelk'],'quad',['antlers','spots'],'Its antlers glow faintly green when the aurora is out.');
S('aurorelk','Aurorelk',['ice','psychic'],[98,106,92,110],16,240,null,'quad',['antlers','mane','gem'],'Leads its herd beneath the northern lights. Its antlers ring like glass.');
S('frostcub','Frostcub',['ice'],[64,68,60,50],12,100,[30,'glacibear'],'tall',['ears','claws'],'Slides down glaciers on its belly, then climbs back up to do it again.');
S('glacibear','Glacibear',['ice','fighting'],[114,126,96,70],17,245,null,'tall',['ears','claws','spikes'],'Its swipe can split an iceberg. It uses it mostly for fishing.');
S('stormhawk','Stormhawk',['flying','electric'],[86,112,78,120],17,240,null,'bird',['crest','bolt'],'Dives out of storm clouds faster than the thunder that follows.');
S('runeshield','Runeshield',['rock','fighting'],[70,78,96,40],12,100,[32,'runebreaker'],'tall',['gem','rocks'],'A carved stone that learned to stand. Its runes say BRAVE, roughly.');
S('runebreaker','Runebreaker',['rock','fighting'],[102,124,122,56],17,245,null,'tall',['gem','rocks','horns'],'Smashes boulders to free the runes trapped inside them.');
S('selkine','Selkine',['water','psychic'],[96,98,90,106],16,235,null,'round',['whiskers','fin','gem'],'Sheds its seal skin on moonlit beaches. Nobody has ever seen what is underneath.');
S('shoalette','Shoalette',['water'],[46,60,50,88],11,95,[26,'shoalstorm'],'fish',['fin','spots'],'Swims in shoals of hundreds that turn as one.');
S('shoalstorm','Shoalstorm',['water','electric'],[82,106,76,122],16,235,null,'fish',['fin','bolt'],'A shoal that learned to strike like lightning. It moves as one creature now.');
S('snowkit','Snowkit',['ice'],[50,58,52,82],11,95,[18,'arctivix'],'quad',['ears','tail'],'Turns pure white in winter and pure mischief in spring.');
S('arctivix','Arctivix',['ice'],[74,90,74,106],15,180,[36,'polarvixen'],'quad',['ears','tail','mane'],'Hunts by listening for mice under three feet of snow.');
S('polarvixen','Polarvixen',['ice','psychic'],[94,114,94,122],19,260,null,'quad',['ears','tail','mane','eyes3'],'Its third eye sees through blizzards, and through bluffs.');
S('snowstride','Snowstride',['ice','normal'],[116,118,94,64],17,240,null,'tall',['big','mane'],'Leaves footprints the size of shields. Everyone has seen the footprints. Few have seen it.');
S('chillwisp','Chillwisp',['ghost','ice'],[56,66,54,82],12,100,[30,'frostgeist'],'ghost',['spikes'],'A breath of cold that drifts through the barrow fields on still nights.');
S('frostgeist','Frostgeist',['ghost','ice'],[88,112,82,114],17,240,null,'ghost',['spikes','crest','horns'],'Its touch leaves frost in the shape of a handprint that never melts.');
S('skaldbird','Skaldbird',['normal','psychic'],[82,98,78,102],15,225,null,'bird',['crest','eyes3'],'Remembers every saga it has heard and recites them, loudly, at dawn.');
S('lichenling','Lichenling',['grass','rock'],[58,54,74,30],11,95,[28,'lichenlurk'],'round',['spots'],'Patches of it grow on old runestones. Some of the patches are awake.');
S('lichenlurk','Lichenlurk',['grass','poison'],[94,98,106,46],16,230,null,'round',['spots','spikes'],'Covers whole boulders and waits for something to sit down.');
S('otterkin','Otterkin',['water','normal'],[58,64,54,78],11,95,[26,'otterhelm'],'quad',['whiskers','tail'],'Floats on its back in the fjord, cracking clams on its belly.');
S('otterhelm','Otterhelm',['water','fighting'],[92,110,86,106],16,235,null,'quad',['whiskers','tail','horns'],'Wears a clamshell helmet and fights anything that threatens the colony.');
S('muskhorn','Muskhorn',['normal','ground'],[120,106,106,46],16,240,null,'quad',['horns','mane','big'],'Herds form a ring of horns against the storm, with the young in the middle.');
S('deeplure','Deeplure',['water','electric'],[62,68,58,72],12,100,[30,'abysslure'],'fish',['antenna','teeth'],'Dangles a glowing lure in the black water under the fjord ice.');
S('abysslure','Abysslure',['water','electric'],[102,110,88,92],16,240,null,'fish',['antenna','teeth','spikes'],'Fjordmere fishermen sometimes see its light far below. They row away.');
S('martling','Martling',['normal'],[52,66,50,92],11,95,[24,'martenfang'],'quad',['tail','teeth'],'Darts through the pine branches and steals anything shiny.');
S('martenfang','Martenfang',['normal','ice'],[82,106,72,122],16,235,null,'quad',['tail','teeth','stripes'],'Hunts across frozen treetops without ever touching the ground.');
S('frostpincer','Frostpincer',['ice','water'],[72,94,106,48],12,100,[32,'glaciclaw'],'crab',[],'Scuttles over the glacier’s edge with claws of solid ice.');
S('glaciclaw','Glaciclaw',['ice','rock'],[104,120,132,58],17,245,null,'crab',['spikes'],'Its claws are chunks of glacier. They grow back colder when they break.');
S('frostflame','Frostflame',['fire','ice'],[88,110,88,106],17,240,null,'round',['topflame','spikes'],'Burns with a white flame that is cold to the touch. Scholars argue about it constantly.');
S('huskling','Huskling',['ice','normal'],[60,66,58,78],11,95,[28,'huskarl'],'quad',['ears','tail'],'Pulls sleds for the fun of it and will not stop until someone climbs in.');
S('huskarl','Huskarl',['ice','fighting'],[96,118,90,102],17,240,null,'quad',['ears','tail','mane'],'The guardian of Highmark’s gates. It has never let a stranger in without a sniff.');
S('fjorddrake','Fjorddrake',['dragon','water'],[102,120,98,106],20,265,null,'serpent',['horns','fin'],'Swims the length of the fjords in a single night, leaving a wake like a longship.');
S('menhirling','Menhirling',['rock','psychic'],[72,60,106,30],12,100,[34,'monolord'],'tall',['gem'],'A small standing stone that hums with old magic. It moves when nobody is looking.');
S('monolord','Monolord',['rock','psychic'],[112,106,140,46],17,245,null,'tall',['gem','rocks','big'],'The tallest stone in Runestad’s circle. The others turn to face it at midwinter.');
S('krakling','Krakling',['water','poison'],[60,66,60,64],12,100,[32,'krakenmaw'],'blob',['tentacles'],'Tangles fishing nets for fun and untangles them for treats.');
S('krakenmaw','Krakenmaw',['water','poison'],[106,120,94,82],17,245,null,'blob',['tentacles','teeth'],'Most old sailors’ stories are about this creature. Most of the stories are true.');
S('lumisprite','Lumisprite',['electric','psychic'],[78,102,74,120],18,245,null,'ghost',['crest','gem'],'A wisp of aurora that fell to earth and decided to stay.');
S('gulotooth','Gulotooth',['normal','fighting'],[94,120,86,98],16,235,null,'quad',['claws','teeth','stripes'],'Pound for pound the fiercest creature in the north. It chases off bears for fun.');

/* ---------------- New Halcyon creatures ---------------- */
S('burrbun','Burrbun',['normal'],[44,48,40,62],7,45,[22,'thistlehare'],'quad',['ears','tail'],'Hides in thistle patches and sneezes when it is found.');
S('thistlehare','Thistlehare',['normal','grass'],[70,80,62,96],12,150,null,'quad',['ears','tail','leaf'],'Its fur is woven with thistledown. Farmers welcome it, because it eats the weeds first.');
S('sparkgrub','Sparkgrub',['bug','fire'],[40,50,42,52],8,50,[24,'cinderwing'],'insect',['antennae'],'Glows like a coal at dusk. Campers mistake a clutch of them for a fire somebody left burning.');
S('cinderwing','Cinderwing',['bug','fire'],[70,92,62,98],13,165,null,'insect',['antennae','wings','flame'],'Its wings shed embers as it flies. Lantern Road’s lamplighters follow its trail home.');
S('cobblet','Cobblet',['rock'],[46,62,74,36],8,52,[30,'slatehorn'],'round',['rocks'],'Rolls itself smooth in streambeds and is very proud of the result.');
S('slatehorn','Slatehorn',['rock','normal'],[84,98,110,52],14,170,null,'quad',['horn','rocks'],'Splits slate with its horn so neatly that roofers keep one around.');
S('mosskit','Mosskit',['grass'],[46,54,48,66],9,55,[26,'fernlynx'],'quad',['ears','leaf'],'Naps in moss so long that moss starts growing on it.');
S('fernlynx','Fernlynx',['grass'],[74,90,68,102],13,165,null,'quad',['ears','leaf','stripes'],'Stalks through ferns without moving a single frond.');
S('coralet','Coralet',['water','rock'],[44,52,72,40],9,58,[32,'reefwarden'],'round',['spikes','gem'],'A pink bud of living coral that grows a branch for every year of calm water.');
S('reefwarden','Reefwarden',['water','rock'],[86,94,114,50],14,175,null,'round',['spikes','gem','crest'],'Guards the reefs off Cape Thorn. Fish shelter in its branches during storms.');
S('seedswift','Seedswift',['grass','flying'],[40,52,40,78],9,52,[28,'galeleaf'],'bird',['leaf'],'Rides the wind like a sycamore seed, spinning all the way down.');
S('galeleaf','Galeleaf',['grass','flying'],[70,92,66,110],13,165,null,'bird',['leaf','plume'],'Its feathers are broad leaves. In autumn it molts in red and gold.');
S('sparkmole','Sparkmole',['electric','ground'],[72,94,84,70],13,160,null,'round',['claws','bolt'],'Digs with sparking claws and leaves glassy tunnels behind it.');
S('chimeling','Chimeling',['psychic'],[42,52,44,62],10,58,[32,'chimesong'],'bird',['crest'],'Rings like a tiny bell when the wind blows through its crest.');
S('chimesong','Chimesong',['psychic','flying'],[76,98,74,98],14,175,null,'bird',['crest','plume'],'Its song can calm a stampede, or start one, depending on the key.');
S('spinnet','Spinnet',['bug','poison'],[42,54,48,56],8,50,[24,'silkfang'],'insect',['antennae','teeth'],'Strings webs across doorways overnight. The webs are surprisingly beautiful.');
S('silkfang','Silkfang',['bug','poison'],[74,96,74,84],13,165,null,'insect',['antennae','teeth','spikes'],'Weaves silk strong enough to hold a cart. Bridge builders have tried to hire it.');
S('puddlepup','Puddlepup',['water'],[50,50,48,56],8,52,[24,'torrenthound'],'quad',['ears','tail','spots'],'Jumps in every puddle it finds and shakes off on everyone nearby.');
S('torrenthound','Torrenthound',['water'],[86,94,78,90],13,170,null,'quad',['ears','tail','mane'],'Can track a scent across a river, then swim upstream to catch up.');
S('kindlefist','Kindlefist',['fire','fighting'],[72,100,66,86],13,170,null,'tall',['mane','topflame'],'Warms its fists in the coals before every bout.');
S('wispurr','Wispurr',['ghost','normal'],[60,76,58,92],12,150,null,'quad',['ears','tail','eyesbig'],'A cat that was so curious it came back to finish looking around.');
S('scaleling','Scaleling',['dragon'],[46,64,52,56],15,80,[30,'scalebrute'],'quad',['horns','tail'],'Butts heads with boulders to toughen its scales. The boulders are unharmed.');
S('scalebrute','Scalebrute',['dragon'],[70,92,78,70],17,170,[45,'drakonarch'],'tall',['horns','tail','spikes'],'Walks on two legs now and will not let anyone forget it.');
S('drakonarch','Drakonarch',['dragon','fighting'],[96,128,98,90],19,260,null,'tall',['horns','tail','spikes','mane'],'A dragon that boxes. It considers flying a form of cheating.');
S('steamtoad','Steamtoad',['water','fire'],[82,92,82,70],13,175,null,'round',['eyesbig','topflame'],'Lives in hot springs and puffs steam rings when it is content.');
S('thudmole','Thudmole',['ground','fighting'],[82,102,84,64],13,170,null,'round',['claws','mask'],'Punches through rock rather than digging. It is very loud about it.');
S('duskmoth','Duskmoth',['bug','ghost'],[64,82,62,100],13,165,null,'insect',['wings','antennae'],'Flies only at dusk, when it is hard to tell where it ends and the shadows begin.');
S('staticat','Staticat',['electric','normal'],[68,86,60,110],13,165,null,'quad',['ears','tail','bolt'],'Pet it the wrong way and your hair will stand up for an hour.');
S('mindcap','Mindcap',['grass','psychic'],[72,88,74,70],13,165,null,'round',['cap','eyes3'],'A mushroom that dreams. Foragers who eat its neighbors have very strange nights.');
S('inkwhirl','Inkwhirl',['water'],[72,90,66,94],12,160,null,'blob',['tentacles','spots'],'Writes in ink on the harbor walls. Nobody has worked out what it is saying.');

/* ---------------- Apex Ascension ---------------- */
const APEX = {
  solvixen:{t:['fire','psychic'], f:['crest']}, tidalrus:{t:['water','ice'], f:['horns']}, elderthorn:{t:['grass','dragon'], f:['petals']},
  galecrest:{t:['flying','fighting'], f:['plume']}, voltail:{t:['electric','dragon'], f:['crest']}, tyrantide:{t:['water','dragon'], f:['spikes']},
  gloomreaper:{t:['ghost','poison'], f:['mane']}, blazehound:{t:['fire','fighting'], f:['horns']}, cerebrix:{t:['psychic','fighting'], f:['mane']},
  bouldrock:{t:['rock','ground'], f:['crest','gem']}, sandreaver:{t:['ground','dragon'], f:['wings']}, brawlape:{t:['fighting','fire'], f:['flame']},
  axoltide:{t:['water','psychic'], f:['horns']}, solfalcon:{t:['fire','flying'], f:['spikes']}, aloeking:{t:['grass','ground'], f:['petals']},
  terraknight:{t:['ground','fighting'], f:['crest']}, sphinxara:{t:['psychic','rock'], f:['crest']}, sunmane:{t:['fire','fighting'], f:['crest']},
  stormkite:{t:['electric','flying'], f:['crest']}, solscarab:{t:['bug','fire'], f:['crest']},
  emperice:{t:['water','ice'], f:['horns']}, forgejarl:{t:['fire','fighting'], f:['spikes']}, worldstag:{t:['grass','psychic'], f:['petals']},
  borealynx:{t:['grass','ice'], f:['crest']}, polarvixen:{t:['ice','psychic'], f:['crest']}, glacibear:{t:['ice','fighting'], f:['horns']},
  runebreaker:{t:['rock','fighting'], f:['crest']}, krakenmaw:{t:['water','poison'], f:['spikes']}
};
for (const [id, a] of Object.entries(APEX)) {
  const s = SPECIES[id];
  S('apex_' + id, 'Apex ' + s.n, a.t, [s.b[0], s.b[1] + 24, s.b[2] + 18, s.b[3] + 12], 99, s.xp, null, s.sh, [...new Set([...s.f, ...a.f, 'aura'])],
    `${s.n} at the height of its bond with its trainer. The form lasts until the battle ends.`, { nocodex:true, apexOf:id });
  KEYS['apexstone_' + id] = [`Apex Stone (${s.n})`, `Lets ${s.n} ascend once per battle while you wear the Apex Band.`];
}
KEYS.apexband = ['Apex Band', 'A woven band set with a pale stone. Once per battle, a partner whose Apex Stone you carry can ascend.'];
const STARTER_FINAL = { emberkit:'solvixen', rippup:'tidalrus', budling:'elderthorn' };
const REGION_STARTERS = { solenne:['axlet','scorchick','aloelet'], nordhaven:['waddlet','forgling','birchling'] };
const REGION_FINAL = { axlet:'axoltide', scorchick:'solfalcon', aloelet:'aloeking', waddlet:'emperice', forgling:'forgejarl', birchling:'worldstag' };
const REGION_RIVAL = {
  solenne:{ axlet:['aloelet','aloespine','aloeking'], scorchick:['axlet','axolance','axoltide'], aloelet:['scorchick','flarewing','solfalcon'] },
  nordhaven:{ waddlet:['birchling','birchstag','worldstag'], forgling:['waddlet','fjordguin','emperice'], birchling:['forgling','forgehorn','forgejarl'] }
};

/* ---------------- Solenne map ---------------- */
const SN = (id, o) => N(id, Object.assign({ rg:'solenne', tier:3 }, o));
SN('s_port',{n:'Port Calder', k:'town', x:60, y:240, tier:1, haven:'haven', shop:true, adj:['saltmere','s_flats'],
  req:g=>F(g,'champion'), lock:'The ferry to Solenne only takes Halcyon’s champion.',
  d:'A whitewashed harbor town under red cliffs, where the ferry from Halcyon ties up at sunset and the air smells of salt and hot stone.',
  encLabel:'Fish the harbor', enc:[['pearlclam',3,6,18],['palmtoad',3,6,16],['dustquail',3,5,10],['brinewader',5,6,6]], rare:['shimmeray',8,8]});
SN('s_flats',{n:'Saltglass Flats', k:'route', x:112, y:205, tier:1, adj:['s_port','s_vinara'],
  d:'A white salt pan so flat and bright you can see the curve of the world. Creatures shimmer in the heat haze.',
  enc:[['dustquail',3,6,16],['camelump',4,7,12],['gecklit',3,6,14],['sandsnip',4,7,12],['dunekit',4,7,10],['sunasp',5,7,8],['skinkle',4,7,10],['tumbleroot',6,7,3]], rare:['miragefen',10,10]});
SN('s_vinara',{n:'Vinara', k:'town', x:165, y:170, tier:1, haven:'haven', shop:true, adj:['s_flats','s_canyon','s_aurelia'],
  d:'A hill town of vineyards and stone wine cellars. Every doorway has a grapevine growing over it.',
  encLabel:'Wander the vineyards', enc:[['grapling',6,10,18],['vintling',6,10,14],['palmkit',6,10,12],['pricklet',7,10,10],['vinebeetle',9,11,4],['sunbloom',9,11,3]], rare:['vinocerus',14,14]});
SN('s_canyon',{n:'Redcut Canyon', k:'cave', x:232, y:196, tier:2, adj:['s_vinara','s_mesa'],
  d:'A deep red canyon cut by a river that dried up a thousand years ago. The walls are carved with old sun-signs.',
  enc:[['cliffswift',10,14,12],['gecklit',10,14,10],['claylet',10,14,12],['mesashell',10,14,10],['sunasp',10,14,8],['crestram',12,15,6],['tombwrap',13,15,4],['sandsnip',10,14,8],['skinkle',10,14,8]], rare:['whirldust',16,16]});
SN('s_mesa',{n:'Mesa Alta', k:'town', x:300, y:168, tier:2, haven:'haven', shop:true, adj:['s_canyon','s_duneway'],
  d:'A town built on top of a mesa, reached by switchback stairs. It has two gyms and an opinion about both.'});
SN('s_duneway',{n:'Duneway', k:'route', x:332, y:105, tier:2, adj:['s_mesa','s_mirrow'],
  d:'An old caravan road through rolling dunes, marked with cairns every mile.',
  enc:[['camelump',16,20,10],['scarablet',16,20,12],['tumbleroot',17,21,8],['pricklet',16,20,8],['tarling',16,20,10],['dustquail',16,19,6],['duneplume',20,22,4],['dunekit',16,20,8],['sandsnip',16,20,8],['whirldust',18,22,6],['dromedune',22,22,2]], rare:['heliskink',24,24]});
SN('s_mirrow',{n:'Mirrowell Oasis', k:'town', x:274, y:62, tier:3, haven:'haven', shop:true, adj:['s_duneway','s_ruins'],
  d:'Palms and blue water in the middle of the desert, and two gyms built over the water.',
  encLabel:'Fish the oasis', enc:[['palmtoad',18,22,12],['pearlclam',18,22,10],['shimmeray',20,24,6],['brinegator',20,24,6],['brinewader',18,22,10],['palmkit',18,22,8],['ibisage',20,24,5]], rare:['pearlord',28,28]});
SN('s_ruins',{n:'Sunstone Ruins', k:'cave', x:200, y:44, tier:3, adj:['s_mirrow','s_cliff'],
  d:'The half-buried palace of Solenne’s first kings, its halls lined with sun-discs and sealed tombs.',
  enc:[['urnling',24,28,12],['claylet',24,28,8],['clayguard',26,30,6],['sphinxit',24,28,10],['scarabsun',26,30,6],['sentrilith',27,31,4],['djinnspark',27,31,4],['jackalith',28,32,4],['tombwrap',24,30,10],['miragefen',26,30,6]], rare:['sphinxara',34,34]});
SN('s_cliff',{n:'Cliffhaven', k:'town', x:118, y:72, tier:4, haven:'haven', shop:true, adj:['s_ruins','s_aurelia'],
  d:'Houses carved into a canyon wall and joined by rope bridges. The wind never stops here, so neither do the windchimes.',
  encLabel:'Climb the cliff paths', enc:[['cliffswift',28,32,14],['kitelet',28,32,14],['canyonswift',30,34,6],['ibisage',28,32,8],['gecklit',28,32,6],['crestram',28,32,8],['whirldust',28,32,6]], rare:['stormkite',36,36]});
SN('s_aurelia',{n:'Aurelia', k:'town', x:178, y:118, tier:4, haven:'haven', shop:true, adj:['s_cliff','s_vinara','s_steps','n_port'],
  d:'Solenne’s capital: gold domes, a sun temple, and a mooring mast where airships leave for the north.',
  encLabel:'Wander the bazaar', enc:[['camelump',30,34,8],['palmkit',30,34,8],['ibisage',30,34,6],['djinnspark',32,36,4],['sunbloom',30,34,6],['heliskink',32,36,4]], rare:['sunmane',38,38]});
SN('s_steps',{n:'Skyreach Steps', k:'cave', x:62, y:128, tier:5, haven:'lodge', shop:true, adj:['s_aurelia','s_league'],
  req:g=>rb(g,'solenne') >= 8, lock:'The steps to the Sunspire League open for trainers with all eight Solenne badges.',
  d:'Ten thousand stone steps up a red mountain to the Sunspire League. Pilgrims rest at a lodge halfway.',
  enc:[['sunmane',40,44,6],['plateaurtle',40,44,6],['gecklord',40,44,6],['sphinxara',42,46,4],['stormkite',40,44,6],['amphorite',40,44,6],['pyrocobra',40,44,6],['terraknight',42,46,3],['duneskorp',40,44,6],['tarmaw',40,44,5],['vinocerus',40,44,5],['dromedune',40,44,5]], rare:['solscarab',48,48]});
SN('s_league',{n:'Sunspire League', k:'league', x:46, y:66, tier:5, adj:['s_steps'],
  req:g=>rb(g,'solenne') >= 8, lock:'The Sunspire League admits only trainers with all eight Solenne badges.',
  d:'A gold-roofed hall on the mountain’s peak, where the sun is first to rise and last to set.'});
NODES.saltmere.adj.push('s_port');

/* ---------------- Nordhaven map ---------------- */
const NN = (id, o) => N(id, Object.assign({ rg:'nordhaven', tier:3 }, o));
NN('n_port',{n:'Skerrport', k:'town', x:330, y:248, tier:1, haven:'haven', shop:true, adj:['s_aurelia','n_trail'],
  req:g=>F(g,'champion_solenne'), lock:'The airship north only flies for Solenne’s champion.',
  d:'A snowy harbor where the airship from the south moors beside fishing boats. Every roof has a carved dragon on its ridge.',
  encLabel:'Fish the harbor', enc:[['puffling',3,6,14],['shoalette',3,6,14],['otterkin',3,6,12],['krakling',4,6,8],['narwhelp',4,6,8],['deeplure',5,6,6]], rare:['selkine',8,8]});
NN('n_trail',{n:'Pinewood Trail', k:'route', x:268, y:224, tier:1, adj:['n_port','n_pinewick'],
  d:'A trail through dark pines heavy with snow. Something always seems to be watching from between the trunks.',
  enc:[['conelet',3,6,12],['martling',3,6,12],['huskling',3,6,10],['snowkit',4,7,10],['frostmite',3,6,12],['howlpup',4,7,10],['rimefawn',5,7,6],['frostcub',5,7,6]], rare:['snowhorn',10,10]});
NN('n_pinewick',{n:'Pinewick', k:'town', x:205, y:236, tier:1, haven:'haven', shop:true, adj:['n_trail','n_fjordmere'],
  d:'A logging village in a clearing, smelling of sap and woodsmoke.',
  encLabel:'Search the pine groves', enc:[['conelet',6,10,14],['martling',6,10,12],['lichenling',6,10,10],['frostmite',6,10,12],['skaldbird',9,11,4],['mosstroll',9,11,3],['howlpup',6,10,8]], rare:['sprucekit',16,16]});
NN('n_fjordmere',{n:'Fjordmere', k:'town', x:130, y:214, tier:2, haven:'haven', shop:true, adj:['n_pinewick','n_glacier'],
  d:'A fishing town at the head of a long fjord, with a longship gym in the harbor and a frozen waterfall gym across the water.',
  encLabel:'Fish the fjord', enc:[['narwhelp',10,14,10],['puffling',10,14,10],['shoalette',10,14,10],['otterkin',10,14,10],['krakling',10,14,8],['deeplure',10,14,8],['selkine',13,16,4],['driftmare',13,16,4]], rare:['fjorddrake',20,20]});
NN('n_glacier',{n:'Glacier Pass', k:'cave', x:90, y:160, tier:2, adj:['n_fjordmere','n_hollow'],
  d:'A pass through blue ice, where the glacier groans like a sleeping animal.',
  enc:[['frostcub',16,20,10],['snowkit',16,19,8],['frostpincer',16,20,10],['chillwisp',16,20,8],['huskling',16,20,8],['muskhorn',18,22,5],['tuskolith',18,22,5],['snowhorn',18,22,6],['howlpup',16,20,6],['snowstride',20,22,3]], rare:['arctivix',24,24]});
NN('n_hollow',{n:'Hollowfrost', k:'town', x:120, y:105, tier:3, haven:'haven', shop:true, adj:['n_glacier','n_whisper','n_peak'],
  d:'A quiet town of turf-roofed houses around a barrow field. People leave bread on the barrows, just in case.',
  encLabel:'Walk the barrow field', enc:[['chillwisp',20,24,16],['runeshield',20,24,12],['skaldbird',20,24,8],['menhirling',20,24,8],['hollowcrow',22,26,6],['barrowight',22,26,5]], rare:['frostgeist',30,30]});
NN('n_whisper',{n:'Whisperwood', k:'route', x:192, y:90, tier:3, adj:['n_hollow','n_runestad'],
  d:'A forest where the wind in the branches sounds almost like voices. Lately it sounds like singing.',
  enc:[['lichenling',24,28,10],['chillwisp',24,28,8],['sprucekit',24,28,6],['skaldbird',24,28,8],['gulotooth',26,30,4],['menhirling',24,28,6],['hollowcrow',24,28,8],['mosstroll',24,28,6],['fenrime',28,30,3]], rare:['runegolem',32,32]});
NN('n_peak',{n:'Aurora Peak', k:'cave', x:50, y:98, tier:4, adj:['n_hollow'],
  req:g=>F(g,'choir_known'), lock:'The path up Aurora Peak is buried in snow. Someone in Whisperwood knows another way.',
  d:'A summit above the clouds where the northern lights hang so low you could almost touch them.',
  enc:[['aurorelk',30,34,8],['polarvixen',34,36,3],['lumisprite',32,36,4],['frostgeist',30,34,6],['stormhawk',30,34,5],['frostflame',30,34,4],['rimewing',30,34,8],['fenrime',30,34,6],['runegolem',30,34,5],['arctivix',30,34,6]], rare:['lumisprite',38,38]});
NN('n_runestad',{n:'Runestad', k:'town', x:262, y:122, tier:4, haven:'haven', shop:true, adj:['n_whisper','n_highmark'],
  d:'A town among standing stones carved with runes, home to a library of stone and a quarry gym.',
  encLabel:'Wander the stone circles', enc:[['menhirling',28,32,14],['runeshield',28,32,12],['monolord',33,34,4],['skaldbird',28,32,8],['runegolem',30,34,5]], rare:['monolord',36,36]});
NN('n_highmark',{n:'Highmark', k:'town', x:332, y:94, tier:4, haven:'haven', shop:true, adj:['n_runestad','n_drakenspire'],
  d:'A walled hill town with a great mead hall where the whole town watches every gym battle.'});
NN('n_drakenspire',{n:'Drakenspire', k:'town', x:288, y:46, tier:5, haven:'haven', shop:true, adj:['n_highmark','n_steps'],
  d:'A basalt tower town where dragons have nested for a thousand years. The gym is at the very top.',
  encLabel:'Climb the dragon roosts', enc:[['fjorddrake',36,40,6],['stormhawk',36,40,8],['skywyrm',36,40,8],['voltwyrm',38,42,4],['wyrmlet',36,38,6]], rare:['voltwyrm',44,44]});
NN('n_steps',{n:'Aurora Steps', k:'cave', x:200, y:36, tier:5, haven:'lodge', shop:true, adj:['n_drakenspire','n_league'],
  req:g=>rb(g,'nordhaven') >= 8, lock:'The Aurora Steps open for trainers with all eight Nordhaven badges.',
  d:'An ice stair to the Aurora League, lit from above by the northern lights.',
  enc:[['glacibear',42,46,5],['runebreaker',42,46,5],['borealynx',43,46,3],['huskarl',42,46,5],['martenfang',42,46,5],['krakenmaw',42,46,4],['abysslure',42,46,4],['glaciclaw',42,46,4],['otterhelm',42,46,4],['puffinarch',42,46,4],['shoalstorm',42,46,4],['narwhallow',42,46,4],['tuskolith',42,46,5],['muskhorn',42,46,5]], rare:['voltwyrm',48,48]});
NN('n_league',{n:'Aurora League', k:'league', x:122, y:40, tier:5, adj:['n_steps'],
  req:g=>rb(g,'nordhaven') >= 8, lock:'The Aurora League admits only trainers with all eight Nordhaven badges.',
  d:'A hall of pale stone under a sky that never quite goes dark, where the north’s best trainers wait.'});

/* ---------------- New Halcyon creatures in the wild ---------------- */
function addEnc(id, rows){ NODES[id].enc = (NODES[id].enc || []).concat(rows); }
addEnc('thistle', [['puddlepup',3,5,10]]);
addEnc('route1', [['burrbun',3,5,10]]);
addEnc('greenwood', [['sparkgrub',4,6,6],['spinnet',4,6,6],['mosskit',5,6,4]]);
addEnc('moonwell', [['cobblet',8,11,8],['chimeling',9,11,4]]);
addEnc('capethorn', [['coralet',12,14,8],['inkwhirl',13,15,3]]);
addEnc('underpass', [['seedswift',14,16,8],['puddlepup',14,16,4]]);
addEnc('gloomrock', [['sparkmole',16,18,5],['cobblet',15,18,6],['thudmole',17,18,3]]);
addEnc('ashgrove', [['wispurr',18,21,6],['duskmoth',20,22,4]]);
addEnc('lanternroad', [['mosskit',20,23,6],['chimeling',20,22,5],['mindcap',21,23,4],['sparkgrub',20,22,4]]);
addEnc('skyway', [['kindlefist',26,29,5],['staticat',26,29,5],['galeleaf',28,30,4]]);
addEnc('wildreach', [['thistlehare',26,29,5],['fernlynx',26,29,4],['steamtoad',26,29,4],['burrbun',24,26,4]]);
addEnc('rimefrost', [['reefwarden',32,34,5],['inkwhirl',30,33,5],['coralet',30,32,4]]);
addEnc('cinderisle', [['cinderwing',32,35,6],['steamtoad',32,35,5],['kindlefist',32,35,5]]);
addEnc('summitpass', [['slatehorn',40,43,6],['thudmole',40,43,5],['scaleling',38,40,3]]);
addEnc('hollowbelow', [['silkfang',50,55,5],['torrenthound',50,55,5],['drakonarch',52,56,3]]);

/* ---------------- Gyms ---------------- */
function rewardStone(g, reward, region){
  if (!reward) return null;
  if (reward === 'starter') { const left = REGION_STARTERS[region].map(s => REGION_FINAL[s]).filter(sp => !g.keys['apexstone_' + sp]); return left.length ? left[0] : null; }
  return g.keys['apexstone_' + reward] ? null : reward;
}
function rewardText(g, reward, region){
  const sp = rewardStone(g, reward, region);
  if (sp) return `\n\nWith the badge comes a second gift: an Apex Stone that hums when you hold it near a ${SPECIES[sp].n}.`;
  return '\n\nWith the badge comes a pouch of three Wisdom Fruits.';
}
function giveReward(g, reward, region){
  const sp = rewardStone(g, reward, region);
  if (sp) giveKey(g, 'apexstone_' + sp);
  else give(g, 'wisdomfruit', 3);
}
function GYM(o){
  const top = Math.max(...o.team.map(t => t[1]));
  T(o.leader, o.name, 100, o.team, '', o.outro, { ai:'smart', heals:top >= 30 ? 2 : 1, leader:true, apex:o.apex || null });
  T(o.leader + '_gt', o.tname, 30, o.tteam.map(sp => [sp, top - 4]), o.tline || '“You’ll have to get past me first!”', '“Go on, then.”', {});
  BADGES.push([o.badge, o.badgeName, o.name.replace('Leader ', ''), NODES[o.node].n, o.type, o.region]);
  SC('gym_' + o.badge, { node:o.node, title:o.title, gym:true, req:g => !hasBadge(g, o.badge), steps:{
    start:{ t:o.text, c:[{ l:o.pl, chk:o.chk, go:'leader', fail:'fail' }, { l:'Battle ' + o.tname + ' instead', battle:o.leader + '_gt', go:'leader' }] },
    fail:{ t:o.failText, c:[{ l:'Battle ' + o.tname, battle:o.leader + '_gt', go:'leader' }] },
    leader:{ t:o.intro, c:[{ l:'Challenge ' + o.name, battle:o.leader, go:'win' }] },
    win:{ t:g => o.win + rewardText(g, o.reward, o.region), do:g => { badge(g, o.badge); giveReward(g, o.reward, o.region); }, end:true }
  }});
}

GYM({ region:'solenne', node:'s_vinara', badge:'vintage', badgeName:'Vintage Badge', type:'grass', title:'Vinara Gym', name:'Leader Ines', leader:'ines', reward:'starter',
  team:[['vintling',11],['palmkit',12],['grapling',13]],
  text:'Vinara Gym is a terraced vineyard under glass. The paths between the vines twist back on themselves, and somewhere in the middle a bell rings every few minutes.',
  pl:'Follow the sound of the bell through the vines', chk:['survival',12], failText:'The vines all look the same. A vintner in a straw hat steps out of the rows, amused.',
  tname:'Vintner Paolo', tteam:['grapling','vintling'],
  intro:'Leader Ines is pressing grapes barefoot in a wooden vat. She climbs out, wipes her feet on her apron and grins. “Halcyon’s champion, starting from scratch in my vineyard! Let’s see if your roots go deep.”',
  outro:'“Deep roots.”', win:'“Deep roots,” Ines says, and pins the Vintage Badge to your collar: a tiny enamel cluster of grapes.' });
GYM({ region:'solenne', node:'s_mesa', badge:'mesa', badgeName:'Mesa Badge', type:'rock', title:'Mesa Alta Climbing Gym', name:'Leader Tomas', leader:'tomas', reward:'sphinxara',
  team:[['gecklit',16],['mesashell',17],['crestram',19]],
  text:'Mesa Alta’s first gym is a sheer climbing wall three hundred feet high. The leader waits at the top.',
  pl:'Climb the wall', chk:['athletics',13], failText:'Halfway up, your grip slips. A climber on a belay rope swings over. “Battle me and I’ll show you the easy route.”',
  tname:'Climber Rosa', tteam:['gecklit','claylet'],
  intro:'Leader Tomas sits on the lip of the mesa with his legs dangling over three hundred feet of air. “Good view, eh? Let’s make it a good battle.”',
  outro:'“Solid as the mesa.”', win:'“Solid as the mesa,” Tomas says. The Mesa Badge is a disc of red sandstone.' });
GYM({ region:'solenne', node:'s_mesa', badge:'gauntlet', badgeName:'Gauntlet Badge', type:'fighting', title:'Mesa Alta Boxing Gym', name:'Leader Brigid', leader:'brigid', reward:'terraknight',
  team:[['claylet',20],['crestram',21],['clayguard',23]],
  text:'The second gym in Mesa Alta is a boxing hall carved into the rock, loud with the thud of gloves on bags.',
  pl:'Square up and stare down the whole hall', chk:['intimidation',13], failText:'Nobody is impressed. A sparring partner taps you on the shoulder.',
  tname:'Boxer Dario', tteam:['claylet','crestram'],
  intro:'Leader Brigid tapes her knuckles without looking up. “Champions talk a lot. Show me.”',
  outro:'“Good hands.”', win:'“Good hands,” Brigid says, which from her is a speech. The Gauntlet Badge is a tiny bronze fist.' });
GYM({ region:'solenne', node:'s_mirrow', badge:'oasis', badgeName:'Oasis Badge', type:'water', title:'Mirrowell Water Gym', name:'Leader Sefa', leader:'sefa', reward:'starter',
  team:[['palmtoad',24],['pearlclam',25],['brinewader',26],['lilyhopper',28]],
  text:'Mirrowell’s first gym floats on the oasis itself: a ring of wooden platforms over water so clear you can see the fish thinking.',
  pl:'Read the ripples for the hidden stepping stones', chk:['perception',14], failText:'Splash. A swimmer surfaces beside you, laughing.',
  tname:'Swimmer Kalani', tteam:['palmtoad','brinewader'],
  intro:'Leader Sefa stands on the water. It takes you a moment to see the glass platform under her feet. “The desert teaches you to respect water. Let me teach you the rest.”',
  outro:'“You flow well.”', win:'“You flow well,” Sefa says. The Oasis Badge is a drop of blue glass on a gold pin.' });
GYM({ region:'solenne', node:'s_mirrow', badge:'essence', badgeName:'Essence Badge', type:'poison', title:'Mirrowell Perfumery Gym', name:'Leader Nadir', leader:'nadir', reward:'solscarab',
  team:[['sunasp',30],['tarmaw',31],['vintoxin',32],['pyrocobra',34]],
  text:'The oasis’s second gym is a perfumery, all copper stills and tiny bottles. Some of the bottles say DO NOT SMELL.',
  pl:'Mix the antidote the door lock asks for', chk:['nature',14], failText:'The lock puffs purple smoke. A perfumer steps out, coughing politely.',
  tname:'Perfumer Amira', tteam:['tarling','sunasp'],
  intro:'Leader Nadir corks a vial and smiles thinly. “Every poison is a perfume in the right dose.”',
  outro:'“The right dose.”', win:'“The right dose,” Nadir murmurs, and hands over the Essence Badge, a tiny glass bottle on a chain.' });
GYM({ region:'solenne', node:'s_cliff', badge:'updraft', badgeName:'Updraft Badge', type:'flying', title:'Cliffhaven Sky Gym', name:'Leader Aria', leader:'aria', reward:'stormkite', apex:['stormkite'],
  team:[['canyonswift',36],['duneplume',37],['brinewader',38],['stormkite',40]],
  text:'Cliffhaven Gym is a run of rope bridges strung between the cliff houses, swaying in the canyon wind.',
  pl:'Cross the bridges in time with the wind', chk:['acrobatics',15], failText:'A gust nearly takes you. A sky diver catches your collar. “Battle first. Then I’ll walk you across.”',
  tname:'Sky Diver Teo', tteam:['canyonswift','duneplume'],
  intro:'Leader Aria balances on a single rope over the canyon, arms out. “Up here, you either fly or you learn to.”',
  outro:'“You flew.”', win:'“You flew,” Aria says, and drops the Updraft Badge into your palm: a little silver feather.' });
GYM({ region:'solenne', node:'s_cliff', badge:'thunderhead', badgeName:'Thunderhead Badge', type:'electric', title:'Cliffhaven Lightning Gym', name:'Leader Kade', leader:'kade', reward:null, apex:['stormkite'],
  team:[['djinnspark',40],['heliskink',42],['stormkite',44]],
  text:'The second Cliffhaven gym is a lightning farm: copper rods along the cliff edge, humming with stored storms.',
  pl:'Reroute the charge so the door opens', chk:['investigation',15], failText:'The door sparks and stays shut. An engineer in rubber boots sighs and sets down her clipboard.',
  tname:'Engineer Lucia', tteam:['kitelet','djinnspark'],
  intro:'Leader Kade is halfway up a lightning rod in a thunderstorm, holding on with one hand. “Perfect weather! Let’s go!”',
  outro:'“What a jolt!”', win:'“What a jolt!” Kade slides down the rod and hands over the Thunderhead Badge, still faintly warm.' });
GYM({ region:'solenne', node:'s_aurelia', badge:'solar', badgeName:'Solar Badge', type:'fire', title:'Aurelia Sun Temple Gym', name:'Leader Calix', leader:'calix', reward:'sunmane', apex:['sunmane'],
  team:[['heliskink',44],['sunbloom',45],['pyrocobra',46],['sunmane',48]],
  text:'Aurelia’s gym is the old sun temple at the heart of the capital, its floor polished brass that throws the noon light everywhere at once.',
  pl:'Read the sundial to find the true door', chk:['investigation',16], failText:'You choose wrong. A temple guard steps out of the glare.',
  tname:'Temple Guard Ilario', tteam:['heliskink','sunbloom'],
  intro:'Leader Calix, in white robes hemmed with gold, turns from the altar fire. “Solenne was built by the sun. Let me show you why it still stands.”',
  outro:'“The sun approves.”', win:'“The sun approves,” Calix says, and places the Solar Badge in your hand. “The Sunspire League waits at the top of Skyreach Steps.”' });

GYM({ region:'nordhaven', node:'n_pinewick', badge:'pinecone', badgeName:'Pinecone Badge', type:'bug', title:'Pinewick Gym', name:'Leader Linnea', leader:'linnea', reward:'starter',
  team:[['frostmite',12],['conelet',13],['frostmite',14]],
  text:'Pinewick Gym is a hollow pine the size of a house, its walls alive with the soft clicking of a thousand beetles.',
  pl:'Follow the beetle trails to the leader’s room', chk:['survival',13], failText:'The trails split and split again. A bug catcher pops out of a knot-hole.',
  tname:'Bug Catcher Nils', tteam:['frostmite','conelet'],
  intro:'Leader Linnea is cupping a moth in her hands. She lets it go. “The forest is small things, champion. Thousands of them. Shall I show you?”',
  outro:'“Thousands of small things.”', win:'“Thousands of small things,” Linnea says, and pins the Pinecone Badge to your coat.' });
GYM({ region:'nordhaven', node:'n_fjordmere', badge:'longship', badgeName:'Longship Badge', type:'water', title:'Fjordmere Longship Gym', name:'Leader Haakon', leader:'haakon', reward:'krakenmaw',
  team:[['otterkin',17],['shoalette',18],['puffling',18],['narwhelp',20]],
  text:'Fjordmere’s first gym is a longship moored in the fjord, its deck cleared for battle and the leader waiting at the prow.',
  pl:'Row out to the ship through the swell', chk:['athletics',13], failText:'The swell takes your oar. A sailor hauls you aboard, dripping.',
  tname:'Sailor Bjorn', tteam:['otterkin','puffling'],
  intro:'Leader Haakon, enormous and red-bearded, laughs from the prow. “A southerner on my ship! Let us see your sea legs!”',
  outro:'“Sea legs!”', win:'“Sea legs!” Haakon roars, and claps the Longship Badge into your hand hard enough to sting.' });
GYM({ region:'nordhaven', node:'n_fjordmere', badge:'rime', badgeName:'Rime Badge', type:'ice', title:'Fjordmere Ice Gym', name:'Leader Solvi', leader:'solvi', reward:'polarvixen',
  team:[['huskling',21],['snowkit',21],['frostcub',23],['arctivix',25]],
  text:'Across the harbor, Fjordmere’s second gym is a frozen waterfall with a door cut into the ice.',
  pl:'Find the warm draft that marks the true passage', chk:['perception',14], failText:'Every passage is cold. A skater glides out of the ice.',
  tname:'Skater Ingrid', tteam:['snowkit','huskling'],
  intro:'Leader Solvi skates a slow circle on the frozen pool. “Ice is patient. Let’s see how long you last on it.”',
  outro:'“Steady on the ice.”', win:'“Steady on the ice,” Solvi says. The Rime Badge is as clear as the waterfall.' });
GYM({ region:'nordhaven', node:'n_hollow', badge:'barrow', badgeName:'Barrow Badge', type:'ghost', title:'Hollowfrost Barrow Gym', name:'Leader Eirik', leader:'eirik', reward:null,
  team:[['chillwisp',26],['hollowcrow',27],['barrowight',28],['frostgeist',30]],
  text:'Hollowfrost Gym is a barrow mound under the snow, with a stone door and old runes for keeping the dead in. Or out.',
  pl:'Read the warding runes before you enter', chk:['investigation',14], failText:'You read a rune wrong. Every candle inside turns to face you. A mourner rises from a bench.',
  tname:'Mourner Hedda', tteam:['chillwisp','hollowcrow'],
  intro:'Leader Eirik sits on a stone coffin, whittling. “The dead here are friendly. Mostly. Let’s see if they like you.”',
  outro:'“They like you.”', win:'“They like you,” Eirik decides, and hands over the Barrow Badge, a ring of grey iron.' });
GYM({ region:'nordhaven', node:'n_runestad', badge:'rune', badgeName:'Rune Badge', type:'psychic', title:'Runestad Stone Library Gym', name:'Leader Ragna', leader:'ragna', reward:'starter',
  team:[['menhirling',32],['rimefawn',33],['skaldbird',34],['aurorelk',36]],
  text:'Runestad’s first gym is a library of standing stones, carved with runes that rearrange themselves when you look away.',
  pl:'Read the stones in the order they want to be read', chk:['insight',15], failText:'The runes laugh at you. Quite audibly. A seer steps out from behind a stone.',
  tname:'Seer Eldrid', tteam:['menhirling','skaldbird'],
  intro:'Leader Ragna does not open her eyes. “You have been reading my stones for an hour. I have been reading you.”',
  outro:'“Clearer now.”', win:'“Clearer now,” Ragna says. The Rune Badge is a small carved stone, warm in your hand.' });
GYM({ region:'nordhaven', node:'n_runestad', badge:'bedrock', badgeName:'Bedrock Badge', type:'ground', title:'Runestad Quarry Gym', name:'Leader Torvald', leader:'torvald', reward:'runebreaker', apex:['runebreaker'],
  team:[['muskhorn',37],['tuskolith',39],['runebreaker',41]],
  text:'Runestad’s second gym is a quarry pit where the ground itself is the arena and the walls lean in.',
  pl:'Brace yourself on the shifting floor', chk:['str',15], failText:'The floor slides out from under you. A quarryman offers a hand, then a battle.',
  tname:'Quarryman Leif', tteam:['muskhorn','tuskolith'],
  intro:'Leader Torvald plants a shovel in the dirt. “The earth was here before the runes and before the people. It will be here after. Shall we?”',
  outro:'“Good footing.”', win:'“Good footing,” Torvald says. The Bedrock Badge is a rough cube of granite.' });
GYM({ region:'nordhaven', node:'n_highmark', badge:'hearth', badgeName:'Hearth Badge', type:'normal', title:'Highmark Mead Hall Gym', name:'Leader Hilde', leader:'hilde', reward:'glacibear',
  team:[['snowhorn',41],['martenfang',42],['skaldbird',43],['gulotooth',44],['muskhorn',45]],
  text:'Highmark Gym is a mead hall with the long tables pushed back, a fire roaring, and the whole town on the benches to watch.',
  pl:'Win the crowd over with a toast', chk:['persuasion',16], failText:'The crowd boos good-naturedly. A shieldmaiden stands up from the benches.',
  tname:'Shieldmaiden Tove', tteam:['snowhorn','gulotooth'],
  intro:'Leader Hilde raises a horn cup to you from the high table. “Every warrior of the north has battled in this hall. Welcome, southerner. Now fight.”',
  outro:'“You will always have a seat at my table.”', win:'The hall erupts. Hilde hands you the Hearth Badge, a tiny bronze shield. “You will always have a seat at my table.”' });
GYM({ region:'nordhaven', node:'n_drakenspire', badge:'dragonscale', badgeName:'Dragonscale Badge', type:'dragon', title:'Drakenspire Gym', name:'Leader Sigurd', leader:'sigurd', reward:'borealynx',
  team:[['skywyrm',46],['voltwyrm',47],['fjorddrake',48],['voltwyrm',49]],
  text:'Drakenspire Gym is the top of a basalt tower where dragons have nested for a thousand years. The wind up here could knock a person flat.',
  pl:'Climb the outer stair without looking down', chk:['wis',16], failText:'You look down. A dragon tamer catches your elbow.',
  tname:'Dragon Tamer Asa', tteam:['voltwyrm','fjorddrake'],
  intro:'Leader Sigurd stands at the edge with a Voltwyrm coiled around his shoulders like a cloak. “Every trainer in the north ends here, or stops here. Which are you?”',
  outro:'“Ends here.”', win:'“Ends here,” Sigurd says, and hands you the Dragonscale Badge. “The Aurora League waits beyond the Aurora Steps.”' });

/* ---------------- Leagues ---------------- */
function LEAGUE(o){
  for (const e of o.elites) T(e.id, e.name, 120, e.team, e.line, e.outro, { ai:'smart', heals:o.heals || 1, apex:e.apex || null });
  T(o.champ.id, o.champ.name, 160, o.champ.team, o.champ.line, o.champ.outro, { ai:'smart', heals:(o.heals || 1) + 1, apex:o.champ.apex || null });
  const steps = { start:{ t:o.intro, c:[{ l:'Open the first door', go:'e1' }, { l:'Not yet', go:'notyet' }] }, notyet:{ t:'The doors will wait.', end:true } };
  o.elites.forEach((e, i) => { steps['e' + (i + 1)] = { t:e.text, c:[{ l:'Battle ' + e.name, battle:e.id, go:i === o.elites.length - 1 ? 'champ' : 'e' + (i + 2), rematch:true }] }; });
  steps.champ = { t:o.champ.text, c:[{ l:'Battle ' + o.champ.name, battle:o.champ.id, go:'hof', rematch:true }] };
  steps.hof = { t:o.hof, do:g => becomeRegionChampion(g, o.region), end:true };
  SC('league_' + o.region, { node:o.node, title:o.title, repeat:true, req:g => !F(g, 'champion_' + o.region), steps });
  SC('league_' + o.region + '_rematch', { node:o.node, title:o.title + ' again', repeat:true, req:g => F(g, 'champion_' + o.region), steps:Object.assign({}, steps, { hof:{ t:'Your name goes up on the wall of champions again. The League adds three Wisdom Fruits and an Absolute Capsule to your bag.', do:g => { g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 3; g.items.absolute = (g.items.absolute || 0) + 1; becomeRegionChampion(g, o.region); }, end:true } }) });
}
LEAGUE({ region:'solenne', node:'s_league', title:'Challenge the Sunspire League', heals:2,
  intro:'The Sunspire League’s doors are beaten gold. Behind them wait four elites and Solenne’s champion. There is no rest between them.',
  elites:[
    { id:'s_e1', name:'Elite Saffi', team:[['duneskorp',55],['miragefen',55],['dromedune',56],['terraknight',57],['plateaurtle',57]], apex:['terraknight'], line:'“Sand gets everywhere. Especially into a losing team.”', outro:'“Fine. It’s in my teeth now.”', text:'SAFFI. A hall knee-deep in warm sand. Saffi lounges on a dune, sunglasses on. “Ready to get sand in your shoes?”' },
    { id:'s_e2', name:'Elite Ottavio', team:[['duneskorp',56],['vinebeetle',56],['scarabsun',57],['solscarab',59]], apex:['solscarab'], line:'“My bugs have been waiting all morning.”', outro:'“They’ll want a rematch.”', text:'OTTAVIO. A glass hall humming with insect wings. Ottavio adjusts his monocle. “My bugs have been waiting all morning.”' },
    { id:'s_e3', name:'Elite Mireille', team:[['miragefen',57],['ibisage',57],['pearlord',58],['shimmeray',58],['sphinxara',60]], apex:['sphinxara'], line:'“I’ve already seen how this goes.”', outro:'“I saw that too. I hoped I was wrong.”', text:'MIREILLE. Mirrors on every wall, and a dozen of you in each. Mireille does not turn around. “I have already seen how this goes.”' },
    { id:'s_e4', name:'Elite Basilio', team:[['tombwrap',58],['crestram',58],['gecklord',59],['sentrilith',59],['plateaurtle',61]], line:'“Mountains do not move for anyone.”', outro:'“Well. This one did.”', text:'BASILIO. A hall of raw red stone. Basilio sits on a boulder, enormous and calm. “Mountains do not move for anyone.”' }
  ],
  champ:{ id:'s_champ', name:'Champion Seraphine', team:[['heliskink',60],['canyonswift',60],['vinocerus',60],['dromedune',61],['stormkite',61],['sunmane',64]], apex:['sunmane'], line:'“Solenne’s sun has been waiting for you.”', outro:'“The sun sets on me, for once.”', text:'The last door opens onto a terrace above the clouds. Champion Seraphine, all gold and white, rises from a sun-throne. “Halcyon’s champion, starting over in my region. Solenne’s sun has been waiting for you.”' },
  hof:'Seraphine laughs, a warm sound, and takes your hand. “Solenne has a new champion.” Your partners’ names are written in gold leaf on the Sunspire wall.\n\nOutside, Corin is waiting with two airship tickets. “There’s a region up north. Nordhaven. They say the sky sings there. Fresh start again?” The airship leaves from Aurelia.' });
LEAGUE({ region:'nordhaven', node:'n_league', title:'Challenge the Aurora League',
  intro:'The Aurora League is a hall of pale stone under a sky that never quite goes dark. Four elites and Nordhaven’s champion wait inside.',
  elites:[
    { id:'n_e1', name:'Elite Frida', team:[['fenrime',54],['tuskolith',54],['rimewing',54],['glacibear',55],['polarvixen',57]], apex:['polarvixen'], line:'“Southerners always feel the cold first.”', outro:'“You did not feel it at all.”', text:'FRIDA. A hall of blue ice and blowing snow. Frida smiles without warmth. “Southerners always feel the cold first.”' },
    { id:'n_e2', name:'Elite Arne', team:[['barrowight',55],['otterhelm',55],['huskarl',56],['glacibear',56],['runebreaker',58]], apex:['runebreaker'], line:'“No runes. No tricks. Fists.”', outro:'“Good fists.”', text:'ARNE. A stone ring under the open sky. Arne cracks his knuckles one at a time. “No runes. No tricks. Fists.”' },
    { id:'n_e3', name:'Elite Liv', team:[['driftmare',56],['hollowcrow',56],['frostgeist',57],['fenrime',58]], line:'“The dead of the north have heard of you.”', outro:'“They will talk about you for a long time.”', text:'LIV. A barrow hall lit by green flames. Liv sits with a raven on each shoulder. “The dead of the north have heard of you.”' },
    { id:'n_e4', name:'Elite Gunnar', team:[['voltwyrm',57],['fjorddrake',58],['skywyrm',58],['fjorddrake',60]], line:'“The dragons came north first. They will be here last.”', outro:'“...They bow to you. I have never seen that.”', text:'GUNNAR. A ledge on the open mountainside, dragons circling below. Gunnar does not raise his voice. “The dragons came north first. They will be here last.”' }
  ],
  champ:{ id:'n_champ', name:'Champion Astrid', team:[['runegolem',59],['fenrime',59],['krakenmaw',60],['borealynx',60],['voltwyrm',61],['polarvixen',63]], apex:['krakenmaw'], line:'“Three regions. Let’s see if it shows.”', outro:'“It shows.”', text:'The last door opens onto the sky itself: a platform of glass under the singing aurora. Champion Astrid stands at its edge in a cloak of white fur. “Three regions, three fresh starts. Let’s see if it shows.”' },
  hof:'Astrid bows, deep and slow. Behind her the aurora brightens until the whole sky is singing. “Nordhaven has a new champion. So does the sky.”\n\nCorin throws an arm around your shoulders and doesn’t say anything for once. Then: “There’s a city down the coast that never sleeps. Arclight. The Undersea Express runs there from Skerrport.” They grin. “Fresh start number four?”' });

/* ---------------- Rivals ---------------- */
RIVAL_TEAMS.rival_s0 = [[0,5]];
RIVAL_TEAMS.rival_s1 = [['kitelet',22],['sunasp',22],['gecklit',21],[1,25]];
RIVAL_TEAMS.rival_solenne = [['stormkite',54],['pyrocobra',54],['sphinxara',55],['gecklord',54],['dromedune',54],[2,58]];
RIVAL_TEAMS.rival_n0 = [[0,5]];
RIVAL_TEAMS.rival_n1 = [['stormhawk',30],['martenfang',29],['shoalette',29],['aurorelk',31],[1,34]];
RIVAL_TEAMS.rival_nordhaven = [['stormhawk',54],['aurorelk',54],['glacibear',55],['krakenmaw',54],['runebreaker',54],[2,58]];
T('rival_s0','Corin',30,null,'“Type edge. Some things never change.”','“...Beginner’s luck. Again.”',{ rival:true, rline:'solenne' });
T('rival_s1','Corin',45,null,'“Let’s see whose team is growing up faster.”','“Okay. Yours. For now.”',{ rival:true, rline:'solenne', heals:1 });
T('rival_solenne','Corin',60,null,'“Let’s see whose bond is stronger.”','“...Okay. Yours. This time.”',{ rival:true, rline:'solenne', ai:'smart', heals:2, apex:['starter'] });
T('rival_n0','Corin',30,null,'“Fresh start. Again. Let’s go.”','“You’re annoyingly good at starting over.”',{ rival:true, rline:'nordhaven' });
T('rival_n1','Corin',50,null,'“Four badges each. Let’s settle who’s ahead.”','“Fine. You’re ahead. By a little.”',{ rival:true, rline:'nordhaven', heals:1 });
T('rival_nordhaven','Corin',70,null,'“Last one. Probably. Best one.”','“Best one.”',{ rival:true, rline:'nordhaven', ai:'smart', heals:2, apex:['starter'] });

/* ---------------- Villains ---------------- */
T('hand_grunts','Gilded Hand Smugglers',40,[['sandsnip',17],['sunasp',17],['tombwrap',18]],'“These relics are spoken for.”','“Crane won’t like this.”');
T('silas','Silas Crane',120,[['miragefen',30],['tombwrap',30],['duneskorp',31],['crestram',31],['sphinxara',33]],'“Everything old is for sale.”','“Not everything, apparently.”',{ ai:'smart', heals:1, apex:['sphinxara'] });
T('choir_singers','Pale Choir Singers',40,[['hollowcrow',27],['barrowight',27],['chillwisp',28]],'“Do not interrupt the song.”','“The song goes on without us.”');
T('cantor','Cantor Ylva',120,[['fenrime',36],['runegolem',36],['driftmare',37],['aurorelk',37],['frostgeist',38],['polarvixen',40]],'“Sing with us, or be silent.”','“The sky does not need us to sing. I see that now.”',{ ai:'smart', heals:2, apex:['polarvixen'] });

/* ---------------- Region stories ---------------- */
SC('s_arrive',{ node:'s_port', title:'A fresh start in Solenne', auto:true, steps:{
  start:{ t:'The ferry from Saltmere noses into Port Calder at sunset. The air smells of salt and hot stone, and red cliffs glow behind the town. Corin leans on the rail beside you, eating a fig.\n\n“Gramps made me leave my whole team at his daycare. Said a new region deserves a new start.” They grin. “Yours are there too. Fresh start. Race you.”\n\nOn the dock, a woman in a dusty field coat waves a wide hat: Professor Odalys Reyne. “Halcyon’s champion! Linden wrote to me. He says you’re starting over. Good. Solenne rewards beginners.”', c:[{ l:'Follow the professor to her dig office', go:'lab' }] },
  lab:{ t:'Three capsules sit on a crate of potsherds. “Every trainer who starts out in Solenne chooses one of these,” Reyne says. “Axlet, from the oases. Scorchick, from the canyon cliffs. Aloelet, from the deep desert.”',
    c:[{ l:'Choose Axlet, the oasis axolotl (Water)', go:'rival', do:g => pickRegionStarter(g, 'solenne', 'axlet') },
       { l:'Choose Scorchick, the canyon chick (Fire)', go:'rival', do:g => pickRegionStarter(g, 'solenne', 'scorchick') },
       { l:'Choose Aloelet, the desert sprout (Grass)', go:'rival', do:g => pickRegionStarter(g, 'solenne', 'aloelet') }] },
  rival:{ t:g => `Corin is already reaching past you for the capsule that beats yours: ${SPECIES[REGION_RIVAL.solenne[g.starters.solenne][0]].n}. “Type edge. Some things never change.”`, c:[{ l:'Battle Corin', battle:'rival_s0', soft:true, go:'band' }] },
  band:{ t:g => (g.lastBattle === 'win' ? '“Beginner’s luck. Again,” Corin mutters.' : '“Still got it,” Corin says.') + `\n\nProfessor Reyne opens a velvet box: a woven band set with a pale stone, and a second, warmer stone. “Solenne’s ruins taught us Apex Ascension. When a trainer and a fully grown partner trust each other completely, an Apex Stone lets that partner become everything it could be, for one battle. The band is yours. This stone answers ${SPECIES[REGION_FINAL[g.starters.solenne]].n}, once your partner grows into one.”\n\nShe frowns. “The Gilded Hand loot the old ruins for stones and sell them in the north. Be careful who you trust.”`,
    do:g => { giveKey(g, 'apexband'); giveKey(g, 'apexstone_' + REGION_FINAL[g.starters.solenne]); give(g, 'capsule', 5); setF(g, 'solenne_arrived'); }, end:true }
}});
SC('s_rival1',{ node:'s_mirrow', title:'Corin at the oasis', auto:true, req:g => rb(g, 'solenne') >= 3, steps:{
  start:{ t:'At the edge of the oasis, Corin is skipping stones across the water. “Three badges? Me too. Let’s see whose team is growing up faster.”', c:[{ l:'Battle Corin', battle:'rival_s1', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? '“Okay. Yours. For now,” Corin says.' : '“Mine!” Corin crows.') + ' They point north across the dunes. “Heard the Gilded Hand have a camp in the old ruins. Want to make it two of us?”', end:true }
}});
SC('s_hand1',{ node:'s_mesa', title:'The dig above Mesa Alta', req:g => !F(g, 'hand_known'), steps:{
  start:{ t:'At a dig site above Mesa Alta, three figures in gold-trimmed masks are crating up carved stone tablets while the archaeologists sit tied up in their own tent.', c:[{ l:'Battle the smugglers', battle:'hand_grunts', go:'manifest' }, { l:'Free the archaeologists quietly first', chk:['stealth',14], go:'freed', fail:'seen' }] },
  seen:{ t:'A masked smuggler turns. “Halcyon’s champion. We were told you might be trouble.”', c:[{ l:'Battle the smugglers', battle:'hand_grunts', go:'manifest' }] },
  freed:{ t:'You cut the archaeologists loose. Outnumbered and suddenly surrounded by angry academics, the smugglers flee without their crates.', next:'manifest' },
  manifest:{ t:'Among the crates is a shipping manifest in gold ink: every crate bound for the Sunstone Ruins, and a buyer called Silas Crane.', do:g => setF(g, 'hand_known'), end:true }
}});
SC('s_hand2',{ node:'s_ruins', title:'Silas Crane', req:g => F(g, 'hand_known') && !F(g, 'hand_beaten'), steps:{
  start:{ t:'In the Sunstone Ruins’ throne room, a tall man in a gold-trimmed coat is directing workers around an enormous sealed sun-disc. Silas Crane, head of the Gilded Hand.\n\n“The champion of somewhere else,” he says pleasantly. “Everything old is for sale. Including whatever the kings sealed in here.”', c:[{ l:'Battle Silas Crane', battle:'silas', go:'after' }] },
  after:{ t:'Crane’s last partner falls. He tips his hat, a little stiffly. “Not everything, apparently.” His workers scatter.\n\nBehind him, the sun-disc has cracked down the middle. Heat pours out of it like a held breath.', do:g => setF(g, 'hand_beaten'), end:true }
}});
SC('s_legend',{ node:'s_ruins', title:'The cracked sun-disc', repeat:true, req:g => F(g, 'hand_beaten') && !F(g, 'legend_helioserp'), steps:{
  start:{ t:'The sun-disc splits apart. A serpent of living sunlight uncoils from the dark behind it, crowned in fire, and turns its gold eyes on you. Helioserp.', c:[{ l:'Face Helioserp', wild:['helioserp',50], go:'gone', fled:'flee' }, { l:'Leave it be for now', go:'flee' }] },
  flee:{ t:'Helioserp coils back into the dark behind the disc. The heat lingers.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule glows like a coal for an hour. Helioserp is yours.' : 'Helioserp bursts up through the ruined roof in a column of light. It will return to the dark of the ruins to rest.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_helioserp'); }, end:true }
}});
SC('s_rival',{ node:'s_steps', title:'Corin on the steps', auto:true, req:g => rb(g, 'solenne') >= 8, steps:{
  start:{ t:'On the first of the Skyreach Steps, Corin is waiting with an Apex Band on their wrist. “Professor Reyne gave me one too. Let’s see whose bond is stronger.”', c:[{ l:'Battle Corin', battle:'rival_solenne', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? '“Yours,” Corin admits. “This time.”' : '“Mine!” Corin crows, then helps you up.') + ' They start up the steps two at a time. “See you at the top!”', end:true }
}});
SC('n_arrive',{ node:'n_port', title:'A fresh start in Nordhaven', auto:true, steps:{
  start:{ t:'The airship settles onto its mast above Skerrport in a swirl of snow. Every roof in the town has a carved dragon on its ridge. Corin is already down the gangplank. “Left my team with Professor Reyne. New region, new start. You too, right?”\n\nA ranger in a fur-lined coat meets you at the bottom: Ranger Sigrid. “Southerners. Champions twice over, I hear. The north does not care. Up here, every traveller is lent a partner by the rangers, and earns the rest.”', c:[{ l:'Follow Sigrid to the ranger hut', go:'lab' }] },
  lab:{ t:'In the ranger hut, three capsules hang from pegs by the fire. “Waddlet, from the fjords. Forgling, from the smithies. Birchling, from the birch woods,” Sigrid says. “Choose.”',
    c:[{ l:'Choose Waddlet, the fjord penguin (Water)', go:'rival', do:g => pickRegionStarter(g, 'nordhaven', 'waddlet') },
       { l:'Choose Forgling, the forge salamander (Fire)', go:'rival', do:g => pickRegionStarter(g, 'nordhaven', 'forgling') },
       { l:'Choose Birchling, the birch fawn (Grass)', go:'rival', do:g => pickRegionStarter(g, 'nordhaven', 'birchling') }] },
  rival:{ t:g => `Corin grabs the capsule that beats yours, ${SPECIES[REGION_RIVAL.nordhaven[g.starters.nordhaven][0]].n}, without even pretending to think about it. “Fresh start. Again. Let’s go.”`, c:[{ l:'Battle Corin', battle:'rival_n0', soft:true, go:'warn' }] },
  warn:{ t:g => (g.lastBattle === 'win' ? '“You’re annoyingly good at starting over,” Corin says.' : 'Corin pumps a fist.') + `\n\nSigrid hands you a pale stone wrapped in fur. “It answers ${SPECIES[REGION_FINAL[g.starters.nordhaven]].n}, when the time comes. And listen: something is wrong in the north. A choir has been singing in Whisperwood, night after night, and the aurora is answering. They call themselves the Pale Choir. They want to wake something that should stay asleep.”`,
    do:g => { giveKey(g, 'apexstone_' + REGION_FINAL[g.starters.nordhaven]); give(g, 'capsule', 5); setF(g, 'nordhaven_arrived'); }, end:true }
}});
SC('n_rival1',{ node:'n_runestad', title:'Corin among the stones', auto:true, req:g => rb(g, 'nordhaven') >= 4, steps:{
  start:{ t:'Among the standing stones, Corin is trying to read the runes and failing. “Four badges each, right? Let’s settle who’s ahead.”', c:[{ l:'Battle Corin', battle:'rival_n1', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? '“Fine. You’re ahead. By a little.”' : '“Ahead. Me. Write it on a rune.”') + ' Corin squints at the sky. “The aurora’s been weird for days. Hollowfrost folk are scared.”', end:true }
}});
SC('n_choir1',{ node:'n_whisper', title:'The singing in the woods', req:g => !F(g, 'choir_known'), steps:{
  start:{ t:'Deep in Whisperwood, robed figures stand in a ring around a carved stone, singing a single held note. The air shivers with it. Above the trees, the aurora pulses in time.', c:[{ l:'Break up the ritual', battle:'choir_singers', go:'path' }, { l:'Join the song, and listen for what it’s calling', chk:['insight',15], go:'heard', fail:'noticed' }] },
  noticed:{ t:'The note falters. Every hooded face turns toward you.', c:[{ l:'Battle the singers', battle:'choir_singers', go:'path' }] },
  heard:{ t:'Under the singing you hear the words, and the words are a name. Aurorath. The singers drift away one by one as the note fades.', next:'path' },
  path:{ t:'Beside the stone, a map is scratched into the bark of a pine: a hidden path from Hollowfrost up to Aurora Peak, and a name. Cantor Ylva.', do:g => setF(g, 'choir_known'), end:true }
}});
SC('n_choir2',{ node:'n_peak', title:'Cantor Ylva', req:g => F(g, 'choir_known') && !F(g, 'choir_beaten'), steps:{
  start:{ t:'On Aurora Peak, under lights so low you could touch them, a woman in white robes sings alone at the edge of the cliff. Cantor Ylva. She stops when she sees you.\n\n“You hear it too,” she says. “The sky has been singing for ten thousand years, and nobody has sung back. Sing with us, or be silent.”', c:[{ l:'“It isn’t asking for an answer.”', chk:['persuasion',17], go:'doubt', fail:'fight' }, { l:'Battle Cantor Ylva', go:'fight' }] },
  doubt:{ t:'Ylva is quiet for a long moment. “Perhaps. Then let it decide.”', next:'fight', nl:'Face her' },
  fight:{ t:'Ylva raises a hand, and the aurora flares.', c:[{ l:'Battle Cantor Ylva', battle:'cantor', go:'after' }] },
  after:{ t:'Ylva sits down in the snow. “The sky does not need us to sing,” she says. “I see that now.”\n\nAbove you, the aurora gathers itself into a shape. Wings. A long neck. Eyes like cold stars.', do:g => setF(g, 'choir_beaten'), end:true }
}});
SC('n_legend',{ node:'n_peak', title:'The dragon of the aurora', repeat:true, req:g => F(g, 'choir_beaten') && !F(g, 'legend_aurorath'), steps:{
  start:{ t:'The aurora comes down. Aurorath lands on the peak in a rush of cold light, wings spread across half the sky, and looks at you with eyes like the stars behind it.', c:[{ l:'Face Aurorath', wild:['aurorath',55], go:'gone', fled:'flee' }, { l:'Leave it be for now', go:'flee' }] },
  flee:{ t:'Aurorath lifts back into the sky and becomes light again. It will come down when you return.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule fills with shifting green light. Aurorath is yours, and the sky over Nordhaven goes quiet for the first time in ten thousand years.' : 'Aurorath scatters into ribbons of light across the sky. It will gather itself again.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_aurorath'); }, end:true }
}});
SC('n_rival',{ node:'n_steps', title:'Corin in the snow', auto:true, req:g => rb(g, 'nordhaven') >= 8, steps:{
  start:{ t:'At the foot of the Aurora Steps, snow in their hair, Corin grins. “Last one. Probably. Let’s make it the best one.”', c:[{ l:'Battle Corin', battle:'rival_nordhaven', soft:true, go:'after' }] },
  after:{ t:g => (g.lastBattle === 'win' ? 'Corin laughs until they have to sit down in the snow. “Best one.”' : '“Best one,” Corin says, and pulls you to your feet.') + ' They look up at the steps. “Go on. I’ll be right behind you. Like always.”', end:true }
}});

MILESTONES.push(
  ['solenne_arrived','The player started over in Solenne, a sunny southern region, with a new starter; their Halcyon team waits at the daycare back home. Professor Odalys Reyne gave them an Apex Band. The Gilded Hand smuggle relics there.'],
  ['hand_beaten','The player defeated Silas Crane of the Gilded Hand in the Sunstone Ruins.'],
  ['champion_solenne','The player is Champion of Solenne.'],
  ['nordhaven_arrived','The player started over again in Nordhaven, a northern region of fjords and aurora, where the Pale Choir sings to wake a sleeping legend.'],
  ['choir_beaten','The player defeated Cantor Ylva of the Pale Choir on Aurora Peak.'],
  ['champion_nordhaven','The player is Champion of Nordhaven.']
);
/* ---------------- Solenne postgame ---------------- */
S('glassling','Glassling',['rock'],[54,60,82,54],13,100,[60,'prismaw'],'round',['gem','spikes'],'A shard of desert glass that rolls toward moonlight.');
S('prismaw','Prismaw',['rock','psychic'],[92,108,124,72],17,240,null,'quad',['gem','spikes','crest'],'Bends moonlight through its glass body into beams that can cut stone.');
S('gloamscarab','Gloamscarab',['bug','ghost'],[88,108,96,96],17,240,null,'insect',['antennae','shell','eyesbig'],'Rolls a ball of moonlight across the Glass Desert: the night twin of the sun scarab.');
S('moonfen','Moonfen',['psychic','ghost'],[86,104,82,118],18,245,null,'quad',['ears','tail','eyes3'],'A pale fennec that walks out of mirages and back into them. Lost caravans follow it home.');
S('astralasp','Astralasp',['poison','psychic'],[90,112,84,106],17,240,null,'serpent',['spots','crest'],'Its scales map the night sky. Navigators once read the stars off its back.');
S('selenserp','Selenserp',['ghost','psychic'],[112,126,104,104],26,340,null,'serpent',['horns','crest','aura','spots'],'The moon serpent of Solenne, sealed beside its sun twin. When it wakes, the desert nights fill with wandering lights.',{legend:true, ex:{1:'recover'}});
KEYS.starcompass = ['Star Compass', 'Professor Reyne’s brass compass. Its needle follows the brightest star, not the north.'];

SN('s_glass',{n:'The Glass Desert', k:'route', x:362, y:150, tier:6, adj:['s_duneway'], lp:[-9, 3.2, 'end'],
  req:g=>F(g,'glass_open'), lock:'Nobody crosses the deep desert east of Duneway without a guide, or at least a very good compass.',
  d:'Whole dunes melted smooth and frozen in waves, ringing faintly underfoot. By day it is an oven. By night it fills with lights that walk.',
  enc:[['glassling',60,63,14],['prismaw',62,65,5],['gloamscarab',60,64,8],['moonfen',62,66,5],['astralasp',62,66,5],['duneskorp',60,64,8],['whirldust',60,64,8],['dromedune',60,64,8],['heliskink',60,64,6],['tombwrap',60,64,6]], rare:['moonfen',68,68]});
NODES.s_duneway.adj.push('s_glass');

/* Gym leader rematches */
const REMATCH_S = [
  ['s_vinara','ines2','Leader Ines','Ines is tasting this year’s vintage. “The champion! Stay for a glass, and a battle. The vines have grown since you left.”','“Deeper roots than ever.”',[['vinocerus',60],['vintoxin',60],['palmquill',61],['sunbloom',61],['aloeking',63]],['aloeking']],
  ['s_mesa','tomas2','Leader Tomas','Tomas is free-climbing the wall without a rope. He drops the last twenty feet and lands beside you. “Champion! Up for the hard route?”','“Still solid as the mesa.”',[['gecklord',61],['plateaurtle',61],['crestram',62],['sentrilith',62],['sphinxara',64]],['sphinxara']],
  ['s_mesa','brigid2','Leader Brigid','Brigid tosses you a pair of gloves. “Again. Harder.”','“Good hands. Better than mine, today.”',[['vinocerus',62],['crestram',62],['clayguard',63],['terraknight',65]],['terraknight']],
  ['s_mirrow','sefa2','Leader Sefa','Sefa surfaces in the middle of the oasis and waves. “Champion! The water missed you!”','“You flow like you were born here.”',[['lilyhopper',63],['pearlord',63],['brinegator',64],['shimmeray',64],['axoltide',66]],['axoltide']],
  ['s_mirrow','nadir2','Leader Nadir','Nadir uncorks a new perfume. “I made this one for you. It smells like defeat.”','“The right dose, again. Infuriating.”',[['tarmaw',64],['vintoxin',64],['astralasp',65],['pyrocobra',67]],null],
  ['s_cliff','aria2','Leader Aria','Aria is standing on the highest bridge in a gale, grinning. “Come up! The wind’s perfect!”','“You flew higher.”',[['canyonswift',65],['duneplume',65],['brinewader',66],['solfalcon',67],['stormkite',68]],['stormkite']],
  ['s_cliff','kade2','Leader Kade','Kade has put up three new lightning rods. “Bigger storm, champion! Let’s see you stand in it!”','“What a JOLT!”',[['djinnspark',66],['heliskink',66],['stormkite',67],['heliskink',69]],['stormkite']],
  ['s_aurelia','calix2','Leader Calix','Calix bows from the altar fire. “The sun rises again. Shall we see whom it favors today?”','“The sun approves. Again.”',[['sunbloom',67],['solfalcon',67],['pyrocobra',68],['solscarab',68],['sunmane',70]],['sunmane']]
];
function REGION_REMATCHES(region, rows){
  for (const [node, tid, name, intro, outro, team, apex] of rows) {
    T(tid, name, 110, team, '', outro, { ai:'smart', heals:2, apex });
    SC('rematch_' + tid, { node, title:'Rematch: ' + name, gym:true, repeat:true, req:g => F(g, 'champion_' + region), steps:{
      start:{ t:intro, c:[{ l:'Battle ' + name, battle:tid, rematch:true, soft:true, go:'won', lose:'lost' }, { l:'Not today', go:'leave' }] },
      won:{ t:g => outro + (F(g, 'rm_' + tid) ? '' : ' Your first rematch win here earns you two Wisdom Fruits and a Max Salve.'), do:g => { if (!F(g, 'rm_' + tid)) { setF(g, 'rm_' + tid); g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 2; g.items.maxsalve = (g.items.maxsalve || 0) + 1; } }, end:true },
      lost:{ t:'“Come back when you’re ready. I’ll be here.”', end:true },
      leave:{ t:'Another time.', end:true }
    }});
  }
}
REGION_REMATCHES('solenne', REMATCH_S);

/* Tournament cups: three knockout rounds against random challengers, with healing between rounds.
   Every cup won makes the next one two levels tougher. A typed cup draws all four of each
   challenger's partners from one type, picked when the cup starts. */
const CUP_ROUNDS = ['quarterfinal','semifinal','final'];
function ordinal(n){ const t = n % 100; return n + (t > 10 && t < 14 ? 'th' : ['th','st','nd','rd'][n % 10] || 'th'); }
const typeName = t => t[0].toUpperCase() + t.slice(1);
function CUP(o){
  const st = g => g[o.key] || (g[o.key] = { cups:0, round:1, foe:null });
  const ensure = g => { const f = st(g).foe || { name:o.foeName, team:[[o.pool[0], o.base]], intro:'' }; Object.assign(TRAINERS[o.foe], { name:f.name, team:f.team, intro:f.intro }); };
  const cupName = g => o.typed ? typeName(st(g).type || 'normal') + ' Cup' : o.cupName;
  function round(g, n){
    const s = st(g); let pool = o.pool;
    if (n > 1) healParty();
    s.round = n;
    if (o.typed) {
      if (n === 1 || !s.type) { const types = TYPES.filter(t => pool.filter(id => SPECIES[id].t.includes(t)).length >= 5); s.type = pick(types); }
      pool = pool.filter(id => SPECIES[id].t.includes(s.type));
    }
    const lvl = Math.min(o.base + 20, o.base + 2 * s.cups) + (n - 1) * 2, left = pool.slice(), team = [];
    for (let i = 0; i < 4; i++) team.push([left.splice(rnd(left.length), 1)[0], Math.min(100, lvl + rnd(2))]);
    s.foe = { name:pick(o.names), team, intro:pick(o.lines) };
    ensure(g);
    return (n > 1 ? o.heal + '\n\n' : '') + `The ${o.typed ? cupName(g) + ' ' : ''}${CUP_ROUNDS[n - 1]}. ${s.foe.name} ${o.walk} with four partners around level ${lvl}.`;
  }
  function won(g){
    const s = st(g); s.cups++;
    const cash = 4000 + 500 * s.cups;
    g.items.wisdomfruit = (g.items.wisdomfruit || 0) + 3; g.items.maxsalve = (g.items.maxsalve || 0) + 2; g.items.absolute = (g.items.absolute || 0) + 1; g.money += cash;
    return `${o.cheer} You win your ${s.cups === 1 ? 'first' : ordinal(s.cups)} ${o.typed ? 'Midwinter crown, the ' + cupName(g) : o.cupName}. Prize: 3 Wisdom Fruits, 2 Max Salves, ${fmtMoney(cash)} and an Absolute Capsule${o.trophy}. The next cup will be tougher.`;
  }
  T(o.foe, o.foeName, 80, [[o.pool[0], o.base]], '', o.outro, { ai:'smart', heals:1, dyn:ensure });
  const battle = next => ({ l:'Battle', battle:o.foe, rematch:true, soft:true, lose:'lost', go:next });
  SC(o.scene, { node:o.node, title:o.title, repeat:true, req:o.req, steps:{
    start:{ t:g => o.intro + `\n\n${o.tally}: ${st(g).cups}.`, c:[{ l:'Enter the cup', go:'r1' }, { l:'Not today', go:'leave' }] },
    leave:{ t:o.leave, end:true },
    r1:{ t:g => round(g, 1), c:[battle('r2')] },
    r2:{ t:g => round(g, 2), c:[battle('r3')] },
    r3:{ t:g => round(g, 3), c:[battle('won')] },
    won:{ t:g => won(g), end:true },
    lost:{ t:g => `Knocked out in the ${CUP_ROUNDS[(st(g).round || 1) - 1]}. ${o.lost}`, end:true }
  }});
}

/* The Aurelia Sun Arena */
CUP({ scene:'sunarena', foe:'arena_foe', key:'arena', node:'s_aurelia', base:60, title:'The Sun Arena cup', req:g => F(g, 'champion_solenne'),
  pool:['duneskorp','vinocerus','sunbloom','miragefen','brinewader','crestram','whirldust','heliskink','tombwrap','solscarab','dromedune','vintoxin','gecklord','sphinxara','tumbleroot','shimmeray','terraknight','palmquill','stormkite','sentrilith','brinegator','ibisage','pyrocobra','djinnspark','vinebeetle','canyonswift','sunmane','tarmaw','amphorite','jackalith','pearlord','plateaurtle','lilyhopper','pricklemaw','duneplume','axoltide','solfalcon','aloeking','prismaw','gloamscarab','moonfen','astralasp'],
  names:['Gladiator Rufio','Caravan Master Omari','Ace Trainer Delphine','Sandrunner Kaya','Duelist Amara','Veteran Bastian','Sun Priest Tahir','Glassblower Petra','Dune Racer Zara','Falconer Hamid','Oasis Warden Noor','Ace Trainer Leon'],
  lines:['“The crowd came to see you lose. Let’s not disappoint them.”','“I’ve trained in this arena since I could walk.”','“Champion or not, the sand doesn’t care.”','“Let’s give them a show.”','“I crossed the whole desert for this match.”'],
  foeName:'Arena Challenger', outro:'“What a match!”', cupName:'Sun Cup', tally:'Sun Cups won', trophy:', polished like a trophy',
  intro:'Behind the sun temple, the Aurelia Sun Arena rises in tiers of gold sandstone, packed with a roaring crowd. The arena master, a woman with a voice like a brass horn, waves you in. “A champion! Every cup is three rounds, knockout, with healers between rounds. Win and the next cup gets tougher.”',
  leave:'The arena master waves you back out into the bazaar.', heal:'The arena healers patch up your team between rounds.', walk:'walks out to the roar of the crowd',
  cheer:'The crowd is on its feet.', lost:'The crowd cheers you off anyway. “Come back for the next cup,” the arena master booms.' });

/* The moon serpent */
T('tomb_guard','Tomb Guardians',0,[['sentrilith',66],['amphorite',66],['jackalith',67],['sphinxara',68]],'The guardians’ eyes open.','The guardians go still.',{ ai:'smart', heals:1, nomoney:true, apex:['sphinxara'] });
SC('sp_seraphine',{ node:'s_aurelia', title:'Two serpents', req:g => F(g, 'champion_solenne') && !F(g, 'glass_open'), steps:{
  start:{ t:'In the sun temple, Champion Seraphine is waiting beside Professor Reyne, both of them unusually serious.\n\n“Since Helioserp woke, the desert nights have gone wrong,” Seraphine says. “Lights that walk. Caravans that leave Duneway and never arrive anywhere.”\n\nReyne unrolls a rubbing of an inscription. “The second half of the kings’ seal. They didn’t bury one serpent. They buried two: sun and moon. The moon tomb is out in the Glass Desert, east of Duneway, where the sand melted the day the sun serpent was sealed.”',
    c:[{ l:'“I’ll go.”', go:'compass' }, { l:'Ask what happened to Silas Crane', go:'silas' }] },
  silas:{ t:'“Crane?” Seraphine’s mouth tightens. “He hired a crew in Mirrowell a week ago and headed east. Nobody has seen him since.”', next:'compass' },
  compass:{ t:'Reyne presses a brass compass into your hand. Its needle doesn’t point north. It swings, slowly, toward the brightest star. “The Star Compass. It will get you across the glass if you trust it. Mostly.”', do:g => { giveKey(g, 'starcompass'); setF(g, 'glass_open'); }, end:true }
}});
SC('sp_trek',{ node:'s_glass', title:'Three nights on the glass', req:g => F(g, 'glass_open') && !F(g, 'tomb_found'), steps:{
  start:{ t:'East of Duneway the sand gives way to glass. You set out at dusk with the Star Compass in your hand and your partners close.', next:'leg1', nl:'Walk into the first night' },
  leg1:{ t:'The first night. The stars wheel overhead, and a line of pale lights crosses the glass ahead of you, moving like a caravan.',
    c:[{ l:'Follow the Star Compass and ignore the lights', chk:['survival',16], go:'leg2', fail:'lost1' }, { l:'Follow the lights', chk:['insight',16], go:'leg2', fail:'lost1' }] },
  lost1:{ t:'The lights were a mirage. By the time you realize it, you are hours off course, and something out on the glass has noticed you.', c:[{ l:'Fight it off', wild:'node', go:'leg2', fled:'leg2' }] },
  leg2:{ t:'The second night. A glass ridge blocks the way, too steep and too smooth to climb, and the wind sings across its edge.',
    c:[{ l:'Climb it carefully', chk:['athletics',16], go:'leg3', fail:'slide' }, { l:'Search along its base for a pass', chk:['perception',16], go:'leg3', fail:'slide' }] },
  slide:{ t:'You slide back down the glass in a rush of sand. Your lead partner breaks your fall and takes the scrapes. You go around the long way.', do:g => hurt(g, 25), next:'leg3', nl:'Keep walking' },
  leg3:{ t:'The third night. In the hollow between two glass dunes, a figure lies half buried in sand: a tall man in a gold-trimmed coat, very sunburnt. Silas Crane.\n\n“Champion,” he croaks. “Of course it’s you.”',
    c:[{ l:'Give him water and a salve', go:'help' }, { l:'“Where’s your crew?”', chk:['insight',14], go:'crew', fail:'help' }] },
  crew:{ t:'“Gone. Took the camels the first night the lights came.” He laughs, weakly. “I came out here to sell the moon. Now I’d settle for seeing the morning.”', next:'help' },
  help:{ t:'You get Crane on his feet and into the shade of a glass overhang. When he can talk again, he points east, toward a single black spire on the horizon.\n\n“The Moon Tomb. The kings sealed the moon serpent there, beside its sun twin. The door only opens at midnight.” He looks at you. “I won’t follow you in. I think I’m done with tombs.”', do:g => setF(g, 'tomb_found'), end:true }
}});
SC('sp_tomb',{ node:'s_glass', title:'The Moon Tomb', repeat:true, req:g => F(g, 'tomb_found') && !F(g, 'legend_selenserp'), steps:{
  start:{ t:'At midnight the black spire’s door slides open on its own. Inside, a spiral stair runs down into the glass, lit by moonlight that has no business being underground.', c:[{ l:'Go down', go:'guard' }, { l:'Come back another night', go:'later' }] },
  later:{ t:'The door slides shut behind you. It will open again at midnight.', end:true },
  guard:{ t:'At the bottom, four stone guardians stand around a sealed silver disc: the moon twin of the sun-disc in the Sunstone Ruins. As you step forward, their eyes open.', c:[{ l:'Battle the tomb guardians', battle:'tomb_guard', go:'seal' }] },
  seal:{ t:'The guardians settle back onto their plinths, eyes dark. The silver disc cracks, and cold light pours out of it like water. Something long and pale uncoils from the light: Selenserp.', c:[{ l:'Face Selenserp', wild:['selenserp',70], go:'gone', fled:'flee' }] },
  flee:{ t:'Selenserp coils back into the cold light behind the disc. The tomb will open again at midnight.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule goes cold as ice and stays that way. Selenserp is yours. If you have Helioserp, its capsule is suddenly warm in your bag, as if answering.' : 'Selenserp rises through the spire and spreads across the night sky like a second river of stars. It will return to the tomb by morning.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_selenserp'); }, end:true }
}});
MILESTONES.push(
  ['glass_open','Champion Seraphine and Professor Reyne revealed that the old kings sealed a second, moon serpent in the Glass Desert east of Duneway.'],
  ['tomb_found','The player crossed the Glass Desert, rescued a stranded Silas Crane, and found the Moon Tomb.']
);

/* ---------------- Nordhaven postgame ---------------- */
S('cryoling','Cryoling',['ice'],[52,58,78,50],13,100,[60,'cryolith'],'round',['gem','spikes'],'A chip of the oldest ice in the north. It glows blue when someone nearby tells a lie.');
S('cryolith','Cryolith',['ice','rock'],[100,104,130,46],17,240,null,'tall',['gem','rocks','spikes','big'],'A pillar of ancient ice that walks. Bubbles of air from ten thousand years ago still drift inside it.');
S('jotling','Jotling',['fighting','ice'],[104,118,96,70],17,240,null,'tall',['horns','mane','big'],'A young frost giant no taller than a house. It sleeps through summer and wrestles glaciers all winter.');
S('rimeray','Rimeray',['water','ice'],[92,104,90,108],17,240,null,'fish',['wings','spots','fin'],'Glides through rivers under the glacier that have never seen daylight, trailing threads of frost.');
S('hearthwisp','Hearthwisp',['fire','ghost'],[84,110,78,110],17,240,null,'ghost',['topflame','crest'],'The last flame of a giants’ hall, still looking for the hearth it used to warm.');
S('glacitan','Glacitan',['ice','fighting'],[124,132,118,74],27,350,null,'tall',['horns','mane','spikes','aura','big'],'The frost giant sealed beneath Nordhaven’s glacier. The sagas say the long winters were only Glacitan turning over in its sleep.',{legend:true, ex:{1:'recover'}});
KEYS.giantshorn = ['Giant’s Horn', 'A horn of yellowed ice the rangers kept for a thousand years. Its note opens the wall at the bottom of Glacier Pass.'];

NN('n_deep',{n:'The Frozen Deep', k:'cave', x:48, y:182, tier:6, adj:['n_glacier'],
  req:g=>F(g,'deep_open'), lock:'A wall of blue ice seals the deepest part of Glacier Pass. Nothing you carry can open it.',
  d:'Below Glacier Pass the ice is older than the north’s first saga: blue caverns, frozen rivers, and halls built for people four times your size.',
  enc:[['cryoling',60,63,14],['cryolith',62,65,5],['jotling',62,66,5],['rimeray',62,66,6],['hearthwisp',62,66,5],['tuskolith',60,64,8],['glaciclaw',60,64,8],['frostgeist',60,64,8],['snowstride',60,64,6],['runebreaker',60,64,5]], rare:['jotling',68,68]});
NODES.n_glacier.adj.push('n_deep');

REGION_REMATCHES('nordhaven', [
  ['n_pinewick','linnea2','Leader Linnea','Linnea is counting beetles on a single pine needle. “Champion! The forest has been waiting for you. Shall we see how much it has grown?”','“Thousands of small things, and you beat them all.”',[['rimewing',60],['lichenlurk',60],['skaldbird',61],['rimewing',62],['borealynx',63]],['borealynx']],
  ['n_fjordmere','haakon2','Leader Haakon','Haakon is at the prow, bellowing a sea song. “The champion returns! Out on the deck with you!”','“Sea legs of a giant!”',[['otterhelm',61],['puffinarch',61],['narwhallow',62],['shoalstorm',62],['krakenmaw',64]],['krakenmaw']],
  ['n_fjordmere','solvi2','Leader Solvi','Solvi skates a perfect figure eight and stops in a spray of ice. “The ice remembers you. Let’s see if you remember the ice.”','“Steady as ever.”',[['martenfang',62],['glaciclaw',62],['frostflame',63],['polarvixen',63],['glacibear',65]],['polarvixen']],
  ['n_hollow','eirik2','Leader Eirik','Eirik looks up from his whittling. “The dead have been asking after you. They want a rematch. So do I.”','“They still like you. Annoyingly.”',[['hollowcrow',63],['barrowight',63],['driftmare',64],['frostgeist',64],['fenrime',66]],null],
  ['n_runestad','ragna2','Leader Ragna','For once, Ragna opens her eyes. “I read this battle in the stones a year ago. I would like to know if they were right.”','“The stones were right. I hoped they were not.”',[['skaldbird',64],['aurorelk',64],['selkine',65],['monolord',65],['polarvixen',67]],['polarvixen']],
  ['n_runestad','torvald2','Leader Torvald','Torvald hands you a shovel. “Dig in, champion. The quarry floor is deeper now.”','“Good footing. Better than mine.”',[['muskhorn',65],['tuskolith',66],['runebreaker',67],['tuskolith',68]],['runebreaker']],
  ['n_highmark','hilde2','Leader Hilde','Hilde stands on the high table and the whole hall falls silent. “The champion of the north, in my hall again! Fill the horns. Then fight.”','“A seat at my table, forever.”',[['snowhorn',66],['martenfang',66],['gulotooth',67],['muskhorn',67],['glacibear',69]],['glacibear']],
  ['n_drakenspire','sigurd2','Leader Sigurd','Sigurd waits at the top of the tower with two Voltwyrms coiled around his shoulders. “Every trainer ends here. You ended here once already. Make it twice.”','“Ends here. Again.”',[['skywyrm',67],['voltwyrm',67],['fjorddrake',68],['voltwyrm',68],['fjorddrake',70]],null]
]);

/* The Midwinter Games: typed cups in Highmark's mead hall */
CUP({ scene:'midwinter', foe:'games_foe', key:'games', node:'n_highmark', base:60, typed:true, title:'The Midwinter Games', req:g => F(g, 'champion_nordhaven'),
  pool:['rimewing','snowhorn','fenrime','barrowight','runegolem','driftmare','tuskolith','mosstroll','hollowcrow','voltwyrm','borealynx','puffinarch','narwhallow','aurorelk','glacibear','stormhawk','runebreaker','selkine','shoalstorm','polarvixen','snowstride','frostgeist','skaldbird','lichenlurk','otterhelm','muskhorn','abysslure','martenfang','glaciclaw','frostflame','huskarl','fjorddrake','monolord','krakenmaw','lumisprite','gulotooth','emperice','forgejarl','worldstag','cryolith','jotling','rimeray','hearthwisp','skywyrm'],
  names:['Shieldmaiden Ragnhild','Skald Eyvind','Berserker Ulf','Ranger Maren','Huntress Sigrun','Skier Kjell','Runecarver Ase','Fisherman Odd','Seer Thyra','Wrestler Bodvar','Sledder Inga','Archer Halvard'],
  lines:['“The whole hall bet against you. I took their money.”','“I came down from the mountains for this.”','“Midwinter crowns are not given. They are taken.”','“May the best team keep its paws warm.”','“My grandmother won this crown. So will I.”'],
  foeName:'Midwinter Challenger', outro:'“A good bout. Drink with me after.”', tally:'Midwinter crowns won', trophy:', with your name carved on it in runes',
  intro:'Every night of midwinter, Highmark’s mead hall clears its long tables for the Midwinter Games, with Hilde herself as judge. “Champion! Each night the games honor one type, and every challenger fights with it. Three bouts, healers between them, and the crown to the last one standing. Win, and tomorrow’s games get harder.”',
  leave:'Hilde raises her horn to you as you leave. “Tomorrow night, then.”', heal:'Between bouts, Highmark’s healers wrap your partners in warm furs and send them back in.', walk:'stomps into the ring to the drumming of a hundred fists on the tables',
  cheer:'The mead hall roars, and a hundred fists hammer the tables.', lost:'The hall drums for you anyway. “Tomorrow night,” Hilde calls. “There is always tomorrow night.”' });

/* The frost giant */
T('vault_guard','Vault Wardens',0,[['runebreaker',67],['monolord',67],['cryolith',68],['jotling',69]],'The runes on the wardens flare white.','The wardens kneel, and their runes go dark.',{ ai:'smart', heals:1, nomoney:true, apex:['runebreaker'] });
SC('n_giant',{ node:'n_hollow', title:'The oldest song', req:g => F(g, 'champion_nordhaven') && !F(g, 'deep_open'), steps:{
  start:{ t:'By the barrow field, Ranger Sigrid is waiting beside a woman in plain grey wool. It takes you a moment to recognize her without the white robes: Cantor Ylva.\n\n“The sky is quiet now,” Sigrid says. “The glacier isn’t. It groans every night, louder than the year before. Ylva says she knows why.”\n\nYlva doesn’t quite meet your eyes. “The Choir sang the wrong song. The oldest song of the north isn’t about the sky. It’s about what sleeps under the ice: a giant the first northerners sealed in the glacier’s heart. While the aurora sang, the giant stayed asleep. Now the sky is quiet, and it is waking.”',
    c:[{ l:'“Then we go down and meet it.”', go:'horn' }, { l:'“Why should I trust you?”', chk:['insight',15], go:'trust', fail:'horn' }] },
  trust:{ t:'Ylva is quiet for a long moment. “You shouldn’t, maybe. But I know the way down, and I owe the north a song sung right.” You find that you believe her.', next:'horn' },
  horn:{ t:'Sigrid unwraps a long horn of yellowed ice. “The Giant’s Horn. The rangers have kept it for a thousand years without knowing what it opened. Ylva says it opens the wall at the bottom of Glacier Pass.”', do:g => { giveKey(g, 'giantshorn'); setF(g, 'deep_open'); }, end:true }
}});
SC('n_descent',{ node:'n_deep', title:'Into the Frozen Deep', req:g => F(g, 'deep_open') && !F(g, 'vault_found'), steps:{
  start:{ t:'At the bottom of Glacier Pass you sound the Giant’s Horn. The note goes on far longer than your breath, and the blue wall cracks open. Ylva follows you in with a lantern.', next:'leg1', nl:'Go down' },
  leg1:{ t:'The tunnel drops into a crevasse spanned by a single bridge of ice, thin as a plank and far older than it looks.',
    c:[{ l:'Run across before it can crack', chk:['acrobatics',16], go:'leg2', fail:'fall' }, { l:'Test every step', chk:['perception',16], go:'leg2', fail:'fall' }] },
  fall:{ t:'The bridge gives way. You and your partners land in a snowdrift far below, and something that lives down here comes to see what fell.', c:[{ l:'Fight it off', wild:'node', go:'leg2', fled:'leg2' }] },
  leg2:{ t:'The cold down here is not like the cold outside. It gets into your bones and starts arguing with your heartbeat.',
    c:[{ l:'Keep moving and keep your partners close', chk:['survival',16], go:'leg3', fail:'frost' }, { l:'Push through on willpower', chk:['wis',16], go:'leg3', fail:'frost' }] },
  frost:{ t:'By the time you find shelter, your lead partner is rimed with frost and shivering. You warm it as best you can and go on.', do:g => hurt(g, 30), next:'leg3', nl:'Keep going' },
  leg3:{ t:'At the bottom a hall opens out: pillars of ice, a long table carved for people four times your size, and a hearth where a single blue flame is still burning. Runes cover every wall.',
    c:[{ l:'Help Ylva read the runes', chk:['investigation',14], go:'read', fail:'ylva' }, { l:'Let Ylva read them', go:'ylva' }] },
  read:{ t:'Together you work the runes out. They aren’t a warning. They’re a lullaby: the oldest song of the north, written out for whoever came next to sing.', next:'ylva' },
  ylva:{ t:'Ylva traces the last line of runes. “Past that door are the wardens the first northerners left to guard the giant. They won’t let us by without a fight.” She sets the lantern down. “I’ll sing while you fight. It’s the least I owe.”', do:g => setF(g, 'vault_found'), end:true }
}});
SC('n_vault',{ node:'n_deep', title:'The Giant’s Vault', repeat:true, req:g => F(g, 'vault_found') && !F(g, 'legend_glacitan'), steps:{
  start:{ t:'The vault door is a single slab of blue ice taller than a longship. Ylva is already singing, very softly.', c:[{ l:'Go in', go:'guard' }, { l:'Come back later', go:'later' }] },
  later:{ t:'Ylva lets the song trail off. “It has waited a thousand years. It can wait a little longer.”', end:true },
  guard:{ t:'Inside, four wardens of stone and ice stand around a sleeping shape the size of a hill. As you step forward, their runes flare.', c:[{ l:'Battle the vault wardens', battle:'vault_guard', go:'giant' }] },
  giant:{ t:'The wardens kneel, and the vault goes quiet. Ylva’s song carries all the way to the far wall, and the hill opens its eyes. Glacitan rises, shedding ice like snow sliding off a roof, and looks down at you.', c:[{ l:'Face Glacitan', wild:['glacitan',72], go:'gone', fled:'flee' }] },
  flee:{ t:'Glacitan settles back into the ice with a sound like a far-off avalanche. Ylva keeps singing. It will still be here.', end:true },
  gone:{ t:g => g.lastBattle === 'caught' ? 'The capsule frosts over so thickly you can barely hold it. Glacitan is yours, and far above, for the first time in years, the glacier falls silent.\n\nYlva stops singing and laughs, a little shakily. “That isn’t how the saga ends. I like this one better.”' : 'Glacitan shoulders its way up through the ice and out into the snow. It will come back to its vault to sleep.', do:g => { if (g.lastBattle === 'caught') setF(g, 'legend_glacitan'); }, end:true }
}});
MILESTONES.push(
  ['deep_open','Ranger Sigrid and a reformed Cantor Ylva revealed that a frost giant sleeps under Nordhaven’s glacier, and gave the player the Giant’s Horn to open the Frozen Deep.'],
  ['vault_found','The player went down into the Frozen Deep with Ylva and found the giants’ hall and the sealed vault.']
);

for (const n of Object.values(NODES)) n.rg = n.rg || 'halcyon';
