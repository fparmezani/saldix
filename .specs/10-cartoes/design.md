# Fase 10 — Cartões — Design

## Entidades / Tabelas

### `cards`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| name | text | ex: "Nubank Roxinho" |
| last_digits | text nullable | últimos 4 dígitos, opcional |
| created_at | timestamptz | |

RLS: `user_id = auth.uid()`.

### Alteração em `variable_expenses` e `fixed_expenses`
Adicionar coluna `card_id uuid nullable references cards(id) on delete set null` em ambas — excluir um cartão não apaga o histórico de despesas, só desvincula (mesmo padrão de `debts.asset_id` na Fase 7).

## Pipeline de importação (sem tocar banco até a confirmação)

```
PDF (buffer) 
  → pdf-text-extractor (Adapter sobre lib `pdf-parse`)
  → card-section-detector (heurística: divide texto por marcadores "final XXXX" / fallback: 1 bloco só)
  → statement-line-parser (por bloco: regex data + descrição + R$ valor, detecta sufixo "N/M")
  → category-suggester (por linha: palavra-chave → nome de categoria do usuário)
  → StatementImportPreview (devolvido ao frontend, nada persistido)
```

Confirmação (`POST /cards/statement-confirm`) recebe a lista já revisada/editada pelo usuário e só então grava.

## Regra de parcela no meio da série (Factory)

`remaining-installments.factory.ts`, variante de `buildInstallments` (Fase 2, `variable-expenses/variable-expenses.factory.ts`):

```
buildRemainingInstallments({ description, installmentAmount, expenseDate, currentInstallment, totalInstallments, categoryId }):
  installmentGroupId = uuid()
  para i de currentInstallment até totalInstallments:
    registros.push({
      description, amount: installmentAmount,  // valor já é o da parcela, não o total — não redivide
      expenseDate: addMonthsClamped(expenseDate, i - currentInstallment),
      installmentGroupId, installmentNumber: i, installmentTotal: totalInstallments, categoryId,
    })
  retorna registros
```

Diferença chave para `buildInstallments`: não recebe um valor total pra dividir — a fatura já mostra o valor da parcela individual, então cada registro gerado usa esse mesmo valor diretamente (sem arredondamento de centavos a resolver).

## Heurística de categoria (`category-suggester.ts`)

Dicionário estático `bucket → palavras-chave`, usando os mesmos nomes das 10 categorias padrão já semeadas nesta sessão:

| balde | palavras-chave (exemplos) |
|---|---|
| Transporte | uber, 99, taxi, combustível, posto |
| Mercado | supermercado, mercado, atacad |
| Delivery | ifood, rappi, delivery |
| Lazer | cinema, ingresso, steam, playstation, xbox, bar |
| Assinaturas | netflix, spotify, amazon prime, hbo, disney |
| Saúde | farmacia, drogaria, droga, clinica |
| Vestuário | renner, riachuelo, zara, C&A |
| Educação | udemy, alura, faculdade, escola |
| Casa | leroy, telhanorte, condominio |

`suggestCategory(description, userCategories)`: normaliza a descrição (minúsculo, sem acento), varre os baldes por palavra-chave, se achar um balde só considera match se o usuário tiver uma categoria com nome igual/muito parecido ao balde — nunca cria categoria nova, nunca sugere uma categoria que o usuário não tem. Sem match → `null` (usuário escolhe na revisão).

## Endpoints backend

`modules/cards`:
- `GET /cards` — lista cartões do usuário.
- `POST /cards` — cria cartão manualmente `{ name, lastDigits? }`.
- `POST /cards/statement-preview` — multipart (`file`), roda o pipeline acima, devolve `StatementImportPreview`. Não persiste nada.
- `POST /cards/statement-confirm` — recebe a lista revisada; cria cartões novos, cria despesas (fixa se `isRecurring`, variável — com `remaining-installments.factory` se parcelado — senão) só para itens com `include: true`.

## Frontend

- Rota `app/cartoes/page.tsx` → `modules/cards/components/CardsPage.tsx`.
- `NewCardModal.tsx`: cadastro manual.
- `StatementUploadModal.tsx`: input de arquivo PDF, chama `statement-preview`.
- `StatementReviewModal.tsx`: popup grande, agrupado por cartão detectado, tabela editável por linha (descrição, valor, categoria, recorrente, incluir), indicador visual de parcela. Botão "Confirmar importação" chama `statement-confirm`.
- `modules/cards/api/cards.ts`, hooks `useCards`, `useCreateCard`, `useUploadStatementPreview`, `useConfirmStatementImport`.
- Adicionar "Cartões" ao `Sidebar.tsx` e ao acesso rápido da Início.

## Tipos compartilhados

- `Card`, `CreateCardInput`.
- `StatementTransactionPreview`, `StatementImportPreview`, `ConfirmStatementImportInput`.
- `VariableExpense`/`FixedExpense` e seus DTOs ganham `cardId: string | null`.

## Padrões de projeto aplicados

- **Adapter**: `pdf-text-extractor.ts` isola a lib `pdf-parse` do resto do domínio (mesmo espírito de `VehiclePricingProvider` da Fase 7).
- **Factory**: `remaining-installments.factory.ts`, variante de `buildInstallments` (Fase 2) para o caso "parcela no meio da série".
- **Repository**: `CardsRepository` encapsulando Supabase, mesmo padrão de todos os módulos anteriores.
- Reaproveitamento explícito: `CategoriesModule` (lista de categorias do usuário) e `ExpensesModule` (`VariableExpensesRepository`/`FixedExpensesRepository`, já existentes desde a Fase 2) são importados pelo `CardsModule` — nenhuma lógica de persistência de despesa é duplicada.
