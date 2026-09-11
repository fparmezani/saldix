# Fase 4 — Reserva de Emergência — Tasks

## Backend
- [ ] Migration: `emergency_fund_settings` (unique por user) + RLS
- [ ] Migration: `emergency_fund_contributions` + RLS
- [ ] Implementar `EmergencyFundStrategy` + `BasicProtectionStrategy` + `ShieldedProtectionStrategy` + factory `strategyFor(type)`
- [ ] `EmergencyFundService.getStatus(userId)` (target, total, %)
- [ ] Endpoints: `GET/PUT /emergency-fund/settings`, `GET /emergency-fund/status`, `GET/POST /emergency-fund/contributions`
- [ ] Testes unitários: meta básica vs blindada, % com 0/parcial/100+ aportes (cap em 100%)

## Frontend
- [ ] Tipos/schemas `EmergencyFundSettings`, `EmergencyFundStatus`, `EmergencyFundContribution`
- [ ] Rota `app/reserva-emergencia/page.tsx`
- [ ] `ProtectionTypeSelector.tsx` (cards Básica/Blindada com descrição)
- [ ] `EssentialCostForm.tsx`
- [ ] `ProgressShield.tsx` (indicador visual de %)
- [ ] `ContributionsList.tsx` + `NewContributionModal.tsx`
- [ ] `api/emergency-fund.ts` + hooks
- [ ] Teste de componente: seleção de tipo recalcula meta exibida imediatamente

## Verificação end-to-end desta fase
- [ ] Selecionar Básica, custo mensal R$3.000 → meta R$18.000
- [ ] Trocar para Blindada → meta recalcula para R$36.000, aportes existentes preservados
- [ ] Registrar aporte de R$1.000 → progresso ~6% (base R$18.000)
- [ ] Registrar aportes até ultrapassar a meta → progresso trava em 100% com indicador de "protegido"
