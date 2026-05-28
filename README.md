<div align="center">

# 🌍 Portal Copa 2026 — Site Estático

[![Status](https://img.shields.io/badge/status-DEVELOPMENT-blue?style=for-the-badge)](README.md)
[![Type](https://img.shields.io/badge/type-static--site-lightblue?style=for-the-badge)](#)
[![Audience](https://img.shields.io/badge/audience-fans%2Fjournalists-green?style=for-the-badge)](#)
[![Tech Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-yellow?style=for-the-badge)](#-stack-tecnológica)
[![License](https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge)](#-licença)

> Um portal estático, rápido e responsivo que apresenta as seleções participantes da **Copa do Mundo 2026** com dados públicos, fotos e elencos detalhados.

[Visão Geral](#-visão-geral) • [Features](#-features) • [Arquitetura](#-arquitetura) • [Como Executar](#-como-executar) • [Documentação](#-documentação) • [Contribuição](#-contribuição)

</div>

---

## 🎯 Visão Geral

O **Portal Copa 2026** é um site 100% estático (HTML/CSS/JavaScript) que permite aos usuários explorar as seleções participantes da Copa do Mundo 2026 e consultar informações detalhadas sobre os jogadores convocados — incluindo foto, idade, posição e clube atual.

**Diferencial:** Sem API própria, sem banco de dados. Todos os dados são obtidos de **fontes públicas oficiais** durante o build e incorporados como **JSON estático** no repositório, garantindo:

- ⚡ **Performance extrema** (carregamento instant)
- 🔒 **Segurança** (sem endpoints dinâmicos)
- 📱 **Offline-friendly** (conteúdo pré-renderizado)
- 🔄 **Facilmente versionável** (dados no Git)
- 🌐 **Hospedagem simples** (GitHub Pages, Netlify, Vercel, S3)

---

## ✨ Features

| Feature | Status | Descrição |
|---------|--------|-----------|
| **Listagem de Seleções** | 🔨 Em progresso | Página principal com todas as seleções da Copa 2026 |
| **Páginas de Seleção** | 🔨 Em progresso | Página estática para cada seleção com elenco completo |
| **Cálculo de Idade** | 🔨 Em progresso | Conversão automática de `birthdate` em anos |
| **Responsividade** | 🔨 Em progresso | Layout mobile-first e desktop otimizado |
| **Placeholders** | 🔨 Em progresso | Fallback automático para imagens indisponíveis |
| **Lazy-loading** | 🔨 Planejado | Otimização de carregamento de imagens |
| **SEO Mínimo** | 🔨 Planejado | Meta tags e estrutura semântica |
| **Acessibilidade** | 🔨 Planejado | WCAG 2.1 AA (alt text, navegação por teclado) |
| **CI/CD Pipeline** | 🔨 Planejado | Build automático e deploy em hospedagem estática |

---

## 🏗️ Arquitetura

### Visão Alto Nível

```
┌─────────────────────────────────────────────┐
│     Fontes Públicas (FIFA, ESPN, etc)      │
└────────────────────┬────────────────────────┘
                     │ (fetch-data.js)
                     ▼
┌─────────────────────────────────────────────┐
│      Build Time: Normalização & JSON        │
│  (scripts/fetch-data.js)                    │
└────────────────────┬────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    teams.json  teams/     assets/
               {slug}.json  (imagens)
         │           │           │
         └───────────┼───────────┘
                     │ (versionado em Git)
                     ▼
        ┌──────────────────────────┐
        │  index.html + JS client  │
        │  selecao/{slug}.html     │
        │  Renderização no Browser │
        └──────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │  Deploy: CDN Estático    │
        │  (GitHub Pages, Netlify) │
        └──────────────────────────┘
```

### Padrões e Decisões Arquiteturais

- **100% Estático:** Sem servidor de aplicação, sem banco de dados.
- **Build-time Rendering:** Dados públicos são processados e salvos como JSON estático no build.
- **Client-side Rendering Leve:** JavaScript minimalista apenas para renderização de componentes (`TeamCard`, `PlayerCard`) e cálculos (idade).
- **Dados Versionados:** `data/teams.json` e `data/teams/{slug}.json` são versionados no Git para reproducibilidade.
- **Fallback Inteligente:** Se a imagem externa falhar, exibe placeholder local com `onerror` handler.
- **Lazy-loading:** Imagens com `loading="lazy"` para otimização de performance.

---

## 🧰 Stack Tecnológica

| Categoria | Tecnologia | Descrição |
|-----------|-----------|-----------|
| **Linguagens** | HTML5, CSS3, JavaScript (ES6+) | Markup, estilo e interatividade |
| **Framework** | Vanilla JS | Sem dependências externas para MVP |
| **Dados** | JSON Estático | Contrato definido em `scripts/contracts.md` |
| **Construção** | Node.js | Script `fetch-data.js` para build |
| **Servidor Local** | http-server / Python SimpleHTTPServer | Testes em ambiente local |
| **Hospedagem** | GitHub Pages, Netlify, Vercel, S3+CloudFront | Stático, sem servidor |
| **CI/CD** | GitHub Actions (planejado) | Build automático e deploy |
| **Fontes de Dados** | FIFA API, ESPN API, Transfermarkt, Wikipedia | Públicas e atualizadas |
| **Imagens** | PNG, JPEG, SVG | Placeholders locais em `assets/img/` |
| **Validação** | JSON Schema | Regras em `scripts/validation-rules.md` |
| **Testes** | Manual + e2e (Cypress/Playwright, planejado) | Validação de renderização e dados |

---

## 📁 Estrutura do Projeto

```
portal-copa-2026-sdd/
├── README.md                          # Este arquivo
├── package.json                       # Dependências Node.js (se necessário)
│
├── spec-doc/                          # Documentação de especificações
│   ├── tarefa.md                      # User story refinada (Markdown)
│   ├── tarefa.txt                     # User story original (texto)
│   ├── prd.md                         # Product Requirements Document
│   ├── spec.md                        # Especificação Técnica Detalhada
│   ├── prompts/                       # Guias de geração automática
│   │   ├── refinar_tarefa_para_markdown.md
│   │   ├── gerar_prd.md
│   │   ├── gerar_spec.md
│   │   ├── gerar-tarefas.md
│   │   ├── atualiza_readme.md
│   │   └── executar-tarefa.md
│   └── tarefas/                       # Tarefas técnicas ordenadas
│       ├── 00-ordem-execucao.md      # Planejamento e status
│       ├── 01-fontes-e-contratos.md  # ✅ CONCLUÍDO
│       ├── 02-ingestao-normalizacao.md
│       ├── 03-ativos-placeholders.md
│       ├── 04-pagina-principal.md
│       ├── 05-paginas-selecao.md
│       ├── 06-acessibilidade-seo-performance.md
│       └── 07-validacao-deploy-ci.md
│
├── scripts/                           # Scripts de build e utilidades
│   ├── sources.json                   # Mapeamento de fontes públicas
│   ├── contracts.md                   # Contrato de tipos (Team, Player)
│   ├── validation-rules.md            # Regras de validação JSON
│   ├── fetch-data.js                  # (TODO) Script para ingerir dados
│   ├── generate-pages.js              # (TODO) Template engine para gerar HTML
│   └── ...
│
├── data/                              # Dados gerados (JSON estático)
│   ├── teams.json                     # Sumário de todas as seleções
│   └── teams/                         # Detalhes por seleção
│       ├── brasil.json                # (exemplo)
│       ├── argentina.json
│       └── ...
│
├── assets/                            # Arquivos estáticos
│   ├── css/
│   │   ├── styles.css                 # Estilos globais
│   │   └── ...
│   ├── js/
│   │   ├── main.js                    # Lógica principal
│   │   ├── components.js              # TeamCard, PlayerCard
│   │   └── utils.js                   # Helpers (cálculo de idade, etc)
│   └── img/
│       ├── placeholder-player.png     # Fallback para foto de jogador
│       ├── placeholder-team.png       # Fallback para bandeira
│       └── logo.svg
│
├── index.html                         # Página principal (Seleções)
├── selecao/                           # Páginas de seleção (dinâmicas ou estáticas)
│   ├── brasil.html                    # (exemplo)
│   ├── argentina.html
│   └── ...
│
├── public/                            # (TODO) Output final após build
│   └── (conteúdo compilado)
│
├── .gitignore                         # Ignora node_modules, .env, etc
└── agent.md                           # Guia de boas práticas do projeto

```

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** >= 14.x (para scripts de build)
- **npm** ou **yarn** (para gerenciar dependências)
- **navegador moderno** com suporte a ES6+
- **python 3** (alternativa para servir localmente)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/portal-copa-2026-sdd.git
cd portal-copa-2026-sdd

# Instale dependências (se houver package.json)
npm install
```

### Desenvolvimento Local

#### 1. Gerar dados estáticos (build)

```bash
# Busca dados de fontes públicas e gera JSONs em data/
node scripts/fetch-data.js --output data/ --no-download-images

# Opcional: gerar páginas HTML a partir de templates
# node scripts/generate-pages.js --templates templates/ --out public/
```

#### 2. Servir localmente

**Opção 1: http-server (Node.js)**
```bash
npx http-server . -p 8080
# Acesse em http://localhost:8080
```

**Opção 2: Python**
```bash
python3 -m http.server 8000
# Acesse em http://localhost:8000
```

**Opção 3: Com Live Reload**
```bash
npm install -g live-server
live-server . --port=8080
```

#### 3. Visualizar no navegador

- **Página Principal:** http://localhost:8080/index.html
- **Seleção (Brasil):** http://localhost:8080/selecao/brasil.html

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (opcional):

```bash
# .env
FETCH_OUTPUT_DIR=data/
CACHE_IMAGES=false               # true para baixar imagens localmente
NO_DOWNLOAD_IMAGES=true          # true para usar apenas URLs externas
API_TIMEOUT=30000                # Timeout para requisições (ms)
LOG_LEVEL=info                   # debug | info | warn | error
```

### Configuração de Fontes de Dados

Edite `scripts/sources.json` para adicionar/remover fontes:

```json
{
  "sources": [
    {
      "id": "fifa-api",
      "baseUrl": "https://worldcup-api.p.rapidapi.com",
      "endpoints": { "teams": "/teams", "teamDetails": "/teams/{id}" },
      "reliability": "high"
    }
  ]
}
```

### Contrato de Dados

Veja `scripts/contracts.md` para entender a estrutura esperada de `data/teams.json` e `data/teams/{slug}.json`.

**Exemplo de `teams.json`:**
```json
{
  "teams": [
    {
      "id": "bra",
      "name": "Brasil",
      "slug": "brasil",
      "photo": "https://img.fifa.com/...",
      "confederation": "CONMEBOL"
    }
  ]
}
```

**Exemplo de `teams/brasil.json`:**
```json
{
  "id": "bra",
  "name": "Brasil",
  "slug": "brasil",
  "photo": "https://...",
  "players": [
    {
      "id": "neymar_jr",
      "name": "Neymar da Silva Santos Júnior",
      "birthdate": "1992-02-05",
      "position": "Ataque",
      "number": 10,
      "photo": "https://...",
      "club": "Al-Hilal SFC",
      "height": 175,
      "weight": 68,
      "caps": 125,
      "goals": 79
    }
  ]
}
```

---

## 🔌 APIs e Fontes Públicas

### Fontes Integradas

| Fonte | Tipo | Cobertura | Confiabilidade | Documentação |
|-------|------|-----------|----------------|--------------|
| **FIFA World Cup API** | REST API | Todos os times e jogadores | ⭐⭐⭐⭐⭐ | [RapidAPI](https://rapidapi.com/api-sports/api/api-football) |
| **ESPN API** | REST API | Informações de ligas e competições | ⭐⭐⭐⭐⭐ | Pública, sem autenticação |
| **Transfermarkt** | Web Scraping | Detalhes de jogadores e clubes | ⭐⭐⭐⭐ | Respeitar robots.txt |
| **Wikipedia** | Web Scraping | Dados históricos e elencos | ⭐⭐⭐ | Público, dados podem estar desatualizados |
| **Wikimedia Commons** | CDN Público | Imagens de jogadores e bandeiras | ⭐⭐⭐ | CC-BY-SA 3.0 |

Veja [scripts/sources.json](scripts/sources.json) e [scripts/contracts.md](scripts/contracts.md) para detalhes completos.

---

## 🧪 Testes

### Teste Manual (MVP)

```bash
# 1. Verificar se data/teams.json existe e é válido
cat data/teams.json | jq .

# 2. Verificar se data/teams/brasil.json existe
cat data/teams/brasil.json | jq .

# 3. Abrir no navegador e verificar:
#    - index.html lista as seleções
#    - Clicar em seleção leva para selecao/{slug}.html
#    - Página exibe jogadores com idade calculada corretamente
#    - Imagens faltantes exibem placeholder

# 4. Testes de responsividade
#    - Abrir em mobile (DevTools)
#    - Verificar layout em diferentes resoluções
```

### Validação de Dados

```bash
# Validar JSONs contra schema
node scripts/validate-data.js --input data/ --schema scripts/contracts.json

# Verificar integridade (teams.json vs teams/{slug}.json)
node scripts/validate-data.js --check-integrity
```

### Testes Automatizados (Planejado)

```bash
# Instalar Cypress ou Playwright
npm install --save-dev cypress

# Rodar testes e2e
npm run test:e2e

# Rodar testes de performance
npm run test:performance
```

---

## 📦 Deploy

### Hospedagem Estática Recomendada

| Plataforma | Vantagens | Comando |
|-----------|-----------|---------|
| **GitHub Pages** | Integração nativa, SSL grátis | `git push` (com workflow) |
| **Netlify** | Deploy automático, preview PRs | `netlify deploy --prod` |
| **Vercel** | Performance otimizada, Edge | `vercel --prod` |
| **AWS S3 + CloudFront** | Escalabilidade, controle total | `aws s3 sync . s3://bucket/` |

### CI/CD com GitHub Actions (Planejado)

Crie `.github/workflows/build-deploy.yml`:

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * 0'  # Rebuild semanalmente

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Fetch data
        run: node scripts/fetch-data.js --output data/
      
      - name: Validate data
        run: node scripts/validate-data.js
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

---

## ☁️ Infraestrutura

### Serviços Utilizados

- **Armazenamento:** Git (versionamento de dados)
- **CDN:** Serviços estáticos (GitHub Pages, Netlify CDN, Cloudflare)
- **Imagens:** Wikimedia Commons, FIFA Official, Transfermarkt, fallback local
- **CI/CD:** GitHub Actions

### Diagrama de Infraestrutura

```
┌──────────────────────┐
│   Git Repository     │
│  (Dados + HTML/CSS)  │
└──────────┬───────────┘
           │
    ┌──────▼──────┐
    │   GitHub    │
    │  Actions    │
    │   (Build)   │
    └──────┬──────┘
           │
    ┌──────▼──────────────┐
    │  Fetch Public Data  │
    │  Validate JSONs     │
    │  Generate static    │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Publish to CDN     │
    │  (GitHub Pages ou   │
    │   outro host)       │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │   Global Users      │
    │  (Browser Static)   │
    └─────────────────────┘
```

---

## 📈 Observabilidade

### Logs

Logs são gerados durante o build em:

```bash
# Build output
node scripts/fetch-data.js 2>&1 | tee build.log

# Validação
node scripts/validate-data.js 2>&1 | tee validation.log
```

**Formato de Log:**
```
[2026-05-27T10:30:45.123Z] [INFO] Iniciando fetch de dados...
[2026-05-27T10:30:46.456Z] [INFO] Teams carregadas: 32
[2026-05-27T10:30:47.789Z] [DEBUG] Processando Brasil...
[2026-05-27T10:30:48.012Z] [WARN] Imagem não disponível para Neymar (usando fallback)
[2026-05-27T10:30:49.345Z] [OK] Validação completa ✅
```

### Métricas de Performance (Planejado)

- Tempo de carregamento de `index.html`
- Tempo de renderização de elenco
- Tamanho de `teams.json` e `teams/{slug}.json`
- Taxa de erros na busca de imagens

---

## 🔒 Segurança

### Considerações de Segurança

- **Dados Públicos:** Todos os dados provêm de fontes públicas e oficiais.
- **Sem Inputs Dinâmicos:** HTML/CSS/JS são estáticos — não há injeção de código.
- **Imagens Externas:** Validadas contra URL patterns; placeholder em caso de falha.
- **Controle de Acesso:** Não se aplica (conteúdo público).
- **Headers de Segurança:** Adicione ao servidor CDN:
  ```
  Content-Security-Policy: default-src 'self' https:
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  ```

### Direitos e Atribuições

- Imagens de jogadores: Copyright FIFA, confederações.
- Dados públicos: Sem restrição (fatos públicos).
- **Atribuição:** Creditar fontes quando publicado (ex: "Powered by FIFA" em footer).

---

## 📚 Documentação

### Documentação Técnica Interna

| Documento | Propósito |
|-----------|-----------|
| [spec-doc/tarefa.md](spec-doc/tarefa.md) | User story refinada (Markdown) |
| [spec-doc/prd.md](spec-doc/prd.md) | Product Requirements Document |
| [spec-doc/spec.md](spec-doc/spec.md) | Especificação Técnica Detalhada |
| [spec-doc/tarefas/00-ordem-execucao.md](spec-doc/tarefas/00-ordem-execucao.md) | Planejamento e status das tarefas |
| [scripts/sources.json](scripts/sources.json) | Mapeamento de fontes públicas |
| [scripts/contracts.md](scripts/contracts.md) | Contrato de tipos (Team, Player) |
| [scripts/validation-rules.md](scripts/validation-rules.md) | Regras de validação JSON |
| [agent.md](agent.md) | Guia de boas práticas do projeto |

### Próximas Etapas

1. ✅ **[01] Definir fontes e contratos** — CONCLUÍDO
2. 🔨 **[02] Implementar ingestão e normalização** — EM PROGRESSO
3. 🔨 **[03] Estruturar ativos estáticos**
4. 🔨 **[04] Construir página principal**
5. 🔨 **[05] Construir páginas de seleção**
6. 🔨 **[06] Acessibilidade, SEO e performance**
7. 🔨 **[07] Validação e deploy/CI**

---

## 🤝 Contribuição

### Padrão de Branch

```bash
# Feature
git checkout -b feature/sua-feature
git commit -m "feat: descrição clara e concisa"
git push origin feature/sua-feature

# Bugfix
git checkout -b bugfix/seu-bugfix
git commit -m "fix: descrição do problema e solução"
git push origin bugfix/seu-bugfix

# Padrão: tipo/escopo: mensagem
# Tipos: feat, fix, docs, style, refactor, test, chore
```

### Mensagens de Commit

```
feat: adicionar page de seleção
fix: corrigir cálculo de idade
docs: atualizar README com instruções
refactor: simplificar componente PlayerCard
test: adicionar validação de dados
```

### Pull Request

1. Abra PR contra `main`
2. Preencha template (descrição, mudanças, testes)
3. Aguarde revisão
4. Faça merge após aprovação

---

## 📄 Licença

Este projeto é licenciado sob a licença **MIT**.

Veja [LICENSE](LICENSE) para detalhes completos.

---

## 👨‍💻 Autor

**Daniel Smanioto**  
Engenheiro de Software Sênior  
📧 [seu-email@example.com](mailto:seu-email@example.com)  
🔗 [LinkedIn](https://linkedin.com/in/seu-perfil) • [GitHub](https://github.com/seu-usuario)

---

<div align="center">

**[⬆ voltar ao topo](#-portal-copa-2026--site-estático)**

Feito com ❤️ para fãs de futebol e jornalistas ao redor do mundo.

</div>
