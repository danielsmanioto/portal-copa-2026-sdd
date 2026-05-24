# Prompt: Gerar PRD a partir de `spec-doc/tarefa.md`

Objetivo: gerar automaticamente um Product Requirements Document (PRD) em Markdown a partir do conteúdo presente em `spec-doc/tarefa.md`.

Instruções para o agente (ou para um script que use este prompt):

1. Leia o arquivo `spec-doc/tarefa.md` e extraia os elementos principais: user story, critérios de aceite, tarefas técnicas, exemplos de dados e observações.
2. Monte um PRD em português com as seguintes seções (preencha com conteúdo extraído e refinado):
   - **Título**
   - **Visão**
   - **Problema**
   - **Objetivo**
   - **Público-alvo**
   - **Principais funcionalidades (MVP)**
   - **Não-funcional / Restrições**
   - **Métricas de sucesso**
   - **Roadmap / Marcos**
   - **Stakeholders**
   - **Riscos e Mitigações**
   - **Entregáveis**
3. Seja conciso e objetivo; use listas e bullets. Não inclua código executável no PRD.
4. Caso faltem informações, faça suposições razoáveis e indique-as na seção "Observações / Suposições" ao final.
5. A saída deve ser exclusivamente o Markdown do PRD, pronto para salvar em `spec-doc/prd.md`.

Exemplo de uso (manual):

```bash
# Exemplo: executar um script que leia tarefa.md e gere prd.md
node scripts/gerar_prd_from_tarefa.js    # script hipotético
```

Notas:
- Este arquivo é um prompt-guia; ele não executa nada por si só. Use-o com um assistente ou script que transforme o conteúdo de `spec-doc/tarefa.md` em um PRD formatado.
