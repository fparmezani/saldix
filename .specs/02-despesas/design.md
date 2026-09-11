# Fase 2 — Despesas Fixas e Variáveis — Design

## Entidades / Tabelas

### `categories`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| name | text | único por usuário |
| color | text | hex, ex `#7C3AED` |
| created_at | timestamptz | |

### `fixed_expenses`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| category_id | uuid, fk categories | |
| description | text | ex: "Aluguel" |
| amount | numeric(12,2) | |
| due_day | int | 1–31 |
| reference_month | date | mês em que essa despesa fixa vale |
| created_at | timestamptz | |

### `variable_expenses`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| category_id | uuid, fk categories | |
| description | text | |
| amount | numeric(12,2) | valor da parcela (se parcelado) ou valor total (se não) |
| expense_date | date | |
| installment_group_id | uuid nullable | agrupa parcelas de uma mesma compra |
| installment_number | int nullable | 1..N |
| installment_total | int nullable | N |
| created_at | timestamptz | |

RLS: `user_id = auth.uid()` em todas.

## Regra de parcelamento (Factory)

Ao criar uma despesa variável com `parcelado = true`, `totalAmount` e `installments` (N):
1. `installmentGroupId = uuid()`.
2. Para `i` de 1 a N: cria um registro em `variable_expenses` com `amount = totalAmount / N` (arredondamento: últimas parcelas absorvem a diferença de centavos), `expense_date = dataBase + i-1 meses`, `installment_number = i`, `installment_total = N`.
3. Centralizado em `ExpensesFactory.buildInstallments(input): VariableExpense[]` — reutilizado por qualquer entrada (form único, futura importação).

## Endpoints backend

`modules/categories`:
- `GET /categories`
- `POST /categories` — `{ name, color }`
- `PATCH /categories/:id`
- `DELETE /categories/:id` (bloqueado com erro amigável se houver despesas vinculadas)

`modules/expenses` (fixas e variáveis):
- `GET /expenses/fixed?month=`
- `POST /expenses/fixed` — `{ description, amount, dueDay, categoryId, referenceMonth }`
- `PATCH /expenses/fixed/:id`, `DELETE /expenses/fixed/:id`
- `GET /expenses/variable?month=&categoryId=`
- `POST /expenses/variable` — `{ description, amount, date, categoryId, installments? }` (se `installments` presente, usa a Factory)
- `PATCH /expenses/variable/:id`, `DELETE /expenses/variable/:id` (deletar 1 parcela não afeta as demais; deletar "grupo" é ação explícita separada)

## Frontend

- `modules/budget/components/CategoriesManager.tsx`: modal de gerenciar categorias (lista + criar/editar cor e nome).
- `modules/budget/components/FixedExpensesTab.tsx` + `NewFixedExpenseModal.tsx`.
- `modules/budget/components/VariableExpensesTab.tsx` + `NewVariableExpenseModal.tsx` (com toggle "Parcelado" revelando campo N parcelas).
- `modules/budget/components/ExpensesFilterBar.tsx`: filtro por categoria + mês, reutilizado na aba variável.
- `modules/budget/components/ExpensesByCategoryChart.tsx`: gráfico de % por categoria (Recharts).
- Atualização de `modules/budget/components/BudgetSummaryCards.tsx` (Receita/Despesas/Saldo) — agora consome incomes (Fase 1) + fixed/variable expenses.
- `modules/budget/api/categories.ts`, `modules/budget/api/expenses.ts`.
- Hooks: `useCategories`, `useCreateCategory`, `useFixedExpenses`, `useVariableExpenses`, `useCreateVariableExpense` (lida com parcelamento).

## Tipos compartilhados

- `Category`, `FixedExpense`, `VariableExpense` (com campos de parcelamento opcionais) em `packages/shared-types`.
- Schema Zod `createVariableExpenseSchema` com refinamento: se `installments` informado, deve ser inteiro >= 2.

## Padrões de projeto aplicados

- **Factory**: `ExpensesFactory.buildInstallments` (ver acima).
- **Repository**: `CategoriesRepository`, `FixedExpensesRepository`, `VariableExpensesRepository` encapsulando Supabase.
