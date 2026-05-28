#!/usr/bin/env node
'use strict';

const { downloadWorldCupTeams, loadLocalTeams, loadCatalogs, downloadSquads, normalizeWorldCupData, parseArgs, printHelp } = require('./worldcup-data');

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const localTeams = await loadLocalTeams();
  const teams = await downloadWorldCupTeams({ forceRefresh: args.forceRefresh });
  const catalogs = await loadCatalogs({ forceRefresh: args.forceRefresh });
  const manifest = await downloadSquads({ teams, catalogs, localTeams, forceRefresh: args.forceRefresh, teamFilter: args.team });
  const normalized = await normalizeWorldCupData({ teams, manifest, localTeams, teamFilter: args.team });
  console.log(`✅ Normalized ${normalized.teams.length} teams and ${normalized.squads.length} squad files`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
