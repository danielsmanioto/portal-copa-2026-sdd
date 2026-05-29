# Prompt: Criar/Atualizar página `tabela.html` (grupos + jogos)

Você é um agente de código e precisa criar ou atualizar a página de tabela da Copa no projeto estático.

## Objetivo
Construir uma página `tabela.html` que mostre:
1. Todos os grupos da Copa (A até L)
2. Seleções de cada grupo com bandeira
3. Jogos da fase de grupos por rodada

## Fonte de dados
- `data/generated/worldcup-complete.json` (fonte principal: times e grupo)
- `data/teams.json` (mapear `id` -> `slug` para link da seleção)

## Regras de implementação
1. Criar `tabela.html` com:
   - header igual ao site
   - navegação com links para `/index.html` e `/tabela.html`
   - container principal: `#worldcup-table-container`
   - script carregado: `/assets/js/tabela.js`
2. Criar `assets/js/tabela.js`:
   - classe `WorldCupTablePage`
   - carregar os 2 JSONs com `Promise.all`
   - agrupar por `team.group`
   - ordenar grupos e seleções alfabeticamente
   - renderizar bandeira (`team.flag` ou fallback por `code`)
   - gerar confrontos por grupo:
     - Rodada 1: 1x2 e 3x4
     - Rodada 2: 1x3 e 4x2
     - Rodada 3: 1x4 e 2x3
3. Usar fallback de imagem: `/assets/img/placeholder-player.png`
4. Manter acessibilidade:
   - `aria-label` nos links
   - estado de loading e erro

## Estilos
Adicionar em `assets/css/styles.css` classes da página:
- `.table-page-hero`
- `.groups-grid`
- `.group-card`
- `.group-teams`
- `.group-team-item`
- `.group-team-flag`
- `.group-fixtures`
- `.fixture-row`

## Critérios de pronto
- `index.html` possui link funcional para `/tabela.html`
- `tabela.html` abre sem erro
- grupos e jogos renderizam no navegador
- sem erros de sintaxe nos arquivos alterados

## Comandos de validação
```bash
node -e "new Function(require('fs').readFileSync('assets/js/tabela.js','utf8'))"
node -e "new Function(require('fs').readFileSync('assets/js/app.js','utf8'))"
```

## Saída esperada do agente
Resumo curto com:
- arquivos criados/alterados
- se os grupos e jogos estão renderizando
- próximos passos (ex.: substituir jogos previstos por calendário oficial)
