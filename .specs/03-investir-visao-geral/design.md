# Fase 3 — Investir + Visão Geral — Design

## Entidade / Tabela

### `budget_settings`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| reference_month | date | um registro por mês (upsert) |
| invest_mode | enum text: `percentage` \| `fixed` | |
| invest_percentage | numeric(5,2) nullable | usado quando `invest_mode = percentage`, default 20.00 |
| invest_fixed_amount | numeric(12,2) nullable | usado quando `invest_mode = fixed` |
| created_at / updated_at | timestamptz | |

Regra: se não existir registro para o mês, o backend assume `invest_mode = percentage`, `invest_percentage = 20` (padrão do sistema, não persistido até o usuário salvar algo).

## Cálculo de saldo (Service, não Strategy — é só uma fórmula, não múltiplas estratégias intercambiáveis)

```
totalIncome = sum(incomes do mês) + sum(future_receivables confirmados no mês)
totalExpenses = sum(fixed_expenses do mês) + sum(variable_expenses do mês)
investAmount = invest_mode === 'fixed'
  ? invest_fixed_amount
  : totalIncome * (invest_percentage / 100)
balance = totalIncome - totalExpenses - investAmount
```//
Centralizado em `BudgetSummaryService.calculate(month)`, reusado pela tela de Orçamento e pela tela Início (card "Saldo do mês").

## Endpoints backend

`modules/budget`:
- `GET /budget/settings?month=` — retorna configuração do mês (ou default).
- `PUT /budget/settings` — upsert `{ referenceMonth, investMode, investPercentage?, investFixedAmount? }`.
- `GET /budget/summary?month=` — retorna `{ totalIncome, totalExpenses, investAmount, balance }` (usa `BudgetSummaryService`).
- `GET /budget/overview?months=3|6|12` — retorna série mensal `[{ month, totalIncome, totalExpenses }]` para o gráfico de Visão Geral.

## Frontend

- `modules/budget/components/InvestBlock.tsx`: slider/input de %, opção "valor fixo", exibe valor calculado.
- Atualizar `BudgetSummaryCards.tsx` para consumir `GET /budget/summary` (fonte única de verdade do saldo).
- Nova rota `app/visao-geral/page.tsx` → `modules/overview/components/OverviewPage.tsx`.
- `modules/overview/components/PeriodSelector.tsx` (mês atual / 3 / 6 / 12 meses).
- `modules/overview/components/IncomeExpenseLineChart.tsx` (Recharts `LineChart`, linha verde = receita, vermelha = despesa).
- `modules/overview/api/overview.ts`, hook `useOverview(months)`.
- `modules/budget/api/budget-settings.ts`, hooks `useBudgetSettings(month)`, `useUpdateBudgetSettings`, `useBudgetSummary(month)`.

## Tipos compartilhados

- `BudgetSettings`, `BudgetSummary`, `OverviewPoint` em `packages/shared-types`.

## Padrões de projeto aplicados

- **Repository** para `budget_settings`.
- Cálculo de resumo isolado em um único `Service` (fonte única de verdade), evitando duplicar a fórmula de saldo em frontend e backend — o frontend sempre consome o valor já calculado pela API, nunca recalcula localmente.
