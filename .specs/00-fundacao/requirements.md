# Fase 0 — Fundação do projeto — Requirements

## User story

Como desenvolvedor único deste projeto, quero uma base de monorepo pronta (frontend, backend, tipos compartilhados, regras do Claude Code), para que cada fase seguinte (Receitas, Despesas, etc.) possa ser implementada de forma consistente e testável.

## Critérios de aceite

- Dado o monorepo, quando eu rodar `pnpm install` na raiz, então todas as dependências de `src/frontend`, `src/backend` e `packages/shared-types` devem instalar sem erro.
- Dado o backend, quando eu rodar `pnpm --filter backend start:dev`, então a rota `GET /health` deve responder `{ status: 'ok' }`.
- Dado o frontend, quando eu rodar `pnpm --filter frontend dev`, então a página inicial deve carregar em `http://localhost:3000` sem erros.
- Dado o repositório, quando eu inspecionar a estrutura de pastas, então `src/frontend/src/modules`, `src/backend/src/modules` e `specs` devem existir seguindo a divisão por módulo de domínio definida em `.claude/rules/estrutura-pastas.md`.
- Dado o projeto Supabase, quando configurado, então deve existir um único usuário de autenticação (email/senha) criado manualmente, sem rota de cadastro público exposta.
- Nenhuma credencial real (Supabase, senha do usuário) deve estar commitada — apenas `.env.example`.

## Fora de escopo nesta fase

- Qualquer lógica de negócio (receitas, despesas, etc.) — começa na Fase 1.
- Deploy em produção (Vercel/Railway) — acontece na Fase 8.
