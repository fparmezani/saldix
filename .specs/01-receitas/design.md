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

### `income_schedules` (rendas recorrentes)
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | RLS filtra por este campo |
| type | enum text: `main` \| `extra` | |
| description | text | ex: "Salário", "Consultoria — 1ª parcela" |
| amount | numeric(12,2) | valor de cada ocorrência |
| recurrence_day | smallint (1–31) | dia fixo do mês; se o mês tiver menos dias, usa o último dia do mês (ex: dia 31 em fevereiro → 28/29) |
| active | boolean | default `true`; `false` = para de gerar novas ocorrências, mas não apaga histórico |
| created_at | timestamptz | |

Uma renda que se repete 2x/mês (ex: dias 1 e 15) vira **duas** linhas em `income_schedules`, cada uma com seu próprio `recurrence_day` e `amount` — evita modelar array de dias e mantém cada ocorrência independente (permite valores diferentes por parcela, desativar uma sem afetar a outra).

`incomes` ganha uma coluna nova:
| coluna | tipo | notas |
|---|---|---|
| income_schedule_id | uuid nullable, fk `income_schedules(id)` | preenchido quando a linha foi gerada automaticamente por uma renda recorrente |

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

RLS: policy padrão `user_id = auth.uid()` para select/insert/update/delete em todas as três tabelas (`incomes`, `future_receivables`, `income_schedules`).

## Geração automática das ocorrências de renda recorrente

Estratégia: **geração preguiçosa (lazy) no read**, sem cron job. Sempre que `GET /incomes?month=X` é chamado:

1. `IncomeSchedulesService.ensureGeneratedForMonth(userId, referenceMonth)` busca todas as `income_schedules` ativas do usuário.
2. Para cada schedule, verifica (via `income_schedule_id` + `reference_month`) se já existe uma linha em `incomes` para aquele mês. Se não existir, cria uma (idempotente — nunca duplica).
3. A data-dia usada é `min(recurrence_day, último dia do referenceMonth)` (Factory `resolveOccurrenceDate`).
4. Só então a query normal de `incomes` do mês é executada e retornada.

Isso garante que, mesmo sem nunca ter "visitado" outubro antes, ao abrir a tela de outubro as rendas recorrentes já aparecem geradas corretamente.

## Endpoints backend (`modules/incomes`, dentro do módulo maior `budget` do Nest ou módulo próprio `incomes`)

- `GET /incomes?month=2026-09` — gera ocorrências pendentes de rendas recorrentes (ver acima) e lista rendas do mês.
- `POST /incomes` — cria renda avulsa (principal ou extra). Body: `{ type, description, amount, referenceMonth }`.
- `PATCH /incomes/:id` — edita.
- `DELETE /incomes/:id` — remove.
- `GET /future-receivables?month=2026-10` — lista recebimentos futuros de um mês (por `expected_date`).
- `POST /future-receivables` — cria. Body: `{ description, amount, expectedDate, incomeType }`. Validação: `expectedDate` deve ser >= hoje.
- `PATCH /future-receivables/:id/confirm` — marca como recebido (dispara criação de `incomes`).
- `PATCH /future-receivables/:id/reschedule` — Body: `{ newExpectedDate }`.
- `GET /income-schedules` — lista todas as rendas recorrentes do usuário (ativas e inativas).
- `POST /income-schedules` — cria renda recorrente. Body: `{ type, description, amount, recurrenceDay }`.
- `PATCH /income-schedules/:id` — edita (`amount`, `recurrenceDay`, `active`) — usado também para desativar (`active: false`).

## Frontend

- Rota: `app/orcamento/page.tsx` (fina) → renderiza `modules/budget/components/BudgetPage` com abas (Receita | Despesa Fixa | Despesa Variável) — nesta fase só a aba **Receita** é funcional.
- `modules/budget/components/IncomeTab.tsx`: lista de rendas do mês + botão "Adicionar" (renda principal/extra) + botão "Recebimento futuro" + seção "Rendas recorrentes" (gerenciar/desativar).
- `modules/budget/components/NewIncomeModal.tsx`: formulário (tipo, descrição, valor) com toggle "Renda recorrente" — quando ativado, troca o campo de valor único por `{ amount, recurrenceDay }` e cria um `income_schedule` em vez de um `income` avulso.
- `modules/budget/components/IncomeSchedulesList.tsx`: lista as rendas recorrentes ativas/inativas com botão "Desativar".
- `modules/budget/components/NewFutureReceivableModal.tsx`: formulário (descrição, valor, data prevista, tipo de renda).
- `modules/budget/components/FutureReceivablesList.tsx`: lista com indicador visual "pendente" (ícone relógio) e ações "Marcar como recebido" / "Reagendar".
- `modules/budget/components/IncomeDonutChart.tsx`: gráfico Recharts (PieChart) com % renda principal vs extra.
- Navegação mês a mês: componente `modules/budget/components/MonthNavigator.tsx` (usado também nas fases seguintes do Orçamento), estado da URL via query param `?month=2026-09`.
- `modules/budget/api/incomes.ts`, `future-receivables.ts` e `income-schedules.ts`: clients HTTP tipados (usando tipos de `packages/shared-types`).
- Hooks TanStack Query: `useIncomes(month)`, `useFutureReceivables(month)`, `useCreateIncome`, `useConfirmReceivable`, `useRescheduleReceivable`, `useIncomeSchedules`, `useCreateIncomeSchedule`, `useToggleIncomeSchedule`.

## Tipos compartilhados (`packages/shared-types`)

- `Income` (id, userId, type, description, amount, referenceMonth, futureReceivableId, incomeScheduleId, createdAt).
- `FutureReceivable` (id, userId, description, amount, expectedDate, status, receivedAt, incomeType, createdAt).
- `IncomeSchedule` (id, userId, type, description, amount, recurrenceDay, active, createdAt).
- Schemas Zod `createIncomeSchema`, `createFutureReceivableSchema`, `createIncomeScheduleSchema` para validar tanto no frontend (form) quanto no backend (DTO).

## Padrões de projeto aplicados

- **Factory** implícita: função `buildIncomeFromReceivable(receivable, confirmedDate)` centraliza a criação do registro de `incomes` a partir de um `future_receivable` confirmado — evita duplicar essa lógica em múltiplos pontos.
- **Factory** implícita: função `resolveOccurrenceDate(recurrenceDay, referenceMonth)` centraliza o cálculo do dia real de geração de uma ocorrência de renda recorrente (clampando ao último dia do mês), reaproveitada tanto na geração lazy quanto em testes.
- **Observer/Event**: ao confirmar um recebimento futuro, o `FutureReceivablesService` emite `future-receivable.confirmed`; o cálculo de saldo/resumo do mês (Fase 3) escuta esse evento para invalidar cache, em vez de acoplamento direto.
