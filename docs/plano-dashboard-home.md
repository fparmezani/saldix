# Home — painel financeiro do Saldix

## Objetivo

Responder rapidamente: como estou, para onde meu dinheiro vai, o que deve acontecer nos próximos meses e qual ação preciso tomar. Os atalhos passam a ser secundários. Referências: imagens Multicap 113529 (indicadores, períodos e evolução), 102616 (lista e distribuição em cards separados), 114233 e 114356 (reserva e progresso).

## Composição proposta

1. Cabeçalho com período, modo Histórico/Projeção e ação “Novo lançamento”.
2. Quatro indicadores: receitas, despesas, resultado e valor planejado para investir. Mostrar intervalo exato e rótulos de realizado/previsto.
3. Card amplo com gráfico de linhas de receitas e despesas; card lateral com rosca de despesas por categoria, valores absolutos e percentuais. Manter tabela acessível equivalente.
4. Investimentos: valor investido, valor atual e ganho/perda; distribuição por tipo em rosca. Data de referência explícita. Não apresentar o saldo atual como se fosse uma série histórica.
5. Reserva: meses cobertos e progresso; metas: próximas metas e aporte necessário; pendências: recebimentos futuros e compromissos registrados.
6. Atalhos compactos para os módulos, abaixo dos indicadores principais.

No celular: indicadores em duas colunas quando couberem, gráficos empilhados, controles de período quebrando linha e ações acessíveis sem rolagem horizontal. Em desktop: proporção aproximada 2:1 entre evolução e composição, com largura de conteúdo limitada.

## Períodos e significado

- Mês atual, 3 meses, 6 meses, 1 ano e personalizado (início/fim).
- Histórico: intervalos passados terminando no mês atual; mês em andamento explicitamente parcial.
- Projeção: mês atual e meses seguintes. Exibir datas exatas para evitar ambiguidade entre “últimos” e “próximos”.
- Personalizado: validar início <= fim e limitar amplitude conforme desempenho medido. Granularidade diária no mês, mensal em períodos maiores.
- Preservar modo e intervalo na URL. Filtros financeiros afetam os gráficos de fluxo; saldo atual de investimentos/reserva permanece identificado como posição atual.

## Regras para projeções

- Separar três séries: realizado, previsto contratado e estimativa opcional.
- Realizado: lançamentos registrados. Previsto: rendas recorrentes ativas, despesas fixas e parcelas futuras, recebimentos futuros pendentes por data prevista.
- Evitar duplicar a ocorrência já materializada de uma recorrência ou um recebimento confirmado; usar os vínculos do modelo, não deduplicação por descrição/valor.
- Renda cancelada não continua na previsão; reagendamento move o recebimento; parcelas terminam no prazo cadastrado.
- Gastos variáveis futuros não são zero por definição: apresentar “não estimados”. Uma média histórica pode ser adicionada como cenário opcional, com janela e hipótese explícitas e exclusão das parcelas já contabilizadas.
- Linha contínua para realizado e tracejada para previsto, acompanhadas de legenda textual. Previsão não altera nem cria lançamentos.
- Ganhos futuros de investimentos só entram em cenário explicitamente configurado. Não extrapolar rentabilidade passada automaticamente.
- Diferenciar resultado do período (receitas − despesas) de saldo disponível após investimento planejado. Sem saldo inicial bancário confiável, não chamar resultado acumulado de saldo em conta.
- Para comparação com período anterior, mostrar diferença em reais; se base anterior for zero, percentual fica “não aplicável”. Meses parciais não devem gerar conclusões enganosas.

## Dados e implementação

Hoje `/budget/overview?months=` oferece série mensal de receitas/despesas; os módulos de investimentos e reserva oferecem posições atuais. O endpoint atual não resolve sozinho intervalo personalizado, projeções e posições históricas.

1. Consolidar contrato de consulta read-only com início, fim, modo e granularidade. Autenticação e isolamento por usuário em todas as fontes.
2. Acrescentar agregação por categoria e composição de investimentos; usar centavos/aritmética decimal e datas locais sem deslocamento UTC.
3. Implementar calculador de previsão independente, sem os efeitos de materialização eventualmente existentes nas consultas operacionais. Revisar os serviços antes de reutilizá-los.
4. Montar Home com histórico real, indicadores, gráficos e posições atuais usando componentes compartilhados.
5. Habilitar projeção e personalizado após validar o contrato; não expor filtros que apenas trocam rótulos sem alterar dados.
6. Comparação histórica de investimentos depende de snapshots/transações históricas. Até existir essa fonte, mostrar posição atual e a limitação claramente.

## Critérios de aceite

- Totais dos cards reconciliam com gráficos e lançamentos do intervalo.
- Verificar vazio, erro de uma fonte, atualização parcial, números negativos e muitos itens.
- Testar recorrências já materializadas, recebimento confirmado/reagendado, parcelas finais e intervalo atravessando o ano.
- Cada gráfico funciona nos temas claro/escuro; teclado, foco, contraste e versão móvel validados.
- Sem indicadores zerados durante falha ou carregamento; retry por fonte e preservação de dados já disponíveis.
- Carregamento paralelo das fontes independentes, cache por usuário/período e ausência de chamadas repetidas por card.

## Sequência de entrega

A. Base visual e acessibilidade compartilhada (em implementação nesta rodada).
B. Home com histórico, investimentos atuais e distribuição.
C. Período personalizado e comparação equivalente.
D. Projeções verificadas e cenários opcionais.

A Home completa descrita aqui é um plano de implementação; filtros personalizados e projeções ainda não estão implementados.
