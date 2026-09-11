# Fase 1 — Receitas — Design

## Entidades / Tabelas (Supabase Postgres)

### `incomes`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | default `gen_random_uuid()` |
| user_id | uuid, fk auth.users | RLS filtra por este campo |
| type | enum text: `main` \| `extra` | renda principal ou extra |
| description | text | ex: "Salário", "Venda de bolo de pote" |
| amount | numeric(12,2) | |
| reference_month | date | primeiro dia do mês de referência (ex: 2026-09-01) |
| created_at | timestamptz | default now() |

### `future_receivables`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| description | text | |
| amount | numeric(12,2) | |
| expected_date | date | deve ser data futura no momento da criação |
| status | enum text: `pending` \| `received` | default `pending` |
| received_at | timestamptz nullable | preenchido ao confirmar |
| income_type | enum text: `main` \| `extra` | usado para % ao ser confirmado |
| created_at | timestamptz | |

Regra: ao marcar `status = received`, o backend cria automaticamente um registro correspondente em `incomes` com `reference_month` = mês de `expected_date` (ou da nova data, se reagendado), e mantém o vínculo (`future_receivable_id` opcional em `incomes` para rastreabilidade).

RLS: policy padrão `user_id = auth.uid()` para select/insert/update/delete em ambas as tabelas.

## Endpoints backend (`modules/incomes`, dentro do módulo maior `budget` do Nest ou módulo próprio `incomes`)

- `GET /incomes?month=2026-09` — lista rendas do mês.
- `POST /incomes` — cria renda (principal ou extra). Body: `{ type, description, amount, referenceMonth }`.
- `PATCH /incomes/:id` — edita.
- `DELETE /incomes/:id` — remove.
- `GET /future-receivables?month=2026-10` — lista recebimentos futuros de um mês (por `expected_date`).
- `POST /future-receivables` — cria. Body: `{ description, amount, expectedDate, incomeType }`. Validação: `expectedDate` deve ser >= hoje.
- `PATCH /future-receivables/:id/confirm` — marca como recebido (dispara criação de `incomes`).
- `PATCH /future-receivables/:id/reschedule` — Body: `{ newExpectedDate }`.

## Frontend

- Rota: `app/orcamento/page.tsx` (fina) → renderiza `modules/budget/components/BudgetPage` com abas (Receita | Despesa Fixa | Despesa Variável) — nesta fase só a aba **Receita** é funcional.
- `modules/budget/components/IncomeTab.tsx`: lista de rendas do mês + botão "Adicionar" (renda principal/extra) + botão "Recebimento futuro".
- `modules/budget/components/NewIncomeModal.tsx`: formulário (tipo, descrição, valor).
- `modules/budget/components/NewFutureReceivableModal.tsx`: formulário (descrição, valor, data prevista, tipo de renda).
- `modules/budget/components/FutureReceivablesList.tsx`: lista com indicador visual "pendente" (ícone relógio) e ações "Marcar como recebido" / "Reagendar".
- `modules/budget/components/IncomeDonutChart.tsx`: gráfico Recharts (PieChart) com % renda principal vs extra.
- Navegação mês a mês: componente `modules/budget/components/MonthNavigator.tsx` (usado também nas fases seguintes do Orçamento), estado da URL via query param `?month=2026-09`.
- `modules/budget/api/incomes.ts` e `future-receivables.ts`: clients HTTP tipados (usando tipos de `packages/shared-types`).
- Hooks TanStack Query: `useIncomes(month)`, `useFutureReceivables(month)`, `useCreateIncome`, `useConfirmReceivable`, `useRescheduleReceivable`.

## Tipos compartilhados (`packages/shared-types`)

- `Income` (id, userId, type, description, amount, referenceMonth, createdAt).
- `FutureReceivable` (id, userId, description, amount, expectedDate, status, receivedAt, incomeType, createdAt).
- Schemas Zod `createIncomeSchema`, `createFutureReceivableSchema` para validar tanto no frontend (form) quanto no backend (DTO).

## Padrões de projeto aplicados

- **Factory** implícita: função `buildIncomeFromReceivable(receivable, confirmedDate)` centraliza a criação do registro de `incomes` a partir de um `future_receivable` confirmado — evita duplicar essa lógica em múltiplos pontos.
- **Observer/Event**: ao confirmar um recebimento futuro, o `FutureReceivablesService` emite `future-receivable.confirmed`; o cálculo de saldo/resumo do mês (Fase 3) escuta esse evento para invalidar cache, em vez de acoplamento direto.
