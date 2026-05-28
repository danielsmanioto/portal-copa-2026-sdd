# Ordem de Execução das Tarefas

Base: `spec-doc/spec.md`.

1. ✅ [01] Definir fontes e contratos de dados
   - **Status:** CONCLUÍDO em 2026-05-27
   - **Artefatos:** `scripts/sources.json`, `scripts/contracts.md`, `scripts/validation-rules.md`
   - **Observações:** Mapeamento completo de fontes públicas (FIFA API, ESPN, Transfermarkt, Wikipedia). Contrato de dados definido com campos obrigatórios, opcionais e validações. Regras de validação mínima documentadas com regex, enums e verificações de integridade.

2. [02] Implementar ingestão e normalização de dados
3. [03] Estruturar ativos estáticos e placeholders
4. [04] Construir página principal (`index.html`)
5. [05] Construir páginas de seleção (`selecao/{slug}.html`)
6. [06] Garantir acessibilidade, SEO e performance mínima
7. [07] Validar qualidade e preparar deploy/CI