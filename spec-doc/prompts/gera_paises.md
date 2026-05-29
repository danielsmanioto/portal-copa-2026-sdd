Você é um engenheiro de software sênior especialista em automação de dados, ETL, geração de datasets esportivos e modelagem JSON.

Objetivo:
Criar um script automatizado para gerar um arquivo JSON completo contendo todas as seleções participantes da Copa do Mundo, incluindo:

* país
* código ISO
* bandeira
* grupo
* jogadores convocados
* posição dos jogadores
* clube atual
* número da camisa
* técnico
* ranking FIFA (se disponível)

Fontes de dados:

1. Seleções da Copa:
   https://github.com/openfootball/worldcup.json/blob/master/2026/worldcup.teams.json

2. Jogadores/convocações:
   https://github.com/footballcsv/cache.footballsquads

3. Bandeiras:
   https://flagcdn.com

Objetivo final:
Gerar um arquivo:

```text
/world-cup-data/worldcup-complete.json
```

Além disso, o pipeline deve manter cache e arquivos intermediários em `data/raw`, `data/normalized` e `data/generated`, e poder ser executado novamente sem duplicar dados.

Formato esperado do JSON:

```json
[
  {
    "id": "BRA",
    "name": "Brazil",
    "code": "br",
    "group": "G",
    "flag": "https://flagcdn.com/br.svg",
    "coach": "Dorival Jr",
    "fifaRank": 5,
    "players": [
      {
        "name": "Vinicius Junior",
        "position": "Forward",
        "club": "Real Madrid",
        "number": 7
      }
    ]
  }
]
```

Requisitos técnicos:

* Utilizar Node.js
* Código limpo e organizado
* Separar responsabilidades
* Criar funções reutilizáveis
* Adicionar tratamento de erros
* Adicionar logs claros no terminal
* Utilizar async/await
* Validar dados antes de salvar
* Normalizar nomes de países
* Evitar duplicidade de jogadores
* Garantir UTF-8

Estrutura esperada:

```text
/scripts
 ├── download-data.js
 ├── normalize-data.js
 ├── merge-data.js
 ├── generate-worldcup-json.js

/data
 ├── raw
 ├── normalized
 ├── generated
```

Regras importantes:

1. Ler todas as seleções do arquivo `worldcup.teams.json`
2. Para cada seleção:

   * encontrar elenco correspondente
   * mapear jogadores
   * adicionar URL da bandeira via ISO code
3. Caso não encontre jogadores:

   * gerar array vazio
   * adicionar warning no log
4. Criar JSON final padronizado
5. Salvar arquivo formatado com identação
6. Garantir que o script possa ser executado novamente sem quebrar

Extras desejáveis:

* script CLI executável
* suporte a cache local
* opção de atualizar apenas uma seleção
* argumentos `--team` e `--refresh`
* fallback para dados ausentes
* gerar estatísticas finais:

  * total de seleções
  * total de jogadores
  * seleções sem elenco

Saída esperada no terminal:

```bash
✅ Brazil loaded with 26 players
✅ Argentina loaded with 26 players
⚠ Germany squad not found
🎉 worldcup-complete.json generated successfully
```

Ao final:

* gerar todos os scripts necessários
* explicar como executar
* gerar package.json se necessário
* adicionar dependências utilizadas
* documentar possíveis limitações dos datasets
