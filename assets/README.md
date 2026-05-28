# Assets

Estrutura visual base do portal.

## Pastas
- `css/`: estilos globais e componentes.
- `js/`: utilitários e renderização client-side.
- `img/`: imagens estáticas, placeholders e ícones.

## Estratégia de fallback de imagem
- Imagens de jogadores devem usar `loading="lazy"` para reduzir custo de carregamento.
- Em caso de falha de rede ou URL inválida, o `img.onerror` deve substituir a imagem por `assets/img/placeholder-player.png`.
- O placeholder local evita cards vazios e mantém a consistência visual mesmo quando a fonte externa não estiver disponível.
