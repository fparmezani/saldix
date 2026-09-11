# Fase 8 — Polimento, Auth final e Deploy — Tasks

## Backend
- [ ] Implementar `SupabaseAuthGuard` (`shared/guards`)
- [ ] Aplicar guard globalmente, exceto `GET /health`
- [ ] Atualizar todos os módulos anteriores para usar `request.user.id` em vez de `user_id` vindo do payload
- [ ] Configurar CORS restrito ao domínio de produção da Vercel
- [ ] Teste de integração: requisição sem token → 401 em rota protegida

## Frontend
- [ ] `modules/auth/components/LoginPage.tsx`
- [ ] `middleware.ts` de proteção de rotas
- [ ] `modules/auth/lib/supabase-server.ts` e `supabase-browser.ts`
- [ ] `modules/auth/api/auth.ts` (`signIn`, `signOut`)
- [ ] `ThemeToggle.tsx` + `ThemeProvider.tsx` + persistência em `localStorage`
- [ ] Script inline anti-flash de tema no `layout.tsx`
- [ ] Botão de logout acessível em algum lugar do layout autenticado

## Testes E2E
- [ ] Configurar Playwright no frontend
- [ ] Escrever teste do fluxo crítico completo (login → receita → despesa → saldo → logout)

## Deploy
- [ ] Criar projeto na Vercel apontando para `src/frontend`, configurar env vars
- [ ] Criar serviço no Railway/Render apontando para `src/backend`, configurar env vars e comando de build/start
- [ ] Validar CORS entre domínio da Vercel e backend em produção
- [ ] Rodar `pnpm build` local em ambos os apps antes do primeiro deploy, garantindo build limpo
- [ ] Smoke test manual em produção: login, lançar receita/despesa, ver saldo atualizado

## Verificação end-to-end desta fase
- [ ] Acessar `/orcamento` deslogado → redirecionado para `/login`
- [ ] Logar com sucesso e navegar por todos os módulos já implementados
- [ ] Alternar tema, recarregar página, confirmar persistência
- [ ] Rodar o teste E2E do fluxo crítico com sucesso
- [ ] Acessar a URL pública da Vercel e repetir o smoke test manual
