# Fase 3 — Investir + Visão Geral — Tasks

## Backend
- [ ] Migration: tabela `budget_settings` + RLS
- [ ] Módulo Nest `modules/budget`: `BudgetSettingsService`/`Repository` (upsert por mês)
- [ ] `BudgetSummaryService.calculate(month)` consumindo incomes + expenses + settings
- [ ] Endpoint `GET /budget/settings?month=`
- [ ] Endpoint `PUT /budget/settings`
- [ ] Endpoint `GET /budget/summary?month=`
- [ ] Endpoint `GET /budget/overview?months=` (série mensal para gráfico)
- [ ] Testes unitários: cálculo de saldo (percentage vs fixed), default 20% quando sem config, série de meses sem dados retorna zeros

## Frontend
- [ ] Tipos/schemas `BudgetSettings`, `BudgetSummary`, `OverviewPoint`
- [ ] `InvestBlock.tsx` (toggle % vs valor fixo, slider/input)
- [ ] Atualizar `BudgetSummaryCards.tsx` para usar `GET /budget/summary`
- [ ] Rota `app/visao-geral/page.tsx`
- [ ] `OverviewPage.tsx`, `PeriodSelector.tsx`, `IncomeExpenseLineChart.tsx`
- [ ] `api/budget-settings.ts`, `api/overview.ts` + hooks
- [ ] Teste de componente: alternar % recalcula valor exibido sem reload
- [ ] Teste de componente: gráfico recebe os pontos corretos por período selecionado

## Verificação end-to-end desta fase
- [ ] Com receita R$5.350 sem config, confirmar sugestão de 20% (R$1.070)
- [ ] Ajustar para 10% e confirmar novo valor e novo saldo
- [ ] Trocar para valor fixo R$700 e confirmar persistência ao navegar entre meses
- [ ] Abrir Visão Geral, alternar entre mês atual/3/6/12 meses e confirmar que o gráfico atualiza
