# Fase 4 — Reserva de Emergência — Tasks

## Backend
- [x] Migration: `emergency_fund_settings` (unique por user) + RLS
- [x] Migration: `emergency_fund_contributions` + RLS
- [x] Implementar `EmergencyFundStrategy` + `BasicProtectionStrategy` + `ShieldedProtectionStrategy` + factory `strategyFor(type)`
- [x] `EmergencyFundService.getStatus(userId)` (target, total, % — retorna `null` se ainda não configurado)
- [x] Endpoints: `GET/PUT /emergency-fund/settings`, `GET /emergency-fund/status`, `GET/POST /emergency-fund/contributions`
- [x] Testes unitários: meta básica (6x) vs blindada (12x), % com 0/parcial/exato/acima de 100 aportes (cap em 100%) — 6 testes + 2 da strategy factory

## Frontend
- [x] Tipos/schemas `EmergencyFundSettings`, `EmergencyFundStatus`, `EmergencyFundContribution`
- [x] Rota `app/reserva-emergencia/page.tsx`
- [x] `ProtectionTypeSelector.tsx` (cards Básica/Blindada com descrição igual ao vídeo)
- [x] Formulário de custo essencial integrado em `EmergencyFundPage.tsx` (junto ao seletor de proteção, já que são salvos juntos)
- [x] `ProgressShield.tsx` (ícone de escudo cinza→verde, barra de progresso, mensagens de incentivo)
- [x] `ContributionsList.tsx` + `NewContributionModal.tsx`
- [x] `api/emergency-fund.ts` + hooks
- [x] Habilitado link "Reserva de emergência" no Sidebar e na Início
- [ ] Teste de componente: seleção de tipo recalcula meta exibida imediatamente (cobertura via teste de backend da fórmula; teste de componente não escrito nesta rodada)

## Verificação end-to-end desta fase
- [x] Backend: build limpo, 41 testes unitários passando (33 anteriores + 8 novos)
- [x] Frontend: build limpo, rota `/reserva-emergencia` funcional
- [ ] Selecionar Básica, custo mensal R$3.000 → meta R$18.000 — pendente teste manual do usuário
- [ ] Trocar para Blindada → meta recalcula para R$36.000, aportes existentes preservados — pendente teste manual
- [ ] Registrar aporte de R$1.000 → progresso ~6% (base R$18.000) — pendente teste manual
- [ ] Registrar aportes até ultrapassar a meta → progresso trava em 100% com indicador de "protegido" — pendente teste manual
