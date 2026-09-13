# Fase 3 — Investir + Visão Geral — Tasks

## Backend
- [x] Migration: tabela `budget_settings` + RLS
- [x] Módulo Nest `modules/budget`: `BudgetSettingsService`/`Repository` (upsert por mês)
- [x] `BudgetSummaryService.calculate(month)` consumindo incomes + expenses + settings (formula isolada em `calculateBudgetSummary`, função pura)
- [x] Endpoint `GET /budget/settings?month=`
- [x] Endpoint `PUT /budget/settings`
- [x] Endpoint `GET /budget/summary?month=`
- [x] Endpoint `GET /budget/overview?months=` (série mensal para gráfico, via `OverviewService` + `buildMonthRange`)
- [x] Testes unitários: 6 casos de `calculateBudgetSummary` (20%/10%/fixo/exemplo da spec/null/saldo negativo) + 4 casos de `buildMonthRange` (1/3/12 meses, virada de ano) — 10 testes novos

## Frontend
- [x] Tipos/schemas `BudgetSettings`, `BudgetSummary`, `OverviewPoint`
- [x] `InvestAdjustModal.tsx` (toggle % vs valor fixo, presets 20/30/40/50%, preview do valor calculado)
- [x] Atualizar `BudgetPage.tsx` para usar `GET /budget/summary` como fonte única — card **Investir inserido entre Receita e Despesas** (ordem do vídeo/Multicap)
- [x] Rota `app/visao-geral/page.tsx`
- [x] `OverviewPage.tsx`, `PeriodSelector.tsx`, `IncomeExpenseLineChart.tsx` (Recharts, linha verde=receita/vermelha=despesa)
- [x] `api/budget.ts`, `modules/overview/api/overview.ts` + hooks
- [x] Habilitado link "Visão geral" no Sidebar e no acesso rápido da Início
- [ ] Teste de componente: alternar % recalcula valor exibido sem reload (cobertura via teste de backend da fórmula; teste de componente não escrito nesta rodada)
- [ ] Teste de componente: gráfico recebe os pontos corretos por período selecionado (mesma observação)

## Verificação end-to-end desta fase
- [x] Backend: build limpo, 33 testes unitários passando (23 anteriores + 10 novos)
- [x] Frontend: build limpo, rotas `/orcamento` e `/visao-geral` funcionais
- [ ] Com receita R$5.350 sem config, confirmar sugestão de 20% (R$1.070) — pendente teste manual do usuário
- [ ] Ajustar para 10% e confirmar novo valor e novo saldo — pendente teste manual
- [ ] Trocar para valor fixo R$700 e confirmar persistência ao navegar entre meses — pendente teste manual
- [ ] Abrir Visão Geral, alternar entre mês atual/3/6/12 meses e confirmar que o gráfico atualiza — pendente teste manual
