# Fase 1 — Receitas — Tasks

## Backend
- [x] Migration: criar tabela `incomes` (colunas conforme design.md) + RLS por `user_id`
- [x] Migration: criar tabela `future_receivables` (colunas conforme design.md) + RLS por `user_id`
- [x] Criar módulo Nest `modules/incomes` (module, controller, service, repository, dto)
- [x] Endpoint `GET /incomes?month=` com filtro por mês e usuário autenticado
- [x] Endpoint `POST /incomes` com validação de DTO
- [x] Endpoint `PATCH /incomes/:id` e `DELETE /incomes/:id`
- [x] Criar módulo Nest `modules/future-receivables` (submódulo dentro de incomes)
- [x] Endpoint `GET /future-receivables?month=`
- [x] Endpoint `POST /future-receivables` com validação `expectedDate >= hoje`
- [x] Endpoint `PATCH /future-receivables/:id/confirm` (cria `incomes` correspondente via factory)
- [x] Endpoint `PATCH /future-receivables/:id/reschedule`
- [x] Emitir evento `future-receivable.confirmed` via `EventEmitter2`
- [x] Testes unitários: cálculo de % por tipo de renda, criação de income a partir de receivable confirmado (5 testes passando)
- [x] Implementado antecipadamente (necessário para testar): `SupabaseAuthGuard` global (`shared/guards`) + `SupabaseService` (`shared/supabase`) — reaproveitado formalmente na Fase 8

## Backend — Rendas recorrentes (income_schedules)
- [x] Migration: criar tabela `income_schedules` + RLS por `user_id`
- [x] Migration: adicionar coluna `income_schedule_id` (nullable, fk) em `incomes`
- [x] Criar tipos `IncomeSchedule`, `CreateIncomeScheduleDto` em `packages/shared-types`
- [x] Criar `IncomeSchedulesRepository` (Repository pattern, igual aos demais)
- [x] Factory `resolveOccurrenceDate(recurrenceDay, referenceMonth)` com teste unitário (dia normal, dia 31 em mês de 30/28/29 dias, ano bissexto)
- [x] `IncomeSchedulesService.ensureGeneratedForMonth(userId, referenceMonth)` — geração lazy idempotente
- [x] Teste unitário: gera ocorrência quando não existe; não duplica quando já existe; ignora schedules inativos
- [x] `IncomesService.listByMonth` chama `ensureGeneratedForMonth` antes de buscar
- [x] Endpoint `GET /income-schedules`
- [x] Endpoint `POST /income-schedules`
- [x] Endpoint `PATCH /income-schedules/:id` (amount, recurrenceDay, active)
- [x] Registrar `IncomeSchedulesController`/`Service`/`Repository` no `IncomesModule`

## Frontend
- [x] Criar tipos/schemas em `packages/shared-types` (`Income`, `FutureReceivable`, schemas Zod)
- [x] Criar rota `app/orcamento/page.tsx` (fina)
- [x] Criar `modules/budget/components/BudgetPage.tsx` com abas (Receita ativa, outras desabilitadas nesta fase)
- [x] Criar `modules/budget/components/MonthNavigator.tsx`
- [x] Criar `modules/budget/components/IncomeTab.tsx` + lista de rendas
- [x] Criar `modules/budget/components/NewIncomeModal.tsx`
- [x] Criar `modules/budget/components/NewFutureReceivableModal.tsx`
- [x] Criar `modules/budget/components/FutureReceivablesList.tsx` com ações confirmar/reagendar
- [x] Criar `modules/budget/components/IncomeDonutChart.tsx` (Recharts)
- [x] Criar `modules/budget/api/incomes.ts` e `future-receivables.ts` (clients HTTP)
- [x] Criar hooks TanStack Query (`useIncomes`, `useFutureReceivables`, `useCreateIncome`, `useConfirmFutureReceivable`, `useRescheduleFutureReceivable`)
- [x] Implementado antecipadamente (necessário para testar): `LoginForm.tsx` + `app/login/page.tsx`, `supabase-browser.ts`, `api-client.ts`, `QueryProvider.tsx` — reaproveitado formalmente na Fase 8
- [ ] Teste de componente: cálculo de % exibido no gráfico com 1 e 2 tipos de renda
- [ ] Teste de componente: recebimento futuro não soma no mês atual, soma após confirmação

## Frontend — Rendas recorrentes (income_schedules)
- [x] Adicionar toggle "Renda recorrente" em `NewIncomeModal.tsx` — troca formulário para `{ amount, recurrenceDay }`
- [x] Criar `modules/budget/api/income-schedules.ts` (client HTTP)
- [x] Criar hooks `useIncomeSchedules`, `useCreateIncomeSchedule`, `useToggleIncomeSchedule`
- [x] ~~Criar `IncomeSchedulesList.tsx` (lista separada)~~ — **removido** após feedback do usuário ("duas listas" confuso). Substituído por ação inline na própria linha da lista principal (ver `IncomeTab.tsx`: botão de lixeira em renda recorrente desativa a recorrência + remove a ocorrência do mês numa única confirmação).
- [x] Regra de exclusão corrigida: backend só bloqueia excluir uma ocorrência se a renda recorrente vinculada ainda estiver **ativa** (antes bloqueava para sempre, mesmo desativada) — `IncomeSchedulesService.isActive`, testado em `incomes.service.spec.ts`

## Verificação end-to-end desta fase
- [x] Backend: build limpo (`pnpm --filter backend build`), testes unitários passando, `GET /health` ok, guard retorna 401 sem token
- [x] Frontend: build limpo (`pnpm --filter frontend build`), rotas `/`, `/login`, `/orcamento` respondendo 200 em dev
- [ ] Cadastrar renda principal de R$5.000 em setembro/2026 e ver refletido no card Receita — **pendente teste manual do usuário (login com credencial própria)**
- [ ] Adicionar renda extra de R$350 e ver % recalculado no gráfico — pendente teste manual
- [ ] Criar recebimento futuro para 01/10/2026 e confirmar que não aparece na receita de setembro — pendente teste manual
- [ ] Navegar para outubro/2026 e confirmar o recebimento — valor deve somar na receita de outubro — pendente teste manual
- [ ] Reagendar um recebimento futuro pendente para outro mês e confirmar que ele "migra" de mês — pendente teste manual
- [x] Cadastrar renda recorrente e ver aparecer automaticamente na lista (geração lazy validada — mecanismo coberto por teste unitário + confirmado manualmente)
- [x] Cadastrar duas rendas recorrentes distintas ("Teste A" dia 10, "Teste B" dia 20) e confirmar que ambas aparecem corretamente no mesmo mês — testado manualmente 2026-09-12
- [x] Excluir/parar uma renda recorrente e confirmar que só ela some, sem afetar a outra — testado manualmente 2026-09-12 ("Teste A" removido, "Teste B" permaneceu intacto)
