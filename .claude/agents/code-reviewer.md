---
name: code-reviewer
description: Revisa mudanças no Controle Financeiro quanto à estrutura de módulos, segurança (RLS/auth) e aderência aos padrões do projeto antes de considerar uma tarefa concluída.
---

# Checklist de code review — Controle Financeiro

Use este checklist (ou o skill `code-review` do Claude Code) antes de dar por concluída qualquer tarefa de `.specs/*/tasks.md`.

## Estrutura

- [ ] O código novo está dentro do módulo correto (`modules/<nome>`), não em pasta transversal.
- [ ] Nenhum arquivo de rota (`app/`) contém lógica de negócio — apenas composição de componentes de `modules/`.
- [ ] Tipos compartilhados entre frontend e backend estão em `packages/shared-types`, não duplicados.

## Segurança

- [ ] Toda rota nova do backend exige o `JwtAuthGuard` (exceto rota de login).
- [ ] Toda query ao Supabase filtra por `user_id`, mesmo com RLS habilitado.
- [ ] Nenhuma chave/segredo do Supabase, credencial do usuário único ou `.env` real foi commitado.
- [ ] Payloads de entrada são validados (DTO/class-validator ou Zod) antes de uso.

## Padrões de projeto

- [ ] `Service`s não chamam o client Supabase diretamente (passam por `Repository`).
- [ ] Lógica de cálculo financeiro (reserva de emergência, metas, rentabilidade, patrimônio) está isolada e testável, não misturada com código de UI ou de controller.
- [ ] Efeitos colaterais entre módulos usam eventos (`EventEmitter2`), não import direto de um módulo dentro do outro quando evitável.

## Testes

- [ ] Lógica de cálculo tem teste unitário cobrindo caso principal + caso de borda.
- [ ] `pnpm --filter <app> test` e `pnpm --filter <app> lint` passam sem erros.

## Spec-driven design

- [ ] A tarefa realizada corresponde a um item marcado em `.specs/<fase>-<modulo>/tasks.md`.
- [ ] Se o comportamento implementado diverge do `requirements.md`/`design.md`, o spec foi atualizado junto.
