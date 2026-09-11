# Fase 9 (opcional) — Calculadoras — Tasks

## Lógica de cálculo (frontend, `modules/calculators/lib`)
- [ ] `compoundInterest.ts` + testes (aporte zero, taxa zero, período longo)
- [ ] `firstMillion.ts` + testes (patrimônio já >= 1M retorna 0 meses, aporte zero nunca atinge → definir comportamento de limite)
- [ ] `financeVsRent.ts` + testes (cenário onde financiar vence, cenário onde alugar+investir vence)

## Frontend — UI
- [ ] Rota `app/calculadoras/page.tsx`
- [ ] `CompoundInterestCalculator.tsx` + `CompoundInterestChart.tsx` com tooltip por mês
- [ ] `FirstMillionCalculator.tsx` (opcionalmente pré-preenchendo com `GET /net-worth/summary`)
- [ ] `FinanceVsRentCalculator.tsx`
- [ ] Teste de componente: gráfico de juros compostos renderiza o número correto de pontos

## Verificação end-to-end desta fase
- [ ] Simular juros compostos com R$1.000 inicial + R$1.000/mês, 8% a.a., 5 anos e confirmar total investido/juros exibidos
- [ ] Simular primeiro milhão com dados de patrimônio atual (Fase 7) pré-preenchidos
- [ ] Simular financiar vs. alugar com um cenário onde cada opção vence, confirmando a recomendação exibida
