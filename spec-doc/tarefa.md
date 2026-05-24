# Título
Página Estática da Copa do Mundo — Listagem de Seleções e Páginas de Seleção

## Resumo (User Story)
Como usuário interessado na Copa do Mundo, quero acessar um site estático que liste todas as seleções participantes e, ao clicar em uma seleção, navegar para a página estática dessa seleção para ver a lista de jogadores convocados com foto, idade e clube atual.

> Observação: NÃO haverá API própria. Os dados serão obtidos de fontes públicas e incorporados ao build como JSON estático (ou carregados pelo cliente como fallback).

## Critérios de Aceite
- Existe uma página principal `index.html` que lista todas as seleções com nome e foto.
- Cada seleção na lista liga para uma página estática `selecao/{slug}.html`.
- A página da seleção mostra: nome, foto da seleção, e lista completa de jogadores convocados.
- Para cada jogador são exibidos: nome completo, idade (anos inteiros), clube atual, posição e foto.
- Imagens exibem placeholders quando a URL não estive
r disponível ou falhar no carregamento.
- Layout responsivo adequado para mobile e desktop.
- Dados são gerados a partir de fontes públicas e produzidos como arquivos JSON estáticos em `data/` durante o build; cliente pode buscar a fonte pública como fallback.

## Definição de Pronto (DoD)
- `index.html` e pelo menos uma `selecao/{slug}.html` geradas a partir de `data/`.
- Todos os critérios de aceite atendidos manualmente em desktop e mobile.
- Placeholders de imagem funcionais.
- Instruções de build e fontes documentadas no repositório.

## Tarefas Técnicas (sub-tasks)
1. Mapear e documentar fontes públicas de dados (JSON/CSV) para cada seleção.
2. Implementar script de build (`scripts/fetch-data.js` ou `scripts/fetch-data.py`) que baixa, normaliza e gera `data/teams.json` e `data/teams/{slug}.json`.
3. Criar `index.html` que consome `data/teams.json` e renderiza a grade/lista de seleções.
4. Criar `selecao/{slug}.html` que consome `data/teams/{slug}.json` e renderiza `TeamPage`.
5. Implementar componentes/client-side JS leves: `TeamCard`, `PlayerCard` (cálculo de idade a partir de `birthdate`).
6. Implementar placeholders de imagem (atributo `onerror`) e otimizações de cache.
7. Adicionar scripts npm/Makefile que executem o fetch e gerem o site estático.
8. Escrever documentação no README com passos de build e lista de fontes.

## Estimativa
- Implementação MVP (script de fetch + 1 seleção exemplo + templates): 3-5 story points.
- Completo (todas seleções, imagens cacheadas, testes): 8-13 story points.

## Exemplo de dados (JSON mínimo)
`data/teams.json` (resumo):
```json
{
  "teams": [
    { "id": "bra", "name": "Brasil", "slug": "brasil", "photo": "https://example.com/images/selecoes/brasil.png" }
  ]
}
```

`data/teams/brasil.json`:
```json
{
  "id": "bra",
  "name": "Brasil",
  "slug": "brasil",
  "photo": "https://example.com/images/selecoes/brasil.png",
  "players": [
    {
      "id": "player1",
      "name": "Alisson Becker",
      "birthdate": "1992-10-02",
      "club": "Liverpool",
      "position": "Goleiro",
      "photo": "https://example.com/images/players/alisson.jpg"
    }
  ]
}
```

## Notas / Próximos passos
- Criar `scripts/fetch-data.js` para normalizar e salvar JSON em `data/`.
- Gerar `index.html` e `selecao/brasil.html` de exemplo usando os JSON gerados.
- Decidir estratégia de hospedagem estática (Netlify, GitHub Pages, Vercel) e CI para rebuild periódico.
- Considerar cache de imagens em `assets/` se necessário para performance e disponibilidade.

---

Arquivo gerado a partir de `spec-doc/tarefa.txt` com refinamento de Product Manager.
