# Especificação Técnica — Site Estático: Copa do Mundo

## Visão Geral
Especificação técnica para implementação do site estático que apresenta seleções e jogadores. Inclui estrutura de arquivos, modelo de dados, scripts de build e instruções de deploy.

## Arquitetura
- Site 100% estático (HTML/CSS/JS).
- Dados consumidos como JSON estático em `data/` (gerados por `scripts/fetch-data`).
- Deploy em hospedagem estática (GitHub Pages / Netlify / Vercel / S3+CloudFront).

## Estrutura de Arquivos (sugerida)

- /index.html
- /selecao/{slug}.html
- /assets/
  - /css/
  - /img/ (opcional cache de imagens)
  - /js/
- /data/
  - teams.json
  - teams/{slug}.json
- /scripts/
  - fetch-data.js
  - generate-pages.js (opcional)
- /spec-doc/
  - tarefa.md
  - prd.md
  - README.md

## Modelo de Dados (JSON)

teams.json (sumário):
{
  "teams": [
    { "id": "bra", "name": "Brasil", "slug": "brasil", "photo": "https://..." }
  ]
}

teams/{slug}.json (detalhe):
{
  "id": "bra",
  "name": "Brasil",
  "slug": "brasil",
  "photo": "https://...",
  "players": [
    {
      "id": "p1",
      "name": "Nome Sobrenome",
      "birthdate": "YYYY-MM-DD",
      "club": "Clube",
      "position": "Goleiro|Defesa|Meio|Ataque",
      "photo": "https://..."
    }
  ]
}

Validação mínima do JSON:
- `id`, `name`, `slug` obrigatórios para team.
- Para players: `id`, `name`, `birthdate`, `position` obrigatórios; `club` e `photo` opcionais.

## Scripts

1. `scripts/fetch-data.js` (Node.js) — responsabilidades:
   - Ler lista de fontes públicas configuradas (arquivo `scripts/sources.json`).
   - Baixar/normalizar dados por seleção.
   - Gerar `data/teams.json` e `data/teams/{slug}.json`.
   - Opcional: baixar imagens para `assets/img/` se `config.cacheImages = true`.

2. `scripts/generate-pages.js` (opcional) — gerar HTML estático a partir de templates e `data/`.

Comandos exemplo:

```bash
node scripts/fetch-data.js
node scripts/generate-pages.js    # opcional
npx http-server . -p 8080         # testar localmente
```

## Páginas / Componentes (comportamento)
- `index.html`: carrega `data/teams.json` e renderiza `TeamCard` para cada seleção.
- `selecao/{slug}.html`: carrega `data/teams/{slug}.json` e renderiza `PlayerCard` para cada jogador.

Comportamentos do `PlayerCard`:
- Calcula idade a partir de `birthdate`.
- Exibe `club` e `position`.
- Usa `img.onerror` para trocar por placeholder.

## Tratamento de Imagens
- Preferir lazy-loading (`loading="lazy"`).
- `img.onerror = () => img.src = '/assets/img/placeholder-player.png'`.
- Se `cacheImages=true`, scripts de build baixam imagens e reescrevem URLs para `/assets/img/`.

## SEO / Performance
- Gerar páginas no build para SEO (meta tags) quando possível.
- Minificar CSS/JS no build.
- Usar `preload` para imagens críticas (logo, bandeiras).

## Testes
- Testes manuais: verificar `index.html` e `selecao/brasil.html` em mobile e desktop.
- Testes automatizados: linting de JSON (schema), e2e simples com Playwright ou Cypress (opcional).

## Acessibilidade
- Todas as imagens com `alt` apropriado.
- Contraste de cores acessível.
- Navegação por teclado testada.

## Deploy / CI
- CI job que executa `node scripts/fetch-data.js` e `node scripts/generate-pages.js`, depois publica os arquivos estáticos.
- Agendar job (opcional) para rebuild periódico se quiser dados atualizados automaticamente.

## Observações finais
- Documentar fontes de dados em `scripts/sources.json` e no `spec-doc/README.md`.
- Em caso de problemas legais com imagens, permitir flag `--no-download-images` no `fetch-data.js`.

