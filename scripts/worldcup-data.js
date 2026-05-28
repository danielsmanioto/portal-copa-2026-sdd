'use strict';

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const RAW_DIR = path.join(DATA_DIR, 'raw');
const NORMALIZED_DIR = path.join(DATA_DIR, 'normalized');
const GENERATED_DIR = path.join(DATA_DIR, 'generated');
const WORLD_CUP_DATA_DIR = path.join(ROOT_DIR, 'world-cup-data');
const RAW_TEAM_FILE = path.join(RAW_DIR, 'openfootball-worldcup-2026.json');
const RAW_MANIFEST_FILE = path.join(RAW_DIR, 'worldcup-manifest.json');
const NORMALIZED_TEAMS_FILE = path.join(NORMALIZED_DIR, 'teams.json');
const NORMALIZED_SQUADS_DIR = path.join(NORMALIZED_DIR, 'squads');
const GENERATED_FILE = path.join(GENERATED_DIR, 'worldcup-complete.json');
const FINAL_OUTPUT_FILE = path.join(WORLD_CUP_DATA_DIR, 'worldcup-complete.json');
const LOCAL_TEAM_FILE = path.join(DATA_DIR, 'teams.json');

const OPENFOOTBALL_TEAMS_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams.json';

const SQUAD_SOURCES = [
  { key: 'wc2022', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2022/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2022/' },
  { key: 'wc2018', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2018/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2018/' },
  { key: 'wc2014', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2014/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2014/' },
  { key: 'wc2010', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2010/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2010/' },
  { key: 'wc2006', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2006/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2006/' },
  { key: 'wc2002', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2002/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc2002/' },
  { key: 'wc1998', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1998/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1998/' },
  { key: 'wc1994', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1994/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1994/' },
  { key: 'wc1990', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1990/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1990/' },
  { key: 'wc1986', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1986/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1986/' },
  { key: 'wc1982', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1982/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1982/' },
  { key: 'wc1978', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1978/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1978/' },
  { key: 'wc1974', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1974/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1974/' },
  { key: 'wc1970', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1970/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1970/' },
  { key: 'wc1966', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1966/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1966/' },
  { key: 'wc1962', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1962/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1962/' },
  { key: 'wc1958', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1958/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1958/' },
  { key: 'wc1954', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1954/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1954/' },
  { key: 'wc1950', type: 'worldcup', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1950/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/worldcup/wc1950/' },
  { key: 'euro2020', type: 'national', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/eurocham/euro2020/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/eurocham/euro2020/' },
  { key: 'euro2012', type: 'national', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/eurocham/euro2012/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/eurocham/euro2012/' },
  { key: 'conf2017', type: 'national', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/confed/conf2017/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/confed/conf2017/' },
  { key: 'conf2009', type: 'national', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/confed/conf2009/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/confed/conf2009/' },
  { key: 'acn2019', type: 'national', readmeUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/africacn/acn2019/README.md', baseUrl: 'https://raw.githubusercontent.com/footballcsv/cache.footballsquads/master/national/africacn/acn2019/' },
];

const FIFA_TO_FLAG_CODE = {
  BRA: 'br', ARG: 'ar', AUS: 'au', AUT: 'at', BEL: 'be', BIH: 'ba', CAN: 'ca', COL: 'co', CRO: 'hr',
  CZE: 'cz', CIV: 'ci', COD: 'cd', CPV: 'cv', ECU: 'ec', EGY: 'eg', ENG: 'gb-eng', ESP: 'es', FRA: 'fr',
  GER: 'de', GHA: 'gh', HAI: 'ht', IRN: 'ir', IRQ: 'iq', JOR: 'jo', JPN: 'jp', KOR: 'kr', MAR: 'ma', MEX: 'mx',
  NED: 'nl', NZL: 'nz', NOR: 'no', PAN: 'pa', PAR: 'py', POR: 'pt', QAT: 'qa', RSA: 'za', SAU: 'sa', KSA: 'sa', CUW: 'cw', SCO: 'gb-sct',
  SEN: 'sn', SRB: 'rs', SWE: 'se', SUI: 'ch', TUN: 'tn', TUR: 'tr', USA: 'us', URU: 'uy', UZB: 'uz',
  WAL: 'gb-wls', WLS: 'gb-wls', NIR: 'gb-nir', IRL: 'ie', ALG: 'dz',
};

const POSITION_MAP = { G: 'Goalkeeper', D: 'Defender', M: 'Midfielder', F: 'Forward' };

const NAME_ALIASES = {
  netherlands: ['holland'], holland: ['netherlands'], southkorea: ['korearepublic'], korearepublic: ['southkorea'],
  czechia: ['czechrepublic'], czechrepublic: ['czechia'], unitedstates: ['usa'], usa: ['unitedstates'],
  ivorycoast: ['cotedivoire'], cotedivoire: ['ivorycoast'], caboverde: ['capeverde'], capeverde: ['caboverde'],
  iriran: ['iran'], iran: ['iriran'], turkiye: ['turkey'], turkey: ['turkiye'], drcongo: ['congodr'],
  congodr: ['drcongo'], southafrica: ['rsa'], rsa: ['southafrica'], scotland: ['gbsct'], england: ['gbeng'],
  wales: ['gbwls'],
};

const DEFAULT_COACH = 'Técnico a confirmar';
const DEFAULT_FIFA_RANK = null;

function normalizeText(value) {
  return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
}

function normalizeSlug(value) {
  return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return fallback;
    }
    throw error;
  }
}

async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readTextIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function fetchText(url, { timeoutMs = 30000, headers = {} } = {}) {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: abortController.signal,
      headers: {
        'user-agent': 'portal-copa-2026-sdd/1.0',
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url, options = {}) {
  return JSON.parse(await fetchText(url, options));
}

function toFlagCode(fifaCode, name) {
  const key = String(fifaCode || '').toUpperCase();
  if (FIFA_TO_FLAG_CODE[key]) {
    return FIFA_TO_FLAG_CODE[key];
  }
  const normalizedName = normalizeText(name);
  if (normalizedName === 'england') return 'gb-eng';
  if (normalizedName === 'scotland') return 'gb-sct';
  if (normalizedName === 'wales') return 'gb-wls';
  if (normalizedName === 'northernireland') return 'gb-nir';
  return key.slice(0, 2).toLowerCase();
}

function getFlagUrl(fifaCode, name) {
  return `https://flagcdn.com/${toFlagCode(fifaCode, name)}.svg`;
}

function getPosition(positionCode) {
  return POSITION_MAP[positionCode] || null;
}

function normalizeClub(club) {
  const value = String(club || '').trim();
  if (!value || ['none', '-', 'n/a', 'na', 'un-attached', 'unattached', 'a confirmar'].includes(value.toLowerCase())) {
    return null;
  }
  return value;
}

function normalizePlayerNumber(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 && parsed < 100 ? parsed : null;
}

function normalizePlayerId(name, number) {
  const base = normalizeSlug(name);
  return number ? `${base}-${number}` : base;
}

function expandAliases(values) {
  const result = new Set();
  const queue = ensureArray(values).filter(Boolean);
  while (queue.length > 0) {
    const current = queue.pop();
    const key = normalizeText(current);
    if (!key || result.has(key)) {
      continue;
    }
    result.add(key);
    for (const alias of NAME_ALIASES[key] || []) {
      if (!result.has(alias)) {
        queue.push(alias);
      }
    }
  }
  return result;
}

async function loadLocalTeams() {
  const data = await readJson(LOCAL_TEAM_FILE, { teams: [] });
  const list = ensureArray(data.teams);
  const map = new Map();
  for (const team of list) {
    for (const key of [team.id, team.slug, team.name, team.coachName]) {
      const normalized = normalizeText(key);
      if (normalized) {
        map.set(normalized, team);
      }
    }
  }
  return { list, map };
}

function selectTeamByQuery(teams, query) {
  if (!query) {
    return teams;
  }
  const normalized = normalizeText(query);
  return teams.filter((team) => {
    const names = expandAliases([team.name, team.name_normalised, team.id, team.slug]);
    return names.has(normalized) || normalizeText(team.fifa_code) === normalized;
  });
}

function parseTeamAliases(team, localTeam = null) {
  return expandAliases([
    team.name,
    team.name_normalised,
    team.fifa_code,
    localTeam?.name,
    localTeam?.slug,
    localTeam?.id,
  ]);
}

async function loadOrFetchJson(filePath, url, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = await readJson(filePath, null);
    if (cached) {
      return cached;
    }
  }
  const data = await fetchJson(url);
  await writeJson(filePath, data);
  return data;
}

async function loadOrFetchText(filePath, url, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = await readTextIfExists(filePath);
    if (cached !== null) {
      return cached;
    }
  }
  const text = await fetchText(url);
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, text, 'utf8');
  return text;
}

function parseReadmeLinks(readmeText) {
  const entries = [];
  for (const line of readmeText.split(/\r?\n/)) {
    const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) {
      continue;
    }
    const displayName = match[1].trim();
    const fileName = match[2].trim();
    if (!fileName || fileName.toLowerCase().includes('readme')) {
      continue;
    }
    entries.push({
      displayName,
      displayNameKey: normalizeText(displayName),
      fileName,
      fileNameKey: normalizeText(fileName.replace(/\.txt$/i, '')),
    });
  }
  return entries;
}

async function loadCatalog(source, { forceRefresh = false } = {}) {
  const cachePath = path.join(RAW_DIR, 'footballcsv-indexes', `${source.key}.md`);
  const text = await loadOrFetchText(cachePath, source.readmeUrl, { forceRefresh });
  return { ...source, cachePath, entries: parseReadmeLinks(text) };
}

async function loadCatalogs({ forceRefresh = false } = {}) {
  const catalogs = [];
  for (const source of SQUAD_SOURCES) {
    try {
      catalogs.push(await loadCatalog(source, { forceRefresh }));
    } catch (error) {
      catalogs.push({ ...source, entries: [], error: error.message });
    }
  }
  return catalogs;
}

function findCatalogEntryForTeam(team, catalogs, localTeam = null) {
  const aliases = parseTeamAliases(team, localTeam);
  for (const catalog of catalogs) {
    for (const entry of catalog.entries || []) {
      if (aliases.has(entry.displayNameKey) || aliases.has(entry.fileNameKey)) {
        return {
          sourceKey: catalog.key,
          sourceType: catalog.type,
          displayName: entry.displayName,
          fileName: entry.fileName,
          url: `${catalog.baseUrl}${entry.fileName}`,
          catalogReadme: catalog.readmeUrl,
        };
      }
    }
  }
  return null;
}

async function downloadWorldCupTeams({ forceRefresh = false } = {}) {
  const rawTeams = await loadOrFetchJson(RAW_TEAM_FILE, OPENFOOTBALL_TEAMS_URL, { forceRefresh });
  return ensureArray(rawTeams);
}

async function downloadSquads({ teams, catalogs, localTeams, forceRefresh = false, teamFilter = null } = {}) {
  const selectedTeams = selectTeamByQuery(teams, teamFilter);
  const updatedManifest = [];

  for (const team of selectedTeams) {
    const localTeam = localTeams.map.get(normalizeText(team.name_normalised || team.name));
    const match = findCatalogEntryForTeam(team, catalogs, localTeam);
    const fifaCode = String(team.fifa_code || '').toUpperCase();
    const teamSlug = normalizeSlug(team.name_normalised || team.name || fifaCode);
    const cachePath = path.join(RAW_DIR, 'footballcsv-squads', `${teamSlug}.txt`);

    if (!match) {
      updatedManifest.push({ fifaCode, name: team.name_normalised || team.name, squadFound: false, cachePath });
      continue;
    }

    const existing = await readTextIfExists(cachePath);
    let squadText = existing;
    if (!squadText || forceRefresh) {
      squadText = await fetchText(match.url);
      await ensureDir(path.dirname(cachePath));
      await fs.writeFile(cachePath, squadText, 'utf8');
    }

    updatedManifest.push({
      fifaCode,
      name: team.name_normalised || team.name,
      squadFound: true,
      sourceKey: match.sourceKey,
      sourceType: match.sourceType,
      sourceUrl: match.url,
      sourceName: match.displayName,
      cachePath,
    });
  }

  const finalManifest = {
    generatedAt: new Date().toISOString(),
    teams: updatedManifest,
    sources: catalogs.map((catalog) => ({
      key: catalog.key,
      type: catalog.type,
      readmeUrl: catalog.readmeUrl,
      baseUrl: catalog.baseUrl,
      entryCount: catalog.entries.length,
      error: catalog.error || null,
    })),
  };

  await writeJson(RAW_MANIFEST_FILE, finalManifest);
  return finalManifest;
}

function parseSquadText(text, team, { maxPlayers = Infinity } = {}) {
  const players = [];
  const seen = new Set();
  let inPlayersSection = false;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
    if (/^==\s*Past Players/i.test(line)) {
      break;
    }
    if (/^Number\s*,\s*Name\s*,\s*Nat\s*,\s*Pos/i.test(line)) {
      inPlayersSection = true;
      continue;
    }
    if (!inPlayersSection && !/^\d*\s*,/.test(line)) {
      continue;
    }
    if (!/^\d*\s*,/.test(line)) {
      continue;
    }

    const parts = line.split(',').map((part) => part.trim());
    if (parts.length < 4) {
      continue;
    }

    const [numberRaw, name, nat, pos, height, weight, birthdate, birthPlace, ...clubParts] = parts;
    if (!name || /^(Number|Name|Nat|Pos)$/i.test(name)) {
      continue;
    }

    const natCode = String(nat || '').toUpperCase();

    const number = normalizePlayerNumber(numberRaw);
    const club = normalizeClub(clubParts.join(', '));
    const position = getPosition(pos);
    const playerKey = `${normalizeText(name)}:${number ?? 'x'}:${normalizeText(club || '')}`;
    if (seen.has(playerKey)) {
      continue;
    }
    seen.add(playerKey);

    players.push({
      id: normalizePlayerId(name, number),
      name,
      position,
      number,
      club,
      nat: natCode || null,
      birthdate: birthdate || null,
      birthPlace: birthPlace || null,
      height: height || null,
      weight: weight || null,
    });

    if (players.length >= maxPlayers) {
      break;
    }
  }

  return players;
}

async function loadRawSquadTextForTeam(_team, manifestEntry) {
  if (!manifestEntry?.cachePath) {
    return null;
  }
  return await readTextIfExists(manifestEntry.cachePath);
}

async function normalizeWorldCupData({ teams, manifest, localTeams, teamFilter = null } = {}) {
  const selectedTeams = selectTeamByQuery(teams, teamFilter);
  const teamsByCode = new Map();
  const normalizedTeams = [];

  for (const team of selectedTeams) {
    const fifaCode = String(team.fifa_code || '').toUpperCase();
    const localTeam = localTeams.map.get(normalizeText(team.name_normalised || team.name)) || localTeams.map.get(normalizeText(fifaCode));
    const code = toFlagCode(fifaCode, team.name_normalised || team.name);
    const flag = getFlagUrl(fifaCode, team.name_normalised || team.name);
    const coach = localTeam?.coachName || localTeam?.coach || DEFAULT_COACH;
    const normalizedTeam = {
      id: fifaCode,
      name: team.name_normalised || team.name,
      code,
      group: team.group || null,
      flag,
      coach,
      fifaRank: DEFAULT_FIFA_RANK,
      players: [],
    };
    normalizedTeams.push(normalizedTeam);
    teamsByCode.set(fifaCode, { team, normalizedTeam, localTeam });
  }

  await ensureDir(NORMALIZED_SQUADS_DIR);
  await writeJson(NORMALIZED_TEAMS_FILE, normalizedTeams);

  const squadEntries = [];
  for (const normalizedTeam of normalizedTeams) {
    const fifaCode = normalizedTeam.id;
    const match = manifest?.teams?.find((entry) => String(entry.fifaCode || '').toUpperCase() === fifaCode);
    const sourceTeam = teamsByCode.get(fifaCode)?.team;
    const squadText = await loadRawSquadTextForTeam(sourceTeam, match);
    let players = [];
    if (squadText) {
      players = parseSquadText(squadText, sourceTeam || { fifa_code: fifaCode, name: normalizedTeam.name });
    }

    const squadData = {
      id: fifaCode,
      name: normalizedTeam.name,
      code: normalizedTeam.code,
      group: normalizedTeam.group,
      flag: normalizedTeam.flag,
      coach: normalizedTeam.coach,
      fifaRank: normalizedTeam.fifaRank,
      players,
      source: match || null,
    };

    await writeJson(path.join(NORMALIZED_SQUADS_DIR, `${normalizeSlug(normalizedTeam.name)}.json`), squadData);
    squadEntries.push(squadData);
  }

  return { teams: normalizedTeams, squads: squadEntries };
}

function validateFinalTeams(teams) {
  const issues = [];
  if (!Array.isArray(teams)) {
    return ['final output is not an array'];
  }
  const seenIds = new Set();
  for (const team of teams) {
    if (!team || typeof team !== 'object') {
      issues.push('team entry is not an object');
      continue;
    }
    if (!team.id || !team.name || !team.code || !team.group || !team.flag) {
      issues.push(`missing required team fields for ${team.name || team.id || 'unknown'}`);
    }
    const id = String(team.id || '').toUpperCase();
    if (seenIds.has(id)) {
      issues.push(`duplicate team id ${id}`);
    }
    seenIds.add(id);
    if (!Array.isArray(team.players)) {
      issues.push(`players is not an array for ${id}`);
    }
  }
  return issues;
}

async function mergeNormalizedData({ teamFilter = null } = {}) {
  const normalizedTeams = await readJson(NORMALIZED_TEAMS_FILE, []);
  const selectedTeams = selectTeamByQuery(normalizedTeams, teamFilter);
  const merged = [];
  let totalPlayers = 0;
  let teamsWithoutSquad = 0;

  for (const team of selectedTeams) {
    const squadPath = path.join(NORMALIZED_SQUADS_DIR, `${normalizeSlug(team.name)}.json`);
    const squad = await readJson(squadPath, null);
    const players = ensureArray(squad?.players).map((player) => ({
      name: player.name,
      position: player.position,
      club: player.club,
      number: player.number,
    }));

    if (!players.length) {
      teamsWithoutSquad += 1;
    }

    totalPlayers += players.length;
    merged.push({
      id: team.id,
      name: team.name,
      code: team.code,
      group: team.group,
      flag: team.flag,
      coach: team.coach,
      fifaRank: team.fifaRank,
      players,
    });
  }

  const issues = validateFinalTeams(merged);
  if (issues.length > 0) {
    throw new Error(`Validation failed: ${issues.join('; ')}`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    totalTeams: merged.length,
    totalPlayers,
    teamsWithoutSquad,
    teams: merged,
  };

  await ensureDir(GENERATED_DIR);
  await ensureDir(WORLD_CUP_DATA_DIR);
  await writeJson(GENERATED_FILE, payload);
  await writeJson(FINAL_OUTPUT_FILE, merged);

  return { payload, merged };
}

async function runPipeline({ teamFilter = null, forceRefresh = false, logger = console } = {}) {
  await ensureDir(RAW_DIR);
  await ensureDir(NORMALIZED_DIR);
  await ensureDir(GENERATED_DIR);
  await ensureDir(WORLD_CUP_DATA_DIR);

  const localTeams = await loadLocalTeams();
  const teams = await downloadWorldCupTeams({ forceRefresh });
  const filteredTeams = selectTeamByQuery(teams, teamFilter);
  const catalogs = await loadCatalogs({ forceRefresh });
  const manifest = await downloadSquads({ teams: filteredTeams, catalogs, localTeams, forceRefresh, teamFilter });
  const normalized = await normalizeWorldCupData({ teams, manifest, localTeams, teamFilter });
  const merged = await mergeNormalizedData({ teamFilter });

  for (const team of merged.merged) {
    if (team.players.length > 0) {
      logger.log(`✅ ${team.name} loaded with ${team.players.length} players`);
    } else {
      logger.warn(`⚠ ${team.name} squad not found`);
    }
  }

  logger.log('🎉 worldcup-complete.json generated successfully');
  logger.log(`📊 ${merged.payload.totalTeams} selections, ${merged.payload.totalPlayers} players, ${merged.payload.teamsWithoutSquad} without squad`);

  return { teams, catalogs, manifest, normalized, merged };
}

function parseArgs(argv) {
  const args = { forceRefresh: false, team: null, output: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    if (token === '--refresh' || token === '--force-refresh') {
      args.forceRefresh = true;
      continue;
    }
    if (token.startsWith('--team=')) {
      args.team = token.slice('--team='.length);
      continue;
    }
    if (token === '--team') {
      args.team = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (token.startsWith('--output=')) {
      args.output = token.slice('--output='.length);
      continue;
    }
  }
  return args;
}

function printHelp() {
  process.stdout.write('Usage: node scripts/generate-worldcup-json.js [options]\n\n');
  process.stdout.write('Options:\n');
  process.stdout.write('  --team <name|id|slug>   Generate only one team\n');
  process.stdout.write('  --refresh               Ignore local cache and re-download\n');
  process.stdout.write('  --output <path>         Custom output file for the merged JSON\n');
  process.stdout.write('  -h, --help              Show this help\n');
}

module.exports = {
  ROOT_DIR,
  DATA_DIR,
  RAW_DIR,
  NORMALIZED_DIR,
  GENERATED_DIR,
  WORLD_CUP_DATA_DIR,
  RAW_TEAM_FILE,
  RAW_MANIFEST_FILE,
  NORMALIZED_TEAMS_FILE,
  NORMALIZED_SQUADS_DIR,
  GENERATED_FILE,
  FINAL_OUTPUT_FILE,
  OPENFOOTBALL_TEAMS_URL,
  SQUAD_SOURCES,
  FIFA_TO_FLAG_CODE,
  POSITION_MAP,
  normalizeText,
  normalizeSlug,
  loadLocalTeams,
  loadCatalogs,
  downloadWorldCupTeams,
  downloadSquads,
  normalizeWorldCupData,
  mergeNormalizedData,
  runPipeline,
  parseArgs,
  printHelp,
  parseSquadText,
  validateFinalTeams,
  toFlagCode,
  getFlagUrl,
  getPosition,
  normalizeClub,
  normalizePlayerId,
};
