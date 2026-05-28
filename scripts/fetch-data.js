#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT_DIR = path.join(ROOT_DIR, 'data');
const SOURCES_FILE = path.join(__dirname, 'sources.json');
const TEAM_OUTPUT_DIRNAME = 'teams';
const DEFAULT_IMAGE_ROOT = path.join(ROOT_DIR, 'assets', 'img');
const POSITION_VALUES = new Set(['Goleiro', 'Defesa', 'Meio', 'Ataque']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.svg', '.webp']);
const TEAM_ID_PATTERN = /^[a-z0-9_-]{2,50}$/;
const TEAM_SLUG_PATTERN = /^[a-z0-9-]{2,50}$/;
const PLAYER_ID_PATTERN = /^[a-z0-9_-]{2,50}$/;

const RAW_TEAM_FIXTURES = [
  {
    sourceId: 'fifa-api',
    id: 'bra',
    name: 'Brasil',
    slug: 'brasil',
    photo: 'https://example.com/images/selecoes/brasil.png',
    confederation: 'CONMEBOL',
    coachName: 'Dorival Júnior',
    players: [
      {
        id: 'alisson_becker',
        name: 'Alisson Ramses Becker',
        birthdate: '1992-10-02',
        position: 'Goleiro',
        number: 1,
        club: 'Liverpool FC',
        photo: 'https://example.com/images/jogadores/alisson-becker.jpg',
        height: 193,
        weight: 91,
        caps: 70,
        goals: 0,
      },
      {
        id: 'marquinhos',
        name: 'Marcos Aoás Corrêa',
        birthdate: '1994-05-14',
        position: 'Defesa',
        number: 4,
        club: 'Paris Saint-Germain',
        photo: 'https://example.com/images/jogadores/marquinhos.jpg',
        height: 183,
        weight: 75,
        caps: 82,
        goals: 7,
      },
      {
        id: 'vinicius_junior',
        name: 'Vinícius José Paixão de Oliveira Júnior',
        birthdate: '2000-07-12',
        position: 'Ataque',
        number: 7,
        club: 'Real Madrid CF',
        photo: 'https://example.com/images/jogadores/vinicius-junior.jpg',
        height: 176,
        weight: 73,
        caps: 32,
        goals: 4,
      },
    ],
  },
  {
    sourceId: 'espn-api',
    id: 'arg',
    name: 'Argentina',
    slug: 'argentina',
    photo: 'https://example.com/images/selecoes/argentina.png',
    confederation: 'CONMEBOL',
    coachName: 'Lionel Scaloni',
    players: [
      {
        id: 'emiliano_martinez',
        name: 'Damián Emiliano Martínez',
        birthdate: '1992-09-02',
        position: 'Goleiro',
        number: 23,
        club: 'Aston Villa FC',
        photo: 'https://example.com/images/jogadores/emiliano-martinez.jpg',
        height: 195,
        weight: 88,
        caps: 52,
        goals: 0,
      },
      {
        id: 'lionel_messi',
        name: 'Lionel Andrés Messi',
        birthdate: '1987-06-24',
        position: 'Ataque',
        number: 10,
        club: 'Inter Miami CF',
        photo: 'https://example.com/images/jogadores/lionel-messi.jpg',
        height: 170,
        weight: 72,
        caps: 180,
        goals: 106,
      },
      {
        id: 'julian_alvarez',
        name: 'Julián Álvarez',
        birthdate: '2000-01-31',
        position: 'Ataque',
        number: 9,
        club: 'Atlético de Madrid',
        photo: 'https://example.com/images/jogadores/julian-alvarez.jpg',
        height: 170,
        weight: 71,
        caps: 39,
        goals: 9,
      },
    ],
  },
  {
    sourceId: 'wikipedia-teams',
    id: 'fra',
    name: 'França',
    slug: 'franca',
    photo: 'https://example.com/images/selecoes/franca.png',
    confederation: 'UEFA',
    coachName: 'Didier Deschamps',
    players: [
      {
        id: 'mike_maignan',
        name: 'Mike Maignan',
        birthdate: '1995-07-03',
        position: 'Goleiro',
        number: 16,
        club: 'AC Milan',
        photo: 'https://example.com/images/jogadores/mike-maignan.jpg',
        height: 191,
        weight: 89,
        caps: 28,
        goals: 0,
      },
      {
        id: 'kylian_mbappe',
        name: 'Kylian Mbappé',
        birthdate: '1998-12-20',
        position: 'Ataque',
        number: 10,
        club: 'Real Madrid CF',
        photo: 'https://example.com/images/jogadores/kylian-mbappe.jpg',
        height: 178,
        weight: 75,
        caps: 75,
        goals: 46,
      },
      {
        id: 'antoine_griezmann',
        name: 'Antoine Griezmann',
        birthdate: '1991-03-21',
        position: 'Meio',
        number: 7,
        club: 'Atlético de Madrid',
        photo: 'https://example.com/images/jogadores/antoine-griezmann.jpg',
        height: 176,
        weight: 72,
        caps: 130,
        goals: 44,
      },
    ],
  },
  {
    sourceId: 'open-data-portal',
    id: 'esp',
    name: 'Espanha',
    slug: 'espanha',
    photo: 'https://example.com/images/selecoes/espanha.png',
    confederation: 'UEFA',
    coachName: 'Luis de la Fuente',
    players: [
      {
        id: 'unai_simon',
        name: 'Unai Simón',
        birthdate: '1997-06-11',
        position: 'Goleiro',
        number: 1,
        club: 'Athletic Club',
        photo: 'https://example.com/images/jogadores/unai-simon.jpg',
        height: 190,
        weight: 88,
        caps: 41,
        goals: 0,
      },
      {
        id: 'rodri',
        name: 'Rodrigo Hernández Cascante',
        birthdate: '1996-06-22',
        position: 'Meio',
        number: 16,
        club: 'Manchester City',
        photo: 'https://example.com/images/jogadores/rodri.jpg',
        height: 191,
        weight: 82,
        caps: 54,
        goals: 4,
      },
      {
        id: 'lamine_yamal',
        name: 'Lamine Yamal',
        birthdate: '2007-07-13',
        position: 'Ataque',
        number: 19,
        club: 'FC Barcelona',
        photo: 'https://example.com/images/jogadores/lamine-yamal.jpg',
        height: 180,
        weight: 66,
        caps: 16,
        goals: 3,
      },
    ],
  },
];

async function main() {
  const cli = parseArgs(process.argv.slice(2));
  if (cli.help) {
    printHelp();
    return;
  }

  const outputDir = path.resolve(ROOT_DIR, cli.outputDir || DEFAULT_OUTPUT_DIR);
  const teamsDir = path.join(outputDir, TEAM_OUTPUT_DIRNAME);
  const cacheImages = cli.downloadImages;

  const sourcesConfig = await loadJson(SOURCES_FILE);
  assertValidSourcesConfig(sourcesConfig);

  await fs.mkdir(teamsDir, { recursive: true });
  if (cacheImages) {
    await fs.mkdir(DEFAULT_IMAGE_ROOT, { recursive: true });
  }

  const preparedTeams = [];
  const seenTeamIds = new Set();
  const seenTeamSlugs = new Set();
  const imageCache = new Map();

  for (const rawTeam of RAW_TEAM_FIXTURES) {
    const team = normalizeTeam(rawTeam);
    validateTeam(team, { seenTeamIds, seenTeamSlugs });

    const preparedPlayers = [];
    const seenPlayerIds = new Set();

    for (const rawPlayer of rawTeam.players) {
      const player = normalizePlayer(rawPlayer);
      validatePlayer(player, seenPlayerIds);
      preparedPlayers.push(player);
    }

    const summaryTeam = await buildTeamSummary(team, cacheImages, imageCache);
    const detailTeam = await buildTeamDetail(team, cacheImages, preparedPlayers, imageCache);

    validateTeamDetailConsistency(summaryTeam, detailTeam);

    preparedTeams.push(summaryTeam);
    await writeJson(path.join(teamsDir, `${team.slug}.json`), detailTeam);
  }

  const summaryPayload = { teams: preparedTeams };
  validateTeamsIndex(summaryPayload);
  await writeJson(path.join(outputDir, 'teams.json'), summaryPayload);

  process.stdout.write(
    `Generated ${preparedTeams.length} teams in ${path.relative(ROOT_DIR, outputDir)}${cacheImages ? ' with cached images' : ''}.\n`
  );
}

function parseArgs(argv) {
  const result = {
    outputDir: null,
    downloadImages: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--help' || token === '-h') {
      result.help = true;
      return result;
    }
    if (token === '--no-download-images') {
      result.downloadImages = false;
      continue;
    }
    if (token === '--download-images') {
      result.downloadImages = true;
      continue;
    }
    if (token === '--output') {
      result.outputDir = argv[index + 1];
      index += 1;
      continue;
    }
    if (token.startsWith('--output=')) {
      result.outputDir = token.slice('--output='.length);
      continue;
    }
    if (token === '--cache-images') {
      result.downloadImages = true;
      continue;
    }
  }

  if (process.env.CACHE_IMAGES === 'true') {
    result.downloadImages = true;
  }

  if (process.env.NO_DOWNLOAD_IMAGES === 'true') {
    result.downloadImages = false;
  }

  return result;
}

