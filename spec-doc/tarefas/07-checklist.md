# Checklist de validação — Tarefa [07]

## Desktop
- Abrir o site com servidor local e confirmar carregamento da página principal.
- Verificar se os cards das seleções aparecem e os links das seleções funcionam.
- Abrir uma página de seleção e confirmar que o elenco é renderizado sem erro.

## Mobile
- Redimensionar a janela para largura de celular e confirmar layout em coluna única.
- Navegar com teclado e verificar se o skip link e os estados de foco estão visíveis.

## Validação automatizada
- Executar `node scripts/validate-json.js` e confirmar que os JSONs estão válidos.
- Confirmar que o workflow do GitHub Actions executa a validação antes da publicação.

## Publicação
- Garantir que o workflow publique o site estático a partir do conteúdo do repositório.
- Validar o resultado final em um ambiente de preview ou no GitHub Pages.