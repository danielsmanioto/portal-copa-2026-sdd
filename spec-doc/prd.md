# PRD — Site Estático: Copa do Mundo (Listagem de Seleções)

## Visão
Um site estático, leve e responsivo, que apresenta todas as seleções participantes da Copa do Mundo e, para cada seleção, uma página com os jogadores convocados, suas fotos, idade e clube atual.

## Problema
Usuários querem consultar informações públicas sobre seleções e elencos de forma rápida, offline-friendly e compartilhável (links estáticos), sem necessidade de APIs dinâmicas.

## Objetivo
Entregar um MVP estático que permita navegar por seleções e ver fichas de jogadores com fotos e dados básicos, consumindo dados públicos incorporados ao build.

## Público-alvo
- Fãs de futebol
- Jornalistas e produtores de conteúdo
- Usuários que buscam informações rápidas sobre elencos

## Principais funcionalidades (MVP)
- Página principal (`index.html`) com todas as seleções (nome + foto).
- Página de seleção (`selecao/{slug}.html`) com lista de jogadores convocados.
- Para cada jogador: nome, idade (anos), posição, clube, foto.
- Placeholders para imagens ausentes.
- Dados gerados a partir de fontes públicas e salvos como JSON estático (`data/`).

## Não-funcional / Restrições
- Sem API própria — conteúdo estático gerado no build ou carregado do cliente.
- Responsividade (mobile / desktop).
- Performance: uso de imagens otimizadas / lazy-loading.
- Acessibilidade básica (alt em imagens, contraste, navegação por teclado).

## Métricas de sucesso
- MVP: páginas carregam em < 2s em conexão 3G respeitando otimizações básicas.
- Conteúdo correto para pelo menos 80% das seleções alvo (dados validados manualmente).
- Tempo para gerar o site (build) < 2 minutos para dataset inicial.

## Roadmap / Marcos
- Sprint 1 (MVP, 3-5 dias): script de fetch, `data/` com 1 seleção exemplo, `index.html`, `selecao/brasil.html`, documentação.
- Sprint 2 (Escala, 5-8 dias): rodar fetch para todas seleções, cache de imagens, template engine para gerar páginas.
- Sprint 3 (Polimento, 2-4 dias): testes automatizados, CI para rebuild, deploy em hospedagem estática.

## Stakeholders
- Product Owner: (definir)
- Designer/UI: (opcional)
- Desenvolvedor: (definir)

## Riscos e Mitigações
- Fonte pública instável: mitigar com cache local no build e fallback a placeholders.
- Direitos de imagem: usar apenas imagens com permissão ou links oficiais; permitir configuração para não baixar imagens.

## Entregáveis
- `spec-doc/tarefa.md` (user story refinada)
- `data/` com JSON gerado
- `index.html`, `selecao/{slug}.html` (exemplo)
- Scripts em `scripts/` para fetch e geração
- README com instruções de build e deploy

