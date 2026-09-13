# Fase 5 — Metas — Tasks

## Backend
- [x] Migration: `goals` + RLS
- [x] Migration: `goal_contributions` + RLS (FK com `on delete cascade` — excluir a meta remove os aportes dela, diferente da Reserva de Emergência que não tem esse conceito de "meta pai")
- [x] `GoalsService.getAllWithStatus` / cálculo isolado em `calculateGoalStatus` (função pura, mesmo padrão das fases anteriores)
- [x] Endpoints CRUD de `goals` + endpoints de `contributions`
- [x] Emitir evento `goal.completed` ao atingir 100% (em `GoalContributionsService.create`)
- [x] Testes unitários: cálculo mensal necessário (24 meses, mês parcial arredondado pra cima, piso de 1 mês), % de progresso com 1 casa decimal (10,4% — não arredondado pra inteiro, diferente das outras fases), marcação de atrasada, cap em 100%, transição para `completed` + não repetir o evento se já completa — 10 testes novos

## Frontend
- [x] Tipos/schemas `Goal`, `GoalWithStatus`, `GoalContribution`
- [x] Rota `app/metas/page.tsx`
- [x] `GoalCard.tsx` (badges Concluída/Atrasada, barra de progresso, "guardar Rx/mês")
- [x] `NewGoalModal.tsx`, `AddContributionModal.tsx`
- [x] `api/goals.ts` + hooks
- [x] Habilitado link "Metas" no Sidebar e na Início
- [ ] `EditGoalModal.tsx` — **não implementado nesta rodada** (não crítico para o fluxo principal; editar exigiria reabrir o NewGoalModal com dados pré-preenchidos, fica pra um polish futuro se o usuário pedir)
- [ ] Teste de componente: card exibe corretamente valor mensal necessário e badge de atrasada/concluída (cobertura via teste de backend; teste de componente não escrito nesta rodada)

## Verificação end-to-end desta fase
- [x] Backend: build limpo, 51 testes unitários passando (41 anteriores + 10 novos)
- [x] Frontend: build limpo, rota `/metas` funcional, guard retornando 401 sem token
- [ ] Criar meta "Viagem para a neve", R$25.000, 24 meses → confirmar sugestão ~R$1.041,67/mês — pendente teste manual do usuário
- [ ] Registrar aporte de R$2.600 → confirmar 10,4% de progresso — pendente teste manual
- [ ] Criar segunda meta e confirmar que aportes de uma não afetam a outra — pendente teste manual
- [ ] Simular meta com data no passado e progresso < 100% → confirmar indicador de atrasada — pendente teste manual
- [ ] Aportar até completar 100% → confirmar mudança de status para concluída — pendente teste manual
