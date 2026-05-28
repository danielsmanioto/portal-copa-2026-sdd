# Regras de Validação Mínima — Copa 2026

## Visão Geral

Este documento define as regras de validação obrigatórias para arquivos JSON gerados pelo pipeline `scripts/fetch-data.js`. Essas regras garantem integridade de dados e compatibilidade com as páginas estáticas.

---

## 1. Validação de Estrutura (Schema)

### 1.1 `data/teams.json`

**Estrutura esperada:**

```json
{
  "teams": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "photo": "string",
      "confederation": "string (optional)",
      "flag": "string (optional)",
      "coachName": "string (optional)"
    }
  ]
}
```

**Validações:**

- [ ] **Root** é um objeto com propriedade `teams` (array)
- [ ] **teams** é non-empty (mínimo 1 item)
- [ ] **Cada item** possua `id`, `name`, `slug`, `photo` (obrigatórios)

---

### 1.2 `data/teams/{slug}.json`

**Estrutura esperada:**

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "photo": "string",
  "players": [
    {
      "id": "string",
      "name": "string",
      "birthdate": "string (YYYY-MM-DD)",
      "position": "string",
      "number": "integer",
      "photo": "string (optional)",
      "club": "string (optional)",
      "height": "number (optional)",
      "weight": "number (optional)",
      "caps": "integer (optional)",
      "goals": "integer (optional)"
    }
  ]
}
```

**Validações:**

- [ ] **Root** é objeto (não array)
- [ ] Possua `id`, `name`, `slug`, `photo`, `players` (obrigatórios)
- [ ] **players** é array non-empty (mínimo 1 jogador)
- [ ] **Cada jogador** possua `id`, `name`, `birthdate`, `position`, `number`

---

## 2. Validação de Tipos

### 2.1 Campos String

**Regras:**

- [ ] Non-empty (comprimento > 0)
- [ ] Tipo é `string` (não número ou booleano)
- [ ] Sem valores especiais como `"null"`, `"undefined"` (strings literais)

**Exemplo inválido:**

```json
{ "name": "" }  // ❌ vazio
{ "name": "null" }  // ❌ string literal "null"
{ "name": 123 }  // ❌ tipo errado
```

### 2.2 Campos Numéricos (integer)

**Regras:**

- [ ] Tipo é `number` ou `integer`
- [ ] Sem valores especiais (`NaN`, `Infinity`)
- [ ] Intervalo válido (ex: `number` entre 1-99)

**Exemplo inválido:**

```json
{ "number": "10" }  // ❌ string, não número
{ "number": 150 }  // ❌ fora do intervalo (máx 99)
{ "number": NaN }  // ❌ NaN
```

### 2.3 Datas (ISO 8601)

**Regras:**

- [ ] Formato: `YYYY-MM-DD`
- [ ] Data válida (não 2026-02-30, ex)
- [ ] Data no passado (não futura)
- [ ] Tipo é `string`

**Exemplo inválido:**

```json
{ "birthdate": "05/02/1992" }  // ❌ formato errado
{ "birthdate": "1992-2-5" }  // ❌ padding incorreto
{ "birthdate": "2026-05-27" }  // ❌ data futura
```

**Implementação sugerida:**

```javascript
function isValidBirthdate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  
  // Verificar se é data passada
  return date < new Date();
}
```

---

## 3. Validação de Identificadores

### 3.1 `id` (Team e Player)

**Regras:**

- [ ] Alfanumérico: `[a-zA-Z0-9_-]`
- [ ] Comprimento: 2-50 caracteres
- [ ] Sem espaços, caracteres especiais ou acentos
- [ ] **Deve ser único** dentro de seu contexto (entre times ou entre jogadores do time)

**Exemplo válido:** `"bra"`, `"usa"`, `"neymar_jr"`, `"player-001"`

**Exemplo inválido:**

```json
{ "id": "br" }  // ❌ muito curto (< 2)
{ "id": "BR" }  // ⚠️ aceitar mas normalizar para lowercase
{ "id": "brasil#1" }  // ❌ caractere especial
```

### 3.2 `slug` (Team)

**Regras:**

- [ ] Lowercase: `[a-z0-9-]`
- [ ] Sem acentos ou caracteres especiais
- [ ] Separadores: apenas `-` (hífens)
- [ ] Comprimento: 2-50 caracteres
- [ ] **Deve ser único** entre times
- [ ] Deve ser derivável do `name` ou `id`

**Exemplo válido:** `"brasil"`, `"united-states"`, `"south-africa"`

**Exemplo inválido:**

```json
{ "slug": "Brasil" }  // ❌ maiúscula
{ "slug": "brasil_" }  // ❌ underscore
{ "slug": "br" }  // ❌ muito curto
```

**Normalização sugerida:**

```javascript
function normalizeSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')  // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacríticos
    .replace(/[^a-z0-9-]/g, '-')  // Substitui caracteres especiais por -
    .replace(/-+/g, '-')  // Reduz múltiplos - para um
    .replace(/^-|-$/g, '')  // Remove - nas extremidades
    .substring(0, 50);  // Limita a 50 caracteres
}
```

---

## 4. Validação de URLs

### 4.1 `photo`, `flag`

**Regras:**

- [ ] URL válida HTTP(S)
- [ ] Protocolo obrigatório: `https://` ou `http://`
- [ ] Domínio válido
- [ ] Formato de arquivo suportado: `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`
- [ ] URL deve retornar status 200 (conexão testa opcional no build)

**Exemplo válido:**

```json
{ "photo": "https://img.fifa.com/image/upload/t_l1_mobile/ifwc69dbnwbu0b8bwtpe.png" }
{ "photo": "https://commons.wikimedia.org/wiki/File:Flag_of_Brazil.svg" }
```

