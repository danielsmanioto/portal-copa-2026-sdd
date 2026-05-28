#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_TEAMS = path.join(ROOT, 'data', 'teams.json');
const TEMPLATE = path.join(ROOT, 'selecao', 'brasil.html');
const OUT_DIR = path.join(ROOT, 'selecao');

async function loadTemplate() {
  const html = await fs.readFile(TEMPLATE, 'utf8');
  return html;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildPageFromTemplate(template, team) {
  const slug = team.slug;
  const name = team.name;
  const title = `${escapeHtml(name)} — Seleção`;
  const description = `Elenco completo da seleção do ${escapeHtml(name)}, com jogadores, posições, clubes e fotos.`;
  const url = `/selecao/${slug}.html`;

  let out = template;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}<\/title>`);
  out = out.replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
  out = out.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  out = out.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
  out = out.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);
  out = out.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
  out = out.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);
  out = out.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`);

  // data-slug in body
  out = out.replace(/<body([^>]*)data-slug="[^"]*"([^>]*)>/i, `<body$1data-slug="${slug}"$2>`);

  // h1
  out = out.replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>Seleção — ${escapeHtml(name)}<\/h1>`);

  // ensure og:url/canonical referencing path updated in other places if present
  out = out.replace(new RegExp(`/selecao/[^"']+\.html`, 'g'), url);

  return out;
}

async function main() {
  const data = JSON.parse(await fs.readFile(DATA_TEAMS, 'utf8'));
  const teams = data.teams || [];
  const template = await loadTemplate();

  await fs.mkdir(OUT_DIR, { recursive: true });

  let count = 0;
  for (const team of teams) {
    const slug = team.slug;
    const outHtml = buildPageFromTemplate(template, team);
    const outPath = path.join(OUT_DIR, `${slug}.html`);
    await fs.writeFile(outPath, outHtml, 'utf8');
    count += 1;
  }

  console.log(`Generated ${count} selecao pages in ${path.relative(ROOT, OUT_DIR)}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
