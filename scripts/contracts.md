# Contrato de Dados — Campos Obrigatórios e Tipos

## 1. Estrutura Global

### `data/teams.json` — Sumário de Seleções

Arquivo: Array de times com informações resumidas para listagem na página principal.

```json
{
  "teams": [
    { ... }
  ]
}
```

**Tipo:** `Object`
- **teams**: `Array<Team>` — Array de seleções participantes.

---

## 2. Objeto `Team` (para `teams.json`)

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo | Validação |
|-------|------|-----------|---------|-----------|
| **id** | `string` | Identificador único da seleção (ISO 3166-1 alpha-3 ou customizado) | `"bra"`, `"usa"` | Alfanumérico, 2-3 caracteres, lowercase |
| **name** | `string` | Nome oficial da seleção em português ou inglês | `"Brasil"`, `"United States"` | Non-empty, max 100 chars |
| **slug** | `string` | URL-safe identifier para construir URLs de detalhe | `"brasil"`, `"united-states"` | Lowercase, sem acentos, separados por `-`, max 50 chars |
| **photo** | `string` | URL da bandeira ou brasão oficial | `"https://..."` | URL válida HTTP(S), arquivo suportado (jpg, png, svg) |

### Campos Opcionais

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| **confederation** | `string` | Confederação (CONMEBOL, UEFA, etc) | `"CONMEBOL"` |
| **flag** | `string` | URL alternativa da bandeira | `"https://..."` |
| **coachName** | `string` | Nome do técnico | `"Carlos Alberto Parreira"` |

### Exemplo Completo

```json
{
  "id": "bra",
  "name": "Brasil",
  "slug": "brasil",
  "photo": "https://img.fifa.com/image/upload/t_l1_mobile/ifwc69dbnwbu0b8bwtpe.png",
  "confederation": "CONMEBOL",
  "coachName": "Dorival Júnior"
}
```

---

## 3. Objeto `Team` (para `data/teams/{slug}.json`)

Arquivo: Objeto único contendo seleção + elenco detalhado.

### Campos Obrigatórios

Herda todos os campos obrigatórios de `Team` (veja acima), mais:

| Campo | Tipo | Descrição | Exemplo | Validação |
|-------|------|-----------|---------|-----------|
| **players** | `Array<Player>` | Array de jogadores da seleção | `[ {...}, {...} ]` | Non-empty array (min 1 jogador) |

### Campos Opcionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **stadium** | `string` | Estádio-base da seleção |
| **founded** | `string` | Ano de fundação (YYYY) |
| **worldCupTitles** | `number` | Quantidade de Copas ganhas |
| **statistics** | `Object` | Estatísticas agregadas (wins, losses, draws, etc) |

### Exemplo Completo

```json
{
  "id": "bra",
  "name": "Brasil",
  "slug": "brasil",
  "photo": "https://...",
  "confederation": "CONMEBOL",
  "coachName": "Dorival Júnior",
  "worldCupTitles": 5,
  "players": [ ... ]
}
```

---

## 4. Objeto `Player`

Incorporado em `data/teams/{slug}.json` dentro do array `players`.

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo | Validação |
|-------|------|-----------|---------|-----------|
| **id** | `string` | Identificador único do jogador | `"p001"`, `"neymar_jr"` | Alfanumérico, sem espaços |
| **name** | `string` | Nome completo do jogador | `"Neymar da Silva Santos Júnior"` | Non-empty, max 200 chars |
| **birthdate** | `string` | Data de nascimento (ISO 8601) | `"1992-02-05"` | Formato YYYY-MM-DD válido |
| **position** | `string` | Posição em campo | `"Goleiro"`, `"Defesa"`, `"Meio"`, `"Ataque"` | Enum: `"Goleiro"`, `"Defesa"`, `"Meio"`, `"Ataque"` |
| **number** | `integer` | Número da camisa | `10`, `1` | Entre 1-99 |

### Campos Opcionais

| Campo | Tipo | Descrição | Exemplo | Validação |
|-------|------|-----------|---------|-----------|
| **photo** | `string` | URL de foto do jogador | `"https://..."` | URL válida ou `null` |
| **club** | `string` | Clube atual | `"FC Barcelona"` | Max 100 chars |
| **height** | `number` | Altura em cm | `183` | Entre 150-220 cm |
| **weight** | `number` | Peso em kg | `75` | Entre 50-150 kg |
| **caps** | `integer` | Número de aparições pela seleção | `120` | >= 0 |
| **goals** | `integer` | Número de gols pela seleção | `77` | >= 0 |

### Exemplo Completo

```json
{
  "id": "neymar_jr",
  "name": "Neymar da Silva Santos Júnior",
  "birthdate": "1992-02-05",
  "position": "Ataque",
  "number": 10,
  "photo": "https://img.fifa.com/image/upload/t_l1_mobile/...",
  "club": "Al-Hilal SFC",
  "height": 175,
  "weight": 68,
  "caps": 125,
  "goals": 79
}
```

---

## 5. Estrutura de Arquivo `data/teams/{slug}.json`

Exemplo completo de `data/teams/brasil.json`:

```json
{
  "id": "bra",
  "name": "Brasil",
  "slug": "brasil",
  "photo": "https://...",
  "confederation": "CONMEBOL",
  "coachName": "Dorival Júnior",
  "worldCupTitles": 5,
  "players": [
    {
      "id": "neymar_jr",
      "name": "Neymar da Silva Santos Júnior",
      "birthdate": "1992-02-05",
      "position": "Ataque",
      "number": 10,
      "photo": "https://...",
      "club": "Al-Hilal SFC",
      "height": 175,
      "weight": 68,
      "caps": 125,
      "goals": 79
    },
    {
      "id": "vinicius_jr",
      "name": "Vinícius José Paixão de Oliveira Júnior",
      "birthdate": "2000-07-12",
      "position": "Ataque",
      "number": 7,
      "photo": "https://...",
      "club": "Real Madrid CF",
      "height": 176,
      "weight": 73,
      "caps": 28,
      "goals": 8
    }
  ]
}
```

---

## 6. Resumo de Validações Críticas

### Para `teams.json`:
- [ ] **id**: 2-3 caracteres, lowercase, alfanumérico
- [ ] **name**: Non-empty, max 100 chars
- [ ] **slug**: URL-safe, lowercase, max 50 chars, único
- [ ] **photo**: URL válida HTTP(S), arquivo suportado

### Para `teams/{slug}.json`:
- [ ] **id, name, slug, photo**: Validações acima
- [ ] **players**: Non-empty array (min 1)
- [ ] **player.id**: Único dentro do array
- [ ] **player.name**: Non-empty
- [ ] **player.birthdate**: Formato ISO 8601 válido, data no passado
- [ ] **player.position**: Um dos valores permitidos
- [ ] **player.number**: 1-99

---

## 7. Notas Importantes

1. **Campos obrigatórios NÃO podem ser `null` ou `undefined`.**
2. **URLs de imagens devem ser HTTPS quando possível.**
3. **Datas devem estar em formato ISO 8601 (YYYY-MM-DD).**
4. **IDs devem ser únicos dentro de seu contexto (seleção ou elenco).**
5. **Slugs devem ser URL-safe e únicos entre seleções.**
6. **Erros de validação devem ser logados com details para debug.**

