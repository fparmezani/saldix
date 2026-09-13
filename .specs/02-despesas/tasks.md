# Fase 2 — Despesas Fixas e Variáveis — Tasks

## Backend
- [x] Migration: tabela `categories` + RLS
- [x] Migration: tabela `fixed_expenses` + RLS
- [x] Migration: tabela `variable_expenses` (com campos de parcelamento) + RLS
- [x] Módulo Nest `modules/categories` (CRUD completo)
- [x] Bloquear DELETE de categoria com despesas vinculadas (retornar erro amigável) — testado em `categories.service.spec.ts`
- [x] Módulo Nest `modules/expenses` com sub-rotas fixed/variable
- [x] Implementar `buildInstallments` (Factory) com testes de arredondamento de centavos
- [x] Endpoint `POST /expenses/variable` usando a Factory quando `installments` informado
- [x] Endpoints de listagem com filtro por mês e por categoria
- [x] Testes unitários: geração de parcelas (divisível, não divisível, rollover de mês em dia 31, remainder de 1 centavo) — 5 testes na factory
- [x] `@HttpCode(204)` em todos os DELETE (lição da Fase 1 — evita corpo vazio quebrando `response.json()` no frontend)

## Frontend
- [x] Tipos/schemas em `packages/shared-types` (`Category`, `FixedExpense`, `VariableExpense`)
- [x] `CategoriesManager.tsx` (criar/excluir nome+cor, paleta de cores predefinida)
- [x] `FixedExpensesTab.tsx` + `NewFixedExpenseModal.tsx`
- [x] `VariableExpensesTab.tsx` + `NewVariableExpenseModal.tsx` com toggle parcelado (mostra preview "Nx de R$Y")
- [x] `ExpensesFilterBar.tsx` (filtro por categoria)
- [x] `ExpensesByCategoryChart.tsx` (Recharts donut)
- [x] Atualizar `BudgetPage.tsx` — abas Despesa Fixa/Variável habilitadas, cards Receita/Despesas/Saldo somando dados reais (Fase 1 + Fase 2)
- [x] `api/categories.ts`, `api/fixed-expenses.ts`, `api/variable-expenses.ts` + hooks TanStack Query
- [ ] Teste de componente: formulário parcelado exibindo corretamente "1/5", "2/5"... (cobertura via teste de backend da factory; teste de componente de UI não escrito nesta rodada)
- [ ] Teste de componente: filtro por categoria reduzindo a lista exibida (mesma observação acima)

## Verificação end-to-end desta fase
- [x] Backend: build limpo, 23 testes unitários passando (16 anteriores + 7 novos desta fase)
- [x] Frontend: build limpo, rota `/orcamento` com as 3 abas funcionais
- [ ] Criar categoria "Casa" (cor azul) e "Lazer" (cor verde) — pendente teste manual do usuário
- [ ] Lançar despesa fixa "Aluguel" R$1.330, vencimento dia 10, categoria Casa — pendente teste manual
- [ ] Lançar despesa variável parcelada "Roupa" R$200 em 5x — confirmar 5 registros com labels corretos em meses consecutivos — pendente teste manual
- [ ] Filtrar despesas variáveis por categoria "Lazer" no mês atual e confirmar resultado — pendente teste manual
- [ ] Confirmar que o card "Saldo" reflete receita (Fase 1) menos despesas fixas+variáveis do mês — pendente teste manual