function printHelp() {
  process.stdout.write(`Usage: node scripts/fetch-data.js [options]\n\n`);
  process.stdout.write(`Options:\n`);
  process.stdout.write(`  --output <dir>           Output directory for generated data (default: data/)\n`);
  process.stdout.write(`  --download-images        Cache remote images to assets/img/\n`);
  process.stdout.write(`  --no-download-images     Skip image caching and keep remote URLs\n`);
  process.stdout.write(`  -h, --help               Show this help\n`);
}

async function loadJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

function assertValidSourcesConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('sources.json must contain a JSON object.');
  }
  if (!Array.isArray(config.sources) || config.sources.length === 0) {
    throw new Error('sources.json must define a non-empty sources array.');
  }
}

function normalizeTeam(rawTeam) {
  const id = normalizeId(rawTeam.id);
  const slug = normalizeSlug(rawTeam.slug || rawTeam.name || rawTeam.id);
  const name = normalizeText(rawTeam.name);
  const photo = normalizeUrl(rawTeam.photo);

  return {
    id,
    name,
    slug,
    photo,
    confederation: normalizeOptionalText(rawTeam.confederation),
    flag: normalizeOptionalUrl(rawTeam.flag),
    coachName: normalizeOptionalText(rawTeam.coachName),
  };
}

