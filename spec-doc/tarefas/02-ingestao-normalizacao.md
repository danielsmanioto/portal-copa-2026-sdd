# [02] Implementar ingestão e normalização de dados

## Objetivo
Criar o processo de build que gera os arquivos estáticos em `data/`.

## Entregáveis
- `scripts/fetch-data.js` para baixar, normalizar e salvar dados.
- Geração de `data/teams.json` e `data/teams/{slug}.json`.
- Suporte à flag para não baixar imagens (`--no-download-images`).

## Dependências
- Conclusão da tarefa [01].
