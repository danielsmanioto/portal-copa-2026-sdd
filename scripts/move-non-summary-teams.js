#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const SUMMARY_FILE = path.join(DATA_DIR, 'teams.json');
const TEAMS_DIR = path.join(DATA_DIR, 'teams');
const BACKUP_DIR = path.join(TEAMS_DIR, 'extra-backup');

async function readJson(p){
  return JSON.parse(await fs.readFile(p, 'utf8'));
}

async function ensureDir(p){
  try { await fs.mkdir(p, { recursive: true }); } catch {}
}

async function main(){
  const summary = await readJson(SUMMARY_FILE);
  const summarySlugs = new Set(summary.teams.map(t => t.slug));
  await ensureDir(BACKUP_DIR);

  const files = await fs.readdir(TEAMS_DIR);
  let moved = 0;
  for (const file of files.filter(f => f.endsWith('.json'))){
    const p = path.join(TEAMS_DIR, file);
    let detail;
    try { detail = await readJson(p); } catch { continue; }
    const slug = detail.slug || file.replace(/\.json$/,'');
    if (!summarySlugs.has(slug)){
      const dest = path.join(BACKUP_DIR, file);
      await fs.rename(p, dest);
      console.log(`Moved ${file} -> ${path.relative(ROOT_DIR, dest)}`);
      moved++;
    }
  }
  console.log(`Done. Files moved: ${moved}`);
}

main().catch(err => { console.error(err); process.exitCode = 1; });
