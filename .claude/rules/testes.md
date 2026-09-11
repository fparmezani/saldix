# Estratégia de testes

## Backend (NestJS + Jest)

- Testes unitários obrigatórios para todo `Service` que contenha lógica de cálculo (ex: % de investimento, meta de reserva de emergência, rentabilidade de investimento, valor mensal de metas, patrimônio líquido).
- Arquivo de teste ao lado do arquivo testado: `x.service.spec.ts` dentro do próprio módulo.
- `Repository`s são mockados nos testes de `Service` (não bater no Supabase real em teste unitário).
- Testes de integração leves para `Controller`s críticos (auth guard bloqueando requisição sem JWT válido).
- Rodar com `pnpm --filter backend test` antes de finalizar qualquer tarefa do backend.

## Frontend (Vitest + Testing Library, E2E opcional com Playwright)

- Testes de componente para lógica de UI não trivial (ex: formulário de despesa parcelada calculando corretamente o valor de cada parcela, gráfico recebendo os dados certos).
- Hooks de módulo (`modules/<nome>/hooks`) que fazem cálculo local devem ter teste unitário isolado.
- Não é necessário testar componentes puramente apresentacionais sem lógica.
- Fluxos críticos end-to-end (login → lançar receita → lançar despesa → saldo atualizado) cobertos por teste E2E antes do deploy da Fase 8.
- Rodar com `pnpm --filter frontend test` antes de finalizar qualquer tarefa do frontend.

## Convenções

- Nome de arquivo de teste sempre `<nome-do-arquivo>.spec.ts(x)`.
- Nenhuma tarefa de `tasks.md` que envolva lógica de cálculo é considerada concluída sem teste cobrindo o caso principal e ao menos um caso de borda (ex: valor zero, parcela única, data no passado).
- Testes não devem depender de dados reais do Supabase de produção — usar mocks/fixtures.
