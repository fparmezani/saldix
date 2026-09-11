# Regras de estrutura de pastas

## Princípio geral

Divisão por **módulo de domínio**, não por tipo técnico. Não criar pastas transversais tipo `components/` ou `services/` na raiz de `src/` — cada módulo é auto-contido e carrega seus próprios componentes/serviços/hooks/testes. Só vai para `shared/` o que é usado por 2 ou mais módulos.

## Monorepo

```
src/
  frontend/   Next.js — ver "Frontend" abaixo
  backend/    NestJS — ver "Backend" abaixo
packages/
  shared-types/   DTOs, enums e schemas Zod usados por frontend e backend
docs/
  Multicap/   material de referência do vídeo (não editar)
  specs/      spec-driven design por fase/módulo (obrigatório antes de codar)
```

## Frontend (`src/frontend/src`)

```
app/              rotas do App Router — arquivos finos, sem lógica de negócio,
                   só compõem componentes vindos de modules/<nome>
modules/
  auth/
  home/
  budget/          receita, investir, despesa fixa/variável
  overview/        visão geral (gráficos comparativos)
  emergency-fund/
  goals/
  investments/
  net-worth/       patrimônio
  calculators/
shared/
  ui/              componentes genéricos reutilizáveis (Button, Modal, Card...)
  hooks/           hooks genéricos (useDebounce, useTheme...)
  lib/             http client, formatação de moeda/data, supabase client
  providers/       providers React globais (QueryClientProvider, ThemeProvider)
```

Cada módulo segue este padrão interno:

```
modules/<nome>/
  components/     componentes específicos do módulo
  hooks/          hooks específicos do módulo (chamadas à API, cálculos locais)
  api/            client HTTP tipado para os endpoints do módulo
  types.ts        tipos locais (o que for compartilhado com o backend vem de shared-types)
```

## Backend (`src/backend/src`)

```
modules/
  auth/
  categories/
  incomes/
  expenses/
  budget/
  emergency-fund/
  goals/
  investments/
  net-worth/       assets + debts
shared/
  guards/          JwtAuthGuard e afins
  interceptors/
  supabase/         cliente Supabase compartilhado
  filters/           exception filters globais
```

Cada módulo Nest segue o padrão:

```
modules/<nome>/
  <nome>.module.ts
  <nome>.controller.ts
  <nome>.service.ts
  <nome>.repository.ts     acesso a dados via Supabase client
  dto/                      request/response DTOs (validação com class-validator ou zod)
  entities/                 tipos de entidade do domínio
  <nome>.service.spec.ts    testes unitários
```

## Spec-driven design (obrigatório)

Antes de implementar qualquer módulo, deve existir `docs/specs/<fase>-<modulo>/`:

- `requirements.md` — user stories + critérios de aceite.
- `design.md` — schema de tabelas, endpoints, componentes de tela, padrões de projeto usados.
- `tasks.md` — checklist granular sequencial de implementação.

Nenhum código de um módulo novo deve ser escrito sem esse spec existir e ter sido revisado com o usuário.
