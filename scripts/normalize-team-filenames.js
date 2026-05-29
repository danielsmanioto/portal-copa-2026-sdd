#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const SUMMARY_FILE = path.join(DATA_DIR, 'teams.json');
const TEAMS_DIR = path.join(DATA_DIR, 'teams');

function sortObject(obj) {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = sortObject(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(p) {
  const txt = await fs.readFile(p, 'utf8');
  return JSON.parse(txt);
}

async function writeJson(p, obj) {
  const content = JSON.stringify(obj, null, 2) + '\n';
  await fs.writeFile(p, content, 'utf8');
}

function mergePlayers(primaryPlayers = [], secondaryPlayers = []) {
  const map = new Map();
  for (const p of primaryPlayers) map.set(p.id, p);
  for (const p of secondaryPlayers) {
    if (!map.has(p.id)) map.set(p.id, p);
  }
  return Array.from(map.values());
}

async function main() {
  const summary = await readJson(SUMMARY_FILE);
  const summarySlugs = new Set(summary.teams.map(t => t.slug));

  const files = await fs.readdir(TEAMS_DIR);
  for (const file of files.filter(f => f.endsWith('.json'))){
    const filePath = path.join(TEAMS_DIR, file);
    let detail;
    try {
      detail = await readJson(filePath);
    } catch (err) {
      console.error(`Skipping invalid JSON: ${file} (${err.message})`);
      continue;
    }

    const declaredSlug = detail.slug || path.basename(file, '.json');
    const desiredName = `${declaredSlug}.json`;
    const desiredPath = path.join(TEAMS_DIR, desiredName);

    if (file === desiredName) {
      // file already matches its declared slug
      continue;
    }

    if (await fileExists(desiredPath)) {
      // target exists — compare/merge
      let targetDetail;
      try {
        targetDetail = await readJson(desiredPath);
      } catch (err) {
        console.error(`Unable to read target ${desiredName}: ${err.message}`);
        continue;
      }

      const a = JSON.stringify(sortObject(targetDetail));
      const b = JSON.stringify(sortObject(detail));
      if (a === b) {
        // identical — remove duplicate
        await fs.unlink(filePath);
        console.log(`Removed duplicate file ${file} (identical to ${desiredName})`);
      } else {
        // merge players and prefer target fields
        const merged = Object.assign({}, targetDetail);
        merged.players = mergePlayers(targetDetail.players || [], detail.players || []);
        await writeJson(desiredPath, merged);
        await fs.unlink(filePath);
        console.log(`Merged ${file} into ${desiredName} (players unified)`);
      }
    } else {
      // rename file to desired slug
      await fs.rename(filePath, desiredPath);
      console.log(`Renamed ${file} -> ${desiredName}`);
    }
  }

  // ensure every summary team has a detail file
  for (const team of summary.teams) {
    const target = path.join(TEAMS_DIR, `${team.slug}.json`);
    if (!(await fileExists(target))) {
      const stub = Object.assign({}, team, { players: [] });
      await writeJson(target, stub);
      console.log(`Created stub for missing team file: ${team.slug}.json`);
    }
  }

  console.log('Normalization complete.');
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
});
