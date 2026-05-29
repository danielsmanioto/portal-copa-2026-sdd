# Prompt: Criar páginas de acesso, login e novo cadastro

Você é um agente de código e precisa criar um fluxo estático simples de autenticação visual (sem backend), com páginas separadas e navegação clara.

## Objetivo
Criar três páginas:
1. `acesso.html` (hub com botões/links)
2. `login.html` (form de login)
3. `cadastro.html` (form de novo cadastro)

## Requisitos
- Reaproveitar `assets/css/styles.css`.
- Manter identidade visual do projeto (`header`, `top-nav`, `footer`).
- Em `acesso.html`, incluir 2 cards:
  - Ir para login
  - Ir para novo cadastro
- Em `login.html`, incluir formulário com:
  - Email
  - Senha
  - Botão Entrar
  - Link para cadastro
- Em `cadastro.html`, incluir formulário com:
  - Nome completo
  - Email
  - Senha
  - Confirmar senha
  - Botão Criar conta
  - Link para login
- Incluir links de retorno para:
  - `/index.html`
  - `/acesso.html`
- Não implementar autenticação real; somente UI e navegação.

## Estilos mínimos para adicionar no CSS
- `.auth-wrapper`
- `.auth-grid`
- `.auth-card`
- `.auth-form`
- `.auth-actions`

## Integração
- Adicionar no menu principal do `index.html` um link para `/acesso.html`.

## Critério de pronto
- As 3 páginas abrem sem erro.
- Navegação entre acesso/login/cadastro funcionando.
- Estilo consistente com o resto do portal.
- Sem erros nos arquivos alterados.

## Saída esperada
Resumo com:
- arquivos criados/alterados
- confirmação de navegação entre páginas
- próximos passos (ex.: integrar backend real de autenticação)
