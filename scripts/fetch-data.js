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

// ============================================================================
// OpenFootball 2026 Integration
// ============================================================================

// Mapeamento de FIFA_CODE -> Slug personalizado
const FIFA_CODE_TO_SLUG = {
  'BRA': 'brasil',
  'ARG': 'argentina',
  'FRA': 'franca',
  'ESP': 'espanha',
};

// Técnicos confirmados para 2026
const COACHES_2026 = {
  'BRA': 'Dorival Júnior',
  'ARG': 'Lionel Scaloni',
  'FRA': 'Didier Deschamps',
  'ESP': 'Luis de la Fuente',
  'GER': 'Julian Nagelsmann',
  'ENG': 'Gareth Southgate',
  'POR': 'Roberto Martínez',
  'NED': 'Ronald Koeman',
  'URU': 'Marcelo Bielsa',
  'BEL': 'Domenico Tedesco',
  'SWE': 'Janne Andersson',
  'ITA': 'Luciano Spalletti',
  'USA': 'Gregg Berhalter',
  'MEX': 'Jaime Lozano',
  'CAN': 'Jesse Marsch',
  'CRO': 'Zlatko Dalić',
  'AUT': 'Ralf Rangnick',
  'CZE': 'Ivan Hasek',
  'DEN': 'Kasper Hjulmand',
  'POL': 'Czesław Michniewicz',
  'ROU': 'Edi Iordănescu',
  'SCO': 'Steve Clarke',
  'JPN': 'Hajime Moriyasu',
  'SEN': 'Aliou Cissé',
  'GHA': 'Otto Addo',
  'NGA': 'Finidi George',
  'CIV': 'Jean-Louis Gasset',
  'EGY': 'Carlos Queiroz',
  'MAR': 'Walid Regragui',
  'TUN': 'Jalel Kadri',
  'RSA': 'Hugo Broos',
  'KOR': 'Paulo Bento',
  'AUS': 'Graham Arnold',
  'IRN': 'Carlos Queiroz',
  'IRQ': 'Bartosz Nawałka',
  'SAU': 'Hervé Renard',
  'JOR': 'Stale Solbakken',
  'COL': 'Néstor Lorenzo',
  'PAR': 'Gustavo Alfaro',
  'ECU': 'Félix Sánchez Bas',
  'NED': 'Ronald Koeman',
  'NOR': 'Stale Solbakken',
  'PER': 'Juan Reynoso',
  'BOL': 'Oscar Villegas',
  'VEN': 'Fernando Batista',
  'CHI': 'Ricardo Gareca',
  'CRC': 'Gustavo Alfaro',
  'PAN': 'Thomas Christiansen',
  'HAI': 'Milenio Peguero',
  'CPV': 'Julio Duarte',
  'UAZ': 'Srecko Katanec',
  'UZB': 'Srecko Katanec',
  'QAT': 'Marсus Steuer',
  'BIH': 'Srecko Katanec',
  'SUI': 'Murat Yakin',
  'HUN': 'Marco Rossi',
  'SVK': 'Francesco Calzona',
  'ALB': 'Sylvinho',
  'GRE': 'Ivan Jovanovic',
  'ISL': 'Hallgrímur Helguson',
  'FIN': 'Markku Kanerva',
  'SVN': 'Matjaž Kek',
  'SRB': 'Dragan Stojković',
  'BUL': 'Georgi Dermendzhiev',
  'CUW': 'Remko Bicentini',
  'ALG': 'Vladimir Petkovic',
  'CAM': 'Rigobert Song',
  'COD': 'Sébastien Desabre',
};

// Coach genérico para times sem confirmação
const DEFAULT_COACH = 'Técnico a confirmar';

// Confederações por FIFA_CODE
const CONFEDERATIONS = {
  'BRA': 'CONMEBOL', 'ARG': 'CONMEBOL', 'URU': 'CONMEBOL', 'PAR': 'CONMEBOL',
  'COL': 'CONMEBOL', 'ECU': 'CONMEBOL', 'PER': 'CONMEBOL',
  'ESP': 'UEFA', 'FRA': 'UEFA', 'GER': 'UEFA', 'ENG': 'UEFA', 'ITA': 'UEFA',
  'POR': 'UEFA', 'NED': 'UEFA', 'BEL': 'UEFA', 'SWE': 'UEFA',
  'JPN': 'AFC', 'KOR': 'AFC', 'AUS': 'AFC', 'IRN': 'AFC', 'IRQ': 'AFC', 'SAU': 'AFC', 'QAT': 'AFC',
  'USA': 'CONCACAF', 'MEX': 'CONCACAF', 'CAN': 'CONCACAF', 'PAN': 'CONCACAF', 'CRC': 'CONCACAF',
  'SEN': 'CAF', 'GHA': 'CAF', 'CIV': 'CAF', 'EGY': 'CAF', 'MAR': 'CAF', 'TUN': 'CAF', 'RSA': 'CAF', 'CPV': 'CAF',
};

