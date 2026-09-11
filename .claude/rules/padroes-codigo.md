# Padrões de código

## Princípios gerais

- TypeScript estrito (`strict: true`) em todos os pacotes. Nunca usar `any` sem justificativa comentada.
- SOLID como guia geral, principalmente:
  - **Single Responsibility**: um `Service` do Nest cuida de um domínio; um componente React tem uma responsabilidade de UI clara.
  - **Dependency Inversion**: `Service`s dependem de interfaces de `Repository`, não de implementações concretas do Supabase diretamente (facilita troca/mocks em teste).
- Sem código morto, sem abstrações especulativas ("YAGNI"). Não criar generalizações para casos hipotéticos futuros.
- Nomes em português para conceitos de domínio visíveis ao usuário quando fizer sentido (ex: rótulos de UI), mas identificadores de código (variáveis, funções, classes, tabelas) em **inglês**, seguindo convenção do ecossistema JS/TS/Postgres.

## Padrões GoF e afins aplicáveis neste projeto

- **Repository**: cada módulo backend tem um `XRepository` que encapsula chamadas ao Supabase — services nunca chamam o client Supabase diretamente.
- **Strategy**: cálculo de Reserva de Emergência (Básica x Blindada) implementado como estratégias intercambiáveis (`BasicProtectionStrategy`, `ShieldedProtectionStrategy`) atrás de uma interface comum `EmergencyFundStrategy`.
- **Factory**: criação de DTOs/entidades complexas (ex: geração das N parcelas de uma despesa parcelada) centralizada em uma função/factory dedicada, nunca duplicada em múltiplos controllers.
- **Observer / Event Emitter**: usar o `EventEmitter2` do Nest (`@nestjs/event-emitter`) para desacoplar efeitos colaterais entre módulos (ex: ao confirmar um recebimento futuro, emitir evento que o módulo de orçamento escuta para recalcular saldo), em vez de um módulo chamar o outro diretamente.
- **Adapter**: qualquer integração externa (Tabela FIPE, futura B3/Open Finance) deve ficar atrás de uma interface própria do domínio, isolando a lib/API de terceiros.

## Frontend

- Componentes de UI genéricos (`shared/ui`) não conhecem regras de negócio — recebem tudo via props.
- Chamadas HTTP sempre passam por um client tipado em `modules/<nome>/api/`, nunca `fetch` solto dentro de componentes.
- Cache/estado de servidor via TanStack Query; estado local de UI via `useState`/`useReducer`. Evitar bibliotecas de estado global desnecessárias.
- Formulários de lançamento (receita, despesa, meta, etc.) validam no cliente usando os mesmos schemas Zod de `packages/shared-types` sempre que possível, para evitar duplicar regra de validação.

## Backend

- DTOs de entrada validados com `class-validator`/`class-transformer` ou Zod nos controllers — nunca confiar em payload não validado.
- Toda query ao Supabase filtra explicitamente por `user_id` do usuário autenticado (mesmo com RLS habilitado, defesa em profundidade).
- Erros de domínio lançam exceções específicas do Nest (`BadRequestException`, `NotFoundException`, etc.), nunca `throw new Error()` genérico.

## Commits e revisão

- Commits pequenos e descritivos, por tarefa do `tasks.md` do módulo em andamento.
- Toda mudança relevante passa pelo checklist de `.claude/agents/code-reviewer.md` antes de ser considerada concluída.
