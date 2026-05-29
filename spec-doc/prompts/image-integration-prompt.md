Prompt: Como integrar imagens (bandeiras ou fotos) de cada país na página principal do portal

Objetivo

Forneça instruções claras e reproduzíveis para que eu (ou outro dev/assistente) consiga adicionar imagens reais para cada seleção nacional na página principal do projeto estático. O resultado deve ser: 1) imagens públicas (preferencialmente bandeiras) exibidas em cada card; 2) fallback local se não houver imagem; 3) processo fácil de repetir para atualizar ou usar fotos do Wikimedia Commons.

Passos (resumido)

1. Escolher o tipo de imagem
   - "Bandeira" (recomendado): cobertura completa, URLs estáveis; SVG de boa qualidade.
   - "Foto da seleção" ou imagem representativa: usar Wikimedia Commons (API).

2. Fonte recomendada
   - Bandeiras rápidas via repository `lipis/flag-icons` (disponível via jsDelivr):
     https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/{code}.svg
     - `{code}` = ISO 3166-1 alpha-2 em minúsculas (ex: `br`, `us`, `fr`). Alguns países/regiões têm códigos específicos (ex: `gb-eng`).
   - Metadata (nome, iso2) opcional: Rest Countries API — https://restcountries.com
   - Fotos e imagens locais detalhadas: Wikimedia Commons / MediaWiki API (pesquisar por título ou por nome do país)

3. Mapear `slug` → código de bandeira (iso2)
   - No pipeline de geração (`scripts/generate-worldcup-json.js` ou `scripts/fetch-data.js`) ou manualmente no `data/teams.json`, acrescente/normalize um campo `photo` apontando para uma URL pública de bandeira.
   - Exemplo de mapeamento rápido (JS):
     const flagUrl = (iso) => `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${iso}.svg`;

4. Implementação no frontend (exemplo mínimo)
   - Atualize `assets/js/app.js` para usar `team.photo` quando for URL válida; caso contrário, resolver via mapa `slug -> iso` e montar URL do CDN.
   - Forçar `img.loading = 'lazy'`, `img.decoding = 'async'` e `img.onerror` para fallback local (`/assets/img/placeholder-player.png`).

   Exemplo (trecho):
   ```js
   function resolveTeamImage(team) {
     const map = { brasil: 'br', 'united-states': 'us', argentina: 'ar' /* ... */ };
     const iso = map[team.slug];
     if (iso) return `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${iso}.svg`;
     if (team.photo && !team.photo.includes('example.com')) return team.photo;
     return '/assets/img/placeholder-player.png';
   }
   ```

5. Ajustes de CSS
   - Se for usar bandeiras SVG (recomendado), usar `object-fit: contain` e padding para não cortar: atualize `.team-card-image img { object-fit: contain; padding: .75rem }`.

6. Fallback e qualidade
   - Sempre ter `/assets/img/placeholder-player.png` como fallback.
   - Use SVG quando possível (bandeiras) para melhor nitidez.
   - Se for usar fotos do Wikimedia Commons, adicione verificação de CORS (algumas imagens funcionam direto; outras podem precisar proxiar ou baixar localmente no pipeline).

7. Automatizar no pipeline (alternativa avançada)
   - No `scripts/fetch-data.js` ou `scripts/generate-worldcup-json.js` durante geração de `data/teams.json`:
     - Buscar `iso2` via Rest Countries (por país) ou manter um mapa local `fifa_code -> iso2`.
     - Gerar `photo` para cada equipe apontando para `jsdelivr` flag ou baixar a imagem para `assets/img/flags/{slug}.svg` e referenciar localmente.
   - Com `--no-download-images` você pode manter URLs remotas e evitar armazenar imagens.

8. Testes e verificação
   - Start local server:
     ```bash
     npm run serve
     # ou
     python3 -m http.server 8080
     ```
   - Abra `http://localhost:8080/` e verifique se cada card mostra a imagem correta e se ocorre fallback quando a URL for inválida.
   - No DevTools: verifique requisições de rede, CORS e se há 404 nas imagens.

9. Exemplo de comando rápido para atualizar todos os `photo` no JSON (script Node.js simples)
   - Pseudocódigo:
     ```js
     const teams = require('./data/teams.json');
     const map = {/* slug->iso */};
     teams.teams.forEach(t => { t.photo = `https://cdn.jsdelivr.net/.../${map[t.slug]||'placeholder'}.svg`; });
     fs.writeFileSync('./data/teams.json', JSON.stringify(teams, null, 2));
     ```

Observações finais

- Bandeiras via `lipis/flag-icons` são rápidas e liberam você de depender de scraping.
- Para fotos (jogadores, times), prefira baixar as imagens durante o build para evitar problemas de CORS e disponibilidade.
- Sempre registre a origem das imagens (Wikimedia Commons, Transfermarkt, etc.) no `assets/README.md` para conformidade.

Uso do prompt com um assistente (exemplo que você pode colar):

"Me ajude a integrar imagens de cada seleção na página principal deste projeto estático. Quero usar bandeiras SVG via jsDelivr (`lipis/flag-icons`) como primeira escolha. Gere um mapeamento `slug -> ISO3166-1 alpha-2` para todas as seleções listadas em `data/teams.json`, atualize `assets/js/app.js` para resolver imagens via esse mapeamento com fallback para `/assets/img/placeholder-player.png`, e ajuste o CSS para `object-fit: contain` em `.team-card-image img`. Forneça o diff das alterações nos arquivos e um pequeno script Node.js para injetar as URLs no `data/teams.json`." 

---

Arquivo salvo em: `spec-doc/prompts/image-integration-prompt.md`
