# Fase 3 — Investir (Orçamento) + Visão Geral — Requirements

## Contexto

Referência: bloco "Investir" dentro do Orçamento (percentual sugerido de 20-50% da renda, ajustável) e a tela "Visão Geral" (gráfico comparativo receitas vs. despesas por período).

## User stories

1. Como usuário, quero que a planilha sugira automaticamente investir 20% da minha receita do mês.
2. Como usuário, quero ajustar esse percentual (ex: 10%, 5%) ou informar um valor fixo em R$ para investir naquele mês.
3. Como usuário, quero ver o saldo final do mês já considerando receita − despesas − valor a investir.
4. Como usuário, quero acessar a tela "Visão Geral" e ver um gráfico com duas linhas (receitas em verde, despesas em vermelho) comparando meses.
5. Como usuário, quero escolher o período do gráfico: mês atual, últimos 3, 6 ou 12 meses.

## Critérios de aceite

- Dado receita de R$5.350 em um mês sem ajuste manual, quando eu abro o bloco Investir, então o valor sugerido é R$1.070 (20%).
- Dado que ajusto o percentual para 10%, quando eu salvo, então o valor sugerido recalcula para R$535 e o saldo do mês aumenta em R$535 em relação ao cenário de 20%.
- Dado que escolho "valor fixo" e informo R$700, quando eu salvo, então o sistema usa R$700 fixo, independente da receita daquele mês (até ser alterado de novo).
- Dado receita R$5.350, despesas R$3.250 e investir R$1.070, quando eu vejo o card "Saldo", então ele mostra R$1.030 (5.350 − 3.250 − 1.070).
- Dado que tenho dados de receita/despesa em 6 meses diferentes, quando eu seleciono "6 meses" na Visão Geral, então o gráfico mostra 6 pontos, um por mês, com a linha verde acima da vermelha nos meses saudáveis.
- Configuração de % ou valor fixo de investir é por mês (pode mudar mês a mês) — dado que configurei 20% em setembro, quando eu vejo outubro sem configuração própria, então o padrão volta a ser 20% (sugestão base do sistema), não o valor fixo de setembro.

## Fora de escopo nesta fase

- Registro efetivo dos aportes de investimento em ativos específicos (isso é Fase 6 — Investimentos). Aqui só se calcula "quanto devo investir este mês", não onde o dinheiro foi de fato investido.
