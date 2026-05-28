#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const SUMMARY_FILE = path.join(DATA_DIR, 'teams.json');
const TEAMS_DIR = path.join(DATA_DIR, 'teams');
const TEAM_SLUG_PATTERN = /^[a-z0-9-]{2,50}$/;
const TEAM_ID_PATTERN = /^[a-z0-9_-]{2,50}$/;
const PLAYER_ID_PATTERN = /^[a-z0-9_-]{2,50}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

async function main() {
  const summary = await readJson(SUMMARY_FILE);
  validateSummary(summary);

  const seenTeamIds = new Set();
  const seenTeamSlugs = new Set();
  const teams = summary.teams;

  for (const team of teams) {
    validateTeamSummary(team, seenTeamIds, seenTeamSlugs);

    const detailFile = path.join(TEAMS_DIR, `${team.slug}.json`);
    const detail = await readJson(detailFile);
    validateTeamDetail(detail, team, detailFile);
  }

  console.log(`JSON validation succeeded: ${teams.length} teams checked.`);
}

async function readJson(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Unable to read valid JSON from ${path.relative(ROOT_DIR, filePath)}: ${error.message}`);
  }
}

function validateSummary(summary) {
  assert(summary && typeof summary === 'object', 'data/teams.json must contain an object');
  assert(Array.isArray(summary.teams), 'data/teams.json must contain a teams array');
  assert(summary.teams.length > 0, 'data/teams.json must contain at least one team');
}

function validateTeamSummary(team, seenTeamIds, seenTeamSlugs) {
  assert(team && typeof team === 'object', 'Each team must be an object');
  assert(isNonEmptyString(team.id) && TEAM_ID_PATTERN.test(team.id), `Invalid team id: ${team.id}`);
  assert(isNonEmptyString(team.name), `Invalid team name for team id ${team.id}`);
  assert(isNonEmptyString(team.slug) && TEAM_SLUG_PATTERN.test(team.slug), `Invalid team slug for team id ${team.id}`);
  assert(isNonEmptyString(team.photo), `Invalid team photo for team slug ${team.slug}`);
  assert(isNonEmptyString(team.confederation), `Invalid team confederation for team slug ${team.slug}`);
  assert(isNonEmptyString(team.coachName), `Invalid coachName for team slug ${team.slug}`);

  assert(!seenTeamIds.has(team.id), `Duplicate team id found: ${team.id}`);
  assert(!seenTeamSlugs.has(team.slug), `Duplicate team slug found: ${team.slug}`);

  seenTeamIds.add(team.id);
  seenTeamSlugs.add(team.slug);
}

function validateTeamDetail(detail, summaryTeam, detailFile) {
  assert(detail && typeof detail === 'object', `Invalid detail file: ${path.relative(ROOT_DIR, detailFile)}`);
  assert(detail.id === summaryTeam.id, `Mismatched team id in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(detail.name === summaryTeam.name, `Mismatched team name in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(detail.slug === summaryTeam.slug, `Mismatched team slug in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(detail.photo === summaryTeam.photo, `Mismatched team photo in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(detail.confederation === summaryTeam.confederation, `Mismatched confederation in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(detail.coachName === summaryTeam.coachName, `Mismatched coachName in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(Array.isArray(detail.players), `players must be an array in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(detail.players.length > 0, `players array cannot be empty in ${path.relative(ROOT_DIR, detailFile)}`);

  const seenPlayerIds = new Set();
  detail.players.forEach((player, index) => validatePlayer(player, index, seenPlayerIds, detailFile));
}

function validatePlayer(player, index, seenPlayerIds, detailFile) {
  assert(player && typeof player === 'object', `Player ${index + 1} must be an object in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(isNonEmptyString(player.id) && PLAYER_ID_PATTERN.test(player.id), `Invalid player id in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(isNonEmptyString(player.name), `Invalid player name in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(isNonEmptyString(player.birthdate) && ISO_DATE_PATTERN.test(player.birthdate), `Invalid player birthdate in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(isNonEmptyString(player.position), `Invalid player position in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(Number.isInteger(player.number), `Invalid player number in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(isNonEmptyString(player.photo), `Invalid player photo in ${path.relative(ROOT_DIR, detailFile)}`);
  assert(isNonEmptyString(player.club), `Invalid player club in ${path.relative(ROOT_DIR, detailFile)}`);

  assert(!seenPlayerIds.has(player.id), `Duplicate player id ${player.id} in ${path.relative(ROOT_DIR, detailFile)}`);
  seenPlayerIds.add(player.id);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

main().catch(error => {
  console.error(`JSON validation failed: ${error.message}`);
  process.exitCode = 1;
});