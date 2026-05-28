#!/usr/bin/env node
'use strict';

const { downloadWorldCupTeams, loadLocalTeams, loadCatalogs, downloadSquads, parseArgs, printHelp } = require('./worldcup-data');

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
  const found = manifest.teams.filter((entry) => entry.squadFound).length;
  const missing = manifest.teams.length - found;

  console.log(`✅ Download cache ready: ${found} squads cached${missing > 0 ? `, ${missing} missing` : ''}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
