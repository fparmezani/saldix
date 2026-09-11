# Fase 8 — Polimento, Auth final e Deploy — Design

## Frontend — Autenticação

- `modules/auth/components/LoginPage.tsx`: formulário email/senha usando `@supabase/ssr` (`createBrowserClient`).
- `middleware.ts` (raiz do Next): verifica sessão Supabase em cada request; se ausente, redireciona para `/login`. Baseado no padrão oficial `@supabase/ssr` para Next App Router.
- `modules/auth/lib/supabase-server.ts` e `supabase-browser.ts`: clients Supabase para uso em Server Components e Client Components respectivamente.
- `modules/auth/api/auth.ts`: `signIn(email, password)`, `signOut()`.
- Sem qualquer rota ou componente de "cadastro"/"esqueci senha automatizado".

## Backend — Guard JWT

- `shared/guards/supabase-auth.guard.ts`: `SupabaseAuthGuard implements CanActivate` — extrai `Authorization: Bearer <token>` do header, valida contra `SUPABASE_JWT_SECRET` (ou via `supabase.auth.getUser(token)`), injeta `request.user`.
- Aplicado globalmente via `app.useGlobalGuards(new SupabaseAuthGuard(...))` em `main.ts`, exceto rota de health-check.
- Todos os `Repository`s dos módulos anteriores passam a usar `request.user.id` como `user_id`, nunca um valor vindo do body/query do cliente.

## Tema claro/escuro

- `modules/home/components/ThemeToggle.tsx`: alterna classe `dark` no `<html>` (Tailwind `darkMode: 'class'`, já configurado na Fase 0).
- Persistência via `localStorage` (`theme = 'light' | 'dark'`), aplicada antes da hidratação via script inline no `layout.tsx` para evitar flash de tema errado.
- `shared/providers/ThemeProvider.tsx`: contexto React simples para expor `theme`/`toggleTheme` aos componentes.

## Testes E2E (Playwright)

Fluxo crítico único coberto ponta a ponta:
1. Acessar app sem login → redirecionado para `/login`.
2. Logar com credenciais de teste (ambiente de staging/local, nunca produção).
3. Lançar uma receita.
4. Lançar uma despesa.
5. Verificar que o card "Saldo" na Início reflete a diferença.
6. Logout e confirmar retorno ao `/login`.

## Deploy

- **Frontend (Vercel)**: conectar repositório GitHub `fparmezani/saldix`, root directory `src/frontend`, variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL` apontando para a URL pública do backend).
- **Backend (Railway ou Render)**: root directory `src/backend`, build `pnpm --filter backend build`, start `node dist/main`, variáveis (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `PORT`).
- CORS do Nest liberado apenas para o domínio da Vercel em produção (não `*`).
- Nenhuma credencial de produção commitada — todas via variáveis de ambiente da própria plataforma de deploy.

## Padrões de projeto aplicados

- **Guard** (padrão do próprio Nest, análogo a um Decorator/Interceptor) centraliza a validação de autenticação, evitando repetição em cada controller.
