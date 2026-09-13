# Fase 6 — Investimentos — Design

## Entidade / Tabela

### `investments` (schema atual, pós-redesenho de categorias)
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| name | text | ex: "Caixinha Nubank", "Tesouro Selic 2029" |
| category | text | enum fechado via check: `renda_fixa \| fiis \| acoes \| cripto \| outros` (substituiu `investment_type` livre) |
| invested_amount | numeric(12,2) | total aportado acumulado |
| current_amount | numeric(12,2) | valor atual — pode ser sugerido (quantidade × preço) mas fica sempre editável, nunca é uma fórmula travada |
| ticker | text, nullable | só para `fiis\|acoes\|cripto`; ex: "MXRF11" |
| quantity | numeric, nullable, check > 0 | só para `fiis\|acoes\|cripto` |
| market_price_per_unit | numeric, nullable, check > 0 | só para `fiis\|acoes\|cripto`; **digitado manualmente pelo usuário**, sem integração externa |
| target_percentage | numeric, nullable, check 0-100 | só para `fiis\|acoes\|cripto`; meta de alocação dentro da categoria, não calculada |
| created_at / updated_at | timestamptz | |

Constraint adicional (`investments_share_fields_check`): fora de `fiis/acoes/cripto`, `ticker/quantity/market_price_per_unit/target_percentage` têm que ser todos `null` — defesa em profundidade além da lógica de `InvestmentsRepository.create()`, que já zera esses campos no insert quando a categoria não é de cota.

RLS: `user_id = auth.uid()` (cobre as colunas novas automaticamente, sem mudança de política).

**Por que não há um Adapter/Provider pra preço de mercado**: diferente do `VehiclePricingProvider`/`MockFipeProvider` da Fase 7 (que existe pra abstrair uma futura integração real com a FIPE), aqui não há nenhuma fonte externa sendo simulada — `market_price_per_unit` é sempre um número que o usuário digita no formulário. Criar uma interface de provider pra isso seria abstração especulativa sem uso real hoje.

## Regra de cálculo

```
gainAmount = current_amount - invested_amount
gainPercentage = invested_amount > 0 ? (gainAmount / invested_amount) * 100 : 0
```

Centralizado em `investment-gain.calculator.ts` (`calculateGain`/`summarizeInvestments`), aplicado a cada item da listagem e ao resumo geral — **não mudou neste redesenho**.

Alocação por categoria — novo `investment-allocation.calculator.ts`:
```
summarizeInvestmentsByCategory(investments) → CategoryAllocation[]
```
Agrupa por `category`, soma `investedAmount`/`currentAmount` (reaproveitando `calculateGain` pro ganho por categoria) e soma `targetPercentage` tratando `null` como 0 (`allocatedPercentage`). É só informativo: nunca bloqueia o cadastro de um ativo isolado, já que só faz sentido a soma bater 100% depois que todos os ativos da categoria existirem.

Resumo total: `GET /investments/summary` retorna `{ totalInvested, totalCurrent, totalGainAmount, totalGainPercentage, byCategory }` — os 4 primeiros campos são os mesmos de sempre (consumidos por `NetWorthSummaryService` sem mudança), `byCategory` é aditivo.

## Endpoints backend

`modules/investments` (rotas inalteradas neste redesenho):
- `GET /investments` — lista com `gainAmount`/`gainPercentage` calculados
- `POST /investments` — `{ name, category, investedAmount, currentAmount, ticker?, quantity?, marketPricePerUnit?, targetPercentage? }` — os 4 últimos só são aceitos/obrigatórios quando `category` é `fiis/acoes/cripto` (`ValidateIf` no DTO)
- `PATCH /investments/:id` — mesmos campos, todos opcionais
- `DELETE /investments/:id`
- `GET /investments/summary`

## Frontend

- Rota `app/investimentos/page.tsx` → `modules/investments/components/InvestmentsPage.tsx`.
- `InvestmentsPage.tsx`: agrupa os cards em uma seção por categoria (`InvestmentCategorySection.tsx`), mantendo a mesma lógica de edição/exclusão (`ConfirmDialog`) de antes.
- `InvestmentCategorySection.tsx` (novo): cabeçalho da categoria + indicador "X% alocado de 100%" (só para categorias com cota) + grid dos cards.
- `InvestmentCard.tsx`: badge de categoria, ticker/quantidade e badge de percentual-alvo quando aplicável, valor investido/atual, badge de rentabilidade (verde/vermelho) — inalterado.
- `NewInvestmentModal.tsx`, `UpdateInvestmentModal.tsx`: seletor de categoria + bloco condicional (ticker/preço/quantidade/percentual) só quando a categoria tem cota; valor investido/atual seguem sugeridos automaticamente (quantidade × preço) mas editáveis.
- `InvestmentsSummaryCard.tsx`: total consolidado (inalterado) + linha de resumo por categoria (`byCategory`).
- `constants.ts` (novo): `INVESTMENT_CATEGORY_LABELS`, `INVESTMENT_CATEGORY_ORDER`.
- `modules/investments/api/investments.ts`, hooks `useInvestments`, `useCreateInvestment`, `useUpdateInvestment`, `useInvestmentsSummary` — sem mudança, já genéricos via `shared-types`.

## Tipos compartilhados

- `InvestmentCategory` (enum), `SHARE_BASED_INVESTMENT_CATEGORIES`/`isShareBasedCategory()` — única fonte da verdade de quais categorias têm campos de cota (backend redeclara localmente, seguindo a convenção já usada pra `CardBrand`/`AssetType`; frontend importa em runtime direto de `@saldix/shared-types`).
- `Investment` (com os 5 campos novos), `InvestmentWithGain`, `InvestmentCategorySummary`, `InvestmentsSummary` (com `byCategory`).

## Padrões de projeto aplicados

- **Repository** para `investments` — sem mudança de padrão.
- Cálculo de rentabilidade isolado em método puro e testável (`calculateGain`), sem duplicar a fórmula entre summary e listagem individual — reaproveitado também pelo cálculo de alocação por categoria.
- Validação condicional por categoria via `ValidateIf` no DTO (primeiro uso desse decorator no projeto) — mais barato que criar DTOs separados por categoria.
