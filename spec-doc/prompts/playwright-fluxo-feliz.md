# Prompt: Criar teste Playwright para validar o fluxo feliz

Você é um agente de código e precisa criar um teste E2E com Playwright para validar o fluxo feliz do portal estático da Copa.

## Objetivo
Cobrir o caminho principal do usuário no site, confirmando que as páginas e a navegação funcionam.

## Fluxo feliz sugerido
1. Abrir `index.html`
2. Confirmar que a home carrega e exibe links principais
3. Clicar em `Acesso`
4. Confirmar que abre `acesso.html`
5. Clicar em `Ir para login`
6. Confirmar que abre `login.html`
7. Clicar em `Não tem conta? Criar cadastro`
8. Confirmar que abre `cadastro.html`
9. Voltar para `acesso.html` e confirmar navegação reversa
10. Opcionalmente confirmar a presença de `Tabela da Copa` no menu

## Requisitos técnicos
- Usar `@playwright/test`
- Criar configuração para rodar contra o servidor local em `http://127.0.0.1:8080`
- Criar ao menos um teste em `tests/e2e/happy-path.spec.ts` ou `.js`
- Usar seletores estáveis: texto visível, links e títulos
- Evitar dependência de dados dinâmicos instáveis

## Scripts sugeridos
- `test:e2e` para executar Playwright
- `test:e2e:ui` se quiser abrir o modo UI

## Critério de pronto
- O teste passa localmente
- O teste falha se algum link ou página quebrar
- O fluxo cobre a navegação principal entre `index`, `acesso`, `login` e `cadastro`

## Saída esperada
Resumo curto com:
- arquivos criados/alterados
- como executar os testes
- resultado da execução
