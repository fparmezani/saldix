# Controle Financeiro

Organizador financeiro pessoal (uso individual, single-user), inspirado no app "Multicap" (ver `docs/Multicap/` para transcript e screenshots de referência). Publicado na Vercel (frontend) + backend separado (Railway/Render) + Supabase (Postgres + Auth).

## Stack

- **Frontend**: `src/frontend` — Next.js 14 (App Router), TypeScript, Tailwind, TanStack Query, Recharts, `@supabase/ssr`.
- **Backend**: `src/backend` — NestJS, TypeScript, `@supabase/supabase-js`.
- **Tipos compartilhados**: `packages/shared-types` — DTOs/enums/schemas Zod usados por frontend e backend.
- **Banco**: Supabase Postgres com RLS habilitado em todas as tabelas (filtro por `user_id`).
- **Auth**: Supabase Auth, email/senha, usuário único criado manualmente — sem cadastro público.
- **Gerenciador de pacotes**: pnpm com workspaces (`pnpm-workspace.yaml`).

## Comandos úteis

```bash
pnpm install              # instala tudo do monorepo
pnpm dev:frontend         # roda o Next.js em modo dev
pnpm dev:backend          # roda o Nest em modo watch
pnpm build                # build de produção de todos os pacotes
pnpm test                 # roda todos os testes
pnpm lint                 # lint de todos os pacotes
```

## Regras do projeto

Leia antes de programar:

- [.claude/rules/estrutura-pastas.md](rules/estrutura-pastas.md) — onde cada tipo de arquivo deve viver, divisão por módulo.
- [.claude/rules/padroes-codigo.md](rules/padroes-codigo.md) — convenções, SOLID, padrões GoF aplicáveis.
- [.claude/rules/testes.md](rules/testes.md) — estratégia e cobertura de testes.

## Fluxo de trabalho obrigatório

1. Antes de implementar qualquer fase/módulo novo, criar (ou já existir) `docs/specs/<fase>-<modulo>/{requirements,design,tasks}.md`.
2. Implementar seguindo `tasks.md`, marcando itens concluídos.
3. Rodar testes e lint do pacote alterado antes de considerar a tarefa concluída.
4. Nunca commitar `.env`, chaves do Supabase ou credenciais do usuário único.

## Plano geral

O plano de fases completo (Fase 0 a Fase 9) está descrito em `docs/specs/` (spec por fase) e foi derivado do vídeo de referência da Multicap. Resumo da ordem: Fundação → Receitas → Despesas → Investir/Visão Geral → Reserva de Emergência → Metas → Investimentos → Patrimônio → Auth/Deploy → Calculadoras (opcional). O módulo "Escola" do vídeo original está **fora de escopo**.
