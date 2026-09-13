# Fase 6 — Investimentos — Tasks

## Backend
- [x] Migration: `investments` + RLS
- [x] Função pura `calculateGain(invested, current)` com testes (ganho positivo, negativo, zero, invested=0, recalculo após aporte)
- [x] Módulo Nest `modules/investments` (CRUD + summary)
- [x] Endpoint `GET /investments/summary`
- [x] Testes unitários adicionais: `summarizeInvestments` somando múltiplos investimentos + portfólio vazio — 7 testes novos

## Frontend
- [x] Tipos/schemas `Investment`, `InvestmentWithGain`, `InvestmentsSummary`
- [x] Rota `app/investimentos/page.tsx`
- [x] `InvestmentCard.tsx` (badge de rentabilidade verde/vermelho)
- [x] `NewInvestmentModal.tsx`, `UpdateInvestmentModal.tsx`
- [x] `InvestmentsSummaryCard.tsx`
- [x] `api/investments.ts` + hooks
- [x] Habilitado link "Investimentos" no Sidebar e na Início
- [ ] Teste de componente: badge muda de cor conforme ganho positivo/negativo (cobertura via teste de backend da fórmula; teste de componente não escrito nesta rodada)

## Verificação end-to-end desta fase
- [x] Backend: build limpo, 58 testes unitários passando (51 anteriores + 7 novos)
- [x] Frontend: build limpo, rota `/investimentos` funcional
- [ ] Cadastrar "Caixinha Nubank", R$2.000 investido, R$2.000 atual → 0% exibido — pendente teste manual do usuário
- [ ] Atualizar valor atual para R$2.400 → +20% / +R$400 exibido — pendente teste manual
- [ ] Registrar novo aporte de R$500 (investido → R$2.500) e confirmar recalculo de % — pendente teste manual
- [ ] Cadastrar 2º e 3º investimento e confirmar soma correta no resumo total — pendente teste manual

## Redesenho — categorias e ativos com cota

### Backend
- [x] Migration: `category`, `ticker`, `quantity`, `market_price_per_unit`, `target_percentage` + constraints (categoria fechada, campos de cota só quando `fiis/acoes/cripto`), drop de `investment_type`
- [x] `entities/investment.entity.ts`: `InvestmentCategory`, `SHARE_BASED_CATEGORIES`, `isShareBasedCategory()`
- [x] `dto/create-investment.dto.ts`: `category` + campos condicionais via `ValidateIf`; `update-investment.dto.ts` sem mudança (`PartialType` já propaga)
- [x] `investments.repository.ts`: mapeamento das 5 colunas novas, zera campos de cota no insert quando categoria não é de cota
- [x] Novo `investment-allocation.calculator.ts` + `.spec.ts` (6 testes: vazio, 100% exato, sub-alocado, sobre-alocado, `null` tratado como 0, múltiplas categorias)
- [x] `investments.service.ts`: `getSummary()` inclui `byCategory`
- [x] `investment-gain.calculator.ts` e seus testes — confirmados inalterados

### Shared types
- [x] `investment.ts`: `investmentCategorySchema`, `isShareBasedCategory`, schemas de create/update/summary atualizados, `InvestmentCategorySummary`

### Frontend
- [x] `constants.ts`: `INVESTMENT_CATEGORY_LABELS`, `INVESTMENT_CATEGORY_ORDER`
- [x] `NewInvestmentModal.tsx`: seletor de categoria, bloco condicional (ticker/preço/quantidade/percentual), sugestão automática de valor investido/atual
- [x] `UpdateInvestmentModal.tsx`: campos de cota editáveis quando aplicável, categoria/ticker/nome somente leitura
- [x] `InvestmentCard.tsx`: badge de categoria, linha de ticker/quantidade/percentual-alvo
- [x] Novo `InvestmentCategorySection.tsx`: agrupamento + indicador de alocação
- [x] `InvestmentsPage.tsx`: grid plano → seções por categoria
- [x] `InvestmentsSummaryCard.tsx`: resumo por categoria abaixo dos totais gerais
- [x] `api/investments.ts`, `hooks/useInvestments.ts`, `app/investimentos/page.tsx` — confirmados sem necessidade de mudança

### Verificação
- [x] Backend: `pnpm --filter backend test` — 101 testes passando (todos os anteriores + 6 novos de alocação), `investment-gain.calculator.spec.ts` e `net-worth-summary.calculator.spec.ts` inalterados e verdes
- [x] `pnpm --filter backend build` e `pnpm --filter frontend build` sem erros
- [ ] Fluxo manual completo (criar Renda Fixa sem campos de cota; criar 2 FIIs 50/50 → "100% alocado"; editar um pra 30% → aviso; excluir; conferir `/patrimonio`) — pendente teste manual do usuário
