# Prompt: Gerar Spec Técnica a partir de `spec-doc/tarefa.md` e `spec-doc/prd.md`

Atue como Engenheiro Líder/Técnico. Leia os arquivos `spec-doc/tarefa.md` e `spec-doc/prd.md` neste repositório e gere um documento técnico `spec-doc/spec.md` em Markdown.

Requisitos do prompt:

- Saída em português.
- Produza APENAS o conteúdo Markdown do spec técnico (pronto para salvar em `spec-doc/spec.md`).
- Use as informações de `tarefa.md` e `prd.md` para compor o documento; quando houver conflitos, priorize as decisões técnicas justificadas e adicione uma nota explicando a escolha.

Estrutura mínima do `spec.md` (preencha com detalhes extraídos e técnicos):

- **Título**
- **Visão Geral**: resumo técnico do que será implementado.
- **Escopo**: o que está dentro e fora do escopo.
- **Arquitetura**: desenho alto nível e decisões (100% estático, fontes de dados públicas, build-time vs client-side).
- **Modelo de Dados**: JSON schema / exemplos para `teams.json` e `teams/{slug}.json`.
- **Estrutura de Pastas e Arquivos**: listagem sugerida (index.html, selecao/, assets/, data/, scripts/).
- **Scripts de Build**: responsabilidades dos scripts (`fetch-data.js`, `generate-pages.js`), entradas/saídas e flags/configurações.
- **Páginas e Componentes**: descrição de `index.html`, `selecao/{slug}.html`, `TeamCard`, `PlayerCard` e comportamentos (cálculo de idade, ordenação, lazy-loading, placeholders).
- **Tratamento de Imagens**: caching, fallback, políticas de download (`--no-download-images`), otimização e lazy-loading.
- **Testes e Validação**: validação de JSON, testes manuais e automáticos sugeridos (lint, e2e).
- **CI / Deploy**: passos de CI para gerar `data/`, gerar páginas e publicar em host estático; agendamento para rebuild.
- **Segurança e Legal**: considerações sobre direitos de imagem e conteúdos externos.
- **Métricas e Observabilidade**: métricas de performance e integridade dos dados.
- **Assunções e Decisões Técnicas**: liste suposições feitas e justificativas.
- **Entregáveis**: lista final de artefatos gerados.

Instruções de execução do prompt:
1. Abra e leia `spec-doc/tarefa.md` e `spec-doc/prd.md`.
2. Extraia requisitos funcionais e não-funcionais.
3. Preencha as seções acima com detalhes técnicos claros e acionáveis.
4. Seja conciso, use listas, exemplos de JSON e referências a caminhos (`data/teams.json`, `scripts/fetch-data.js`).
5. Se tomar decisões por falta de informação, escreva-as na seção `Assunções e Decisões Técnicas`.

Formato e tom:
- Tom técnico e direto, adequado para engenharia.
- Use Markdown puro, pronto para salvar em `spec-doc/spec.md`.

Exemplo de uso:
- Manual (hipotético):

```bash
# Exemplo de script que usa o prompt
node scripts/gerar_spec_from_docs.js
```

---

Use este prompt para gerar/atualizar o `spec-doc/spec.md` sempre que `spec-doc/tarefa.md` ou `spec-doc/prd.md` for alterado.
