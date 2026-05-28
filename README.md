# Guia: Gerar site estático da Copa do Mundo

![status](https://img.shields.io/badge/status-DRAFT-yellow) ![type](https://img.shields.io/badge/type-static--site-blue) ![audience](https://img.shields.io/badge/audience-fans%2C%20journalists-green) ![tech](https://img.shields.io/badge/tech-HTML%2FCSS%2FJS-lightgrey)

> Resumo: passos para transformar `spec-doc/tarefa.md` / `spec-doc/tarefa.txt` em artefatos estáticos (Markdown, JSON, páginas estáticas).

**Tags:** `status:draft` • `type:static-site` • `audience:fans,journalists` • `scope:build-time`

---

## Notas rápidas sobre os scripts

- `scripts/refinar_tarefa_para_markdown.js` — converte `spec-doc/tarefa.txt` em `spec-doc/tarefa.md` (ou executa o prompt correspondente).
- `scripts/gerar_prd_from_tarefa.js` — opcional, gera/atualiza `spec-doc/prd.md` a partir de `spec-doc/tarefa.md`.
- `scripts/gerar_spec_from_docs.js` — opcional, gera/atualiza `spec-doc/spec.md` a partir de `spec-doc/tarefa.md` e `spec-doc/prd.md`.
- `scripts/fetch-data.js` — flags sugeridas:
  - `--output <dir>`: pasta destino (padrão `data/`).
  - `--no-download-images`: não baixar imagens, usar URLs externas.

## Testar localmente

```bash
npx http-server public -p 8080
# ou
python3 -m http.server 8000
```

## Boas práticas mínimas

- Use `loading="lazy"` nas imagens e `img.onerror` para placeholders.
- Mantenha os JSON gerados versionados ou em cache no CI se as fontes públicas forem instáveis.
- Para atualizações automáticas, agende um job CI que execute `node scripts/fetch-data.js` e publique o site.

---

Se quiser, posso gerar agora os scripts de exemplo (`scripts/refinar_tarefa_para_markdown.js`, `scripts/gerar_prd_from_tarefa.js`, `scripts/gerar_spec_from_docs.js`, `scripts/fetch-data.js`, `scripts/generate-pages.js`) e um `index.html`/`selecao/brasil.html` de exemplo.
# Guia: Gerar site estático da Copa do Mundo

Este documento descreve os passos mínimos para transformar a tarefa em `spec-doc/tarefa.txt` em artefatos estáticos prontos (Markdown, JSON e páginas estáticas).

## Passo 1 — Refinar a tarefa para Markdown 
- rodar o script prompts/refinar_tarefa_para_markdown.md

## Passo 2 - Gerar PRD 
- rodar o script prompts/gerar_spec.md

## Passo 3 - Gerar especificacao técnica
- rodar o script prompts/gerar_spec.md

## Passo 4 - Executar a tarefa 
- realizar a implementacao com base nos arquivos  spec-doc/prd.md, spec-doc/spec.md e spec-doc/tarefa.md
