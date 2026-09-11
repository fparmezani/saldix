# Fase 7 — Patrimônio — Tasks

## Backend
- [ ] Migration: `liquid_accounts` + RLS
- [ ] Migration: `assets` + RLS
- [ ] Migration: `debts` + RLS
- [ ] Interface `VehiclePricingProvider` + implementação inicial (mock ou API pública)
- [ ] Módulo Nest `modules/net-worth` com sub-recursos (liquid-accounts, assets, debts)
- [ ] Endpoint `GET /net-worth/vehicle-lookup`
- [ ] `NetWorthService.getSummary(userId)` somando liquidez + investimentos (Fase 6) + bens − dívidas
- [ ] Endpoint `GET /net-worth/summary`
- [ ] Testes unitários: cálculo de patrimônio líquido com/sem dívidas, amortização reduzindo dívida

## Frontend
- [ ] Tipos/schemas `LiquidAccount`, `Asset`, `Debt`, `NetWorthSummary`
- [ ] Rota `app/patrimonio/page.tsx`
- [ ] `LiquidAccountsSection.tsx`, `AssetsSection.tsx`, `DebtsSection.tsx`
- [ ] `VehicleLookupForm.tsx` (busca FIPE)
- [ ] `NetWorthSummaryCard.tsx` (breakdown visual)
- [ ] `api/net-worth.ts` + hooks
- [ ] Teste de componente: breakdown exibe corretamente os 4 componentes do patrimônio

## Verificação end-to-end desta fase
- [ ] Cadastrar contas de liquidez somando R$1.572 e confirmar refletido no resumo
- [ ] Cadastrar imóvel (terreno) R$200.000 e confirmar soma no patrimônio
- [ ] Cadastrar apartamento R$600.000 + dívida vinculada R$450.000 e confirmar efeito líquido +R$150.000
- [ ] Amortizar a dívida para R$400.000 e confirmar aumento de R$50.000 no patrimônio
- [ ] Buscar veículo por marca/modelo/ano e confirmar sugestão de valor FIPE
