# Prompt: Refinar tarefa para Markdown (Product Manager)

Atue como Product Manager. Leia o arquivo `spec-doc/tarefa.txt` deste repositório e refine a tarefa existente. Gere uma versão em Markdown pronta para abrir como issue ou documentação, seguindo o padrão de história Jira.

Formato esperado (produza apenas o Markdown):

- **Título**: curto e descritivo
- **Resumo (User Story)**: como/quem/porquê
- **Critérios de Aceite**: lista clara e testável
- **Definição de Pronto (DoD)**: o que garante que a história está finalizada
- **Tarefas Técnicas (sub-tasks)**: passos executáveis para desenvolvimento
- **Estimativa**: sugestão de story points ou esforço
- **Exemplo de dados**: JSON mínimo (data/teams.json ou data/teams/{slug}.json)
- **Notas / Próximos passos**: mockups, script de build, hospedagem estática, CI para rebuild

Restrições e contexto:

- O site será estático (SEM API própria). Dados devem ser obtidos de fontes públicas e incorporados ao build (ou carregados pelo cliente como fallback).
- Preferência por saída em português claro.
- Inclua placeholders para imagens quando necessário.

Instruções de saída:

1. Leia `spec-doc/tarefa.txt` e extraia os pontos importantes.
2. Refine a user story e atualize critérios de aceite considerando o contexto estático.
3. Gere o Markdown final com todas as seções acima.
4. Seja conciso, objetivo e entregue conteúdo pronto para colar em uma Issue.


---

Use este prompt localmente para transformar a tarefa em documentação de produto alinhada com implementação estática.
