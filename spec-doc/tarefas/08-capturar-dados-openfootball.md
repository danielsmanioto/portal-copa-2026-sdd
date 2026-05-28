# [08] Capturar dados do OpenFootball 2026

## Objetivo
Atualizar a base de dados do portal para consumir a edição 2026 do OpenFootball como fonte primária de seleções.

## Entregáveis
- Integração da lista de seleções do OpenFootball 2026 em `data/teams.json`.
- Atualização dos arquivos `data/teams/{slug}.json` com os times da nova fonte.
- Definição de um jogador fictício padrão para preencher elencos quando a fonte não trouxer jogadores completos.
- Validação automatizada dos JSONs após a geração.

## Fonte principal
- `https://github.com/openfootball/worldcup.json/blob/master/2026/worldcup.teams.json`
- `https://github.com/openfootball/worldcup.json/tree/master/2026`

## Premissas
- O repositório OpenFootball é usado apenas como fonte de dados públicos para as seleções.
- Os nomes das seleções devem ser normalizados para manter compatibilidade com o padrão atual do portal.
- Quando não houver elenco completo disponível, o projeto deve manter pelo menos um jogador placeholder com nome em português e campos consistentes com o contrato atual.

## Critérios de aceite
- `data/teams.json` contém as seleções da Copa do Mundo 2026 vindas do OpenFootball.
- Os slugs continuam consistentes com a navegação existente em `/selecao/{slug}.html`.
- Cada arquivo `data/teams/{slug}.json` permanece válido e compatível com as páginas de seleção.
- Existe um jogador fictício padrão definido para casos em que a fonte não entregue elenco real.
- A validação de JSON continua passando sem erros.

## Dependências
- Conclusão das tarefas [02], [05], [07] e [06].
