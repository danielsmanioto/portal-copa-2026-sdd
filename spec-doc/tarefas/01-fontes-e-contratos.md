# [01] Definir fontes e contratos de dados

## Objetivo
Mapear fontes públicas e fechar o contrato mínimo dos JSONs (`teams.json` e `teams/{slug}.json`).

## Entregáveis
- Lista de fontes públicas em `scripts/sources.json`.
- Contrato de campos obrigatórios para time e jogador.
- Regras de validação mínima documentadas.

## Dependências
- Nenhuma.

## Status
- Concluída em 2026-05-28.

## Fontes públicas definidas
- Arquivo criado: `scripts/sources.json`.
- Fontes iniciais mapeadas:
  - FIFA (referência oficial institucional).
  - Wikipedia (bootstrap de seleções).
  - Wikidata Query Service (dados estruturados para normalização).

## Contrato mínimo de dados

### `data/teams.json` (sumário)
- Estrutura: objeto raiz com chave `teams` (array).
- Cada item de `teams` deve conter:
  - `id` (string, obrigatório, único).
  - `name` (string, obrigatório).
  - `slug` (string, obrigatório, único).
  - `photo` (string URL, opcional).

### `data/teams/{slug}.json` (detalhe)
- Objeto raiz da seleção:
  - `id` (string, obrigatório).
  - `name` (string, obrigatório).
  - `slug` (string, obrigatório).
  - `photo` (string URL, opcional).
  - `players` (array, obrigatório).
- Cada jogador em `players`:
  - `id` (string, obrigatório, único no elenco).
  - `name` (string, obrigatório).
  - `birthdate` (string no formato `YYYY-MM-DD`, obrigatório).
  - `position` (string, obrigatório: `Goleiro|Defesa|Meio|Ataque`).
  - `club` (string, opcional).
  - `photo` (string URL, opcional).

## Regras de validação mínima
- Reprovar seleção sem `id`, `name` ou `slug`.
- Reprovar jogador sem `id`, `name`, `birthdate` ou `position`.
- Reprovar `birthdate` fora do padrão ISO (`YYYY-MM-DD`).
- Reprovar `position` fora da enumeração prevista.
- Reprovar `slug` duplicado em `teams.json`.
- Reprovar `id` duplicado dentro do mesmo elenco.
