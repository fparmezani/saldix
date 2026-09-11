# Fase 1 — Receitas — Tasks

## Backend
- [ ] Migration: criar tabela `incomes` (colunas conforme design.md) + RLS por `user_id`
- [ ] Migration: criar tabela `future_receivables` (colunas conforme design.md) + RLS por `user_id`
- [ ] Criar módulo Nest `modules/incomes` (module, controller, service, repository, dto)
- [ ] Endpoint `GET /incomes?month=` com filtro por mês e usuário autenticado
- [ ] Endpoint `POST /incomes` com validação de DTO
- [ ] Endpoint `PATCH /incomes/:id` e `DELETE /incomes/:id`
- [ ] Criar módulo Nest `modules/future-receivables` (ou submódulo dentro de incomes)
- [ ] Endpoint `GET /future-receivables?month=`
- [ ] Endpoint `POST /future-receivables` com validação `expectedDate >= hoje`
- [ ] Endpoint `PATCH /future-receivables/:id/confirm` (cria `incomes` correspondente via factory)
- [ ] Endpoint `PATCH /future-receivables/:id/reschedule`
- [ ] Emitir evento `future-receivable.confirmed` via `EventEmitter2`
- [ ] Testes unitários: cálculo de % por tipo de renda, criação de income a partir de receivable confirmado, validação de data futura

## Frontend
- [ ] Criar tipos/schemas em `packages/shared-types` (`Income`, `FutureReceivable`, schemas Zod)
- [ ] Criar rota `app/orcamento/page.tsx` (fina)
- [ ] Criar `modules/budget/components/BudgetPage.tsx` com abas (Receita ativa, outras desabilitadas nesta fase)
- [ ] Criar `modules/budget/components/MonthNavigator.tsx`
- [ ] Criar `modules/budget/components/IncomeTab.tsx` + lista de rendas
- [ ] Criar `modules/budget/components/NewIncomeModal.tsx`
- [ ] Criar `modules/budget/components/NewFutureReceivableModal.tsx`
- [ ] Criar `modules/budget/components/FutureReceivablesList.tsx` com ações confirmar/reagendar
- [ ] Criar `modules/budget/components/IncomeDonutChart.tsx` (Recharts)
- [ ] Criar `modules/budget/api/incomes.ts` e `future-receivables.ts` (clients HTTP)
- [ ] Criar hooks TanStack Query (`useIncomes`, `useFutureReceivables`, `useCreateIncome`, `useConfirmReceivable`, `useRescheduleReceivable`)
- [ ] Teste de componente: cálculo de % exibido no gráfico com 1 e 2 tipos de renda
- [ ] Teste de componente: recebimento futuro não soma no mês atual, soma após confirmação

## Verificação end-to-end desta fase
- [ ] Cadastrar renda principal de R$5.000 em setembro/2026 e ver refletido no card Receita
- [ ] Adicionar renda extra de R$350 e ver % recalculado no gráfico
- [ ] Criar recebimento futuro para 01/10/2026 e confirmar que não aparece na receita de setembro
- [ ] Navegar para outubro/2026 e confirmar o recebimento — valor deve somar na receita de outubro
- [ ] Reagendar um recebimento futuro pendente para outro mês e confirmar que ele "migra" de mês