**Exemplo inválido:**

```json
{ "photo": "img.fifa.com/..." }  // ❌ falta protocolo
{ "photo": "https://example.com/image.gif" }  // ❌ formato não suportado
{ "photo": "/local/path/image.png" }  // ❌ caminho local (usar em data/teams/{slug}.json se cached)
```

**Validação sugerida:**

```javascript
function isValidImageUrl(url) {
  try {
    const urlObj = new URL(url);
    const validProtocols = ['https:', 'http:'];
    if (!validProtocols.includes(urlObj.protocol)) return false;
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
    const pathname = urlObj.pathname.toLowerCase();
    return validExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}
```

---

## 5. Validação de Enums

### 5.1 `position` (Player)

**Valores permitidos:**

- `"Goleiro"` (GK)
- `"Defesa"` (DF)
- `"Meio"` (MF)
- `"Ataque"` (FW)

**Regra:**

- [ ] Tipo é `string`
- [ ] Valor está na lista de permitidos (case-sensitive)

**Exemplo inválido:**

```json
{ "position": "goleiro" }  // ❌ lowercase (case-sensitive)
{ "position": "Atacante" }  // ❌ valor não permitido
{ "position": "Forward" }  // ❌ idioma errado
```

---

## 6. Validação de Intervalos

### 6.1 `number` (Player - número da camisa)

**Regras:**

- [ ] Tipo é `integer`
- [ ] Intervalo: 1 - 99
- [ ] Obrigatório

**Exemplo inválido:**

```json
{ "number": 0 }  // ❌ abaixo do mínimo
{ "number": 150 }  // ❌ acima do máximo
{ "number": "10" }  // ❌ tipo errado
```

### 6.2 `height`, `weight` (Player - opcionais)

**Regras para `height`:**

- [ ] Tipo é `number`
- [ ] Intervalo: 150 - 220 cm
- [ ] Opcional (pode ser omitido)

**Regras para `weight`:**

- [ ] Tipo é `number`
- [ ] Intervalo: 50 - 150 kg
- [ ] Opcional (pode ser omitido)

### 6.3 `caps`, `goals` (Player - opcionais)

**Regras:**

- [ ] Tipo é `integer` >= 0
- [ ] Opcional (pode ser omitido)

---

## 7. Validação de Referência

### 7.1 Integridade entre `teams.json` e `teams/{slug}.json`

**Regras:**

- [ ] **Cada `team` em `teams.json` deve ter arquivo correspondente em `teams/{slug}.json`**
- [ ] **O `slug` do arquivo deve corresponder ao `slug` do objeto**
- [ ] **Campos `id`, `name`, `slug`, `photo` devem ser idênticos entre os dois arquivos**

**Verificação sugerida:**

```javascript
// Pseudocódigo
teams.forEach(team => {
  const file = readFile(`data/teams/${team.slug}.json`);
  assert(file.id === team.id, `ID mismatch: teams.json vs teams/${team.slug}.json`);
  assert(file.name === team.name, `Name mismatch`);
  assert(file.slug === team.slug, `Slug mismatch`);
});
```

### 7.2 Unicidade de IDs e Slugs

**Regras:**

- [ ] **Cada `id` em `teams.json` é único**
- [ ] **Cada `slug` em `teams.json` é único**
- [ ] **Cada `player.id` é único dentro de `teams/{slug}.json`**

---

## 8. Validação de Completude

### 8.1 Cobertura de Times

**Regra:**

- [ ] Todos os 32 times (ou quantos estiverem qualificados) devem ter arquivo em `data/teams/{slug}.json`
- [ ] Se time faltante, log warning mas não falhar o build

### 8.2 Cobertura de Jogadores

**Regra:**

- [ ] Cada time deve ter mínimo 1 jogador (recomendado 23)
- [ ] Se jogadores faltantes, usar dados parciais e log warning

---

## 9. Tratamento de Erros e Logging

### 9.1 Níveis de Log

| Nível | Exemplo | Ação |
|-------|---------|------|
| **ERROR** | Campo obrigatório ausente | Falha validação, arquivo rejeitado |
| **WARNING** | URL de imagem retorna 404 | Continua com fallback/placeholder |
| **INFO** | Time validado com sucesso | Log informativo, sem ação |
| **DEBUG** | Detalhes de parsing JSON | Apenas em verbose mode |

### 9.2 Exemplo de Log

```
[VALIDATE] Processing data/teams.json...
[INFO] Found 32 teams
[INFO] Validating team: Brasil (id=bra)
[VALIDATE] Processing data/teams/brasil.json...
[INFO] Found 23 players
[OK] Player: Neymar da Silva Santos Júnior (id=neymar_jr)
[WARNING] Player photo URL returned 404: https://... (using fallback)
[OK] Team: Brasil validated
[SUMMARY] ✅ All data valid. Ready for deployment.
```

---

## 10. Checklist de Implementação

### Antes de Deploy

- [ ] `data/teams.json` valida contra schema
- [ ] `data/teams/{slug}.json` (todos) validam contra schema
- [ ] Todos os IDs e slugs são únicos
- [ ] Todas as datas estão em formato ISO 8601
- [ ] Todas as URLs são acessíveis (ou fallback configurado)
- [ ] Posições estão nos valores permitidos
- [ ] Números das camisas estão no intervalo 1-99
- [ ] Logs de validação sem ERRORs
- [ ] Mínimo 1 jogador por time
- [ ] Cobertura >= 90% de times qualificados

---

## 11. Referências

- JSON Schema: https://json-schema.org/
- ISO 8601: https://en.wikipedia.org/wiki/ISO_8601
- URL Standard: https://url.spec.whatwg.org/

