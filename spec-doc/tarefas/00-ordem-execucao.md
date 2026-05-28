# Ordem de Execução das Tarefas

Base: `spec-doc/spec.md`.

1. ✅ [01] Definir fontes e contratos de dados
   - **Status:** CONCLUÍDO em 2026-05-27
   - **Artefatos:** `scripts/sources.json`, `scripts/contracts.md`, `scripts/validation-rules.md`
   - **Observações:** Mapeamento completo de fontes públicas (FIFA API, ESPN, Transfermarkt, Wikipedia). Contrato de dados definido com campos obrigatórios, opcionais e validações. Regras de validação mínima documentadas com regex, enums e verificações de integridade.

2. ✅ [02] Implementar ingestão e normalização de dados
   - **Status:** CONCLUÍDO em 2026-05-27
   - **Artefatos:** `scripts/fetch-data.js`, `data/teams.json`, `data/teams/*.json`
   - **Observações:** Pipeline Node.js com validação do contrato, normalização de campos, geração dos JSONs estáticos e suporte à flag `--no-download-images`. Nesta etapa, a ingestão usa fixtures locais alinhadas às fontes públicas documentadas, mantendo o pipeline pronto para substituição por fetch real sem quebrar o contrato.
3. ✅ [03] Estruturar ativos estáticos e placeholders
   - **Status:** CONCLUÍDO em 2026-05-27
   - **Artefatos:** `assets/css/`, `assets/js/`, `assets/img/placeholder-player.png`, `assets/README.md`
   - **Observações:** Estrutura base de ativos criada com placeholder local em PNG e documentação da estratégia de `img.onerror` + `loading="lazy"` para fallback de imagem.
4. ✅ [04] Construir página principal (`index.html`)
   - **Status:** CONCLUÍDO em 2026-05-27
   - **Artefatos:** `index.html`, `assets/css/styles.css`, `assets/js/app.js`
   - **Observações:** Página responsiva com grid dinâmico usando CSS Grid. JavaScript modular com classe `TeamManager` que carrega dados de `teams.json` e renderiza cards com tratamento de erros, lazy loading e fallback de imagem. Design mobile-first com breakpoints em 640px e 1024px. Acessibilidade: alt text em imagens, focus-visible para navegação por teclado, semantic HTML com header/main/footer. Meta tags SEO e preview social.
5. [05] Construir páginas de seleção (`selecao/{slug}.html`)
6. [06] Garantir acessibilidade, SEO e performance mínima
7. [07] Validar qualidade e preparar deploy/CI