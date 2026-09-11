# Fase 6 — Investimentos — Design

## Entidade / Tabela

### `investments`
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| name | text | ex: "Caixinha Nubank" |
| investment_type | text | ex: "Renda Fixa", "Ações", "Cripto" — lista livre, não enum fechado |
| invested_amount | numeric(12,2) | total aportado acumulado |
| current_amount | numeric(12,2) | valor atual (atualizado manualmente pelo usuário) |
| created_at / updated_at | timestamptz | |

RLS: `user_id = auth.uid()`.

## Regra de cálculo

```
gainAmount = current_amount - invested_amount
gainPercentage = invested_amount > 0 ? (gainAmount / invested_amount) * 100 : 0
```

Centralizado em `InvestmentsService.withGain(investment)`, aplicado a cada item retornado pela listagem.

Resumo total: `GET /investments/summary` retorna `{ totalInvested, totalCurrent, totalGainAmount, totalGainPercentage }` somando todos os investimentos do usuário.

## Endpoints backend

`modules/investments`:
- `GET /investments` — lista com `gainAmount`/`gainPercentage` calculados
- `POST /investments` — `{ name, investmentType, investedAmount, currentAmount }`
- `PATCH /investments/:id` — atualizar valor investido (novo aporte) e/ou valor atual
- `DELETE /investments/:id`
- `GET /investments/summary`

## Frontend

- Rota `app/investimentos/page.tsx` → `modules/investments/components/InvestmentsPage.tsx`.
- `InvestmentCard.tsx`: nome, tipo, valor investido, valor atual, badge de rentabilidade (verde se positivo, vermelho se negativo).
- `NewInvestmentModal.tsx`, `UpdateInvestmentModal.tsx` (dois campos: novo valor investido total / novo valor atual).
- `InvestmentsSummaryCard.tsx`: total consolidado.
- `modules/investments/api/investments.ts`, hooks `useInvestments`, `useCreateInvestment`, `useUpdateInvestment`, `useInvestmentsSummary`.

## Tipos compartilhados

- `Investment` (com `gainAmount`/`gainPercentage` calculados no shape de resposta), `InvestmentsSummary`.

## Padrões de projeto aplicados

- **Repository** para `investments`.
- Cálculo de rentabilidade isolado em método puro e testável (`calculateGain(invested, current)`), sem duplicar a fórmula entre summary e listagem individual.
