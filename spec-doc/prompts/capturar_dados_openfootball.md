# Prompt: Capturar dados do OpenFootball 2026

Atue como engenheiro de software sênior. Leia a documentação atual do projeto e implemente a captura de dados a partir do repositório OpenFootball para a Copa do Mundo 2026, usando como base os arquivos públicos em `openfootball/worldcup.json`.

## Fontes de dados
- Lista de seleções: `https://github.com/openfootball/worldcup.json/blob/master/2026/worldcup.teams.json`
- Estrutura da edição 2026: `https://github.com/openfootball/worldcup.json/tree/master/2026`

## Objetivo
- Usar a lista oficial de times de 2026 como fonte primária para `data/teams.json`.
- Manter o contrato de dados já existente no projeto.
- Gerar/atualizar os arquivos detalhados em `data/teams/{slug}.json` com a nova base de seleções.
- Quando a fonte não trouxer elenco de jogadores completo, inserir um jogador fictício padrão com nome e campos a definir, preservando a navegação e o layout das páginas de seleção.

## Regras de implementação
- Preserve o padrão arquitetural atual do repositório.
- Não crie abstrações desnecessárias.
- Prefira mudanças incrementais em `scripts/fetch-data.js` e arquivos de dados.
- Use o campo `fifa_code` como referência principal para identificar seleções quando aplicável.
- Normalize nomes de times com base em `name` e, quando disponível, `name_normalised`.
- Preserve `slug`, `confederation`, `group` e `continent` quando úteis para a experiência do portal.
- Se não houver elenco real disponível, gere um jogador placeholder consistente, por exemplo com `id` estável, nome em português como `A definir` e imagem fallback local.
- Garanta que a validação de JSON continue passando após a atualização dos dados.

## Entregáveis esperados
- Atualização do pipeline de ingestão para ler a nova fonte.
- JSONs estáticos atualizados com as seleções de 2026.
- Jogador fictício padrão definido para manter as páginas funcionais.
- Validação executada com sucesso.
- Atualização da ordem de execução e documentação se necessário.

## Saída esperada
- Resumo objetivo das alterações feitas.
- Arquivos alterados.
- Decisões técnicas adotadas.
- Riscos ou limitações identificadas.
