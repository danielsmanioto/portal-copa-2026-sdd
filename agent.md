```markdown
# AGENT

- Projeto: site estático (HTML/CSS/JS) para exibição de seleções e jogadores da Copa do Mundo.
- Objetivo: fornecer páginas estáticas leves, responsivas e SEO-friendly com dados públicos incorporados em `data/`.

Principais regras e práticas
- Estrutura mínima: `index.html`, `selecao/{slug}.html`, `assets/` (css/js/img), `data/` (JSON gerados), `scripts/`.
- Dados: não haverá API própria — os dados são obtidos de fontes públicas e gerados em JSON no build (`data/teams.json`, `data/teams/{slug}.json`).
- Imagens: preferir URLs externas; opcionalmente cachear imagens em `assets/img/` durante o build.
- Acessibilidade: todas as imagens com `alt`, contraste adequado e navegação por teclado.
- SEO: meta tags mínimas em páginas geradas/build-time para melhor indexação.

Qualidade e testes
- Sempre adicionar validação dos JSON gerados (schema simples) e testes básicos que verifiquem a renderização das páginas (manual ou e2e).
- Adicionar linting para CSS/JS e checks automáticos no CI.

Scripts e comandos sugeridos
- Gerar tarefa refinada: `node scripts/refinar_tarefa_para_markdown.js`
- Gerar PRD: `node scripts/gerar_prd_from_tarefa.js` (opcional)
- Gerar spec técnico: `node scripts/gerar_spec_from_docs.js` (opcional)
- Buscar e gerar dados: `node scripts/fetch-data.js --output data/ --no-download-images`
- Gerar páginas (opcional): `node scripts/generate-pages.js --templates templates/ --out public/`
- Servir localmente: `npx http-server public -p 8080` ou `python3 -m http.server 8000`

Onde estão as especificações
- User story / tarefa: `spec-doc/tarefa.md` e `spec-doc/tarefa.txt`
- PRD: `spec-doc/prd.md`
- Especificação técnica: `spec-doc/spec.md`
- Prompts úteis: `spec-doc/prompts/` e `prompts/`

Observações
- Manter o repositório organizado com `data/` e `assets/` versionados conforme política de atualização.
- Para atualizações automáticas, configurar um job CI que execute `scripts/fetch-data.js` e faça deploy do `public/`.
```
# AGENT

- Pafina web com html, css, java script
- Sempre criar testes
- Manter padrao de SEO 
- imagens staticas armezanadas no repositorioem png