# Fase 7 — Patrimônio — Design

## Entidades / Tabelas

### `liquid_accounts` (liquidez)
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| name | text | ex: "Conta Bradesco" |
| amount | numeric(12,2) | |
| created_at / updated_at | timestamptz | |

### `assets` (bens)
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| asset_type | enum text: `real_estate` \| `vehicle` \| `other` | |
| name | text | ex: "Apartamento 506", "Gol 1.0 2014" |
| current_value | numeric(12,2) | valor de mercado estimado |
| fipe_code | text nullable | preenchido quando `asset_type = vehicle` e buscado via provider |
| created_at / updated_at | timestamptz | |

### `debts` (dívidas/financiamentos)
| coluna | tipo | notas |
|---|---|---|
| id | uuid, pk | |
| user_id | uuid, fk | |
| asset_id | uuid, fk assets, nullable | vínculo opcional a um bem específico |
| name | text | ex: "Financiamento apartamento" |
| outstanding_balance | numeric(12,2) | saldo devedor atual |
| created_at / updated_at | timestamptz | |

RLS: `user_id = auth.uid()` em todas as três.

## Regra de cálculo

```
totalLiquidity = sum(liquid_accounts.amount)
totalInvestments = sum(investments.current_amount)  // reaproveita Fase 6
totalAssets = sum(assets.current_value)
totalDebts = sum(debts.outstanding_balance)
netWorth = totalLiquidity + totalInvestments + totalAssets - totalDebts
```

Centralizado em `NetWorthService.getSummary(userId)`.

## Integração Tabela FIPE (Adapter)

Interface de domínio:
```
interface VehiclePricingProvider {
  searchByBrandModelYear(brand: string, model: string, year: number): Promise<{ fipeCode: string; estimatedValue: number }>
}
```
Implementação inicial (`MockFipeProvider` ou `FipeApiProvider` usando uma API pública de tabela FIPE) fica atrás dessa interface — o módulo `assets` nunca chama a API externa diretamente, apenas o `VehiclePricingProvider` injetado.

## Endpoints backend

`modules/net-worth`:
- `GET /net-worth/liquid-accounts`, `POST`, `PATCH /:id`, `DELETE /:id`
- `GET /net-worth/assets`, `POST`, `PATCH /:id`, `DELETE /:id`
- `GET /net-worth/vehicle-lookup?brand=&model=&year=` — usa `VehiclePricingProvider`
- `GET /net-worth/debts`, `POST`, `PATCH /:id` (para amortizar, atualiza `outstanding_balance`), `DELETE /:id`
- `GET /net-worth/summary` — retorna `{ totalLiquidity, totalInvestments, totalAssets, totalDebts, netWorth }`

## Frontend

- Rota `app/patrimonio/page.tsx` → `modules/net-worth/components/NetWorthPage.tsx`.
- `LiquidAccountsSection.tsx`, `AssetsSection.tsx` (com sub-fluxo de busca FIPE para veículos), `DebtsSection.tsx`.
- `NetWorthSummaryCard.tsx`: total consolidado com breakdown (liquidez / investimentos / bens / dívidas).
- `VehicleLookupForm.tsx`: marca/modelo/ano → sugestão de valor.
- `modules/net-worth/api/net-worth.ts`, hooks correspondentes.

## Tipos compartilhados

- `LiquidAccount`, `Asset`, `Debt`, `NetWorthSummary`.

## Padrões de projeto aplicados

- **Adapter**: `VehiclePricingProvider` isola a fonte de dados FIPE do domínio.
- **Repository** para as três tabelas.
