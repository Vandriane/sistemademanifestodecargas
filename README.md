


## 🔧 Automação Make.com — Conferência de Manifesto de Carga

Esta automação recebe um manifesto de carga (BL), extrai os itens declarados via IA, cruza com a base de referência interna (Google Sheets) e classifica cada item em **Correto**, **Divergente**, **Incorreto/Não cadastrado** ou **Faltante**.

### Visão geral do fluxo

```
Webhook (recebe o arquivo)
  └─ Gemini AI · Upload a file        → sobe o arquivo para a API do Gemini
      └─ Gemini AI · Extract structured data → extrai { bl, itens[] } do manifesto
          └─ Router
              ├─ Rota 1 · Processar Manifesto
              │     Iterator → percorre cada item extraído
              │       └─ Google Sheets · Add a Row        → log em "Itens_Extraidos"
              │           └─ Google Sheets · Search Rows  → busca item correspondente em "Itens_Referencia"
              │               └─ Router (comparação)
              │                     ├─ Itens corretos      → Add a Row → "Itens_Corretos"
              │                     ├─ Itens divergentes    → Add a Row → "Itens_Divergentes"
              │                     └─ fallback: incorreto/não cadastrado → Add a Row → "Itens_Incorretos"
              │
              └─ Rota 2 · Descobrir item faltante   (roda DEPOIS da Rota 1 terminar)
                    Google Sheets · Search Rows      → todas as linhas de referência daquele BL
                      └─ Google Sheets · Search Rows → procura cada uma em "Itens_Extraidos"
                          └─ Filter: 0 resultados encontrados
                              └─ Add a Row → "Itens_Faltantes"
```

### Por que duas rotas no primeiro Router

A Rota 1 responde "esse item do manifesto existe na base de referência?" — ela cobre **corretos**, **divergentes** e **incorretos**.
A Rota 2 responde a pergunta inversa: "esse item da base de referência apareceu no manifesto?" — só assim é possível detectar um item que **nunca foi extraído** (faltante).

A ordem importa: o Make processa as rotas de um Router sequencialmente para o mesmo bundle, então a Rota 1 grava tudo em `Itens_Extraidos` antes da Rota 2 começar a consultar esse mesmo log — é isso que garante que a checagem de itens faltantes seja confiável.

### Planilhas utilizadas

| Aba | Função |
|---|---|
| `Itens_Referencia` | Base de referência (sistema interno), somente leitura |
| `Itens_Extraidos` | Log bruto de tudo que a IA extraiu do manifesto |
| `Itens_Corretos` | Itens que batem 100% com a referência |
| `Itens_Divergentes` | Itens encontrados na referência, mas com quantidade/peso/contêiner diferente |
| `Itens_Incorretos` | Itens do manifesto sem correspondência na base |
| `Itens_Faltantes` | Itens da base que não apareceram no manifesto |

### Critérios de comparação

Um item é considerado:
- **Correto** — quantidade, peso bruto e contêiner idênticos aos da base de referência.
- **Divergente** — item encontrado na base (mesmo BL + Nº do item), mas com pelo menos um desses campos diferente.
- **Incorreto/não cadastrado** — item presente no manifesto, sem correspondência de BL + Nº do item na base.
- **Faltante** — item presente na base de referência para aquele BL, mas ausente no manifesto extraído.

### Resultado validado

Teste com o manifesto `BL-2026-001` (6 itens declarados): **5 corretos**, **1 divergente** (Kit de embreagem completo: manifesto declara 450 unidades/2.700 kg, base de referência tem 480 unidades/2.880 kg), **0 incorretos**, **0 faltantes** — confirmando o funcionamento ponta a ponta do fluxo.