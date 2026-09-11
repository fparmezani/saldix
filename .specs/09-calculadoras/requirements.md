# Fase 9 (opcional, pós-MVP) — Calculadoras — Requirements

## Contexto

Referência: aba "Calculadoras" do vídeo — três calculadoras independentes, sem persistência de dados (são simulações pontuais, não cadastros). Fase opcional, só entra depois que as Fases 1–8 estiverem prontas e em uso real.

## User stories

1. Como usuário, quero simular "financiar vs. alugar" um imóvel para decidir qual opção é financeiramente melhor.
2. Como usuário, quero calcular quando vou atingir meu primeiro milhão de patrimônio, dado meu ritmo atual de investimento.
3. Como usuário, quero simular juros compostos: valor inicial, aporte mensal, taxa de juros e período, vendo o total investido vs. total em juros ao longo do tempo.

## Critérios de aceite

- Dado valor inicial R$1.000, aporte mensal R$1.000, taxa 8% a.a., período 5 anos, quando eu clico em calcular, então o sistema mostra valor total investido (R$60.000 + inicial) e total em juros (aprox. conforme fórmula de juros compostos com aportes), exibindo um gráfico com linha de valor investido (preta) e linha de juros acumulados (verde).
- Dado a mesma simulação, quando eu passo o mouse/toco em um ponto do gráfico (ex: mês 20), então vejo o rendimento mensal estimado naquele ponto.
- A calculadora "financiar vs. alugar" recebe: valor do imóvel, entrada, taxa de juros do financiamento, prazo, valor do aluguel equivalente, e retorna qual opção acumula mais patrimônio no mesmo período.
- A calculadora "primeiro milhão" recebe: patrimônio atual (pode vir pré-preenchido do módulo Patrimônio, Fase 7, mas editável), aporte mensal médio, taxa de retorno esperada, e retorna em quantos meses/anos o patrimônio atinge R$1.000.000.
- Nenhuma calculadora persiste dados no banco — são simulações client-side ou stateless no backend.

## Fora de escopo

- Qualquer persistência de simulações salvas para consulta posterior (pode ser considerado em uma fase futura, se o usuário pedir).
