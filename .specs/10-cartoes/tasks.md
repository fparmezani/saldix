# Fase 10 — Cartões — Tasks

## Backend
- [ ] Migration: tabela `cards` + RLS
- [ ] Migration: `card_id` nullable em `variable_expenses` e `fixed_expenses`
- [ ] Adicionar dependência `pdf-parse` ao backend
- [ ] `pdf-text-extractor.ts` (Adapter sobre `pdf-parse`)
- [ ] `statement-line-parser.ts` + testes (formatos de data variados, com/sem parcela, valores com milhar)
- [ ] `card-section-detector.ts` + testes (1 bloco, 2 blocos com marcador)
- [ ] `category-suggester.ts` + testes (match óbvio, sem match, categoria inexistente no usuário)
- [ ] `remaining-installments.factory.ts` + testes (parcela no meio "5/12", última parcela "12/12", virada de ano)
- [ ] Módulo Nest `modules/cards` (CRUD básico de cartões)
- [ ] `ExpensesModule` e `CategoriesModule` exportando os services necessários (se ainda não exportados)
- [ ] Endpoint `POST /cards/statement-preview` (multipart, sem persistir)
- [ ] Endpoint `POST /cards/statement-confirm` (persiste cartões novos + despesas fixas/variáveis conforme revisão)
- [ ] Exportar `cardId` nos DTOs/entities de `variable_expenses`/`fixed_expenses`

## Frontend
- [ ] Tipos/schemas `Card`, `StatementTransactionPreview`, `StatementImportPreview`, `ConfirmStatementImportInput` em `packages/shared-types`
- [ ] Rota `app/cartoes/page.tsx`
- [ ] `CardsPage.tsx`, `NewCardModal.tsx`
- [ ] `StatementUploadModal.tsx` (input de PDF)
- [ ] `StatementReviewModal.tsx` (popup grande, tabela editável por linha, agrupado por cartão)
- [ ] `api/cards.ts` + hooks
- [ ] Adicionar "Cartões" ao `Sidebar.tsx` e à Início

## Verificação end-to-end desta fase
- [ ] Cadastrar um cartão manualmente e confirmar que aparece na lista
- [ ] Upload de PDF de teste com 1 lançamento simples → revisão mostra a linha correta com categoria sugerida (se aplicável)
- [ ] Upload de PDF com lançamento parcelado "X 5/12" → confirmar geração de 8 registros (parcelas 5 a 12) com mesmo valor e grupo
- [ ] Desmarcar "incluir" numa linha e confirmar que ela não gera registro
- [ ] Marcar uma linha como "recorrente" e confirmar que ela cai em Despesa Fixa, não Variável
- [ ] PDF com 2 cartões detectáveis → revisão agrupa corretamente por cartão
