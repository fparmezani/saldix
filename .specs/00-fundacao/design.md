# Fase 0 — Fundação do projeto — Design

## Estrutura criada

```
ControleFinanceiro/
  package.json               scripts raiz (dev:frontend, dev:backend, build, test, lint)
  pnpm-workspace.yaml         src/*, packages/*
  .gitignore
  .prettierrc.json
  src/
    frontend/                 Next.js 14 App Router + Tailwind + TanStack Query
      src/app/                 rotas finas
      src/modules/              auth, home, budget, overview, emergency-fund, goals,
                                investments, net-worth, calculators (vazios, a preencher
                                fase a fase)
      src/shared/                ui, hooks, lib, providers
      .env.example
    backend/                  NestJS
      src/main.ts, app.module.ts, app.controller.ts (GET /health)
      src/modules/               auth, categories, incomes, expenses, budget,
                                 emergency-fund, goals, investments, net-worth (vazios)
      src/shared/                guards, interceptors, supabase, filters
      .env.example
  packages/
    shared-types/              Zod schemas compartilhados (ex: Category)
  docs/
    Multicap/                  material de referência (já existia)
    .specs/                     specs por fase (este arquivo faz parte da Fase 0)
  .claude/
    CLAUDE.md
    rules/estrutura-pastas.md
    rules/padroes-codigo.md
    rules/testes.md
    agents/code-reviewer.md
```

## Decisões técnicas desta fase

- **Gerenciador de pacotes**: pnpm (instalado globalmente via npm), com workspaces `src/*` e `packages/*`.
- **Módulos vazios com `.gitkeep`**: pastas de módulo de cada fase futura já existem desde a Fase 0 para fixar a convenção de estrutura, mas sem código de negócio.
- **`packages/shared-types`**: inicia com um schema de exemplo (`Category`, usado a partir da Fase 2) para validar que o build/type-check entre pacotes funciona via `workspace:*`.
- **Backend**: Nest mínimo com `ConfigModule` global e um endpoint de health-check, sem módulos de domínio ainda.
- **Frontend**: Next App Router mínimo, Tailwind configurado com `darkMode: 'class'` (necessário para o toggle de tema da Fase 8), página inicial placeholder.
- **Supabase**: criação do projeto e do usuário único de autenticação é uma ação manual/assistida (via MCP Supabase, mediante confirmação do usuário) — não faz parte do código versionado.

## Não incluído nesta fase

- Migrations de tabelas de domínio (começam na Fase 1: `incomes`, `future_receivables`).
- Guards de autenticação reais (Fase 8, embora a pasta `shared/guards` já exista).
