# Prompt: Criar script para executar testes E2E com Playwright

Você é um agente de código e precisa manter um script simples para executar os testes end-to-end do portal.

## Objetivo
Criar um comando/script único para rodar os testes Playwright sem precisar decorar o comando longo.

## Requisitos
- Criar um script na raiz do projeto, por exemplo `run-e2e.sh`
- O script deve:
  - entrar na raiz do projeto com segurança
  - executar `npm run test:e2e:headed`
  - falhar se o teste falhar
- Opcionalmente, adicionar um script equivalente em `package.json`
- Não remover o comando Playwright já existente

## Uso esperado
```bash
sh run-e2e.sh
```

## Execução visível
- Para ver o browser abrindo e clicando, use `npm run test:e2e:headed`
- O projeto Playwright precisa declarar o projeto `chromium`

## Critério de pronto
- O script executa o teste E2E
- O resultado aparece no terminal
- O fluxo feliz continua coberto pelo Playwright

## Saída esperada
Resumo curto com:
- arquivo criado/alterado
- comando para rodar
- resultado da execução