function normalizePlayer(rawPlayer) {
  return {
    id: normalizeId(rawPlayer.id),
    name: normalizeText(rawPlayer.name, 200),
    birthdate: normalizeDate(rawPlayer.birthdate),
    position: normalizePosition(rawPlayer.position),
    number: normalizeInteger(rawPlayer.number, 1, 99, 'number'),
    photo: normalizeOptionalUrl(rawPlayer.photo),
    club: normalizeOptionalText(rawPlayer.club, 100),
    height: normalizeOptionalInteger(rawPlayer.height, 150, 220, 'height'),
    weight: normalizeOptionalInteger(rawPlayer.weight, 50, 150, 'weight'),
    caps: normalizeOptionalInteger(rawPlayer.caps, 0, Number.MAX_SAFE_INTEGER, 'caps'),
    goals: normalizeOptionalInteger(rawPlayer.goals, 0, Number.MAX_SAFE_INTEGER, 'goals'),
  };
}

async function buildTeamSummary(team, cacheImages, imageCache) {
  const summary = {
    id: team.id,
    name: team.name,
    slug: team.slug,
    photo: await maybeCacheImage(team.photo, cacheImages, `${team.slug}-team`, imageCache),
  };

  addOptional(summary, 'confederation', team.confederation);
  addOptional(summary, 'flag', team.flag);
  addOptional(summary, 'coachName', team.coachName);

  return summary;
}

async function buildTeamDetail(team, cacheImages, players, imageCache) {
  const detail = {
    id: team.id,
    name: team.name,
    slug: team.slug,
    photo: await maybeCacheImage(team.photo, cacheImages, `${team.slug}-team`, imageCache),
    players: await Promise.all(players.map(async (player) => ({
      ...player,
      photo: await maybeCacheImage(player.photo, cacheImages, `${team.slug}-${player.id}`, imageCache),
    }))),
  };

  addOptional(detail, 'confederation', team.confederation);
  addOptional(detail, 'flag', team.flag);
  addOptional(detail, 'coachName', team.coachName);

  return detail;
}

