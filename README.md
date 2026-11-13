# Halcyon Road

A single-player creature-trainer RPG played with tabletop dice. Leave Thistle Hollow with your first partner, earn eight gym badges, deal with your rival Corin, break up Team Umbra, and challenge the Summit League. Then sail south, and later fly north, to new regions with their own gyms and leagues. Every risky choice is a d20 skill check, and every battle is decided by attack rolls, Armor Class and damage dice.

The three regions, their 191 creatures and the whole cast are original. The first region follows the classic shape of a first adventure: a starter from the professor, a rival with the type advantage, a ghost tower, a casino hideout, a corporate tower takeover and a lab-made legend under a lake.

## Play it

- **Online:** https://santiagovarela1552006-lgtm.github.io/Pokemon-stuff/
- **On your computer:** open `index.html` in a browser. No install or build step.

Progress saves in your browser. Use **Menu → Copy save to clipboard** to back it up, and **Restore this save** to load it on another browser or device.

## How it plays

- **Your trainer:** a name, a background (Ace Trainer, Field Researcher, Wildlands Ranger or Silver Tongue) and six ability scores rolled 4d6-drop-lowest.
- **Checks:** story choices show the skill and DC up front. Roll d20 + ability modifier + proficiency. A natural 20 grants Inspiration, which buys one reroll.
- **Battles:** initiative is rolled every round. Attacks roll d20 against the target's AC. Damage dice grow with level, and type matchups, STAB, critical hits on a natural 20 and status saving throws all apply.
- **Capture:** wear a creature down or put it to sleep, then roll d20 + Capsule bonus + Dexterity against its capture DC.
- **The Codex:** all 191 creatures can be obtained in one playthrough. Professor Marr rewards milestones, including the two starters you didn't pick.
- **Pace:** Story, Adventurer or Veteran, chosen when you start.

## After the Halcyon League

| Unlocks when | What opens |
| --- | --- |
| You become Halcyon's champion | **Summit Tower** above the League (endless five-battle sets with a streak and prizes), **rematches** with all eight gym leaders and the Elite Four, Lisk's **Ashen Lantern** story leading to **Starfall Crater** and the legendary Astraeon, and the **ferry to Solenne** from Port Saltmere |
| You arrive in Solenne | A sun-baked region of salt flats, vineyards, canyons and an oasis: eight gyms, the Gilded Hand smugglers, the legendary Helioserp and the Sunspire League. Professor Reyne gives you the **Apex Band** |
| You become Solenne's champion | The **airship to Nordhaven** from Aurelia: fjords, pine forests and glaciers, eight more gyms, the Pale Choir, the legendary Aurorath and the Aurora League |

### Apex Ascension

Once per battle, a fully evolved partner whose Apex Stone you carry can **ascend**: it gains attack, defense and speed, sometimes a new type, and a new look until the battle ends. Twelve partners can ascend, including all three starters' final forms. You get your starter's stone from Professor Reyne, and the rest from gym leaders in Solenne and Nordhaven. Some leaders, champions and Corin ascend too.

### The AI Dungeon Master

The **Free action** box lets you type anything ("ask the fisherman what he's seen on the water"). An AI Dungeon Master sets a DC and narrates both outcomes, and the game rolls the die. It only works when the game runs as an artifact on claude.ai. Everywhere else the box explains that it's off, and the scripted campaign plays fully without it.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page layout and all styles |
| `data.js` | Halcyon's content: types, moves, creatures, items, map, trainers, story scenes and the postgame |
| `regions.js` | Solenne and Nordhaven (maps, creatures, gyms, leagues, stories) and the Apex forms |
| `game.js` | Rules engine, battle system, Apex Ascension, Summit Tower, sprites (drawn procedurally as SVG), maps and interface |
| `tools/validate.js` | Checks every cross-reference in the data (scenes, trainers, creatures, moves, map links) |
| `tools/playtest.js` | A bot plays the Halcyon story six times, then fuzzes random battles and renders every view |
| `tools/regions-test.js` | A bot plays the postgame, both new regions and their leagues, using Apex Ascension |
| `tools/serve.js` | A tiny local web server: `node tools/serve.js` then open http://127.0.0.1:8765 |

Run the checks with Node:

```bash
node tools/validate.js
```

```bash
node tools/playtest.js
```

```bash
node tools/regions-test.js
```
