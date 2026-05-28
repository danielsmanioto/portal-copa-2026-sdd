#!/usr/bin/env node
'use strict';

const { mergeNormalizedData, parseArgs, printHelp } = require('./worldcup-data');

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const result = await mergeNormalizedData({ teamFilter: args.team });
  console.log(`✅ Merged ${result.merged.length} teams into ${result.payload.totalPlayers} players`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
