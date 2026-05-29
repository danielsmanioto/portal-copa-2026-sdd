# Prompt: Ajuste de equipes (normalização + correções + validação)

Você é um agente de código e precisa padronizar os arquivos de equipes da Copa no projeto.

## Objetivo
Garantir consistência completa entre:
- `data/teams.json` (fonte de verdade dos slugs)
- arquivos de detalhe em `data/teams/*.json`
- campos obrigatórios de jogadores para passar em `scripts/validate-json.js`

## Regras obrigatórias
1. **Use `data/teams.json` como referência oficial** para os slugs válidos.
2. **Padronize nomes de arquivos** em `data/teams/` para combinar com `detail.slug`.
3. Se houver duplicados (ex.: `brasil.json` e `brazil.json`):
   - mantenha o slug oficial de `data/teams.json`
   - mova os não-oficiais para backup em `data/teams/extra-backup/`
4. Garanta que cada jogador tenha os campos obrigatórios:
   - `id` (string)
   - `name` (string)
   - `birthdate` (`YYYY-MM-DD`)
   - `position` (string)
   - `number` (inteiro)
   - `photo` (string não vazia)
   - `club` (string não vazia)
5. Para valores ausentes, usar fallback:
   - `photo`: `/assets/img/placeholder-player.png`
   - `club`: `Unknown`
6. Não apagar dados de backup sem pedido explícito.

## Scripts que devem existir/ser usados
- `scripts/normalize-team-filenames.js`
- `scripts/fix-player-photos.js`
- `scripts/move-non-summary-teams.js`
- `scripts/validate-json.js`

## Passos de execução
1. Rodar normalização de nomes/slug:
   - `node scripts/normalize-team-filenames.js`
2. Corrigir campos ausentes de jogadores:
   - `node scripts/fix-player-photos.js`
3. Mover arquivos não-oficiais para backup:
   - `node scripts/move-non-summary-teams.js`
4. Validar tudo:
   - `node scripts/validate-json.js`

## Critério de pronto
- `node scripts/validate-json.js` deve retornar sucesso.
- Não deve restar arquivo duplicado de slug oficial dentro de `data/teams/`.
- Arquivos extras devem estar em `data/teams/extra-backup/`.

## Saída esperada do agente
- Resumo curto com:
  - quantidade de arquivos ajustados
  - arquivos movidos para backup
  - resultado da validação final
