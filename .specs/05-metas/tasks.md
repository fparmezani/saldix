# Fase 5 — Metas — Tasks

## Backend
- [ ] Migration: `goals` + RLS
- [ ] Migration: `goal_contributions` + RLS
- [ ] `GoalsService.getStatus` / `getAllWithStatus` (cálculo de mensal necessário, %, atrasada)
- [ ] Endpoints CRUD de `goals` + endpoints de `contributions`
- [ ] Emitir evento `goal.completed` ao atingir 100%
- [ ] Testes unitários: cálculo mensal necessário (datas variadas), % de progresso, marcação de atrasada, transição para `completed`

## Frontend
- [ ] Tipos/schemas `Goal`, `GoalStatus`, `GoalContribution`
- [ ] Rota `app/metas/page.tsx`
- [ ] `GoalCard.tsx`, `NewGoalModal.tsx`, `EditGoalModal.tsx`, `AddContributionModal.tsx`
- [ ] `api/goals.ts` + hooks
- [ ] Teste de componente: card exibe corretamente valor mensal necessário e badge de atrasada/concluída

## Verificação end-to-end desta fase
- [ ] Criar meta "Viagem para a neve", R$25.000, 24 meses → confirmar sugestão ~R$1.041,67/mês
- [ ] Registrar aporte de R$2.600 → confirmar 10,4% de progresso
- [ ] Criar segunda meta e confirmar que aportes de uma não afetam a outra
- [ ] Simular meta com data no passado e progresso < 100% → confirmar indicador de atrasada
- [ ] Aportar até completar 100% → confirmar mudança de status para concluída
