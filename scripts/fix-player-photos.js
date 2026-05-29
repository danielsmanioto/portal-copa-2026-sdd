#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEAMS_DIR = path.join(ROOT_DIR, 'data', 'teams');
const PLACEHOLDER = '/assets/img/placeholder-player.png';

async function readJson(p) {
  return JSON.parse(await fs.readFile(p, 'utf8'));
}

async function writeJson(p, obj) {
  await fs.writeFile(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

async function main() {
  const files = await fs.readdir(TEAMS_DIR);
  let updated = 0;
  for (const file of files.filter(f => f.endsWith('.json'))){
    const p = path.join(TEAMS_DIR, file);
    let team;
    try {
      team = await readJson(p);
    } catch (err) {
      console.error(`Skipping ${file}: ${err.message}`);
      continue;
    }
    let changed = false;
    if (Array.isArray(team.players)){
      for (const player of team.players){
        if (!player.photo || typeof player.photo !== 'string' || player.photo.trim() === ''){
          player.photo = PLACEHOLDER;
          changed = true;
        }
        // ensure number is integer
        if (player.number && typeof player.number === 'string'){
          const n = parseInt(player.number, 10);
          if (!Number.isNaN(n)) player.number = n;
        }
        // ensure club exists
        if (!player.club || typeof player.club !== 'string' || player.club.trim() === ''){
          player.club = 'Unknown';
          changed = true;
        }
      }
    }
    if (changed){
      await writeJson(p, team);
      updated++;
      console.log(`Updated ${file}`);
    }
  }
  console.log(`Finished. Files updated: ${updated}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