// Mapa país -> ID curto
const COUNTRY_NAME_MAP = {
  'Mexico': 'mex', 'South Africa': 'rsa', 'South Korea': 'kor', 'Czech Republic': 'cze',
  'Canada': 'can', 'Bosnia & Herzegovina': 'bih', 'Qatar': 'qat', 'Switzerland': 'sui',
  'Brazil': 'bra', 'Morocco': 'mar', 'Haiti': 'hai', 'Scotland': 'sco', 'USA': 'usa',
  'Paraguay': 'par', 'Australia': 'aus', 'Turkey': 'tur', 'Germany': 'ger', 'Curaçao': 'cuw',
  'Ivory Coast': 'civ', 'Ecuador': 'ecu', 'Netherlands': 'ned', 'Japan': 'jpn', 'Sweden': 'swe',
  'Tunisia': 'tun', 'Belgium': 'bel', 'Egypt': 'egy', 'Iran': 'irn', 'New Zealand': 'nzl',
  'Spain': 'esp', 'Cape Verde': 'cpv', 'Saudi Arabia': 'ksa', 'Uruguay': 'uru', 'France': 'fra',
  'Senegal': 'sen', 'Iraq': 'irq', 'Norway': 'nor', 'Argentina': 'arg', 'Algeria': 'alg',
  'Austria': 'aut', 'Jordan': 'jor', 'Portugal': 'por', 'DR Congo': 'cod', 'Uzbekistan': 'uzb',
  'Colombia': 'col', 'England': 'eng', 'Croatia': 'cro', 'Ghana': 'gha', 'Panama': 'pan',
};

// Criar jogador fictício padrão
function createDefaultPlayer() {
  return {
    id: 'player_a_definir',
    name: 'A definir',
    birthdate: '2000-01-01',
    position: 'Meio',
    number: 1,
    photo: 'https://example.com/images/placeholder-player.png',
    club: 'A confirmar',
  };
}

// Buscar dados do OpenFootball
async function fetchOpenFootballTeams() {
  const url = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams.json';
  try {
    const response = await fetchWithTimeout(url, 30000);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const text = Buffer.from(arrayBuffer).toString('utf8');
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to fetch OpenFootball teams: ${error.message}`);
  }
}

// Converter OpenFootball teams para fixtures
async function convertOpenFootballToFixtures(fallbackFixtures) {
  let teams = [];
  try {
    teams = await fetchOpenFootballTeams();
    console.log(`✓ Fetched ${teams.length} teams from OpenFootball`);
  } catch (error) {
    console.warn(`⚠ Using fallback fixtures: ${error.message}`);
    return fallbackFixtures;
  }

  const fixtures = teams.map((team) => {
    const fifa_code = (team.fifa_code || '').toUpperCase();
    const team_name = team.name_normalised || team.name || 'Unknown';
    const customSlug = FIFA_CODE_TO_SLUG[fifa_code];
    const slug = customSlug || normalizeSlug(team_name);
    const id = COUNTRY_NAME_MAP[team.name] || fifa_code.toLowerCase().slice(0, 3).toLowerCase();

    return {
      sourceId: 'openfootball-2026',
      id,
      name: team_name,
      slug,
      photo: `https://example.com/images/selecoes/${slug}.png`,
      confederation: CONFEDERATIONS[fifa_code] || team.confed || 'Unknown',
      coachName: COACHES_2026[fifa_code] || DEFAULT_COACH,
      players: [createDefaultPlayer()],
    };
  });

  return fixtures;
}

// Fixtures locais como fallback
const FALLBACK_FIXTURES = [
  {
    sourceId: 'fifa-api',
    id: 'bra',
    name: 'Brasil',
    slug: 'brasil',
    photo: 'https://example.com/images/selecoes/brasil.png',
    confederation: 'CONMEBOL',
    coachName: 'Dorival Júnior',
    players: [createDefaultPlayer()],
  },
  {
    sourceId: 'fifa-api',
    id: 'arg',
    name: 'Argentina',
    slug: 'argentina',
    photo: 'https://example.com/images/selecoes/argentina.png',
    confederation: 'CONMEBOL',
    coachName: 'Lionel Scaloni',
    players: [createDefaultPlayer()],
  },
  {
    sourceId: 'fifa-api',
    id: 'fra',
    name: 'França',
    slug: 'franca',
    photo: 'https://example.com/images/selecoes/franca.png',
    confederation: 'UEFA',
    coachName: 'Didier Deschamps',
    players: [createDefaultPlayer()],
  },
  {
    sourceId: 'fifa-api',
    id: 'esp',
    name: 'Espanha',
    slug: 'espanha',
    photo: 'https://example.com/images/selecoes/espanha.png',
    confederation: 'UEFA',
    coachName: 'Luis de la Fuente',
    players: [createDefaultPlayer()],
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

  // Converter dados do OpenFootball para fixtures
  const rawTeamFixtures = await convertOpenFootballToFixtures(FALLBACK_FIXTURES);

  const preparedTeams = [];
  const seenTeamIds = new Set();
  const seenTeamSlugs = new Set();
  const imageCache = new Map();

  for (const rawTeam of rawTeamFixtures) {
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
    if (!['http:', 'https:', 'file:'].includes(parsed.protocol)) {
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
