# Halcyon Road

A single-player creature-trainer RPG played with tabletop dice. Leave Thistle Hollow with your first partner, earn eight gym badges, deal with your rival Corin, break up Team Umbra, and challenge the Summit League. Every risky choice is a d20 skill check, and every battle is decided by attack rolls, Armor Class and damage dice.

The region, its 157 creatures and its cast are all original. The story follows the classic shape of a first-region adventure: a starter from the professor, a rival with the type advantage, a ghost tower, a casino hideout, a corporate tower takeover and a lab-made legend under a lake.

## Play it

- **On your computer:** open `index.html` in a browser. No install or build step.
- **On GitHub Pages:** in this repo go to **Settings → Pages**, set the source to **Deploy from a branch**, pick `main` and `/ (root)`, and save. The game appears at `https://<your-username>.github.io/Pokemon-stuff/` after a minute.

Progress saves in your browser. Use **Menu → Copy save to clipboard** to back it up, and **Restore this save** to load it on another browser or device.

## How it plays

- **Your trainer:** a name, a background (Ace Trainer, Field Researcher, Wildlands Ranger or Silver Tongue) and six ability scores rolled 4d6-drop-lowest.
- **Checks:** story choices show the skill and DC up front. Roll d20 + ability modifier + proficiency. A natural 20 grants Inspiration, which buys one reroll.
- **Battles:** initiative is rolled every round. Attacks roll d20 against the target's AC. Damage dice grow with level, and type matchups, STAB, critical hits on a natural 20 and status saving throws all apply.
- **Capture:** wear a creature down or put it to sleep, then roll d20 + Capsule bonus + Dexterity against its capture DC.
- **The Codex:** all 157 creatures can be obtained in one playthrough. Professor Marr rewards milestones, including the two starters you didn't pick.
- **Pace:** Story, Adventurer or Veteran, chosen when you start.

### The AI Dungeon Master

The **Free action** box lets you type anything ("ask the fisherman what he's seen on the water"). An AI Dungeon Master sets a DC and narrates both outcomes, and the game rolls the die. It only works when the game runs as an artifact on claude.ai. Everywhere else the box explains that it's off, and the scripted campaign plays fully without it.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page layout and all styles |
| `data.js` | Campaign content: types, moves, creatures, items, map, trainers and every story scene |
| `game.js` | Rules engine, battle system, sprites (drawn procedurally as SVG), map and interface |
| `tools/validate.js` | Checks every cross-reference in the data (scenes, trainers, creatures, moves, map links) |
| `tools/playtest.js` | A bot plays the whole story six times, then fuzzes 500 random battles and renders every view |
| `tools/serve.js` | A tiny local web server: `node tools/serve.js` then open http://127.0.0.1:8765 |

Run the checks with Node:

```bash
node tools/validate.js
```

```bash
node tools/playtest.js
```
