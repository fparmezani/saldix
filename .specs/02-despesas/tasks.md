# Fase 2 — Despesas Fixas e Variáveis — Tasks

## Backend
- [ ] Migration: tabela `categories` + RLS
- [ ] Migration: tabela `fixed_expenses` + RLS
- [ ] Migration: tabela `variable_expenses` (com campos de parcelamento) + RLS
- [ ] Módulo Nest `modules/categories` (CRUD completo)
- [ ] Bloquear DELETE de categoria com despesas vinculadas (retornar erro amigável)
- [ ] Módulo Nest `modules/expenses` com sub-rotas fixed/variable
- [ ] Implementar `ExpensesFactory.buildInstallments` com testes de arredondamento de centavos
- [ ] Endpoint `POST /expenses/variable` usando a Factory quando `installments` informado
- [ ] Endpoints de listagem com filtro por mês e por categoria
- [ ] Testes unitários: geração de parcelas (2x, 3x, valores não divisíveis por N), filtro por categoria/mês

## Frontend
- [ ] Tipos/schemas em `packages/shared-types` (`Category`, `FixedExpense`, `VariableExpense`)
- [ ] `CategoriesManager.tsx` (criar/editar nome+cor)
- [ ] `FixedExpensesTab.tsx` + `NewFixedExpenseModal.tsx`
- [ ] `VariableExpensesTab.tsx` + `NewVariableExpenseModal.tsx` com toggle parcelado
- [ ] `ExpensesFilterBar.tsx` (categoria + mês)
- [ ] `ExpensesByCategoryChart.tsx`
- [ ] Atualizar `BudgetSummaryCards.tsx` para somar despesas fixas+variáveis
- [ ] `api/categories.ts`, `api/expenses.ts` + hooks TanStack Query
- [ ] Teste de componente: formulário parcelado exibindo corretamente "1/5", "2/5"...
- [ ] Teste de componente: filtro por categoria reduzindo a lista exibida

## Verificação end-to-end desta fase
- [ ] Criar categoria "Casa" (cor azul) e "Lazer" (cor verde)
- [ ] Lançar despesa fixa "Aluguel" R$1.330, vencimento dia 10, categoria Casa
- [ ] Lançar despesa variável parcelada "Roupa" R$200 em 5x — confirmar 5 registros com labels corretos em meses consecutivos
- [ ] Filtrar despesas variáveis por categoria "Lazer" no mês atual e confirmar resultado
- [ ] Confirmar que o card "Saldo" reflete receita (Fase 1) menos despesas fixas+variáveis do mês
