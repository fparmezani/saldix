# Fase 6 — Investimentos — Tasks

## Backend
- [ ] Migration: `investments` + RLS
- [ ] Função pura `calculateGain(invested, current)` com testes (ganho positivo, negativo, zero, invested=0)
- [ ] Módulo Nest `modules/investments` (CRUD + summary)
- [ ] Endpoint `GET /investments/summary`
- [ ] Testes unitários adicionais: summary somando múltiplos investimentos

## Frontend
- [ ] Tipos/schemas `Investment`, `InvestmentsSummary`
- [ ] Rota `app/investimentos/page.tsx`
- [ ] `InvestmentCard.tsx` (badge de rentabilidade colorido)
- [ ] `NewInvestmentModal.tsx`, `UpdateInvestmentModal.tsx`
- [ ] `InvestmentsSummaryCard.tsx`
- [ ] `api/investments.ts` + hooks
- [ ] Teste de componente: badge muda de cor conforme ganho positivo/negativo

## Verificação end-to-end desta fase
- [ ] Cadastrar "Caixinha Nubank", R$2.000 investido, R$2.000 atual → 0% exibido
- [ ] Atualizar valor atual para R$2.400 → +20% / +R$400 exibido
- [ ] Registrar novo aporte de R$500 (investido → R$2.500) e confirmar recalculo de %
- [ ] Cadastrar 2º e 3º investimento e confirmar soma correta no resumo total