function validateTeam(team, { seenTeamIds, seenTeamSlugs }) {
  assertString(team.id, 'team.id');
  assertString(team.name, 'team.name');
  assertString(team.slug, 'team.slug');
  assertString(team.photo, 'team.photo');

  if (!TEAM_ID_PATTERN.test(team.id)) {
    throw new Error(`Invalid team.id: ${team.id}`);
  }
  if (!TEAM_SLUG_PATTERN.test(team.slug)) {
    throw new Error(`Invalid team.slug: ${team.slug}`);
  }
  if (seenTeamIds.has(team.id)) {
    throw new Error(`Duplicated team.id: ${team.id}`);
  }
  if (seenTeamSlugs.has(team.slug)) {
    throw new Error(`Duplicated team.slug: ${team.slug}`);
  }
  if (!isValidImageUrl(team.photo)) {
    throw new Error(`Invalid team.photo URL: ${team.photo}`);
  }

  seenTeamIds.add(team.id);
  seenTeamSlugs.add(team.slug);
}

function validatePlayer(player, seenPlayerIds) {
  assertString(player.id, 'player.id');
  assertString(player.name, 'player.name');
  assertString(player.birthdate, 'player.birthdate');
  assertString(player.position, 'player.position');
  assertNumber(player.number, 'player.number');

  if (!PLAYER_ID_PATTERN.test(player.id)) {
    throw new Error(`Invalid player.id: ${player.id}`);
  }
  if (seenPlayerIds.has(player.id)) {
    throw new Error(`Duplicated player.id: ${player.id}`);
  }
  if (!POSITION_VALUES.has(player.position)) {
    throw new Error(`Invalid player.position: ${player.position}`);
  }
  if (!isValidBirthdate(player.birthdate)) {
    throw new Error(`Invalid player.birthdate: ${player.birthdate}`);
  }
  if (!Number.isInteger(player.number) || player.number < 1 || player.number > 99) {
    throw new Error(`Invalid player.number: ${player.number}`);
  }
  if (player.photo !== null && player.photo !== undefined && !isValidImageUrl(player.photo)) {
    throw new Error(`Invalid player.photo URL: ${player.photo}`);
  }

  if (player.club !== null && player.club !== undefined) {
    assertString(player.club, 'player.club');
  }
  if (player.height !== null && player.height !== undefined && !Number.isInteger(player.height)) {
    throw new Error(`Invalid player.height: ${player.height}`);
  }
  if (player.weight !== null && player.weight !== undefined && !Number.isInteger(player.weight)) {
    throw new Error(`Invalid player.weight: ${player.weight}`);
  }

  seenPlayerIds.add(player.id);
}

function validateTeamDetailConsistency(summary, detail) {
  if (summary.id !== detail.id || summary.name !== detail.name || summary.slug !== detail.slug || summary.photo !== detail.photo) {
    throw new Error(`Summary and detail mismatch for ${summary.slug}`);
  }
}

function validateTeamsIndex(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('teams.json must be a JSON object.');
  }
  if (!Array.isArray(payload.teams) || payload.teams.length === 0) {
    throw new Error('teams.json must contain a non-empty teams array.');
  }
  const seenIds = new Set();
  const seenSlugs = new Set();
  for (const team of payload.teams) {
    if (!team.id || !team.name || !team.slug || !team.photo) {
      throw new Error('Each team in teams.json must contain id, name, slug and photo.');
    }
    if (seenIds.has(team.id)) {
      throw new Error(`Duplicated team.id in teams.json: ${team.id}`);
    }
    if (seenSlugs.has(team.slug)) {
      throw new Error(`Duplicated team.slug in teams.json: ${team.slug}`);
    }
    seenIds.add(team.id);
    seenSlugs.add(team.slug);
  }
}

function addOptional(target, key, value) {
  if (value !== null && value !== undefined && value !== '') {
    target[key] = value;
  }
}

