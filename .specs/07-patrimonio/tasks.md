# Fase 7 — Patrimônio — Tasks

## Backend
- [x] Migration: `liquid_accounts` + RLS
- [x] Migration: `assets` + RLS
- [x] Migration: `debts` + RLS (FK opcional pra `assets`, `on delete set null` — excluir o bem não apaga a dívida, só desvincula)
- [x] Interface `VehiclePricingProvider` (Adapter) + `MockFipeProvider` (placeholder — API real fora de escopo, conforme spec)
- [x] Módulo Nest `modules/net-worth` com sub-recursos (liquid-accounts, assets, debts) num único `NetWorthController`
- [x] Endpoint `GET /net-worth/vehicle-lookup`
- [x] `NetWorthSummaryService.getSummary(userId)` somando liquidez + investimentos (reaproveita `InvestmentsService.getSummary` da Fase 6) + bens − dívidas
- [x] Endpoint `GET /net-worth/summary`
- [x] Testes unitários: patrimônio com/sem bens, efeito líquido de bem+dívida vinculada, aumento após amortização, patrimônio negativo, `MockFipeProvider` (exemplo conhecido do vídeo + fallback determinístico) — 14 testes novos

## Frontend
- [x] Tipos/schemas `LiquidAccount`, `Asset`, `Debt`, `NetWorthSummary`, `VehicleLookupResult`
- [x] Rota `app/patrimonio/page.tsx`
- [x] `LiquidAccountsSection.tsx`, `AssetsSection.tsx`, `DebtsSection.tsx` (formulários inline, sem modal separado — mais direto pra esses CRUDs simples)
- [x] `VehicleLookupForm.tsx` (busca FIPE, preenche valor+código automaticamente no formulário de bem)
- [x] `NetWorthSummaryCard.tsx` (breakdown visual: liquidez/investimentos/bens/dívidas)
- [x] `api/net-worth.ts` + hooks
- [x] Habilitado link "Patrimônio" no Sidebar e na Início — **todas as 7 fases de domínio agora acessíveis pela navegação**
- [ ] Teste de componente: breakdown exibe corretamente os 4 componentes do patrimônio (cobertura via teste de backend; teste de componente não escrito nesta rodada)

## Verificação end-to-end desta fase
- [x] Backend: build limpo, 67 testes unitários passando (58 anteriores + 9 novos)
- [x] Frontend: build limpo, rota `/patrimonio` funcional, guard retornando 401 sem token
- [ ] Cadastrar contas de liquidez somando R$1.572 e confirmar refletido no resumo — pendente teste manual do usuário
- [ ] Cadastrar imóvel (terreno) R$200.000 e confirmar soma no patrimônio — pendente teste manual
- [ ] Cadastrar apartamento R$600.000 + dívida vinculada R$450.000 e confirmar efeito líquido +R$150.000 — pendente teste manual
- [ ] Amortizar a dívida para R$400.000 e confirmar aumento de R$50.000 no patrimônio — pendente teste manual
- [ ] Buscar veículo Volkswagen Gol 1.0 2014 e confirmar sugestão de ~R$31.982 — pendente teste manual
