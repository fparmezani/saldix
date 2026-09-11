# Fase 8 — Polimento, Auth final e Deploy — Requirements

## Contexto

Última fase antes do uso real: protege todas as rotas com o usuário único do Supabase Auth, adiciona o toggle de tema claro/escuro visto na tela Início do vídeo, cobre os fluxos principais com testes E2E e publica em produção (Vercel + Railway/Render + Supabase).

## User stories

1. Como usuário, quero uma tela de login (email/senha) que só aceita minhas credenciais cadastradas manualmente no Supabase.
2. Como usuário, quero ser redirecionado para o login se tentar acessar qualquer página sem estar autenticado.
3. Como usuário, quero que o backend rejeite qualquer requisição sem um JWT válido do Supabase.
4. Como usuário, quero alternar entre tema claro e escuro na tela Início, e que essa preferência persista entre sessões.
5. Como usuário, quero que o app esteja publicado e acessível via URL da Vercel, com backend funcionando em produção.

## Critérios de aceite

- Dado que não estou autenticado, quando eu acesso qualquer rota do app (ex: `/orcamento`), então sou redirecionado para `/login`.
- Dado credenciais corretas, quando eu faço login, então sou redirecionado para a tela Início autenticado.
- Dado credenciais incorretas, quando eu tento logar, então vejo uma mensagem de erro clara, sem expor detalhes internos.
- Dado um token JWT ausente ou inválido, quando o backend recebe uma requisição a qualquer rota protegida, então retorna `401 Unauthorized`.
- Dado que alterno para tema escuro, quando eu recarrego a página, então o tema escuro permanece ativo.
- Dado o deploy finalizado, quando eu acesso a URL pública da Vercel, então a aplicação carrega e consigo logar e usar normalmente, incluindo chamadas ao backend em produção.
- Não deve existir nenhuma rota de cadastro público de novos usuários.

## Fora de escopo nesta fase

- Recuperação de senha via e-mail automatizado (pode ser feita manualmente pelo painel Supabase, já que é uso pessoal com um único usuário).
