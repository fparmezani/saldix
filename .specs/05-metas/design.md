# Fase 5 — Metas — Design

## Entidades / Tabelas

### `goals`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| name | text | |
| target_amount | numeric(12,2) | |
| target_date | date | |
| status | enum text: `active` \| `completed` | atualizado automaticamente ao atingir 100% |
| created_at / updated_at | timestamptz | |

### `goal_contributions`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| goal_id | uuid, fk goals | |
| user_id | uuid, fk | redundante para RLS direta sem join |
| amount | numeric(12,2) | |
| contributed_at | date | |
| created_at | timestamptz | |

RLS: `user_id = auth.uid()` em ambas.

## Regras de cálculo

```
monthsRemaining = max(1, ceil(monthsBetween(today, targetDate)))
monthlyRequired = targetAmount / monthsRemaining
totalContributed = sum(goal_contributions.amount para essa goal)
progressPercentage = min(100, round(totalContributed / targetAmount * 100))
isOverdue = targetDate < today && progressPercentage < 100
```

Centralizado em `GoalsService.getStatus(goalId)` / `getAllWithStatus(userId)`.

Ao registrar um aporte que faz `totalContributed >= targetAmount`, o serviço atualiza `goals.status = 'completed'` (evento `goal.completed` emitido para eventual notificação futura).

## Endpoints backend

`modules/goals`:
- `GET /goals` — lista todas com status calculado
- `POST /goals` — `{ name, targetAmount, targetDate }`
- `PATCH /goals/:id`, `DELETE /goals/:id`
- `GET /goals/:id/contributions`
- `POST /goals/:id/contributions` — `{ amount, contributedAt }`

## Frontend

- Rota `app/metas/page.tsx` → `modules/goals/components/GoalsPage.tsx`.
- `GoalCard.tsx`: nome, barra de progresso, "guardar R$X/mês", indicador de atrasada/concluída.
- `NewGoalModal.tsx`, `EditGoalModal.tsx`.
- `AddContributionModal.tsx` (seleciona a meta ao abrir a partir do card correspondente).
- `modules/goals/api/goals.ts`, hooks `useGoals`, `useCreateGoal`, `useAddContribution`.

## Tipos compartilhados

- `Goal`, `GoalStatus` (com campos calculados: `monthlyRequired`, `progressPercentage`, `isOverdue`), `GoalContribution`.

## Padrões de projeto aplicados

- **Repository** para `goals`/`goal_contributions`.
- **Observer/Event**: `goal.completed` emitido via `EventEmitter2` ao bater 100%, desacoplando de uma futura notificação (fora de escopo agora, mas a estrutura já permite).
