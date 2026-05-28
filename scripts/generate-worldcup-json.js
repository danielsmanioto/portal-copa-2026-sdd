#!/usr/bin/env node
'use strict';

const { parseArgs, printHelp, runPipeline } = require('./worldcup-data');

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  await runPipeline({ teamFilter: args.team, forceRefresh: args.forceRefresh, logger: console });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
