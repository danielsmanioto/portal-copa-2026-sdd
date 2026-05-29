#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { normalizeSlug } = require('./fetch-data');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'data', 'raw', 'worldcup-manifest.json');
const OUTPUT_TEAMS_DIR = path.join(ROOT, 'data', 'teams');
const PLACEHOLDER = '/assets/img/placeholder-player.png';

const POSITION_MAP = { G: 'Goleiro', D: 'Defesa', M: 'Meio', F: 'Ataque' };

function parseLine(line) {
  // naive CSV split — files are simple comma-separated
  const parts = line.split(',').map(p => p.trim());
  // Expected: Number, Name, Nat, Pos, Height, Weight, Date of Birth, Birth Place, Current Club
  const number = parseInt(parts[0], 10);
  const name = parts[1] || '';
  const pos = parts[3] || '';
  const dobRaw = parts[6] || '';
  const club = parts.slice(8).join(', ') || parts[8] || '';

  return { number, name, pos, dobRaw, club };
}

function normalizeBirthdate(dobRaw) {
  // Accept formats: DD-MM-YY or DD-MM-YYYY
  const m = dobRaw.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
  if (!m) return '2000-01-01';
  let [ , dd, mm, yy ] = m;
  dd = dd.padStart(2, '0');
  mm = mm.padStart(2, '0');
  if (yy.length === 2) {
    const y = parseInt(yy, 10);
    yy = y <= 30 ? `20${yy}` : `19${yy}`;
  }
  return `${yy}-${mm}-${dd}`;
}

function makePlayerId(name, number) {
  return normalizeSlug((name || 'player') + '-' + (number || '0')).slice(0, 50);
}

async function run() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('Manifest not found:', MANIFEST);
    process.exit(1);
  }

  const manifest = JSON.parse(await fsp.readFile(MANIFEST, 'utf8'));
  await fsp.mkdir(OUTPUT_TEAMS_DIR, { recursive: true });

  let updated = 0;

  // try to load existing teams index to map names -> slugs
  const teamsIndexPath = path.join(ROOT, 'data', 'teams.json');
  let teamsIndex = null;
  const nameToSlug = new Map();
  if (fs.existsSync(teamsIndexPath)) {
    try {
      teamsIndex = JSON.parse(await fsp.readFile(teamsIndexPath, 'utf8'));
      if (teamsIndex && Array.isArray(teamsIndex.teams)) {
        for (const t of teamsIndex.teams) {
          if (t && t.name && t.slug) nameToSlug.set(String(t.name).toLowerCase(), t.slug);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  for (const team of manifest.teams) {
    if (!team.squadFound || !team.cachePath) continue;
    if (!fs.existsSync(team.cachePath)) continue;

    // resolve slug using existing teams.json mapping when possible
    const nameKey = String(team.name || '').toLowerCase();
    const slug = nameToSlug.get(nameKey) || normalizeSlug(team.name || path.basename(team.cachePath, '.txt'));
    const text = await fsp.readFile(team.cachePath, 'utf8');
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);

    // find header index (line starting with Number, or containing 'Number')
    let startIdx = 0;
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (/^Number[,\s]/i.test(lines[i]) || /^Number,/.test(lines[i]) || /Number/.test(lines[i])) {
        startIdx = i + 1;
        break;
      }
      // skip title lines starting with '='
      if (/^=/.test(lines[i])) continue;
    }

    const players = [];
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      if (!/^[0-9]+,/.test(line)) continue;
      const parsed = parseLine(line);
      const birthdate = normalizeBirthdate(parsed.dobRaw || '01-01-00');
      const position = POSITION_MAP[parsed.pos] || 'Meio';
      const player = {
        id: makePlayerId(parsed.name, parsed.number),
        name: parsed.name || `Player ${parsed.number}`,
        birthdate,
        position,
        number: Number.isInteger(parsed.number) ? parsed.number : 0,
        photo: undefined,
        club: parsed.club || undefined,
      };
      players.push(player);
    }

    // load existing team file if exists
    const teamFile = path.join(OUTPUT_TEAMS_DIR, `${slug}.json`);
    let teamDetail = null;
    if (fs.existsSync(teamFile)) {
      try { teamDetail = JSON.parse(await fsp.readFile(teamFile, 'utf8')); } catch(e) { teamDetail = null; }
    }

    if (!teamDetail) {
      teamDetail = {
        id: slug,
        name: team.name || slug,
        slug,
        photo: `/assets/img/placeholder-player.png`,
        players: players.length ? players : [ { id: 'player_a_definir', name: 'A definir', birthdate: '2000-01-01', position: 'Meio', number: 1, photo: PLACEHOLDER, club: 'A confirmar' } ]
      };
    } else {
      teamDetail.players = players.length ? players : teamDetail.players || [];
    }

    await fsp.writeFile(teamFile, JSON.stringify(teamDetail, null, 2) + '\n', 'utf8');
    updated++;
    console.log(`Wrote ${teamFile} (${players.length} players)`);
  }

  console.log(`Updated ${updated} team files in ${OUTPUT_TEAMS_DIR}`);
}

run().catch(err => { console.error(err); process.exit(1); });
