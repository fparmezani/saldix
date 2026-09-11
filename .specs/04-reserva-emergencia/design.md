# Fase 4 — Reserva de Emergência — Design

## Entidades / Tabelas

### `emergency_fund_settings`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk, unique | 1 configuração por usuário (não por mês) |
| protection_type | enum text: `basic` \| `shielded` | `basic` = 6 meses, `shielded` = 12 meses |
| monthly_essential_cost | numeric(12,2) | custo mensal necessário para viver |
| created_at / updated_at | timestamptz | |

### `emergency_fund_contributions`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| amount | numeric(12,2) | pode ser negativo? não — retiradas são um tipo separado (`withdrawal`, fora do MVP) |
| contributed_at | date | |
| note | text nullable | ex: "Caixinha Nubank" |
| created_at | timestamptz | |

RLS: `user_id = auth.uid()`.

## Regra de cálculo (Strategy)

Interface `EmergencyFundStrategy { monthsOfProtection(): number }`:
- `BasicProtectionStrategy.monthsOfProtection() = 6`
- `ShieldedProtectionStrategy.monthsOfProtection() = 12`

```
targetAmount = monthlyEssentialCost * strategyFor(protectionType).monthsOfProtection()
totalContributed = sum(emergency_fund_contributions.amount)
progressPercentage = min(100, round(totalContributed / targetAmount * 100))
```

Centralizado em `EmergencyFundService.getStatus(userId)`.

## Endpoints backend

`modules/emergency-fund`:
- `GET /emergency-fund/settings`
- `PUT /emergency-fund/settings` — `{ protectionType, monthlyEssentialCost }`
- `GET /emergency-fund/status` — retorna `{ targetAmount, totalContributed, progressPercentage, protectionType }`
- `GET /emergency-fund/contributions` — histórico
- `POST /emergency-fund/contributions` — `{ amount, contributedAt, note? }`

## Frontend

- Rota `app/reserva-emergencia/page.tsx` → `modules/emergency-fund/components/EmergencyFundPage.tsx`.
- `ProtectionTypeSelector.tsx`: cards "Básica" vs "Blindada" com descrição de para quem é recomendado (texto igual ao vídeo: CLT vs renda variável).
- `EssentialCostForm.tsx`: input do custo mensal essencial.
- `ProgressShield.tsx`: barra/indicador visual de % (ícone de escudo, cor muda conforme progresso).
- `ContributionsList.tsx` + `NewContributionModal.tsx`.
- `modules/emergency-fund/api/emergency-fund.ts`, hooks `useEmergencyFundStatus`, `useUpdateSettings`, `useContributions`, `useAddContribution`.

## Tipos compartilhados

- `EmergencyFundSettings`, `EmergencyFundStatus`, `EmergencyFundContribution`.

## Padrões de projeto aplicados

- **Strategy**: `BasicProtectionStrategy` / `ShieldedProtectionStrategy` atrás de `EmergencyFundStrategy`, resolvidas por uma factory simples (`strategyFor(type)`), evitando `if/else` espalhado pelo código sempre que se precisa saber "quantos meses".