function normalizeText(value, maxLength = 100) {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, received ${typeof value}`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('String values cannot be empty.');
  }
  if (trimmed.length > maxLength) {
    throw new Error(`String exceeds max length ${maxLength}: ${trimmed}`);
  }
  return trimmed;
}

function normalizeOptionalText(value, maxLength = 100) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return normalizeText(value, maxLength);
}

function normalizeId(value) {
  const id = normalizeText(String(value).toLowerCase().trim(), 50);
  if (!PLAYER_ID_PATTERN.test(id)) {
    throw new Error(`Invalid identifier: ${id}`);
  }
  return id;
}

function normalizeSlug(value) {
  const slug = String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  if (!TEAM_SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid slug: ${value}`);
  }
  return slug;
}

function normalizeUrl(value) {
  if (typeof value !== 'string') {
    throw new Error(`Expected URL string, received ${typeof value}`);
  }
  const trimmed = value.trim();
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('URL must use http or https.');
    }
    return trimmed;
  } catch (error) {
    throw new Error(`Invalid URL: ${trimmed}`);
  }
}

function normalizeOptionalUrl(value) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return normalizeUrl(value);
}

function normalizePosition(value) {
  const position = normalizeText(value, 20);
  if (!POSITION_VALUES.has(position)) {
    throw new Error(`Invalid position: ${position}`);
  }
  return position;
}

function normalizeDate(value) {
  if (typeof value !== 'string') {
    throw new Error(`Invalid birthdate: expected string, received ${typeof value}`);
  }

  const birthdate = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    throw new Error(`Invalid birthdate format: ${birthdate}`);
  }
  if (!isValidBirthdate(birthdate)) {
    throw new Error(`Invalid birthdate value: ${birthdate}`);
  }

  return birthdate;
}

function normalizeInteger(value, min, max, fieldName) {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`Invalid ${fieldName}: expected integer.`);
  }
  if (value < min || value > max) {
    throw new Error(`Invalid ${fieldName}: ${value} outside ${min}-${max}.`);
  }
  return value;
}

function normalizeOptionalInteger(value, min, max, fieldName) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return normalizeInteger(value, min, max, fieldName);
}

function assertString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid ${fieldName}: expected non-empty string.`);
  }
}

function assertNumber(value, fieldName) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid ${fieldName}: expected finite number.`);
  }
}

function isValidBirthdate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    return false;
  }
  return date.getTime() < Date.now();
}

function isValidImageUrl(value) {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    const pathname = parsed.pathname.toLowerCase();
    return Array.from(IMAGE_EXTENSIONS).some((extension) => pathname.endsWith(extension));
  } catch {
    return false;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function maybeCacheImage(url, cacheImages, baseName, imageCache) {
  if (!url || !cacheImages) {
    return url;
  }

  const cacheKey = `${baseName}::${url}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    const localPath = await downloadImage(url, baseName);
    const publicPath = `/${path.relative(ROOT_DIR, localPath).split(path.sep).join('/')}`;
    imageCache.set(cacheKey, publicPath);
    return publicPath;
  } catch (error) {
    console.warn(`WARN: failed to cache image ${url}: ${error.message}`);
    imageCache.set(cacheKey, url);
    return url;
  }
}

async function downloadImage(url, baseName) {
  const parsed = new URL(url);
  const extension = getImageExtension(parsed.pathname) || '.jpg';
  const fileName = `${sanitizeFileName(baseName)}${extension}`;
  const targetDir = path.join(ROOT_DIR, 'assets', 'img');
  const targetPath = path.join(targetDir, fileName);

  const response = await fetchWithTimeout(url, 20000);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
  return targetPath;
}

function getImageExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext) ? ext : null;
}

function sanitizeFileName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'image';
}

async function fetchWithTimeout(url, timeoutMs) {
  if (typeof fetch === 'function') {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  return new Promise((resolve, reject) => {
    const https = require('https');
    const request = https.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
          arrayBuffer: async () => Buffer.concat(chunks),
        });
      });
    });
    request.on('error', reject);
    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error('Request timed out'));
      reject(new Error('Request timed out'));
    });
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  normalizeSlug,
  isValidBirthdate,
  isValidImageUrl,
};
