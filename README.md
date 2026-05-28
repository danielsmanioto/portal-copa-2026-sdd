<div align="center">

# 🌍 Portal Copa 2026 — Site Estático Responsivo

[![Status](https://img.shields.io/badge/status-in%20development-blue?style=flat-square)](README.md)
[![Type](https://img.shields.io/badge/type-static%20site-lightblue?style=flat-square)](#)
[![HTML/CSS/JS](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-ffd700?style=flat-square)](https://developer.mozilla.org/)
[![Node.js](https://img.shields.io/badge/node-18%2B-green?style=flat-square)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)](#-licença)

> **Explorar as seleções da Copa do Mundo 2026.** Um portal estático, rápido e responsivo que apresenta equipes nacionais com dados públicos, fotos, informações dos técnicos e elencos detalhados de jogadores.

[Visão Geral](#-visão-geral) • [Features](#-features) • [Arquitetura](#-arquitetura) • [Stack](#-stack-tecnológica) • [Quick Start](#-quick-start) • [Documentação](#-documentação)

</div>

---

## ▶️ Como executar o projeto

Se você abrir o `index.html` direto no navegador, o portal pode ficar em branco porque os dados são carregados com `fetch()` e isso exige um servidor local. Use um dos passos abaixo.

### Passo a passo rápido

1. Abra um terminal na pasta do projeto.
2. Inicie um servidor local na raiz do repositório.
3. Acesse o endereço do servidor no navegador.
4. Aguarde o carregamento dos dados das seleções.

### Opção 1: Python

```bash
python3 -m http.server 8080
```

Abra depois:

```text
http://localhost:8080
```

### Opção 2: Node.js

Se você tiver `http-server` instalado:

```bash
npm install -g http-server
http-server . -p 8080
```

### Opção 3: Live Server no VS Code

1. Instale a extensão Live Server.
2. Clique com o botão direito em `index.html`.
3. Selecione Open with Live Server.

### Se não aparecer nada

- Confirme que você está acessando `http://localhost:8080`, não `file:///...`.
- Abra o DevTools do navegador e veja se há erro de `fetch`.
- Verifique se os arquivos `data/teams.json` e `data/teams/*.json` existem.
- Se estiver usando um subcaminho diferente, ajuste o servidor para servir a raiz do projeto.

---

## 🎯 Visão Geral

**Portal Copa 2026** é um **site 100% estático** (HTML/CSS/JavaScript vanilla) que oferece uma experiência rápida e offline-friendly para explorar as seleções participantes da Copa do Mundo 2026 e consultar informações detalhadas sobre os jogadores convocados — nome, foto, idade, posição, clube e estatísticas.

### Por que estático?

| Aspecto | Benefício |
|--------|-----------|
| ⚡ **Performance** | Carregamento instantâneo; sem latência de rede; Zero cold starts |
| 🔒 **Segurança** | Sem API dinâmica; sem banco de dados; superfície de ataque mínima |
| 📱 **Offline** | Conteúdo pré-renderizado; funciona sem internet após primeira visita |
| 🔄 **Versionável** | Histórico de dados no Git; fácil rollback e auditoria |
| 🌐 **Hospedagem** | Deploy em qualquer provedor estático: GitHub Pages, Netlify, Vercel, S3, etc. |
| 💰 **Custo** | Sem servidor, sem taxa de API, sem banco de dados; hospedagem gratuita possível |

---

## ✨ Features

| Feature | Status | Descrição |
|---------|--------|-----------|
| **Listagem de Seleções** | ✅ Completo | Página principal com grid responsivo de todas as seleções |
| **Cards de Seleção** | ✅ Completo | Nome, foto, confederação, técnico com link para detalhes |
| **Renderização Dinâmica** | ✅ Completo | JavaScript client-side que carrega `teams.json` |
| **Responsividade** | ✅ Completo | Mobile-first com breakpoints em 640px, 1024px |
| **Lazy Loading** | ✅ Completo | Imagens carregadas sob demanda com `loading="lazy"` |
| **Fallback de Imagem** | ✅ Completo | Placeholder automático em caso de erro (`img.onerror`) |
| **Tratamento de Erros** | ✅ Completo | UI amigável para falhas de rede ou dados inválidos |
| **Acessibilidade** | ✅ Completo | Alt text, focus-visible, semantic HTML, contraste WCAG AA |
| **SEO** | ✅ Completo | Meta tags, Open Graph, estrutura semântica, robots-friendly |
| **Páginas de Seleção** | 🔨 Em progresso | Página estática para cada seleção com elenco e estatísticas |
| **Cálculo de Idade** | 🔨 Em progresso | Conversão automática de `birthdate` em anos |
| **Pipeline CI/CD** | 🔨 Planejado | Build automático e deploy contínuo |

---

## 🏗️ Arquitetura

```
                    ┌─────────────────┐
                    │  Usuário Final  │
                    └────────┬────────┘
                             │
                   ┌─────────┴─────────┐
                   │   index.html      │  (SSR-like static page)
                   │ (Semantic HTML)   │
                   └─────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
          ┌─────▼──────┐          ┌──────▼──────┐
          │ styles.css │          │   app.js    │
          │ (Grid CSS) │          │ (Vanilla JS)│
          └────────────┘          └──────┬──────┘
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                          ┌───▼────┐           ┌───▼──────────┐
                          │ Fetch  │           │ DOM Parser   │
                          │  API   │           │ & Render     │
                          └───┬────┘           └──────────────┘
                              │
                        ┌─────▼──────────┐
                        │ teams.json     │
                        │ (Static Data)  │
                        │ + teams/*.json │
                        └────────────────┘
```

### Padrões e Decisões Arquiteturais

**1. JavaScript Modular (Class-Based)**
- Classe `TeamManager` encapsula lógica de carregamento e renderização
- Separação clara de responsabilidades (fetch, render, error-handling)
- Facilita testes unitários e manutenção futura

**2. CSS Grid + Mobile-First**
- Grid dinâmico: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Breakpoints: 640px (mobile), 1024px (tablet)
- Design system com variáveis CSS (`:root`) para consistência

**3. Dados JSON Estáticos**
- `data/teams.json`: sumário com todas seleções
- `data/teams/{slug}.json`: detalhes de cada seleção com elenco
- Estrutura hierárquica facilita geração automática de páginas

**4. Lazy Loading + Fallback**
- `loading="lazy"` para otimização de imagens
- `img.onerror` substitui URL inválida por placeholder local
- Garante UX consistente mesmo com falhas de rede

**5. Tratamento de Erros Explícito**
- Estados de loading, sucesso e erro com UI clara
- Mensagens amigáveis em português
- Logs no console para debug

---

## 🧰 Stack Tecnológica

| Categoria | Tecnologia | Motivo |
|-----------|-----------|--------|
| **Frontend** | HTML5 | Semântica, acessibilidade, compatibilidade |
| **Estilo** | CSS3 | CSS Grid, Flexbox, custom properties, variáveis |
| **Scripts** | JavaScript (Vanilla) | Sem dependências; lightweight; compatibilidade universal |
| **Runtime (Build)** | Node.js 18+ | Execução de scripts de build e fetch |
| **Dados** | JSON | Formato padrão, nativo em JavaScript |
| **Hospedagem** | Estática (CDN) | GitHub Pages, Netlify, Vercel, AWS S3, etc. |
| **Versioning** | Git | Controle de histórico de dados e código |

### Ferramentas Opcionais (Futuro)

| Ferramenta | Uso |
|-----------|-----|
| `http-server` | Desenvolvimento local rápido |
| `Playwright/Cypress` | Testes E2E |
| `ESLint` | Linting de JavaScript |
| `StyleLint` | Linting de CSS |
| `GitHub Actions` | CI/CD pipeline |

---

## 📁 Estrutura do Projeto

```
portal-copa-2026-sdd/
├── index.html                    # Página principal
├── assets/
│   ├── css/
│   │   └── styles.css           # Design system, cards, layout responsivo
│   ├── js/
│   │   └── app.js               # Classe TeamManager, lógica de renderização
│   └── img/
│       └── placeholder-player.png # Fallback para imagens ausentes
├── data/
│   ├── teams.json               # Sumário de todas as seleções
│   └── teams/
│       ├── brasil.json          # Detalhes da seleção (id, nome, elenco)
│       ├── argentina.json
│       ├── franca.json
│       └── espanha.json
├── scripts/
│   ├── fetch-data.js            # Pipeline de ingestão e normalização
│   ├── sources.json             # Configuração de fontes públicas
│   ├── contracts.md             # Contrato de tipos (Team, Player)
│   └── validation-rules.md      # Regras de validação JSON
├── spec-doc/
│   ├── prd.md                   # Product Requirements Document
│   ├── spec.md                  # Especificação técnica
│   ├── README.md                # Documentação de projeto
│   └── tarefas/
│       ├── 00-ordem-execucao.md # Roadmap de tarefas
│       ├── 01-fontes-e-contratos.md
│       ├── 02-ingestao-normalizacao.md
│       ├── 03-ativos-placeholders.md
│       ├── 04-pagina-principal.md
│       ├── 05-paginas-selecao.md
│       ├── 06-acessibilidade-seo-performance.md
│       └── 07-validacao-deploy-ci.md
├── README.md                    # Este arquivo
└── .git/                        # Histórico de versão

```

### Detalhamento das Pastas Principais

#### `index.html`
- Única página renderizada em HTML puro
- Estrutura semântica: `<header>`, `<main>`, `<footer>`
- Meta tags SEO e Open Graph
- Carrega CSS e JS como dependências
- Container `#teams-container` preenchido dinamicamente

#### `assets/css/styles.css`
- Design system com 50+ variáveis CSS (cores, espaçamento, sombras)
- Grid responsivo para cards de seleções
- Animações suaves (hover, loading spinner)
- Classes utilitárias (`.sr-only` para screen readers)
- Sem framework CSS; puro CSS3

#### `assets/js/app.js`
- Classe `TeamManager` com métodos públicos: `loadTeams()`, `render()`
- Métodos privados: `createTeamCard()`, `showLoading()`, `showError()`, `escapeHtml()`
- Event listener `DOMContentLoaded` para inicialização automática
- Tratamento de erros com try/catch e feedback visual

#### `data/teams.json`
```json
{
  "teams": [
    {
      "id": "bra",
      "name": "Brasil",
      "slug": "brasil",
      "photo": "https://example.com/.../brasil.png",
      "confederation": "CONMEBOL",
      "coachName": "Dorival Júnior"
    }
    // ... mais 3 seleções
  ]
}
```

#### `scripts/fetch-data.js`
- Script Node.js que orquestra pipeline de ingestão
- Lê configuração de fontes em `sources.json`
- Valida dados contra contrato de dados
- Normaliza campos (birthdate, position, slug)
- Gera `data/teams.json` e `data/teams/{slug}.json`
- Suporta flag `--no-download-images` para evitar issues de copyright

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/portal-copa-2026-sdd.git
cd portal-copa-2026-sdd
```

### 2️⃣ Abra no Navegador (Desenvolvimento Local)

**Opção A: Usar `http-server` (recomendado)**

```bash
# Instalar globalmente (uma única vez)
npm install -g http-server

# Executar servidor local
http-server . -p 8080
```

Acesse: **http://localhost:8080**

**Opção B: Usar Python**

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Opção C: Usar VS Code Live Server**

1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html` → "Open with Live Server"

### 3️⃣ (Opcional) Regenerar Dados

Para atualizar dados das seleções (fixtures):

```bash
node scripts/fetch-data.js
```

**Flags:**
- `--no-download-images`: Pula download de imagens (mais rápido, menos storage)
- `--output-dir /caminho`: Especifica diretório de saída (default: `./data`)

### 4️⃣ Validação e CI

- Validar os JSONs localmente:

```bash
node scripts/validate-json.js
```

- O pipeline automático está em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) e executa:
  - validação dos JSONs em todo push e pull request;
  - empacotamento do site estático;
  - publicação no GitHub Pages em `main`.

---

## ⚙️ Configuração

### Variáveis de Ambiente (Opcional)

Se usar API com autenticação no futuro, crie `.env`:

```bash
# .env
RAPIDAPI_KEY=sua_chave_aqui
RAPIDAPI_HOST=worldcup-api.p.rapidapi.com
TRANSFERMARKT_USER_AGENT=Mozilla/5.0...
```

Atualize `scripts/fetch-data.js` para ler dessas variáveis:

```javascript
const apiKey = process.env.RAPIDAPI_KEY;
```

### Customização de Estilos

Edite as variáveis CSS em `assets/css/styles.css`:

```css
:root {
  --color-primary: #1a73e8;    /* Cor principal (azul Google) */
  --color-secondary: #34a853;  /* Cor secundária (verde) */
  --color-danger: #ea4335;     /* Cor de erro (vermelho) */
  --spacing-lg: 2rem;          /* Espaçamento grande */
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);  /* Sombra média */
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
      "confederation": "CONMEBOL",
      "coachName": "Dorival Júnior"
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

Veja [scripts/sources.json](scripts/sources.json) para detalhes completos.

---

## 🧪 Testes

### Teste Manual: Página Principal

1. Abra **http://localhost:8080/**
2. Verifique se 4 cards aparecem (Brasil, Argentina, França, Espanha)
3. Teste responsividade: Redimensione a janela (mobile 375px, tablet 768px, desktop 1200px)
4. Clique em um card → deve levar para `/selecao/{slug}.html` (em desenvolvimento)

### Teste Manual: Lazy Loading

```javascript
// No console do navegador:
document.querySelectorAll('img').forEach(img => console.log(img.loading));
// Deve retornar "lazy" para todas as imagens
```

### Teste Manual: Acessibilidade

1. Navegue com **Tab** → focus deve estar visível em cards
2. Teste com leitora de tela (macOS: Cmd+F5)
3. Verifique **contraste** com ferramentas como [WebAIM](https://webaim.org/resources/contrastchecker/)

### Validação de Dados

```bash
# Verificar se data/teams.json é JSON válido
cat data/teams.json | jq .

# Verificar estrutura dos dados
jq '.teams | length' data/teams.json
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

### Deploy em GitHub Pages

```bash
# 1. Push no repositório
git add .
git commit -m "atualizar portal"
git push origin main

# 2. Ative GitHub Pages em Settings → Pages
# 3. Selecione "Deploy from a branch" → main branch
# Site disponível em: https://seu-usuario.github.io/portal-copa-2026-sdd/
```

### Deploy em Netlify

```bash
# 1. Conecte repositório em https://netlify.com/
# 2. Configure build (opcional, site é estático):
#    - Build command: (deixe vazio)
#    - Publish directory: .
# 3. Deploy automático em cada push
```

### Deploy em Vercel

```bash
npm i -g vercel
vercel
# Responda as perguntas interativas
```

---

## ☁️ Infraestrutura

### Serviços Utilizados

- **Armazenamento:** Git (versionamento de dados)
- **CDN:** Serviços estáticos (GitHub Pages, Netlify CDN, Cloudflare)
- **Imagens:** Wikimedia Commons, FIFA Official, Transfermarkt, fallback local
- **CI/CD:** GitHub Actions (planejado)

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

### Métricas de Performance

- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Bundle Size:** < 50KB (HTML+CSS+JS)
- **Imagens:** < 5MB total com lazy loading

---

## 🔒 Segurança

### Considerações de Segurança

- **Dados Públicos:** Todos os dados provêm de fontes públicas e oficiais.
- **Sem Inputs Dinâmicos:** HTML/CSS/JS são estáticos — não há injeção de código.
- **Imagens Externas:** Validadas contra URL patterns; placeholder em caso de falha.
- **XSS Prevention:** Método `escapeHtml()` previne injeção de scripts.
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
| [spec-doc/prd.md](spec-doc/prd.md) | Product Requirements Document |
| [spec-doc/spec.md](spec-doc/spec.md) | Especificação Técnica Detalhada |
| [spec-doc/tarefas/00-ordem-execucao.md](spec-doc/tarefas/00-ordem-execucao.md) | Planejamento e status das tarefas |
| [scripts/sources.json](scripts/sources.json) | Mapeamento de fontes públicas |
| [scripts/contracts.md](scripts/contracts.md) | Contrato de tipos (Team, Player) |
| [scripts/validation-rules.md](scripts/validation-rules.md) | Regras de validação JSON |
| [assets/README.md](assets/README.md) | Documentação de assets e fallback |

### Roadmap

#### ✅ Concluído
- [01] Definir fontes e contratos de dados
- [02] Implementar ingestão e normalização de dados
- [03] Estruturar ativos estáticos e placeholders
- [04] Construir página principal (`index.html`)

#### 🔨 Em Progresso
- [05] Construir páginas de seleção (`selecao/{slug}.html`)
- [06] Garantir acessibilidade, SEO e performance mínima
- [07] Validar qualidade e preparar deploy/CI

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

---

<div align="center">

**[⬆ voltar ao topo](#-portal-copa-2026--site-estático-responsivo)**

Feito com ❤️ para fãs de futebol ao redor do mundo 🌍

</div>
