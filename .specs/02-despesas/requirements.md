# Fase 2 — Despesas Fixas e Variáveis — Requirements

## Contexto

Referência: bloco "Orçamento > Despesa Fixa" e "Despesa Variável" do vídeo Multicap. Inclui também gerenciamento de categorias (nome + cor).

## User stories

1. Como usuário, quero criar categorias personalizadas (nome + cor) para classificar meus gastos.
2. Como usuário, quero editar nome/cor de uma categoria existente.
3. Como usuário, quero lançar uma despesa fixa (ex: aluguel) com valor, dia de vencimento e categoria.
4. Como usuário, quero lançar uma despesa variável (ex: mercado, iFood) com data, valor, descrição e categoria — sempre gasto por gasto, nunca a fatura inteira do cartão.
5. Como usuário, quero marcar uma despesa variável como parcelada (ex: 5x de R$40), e o sistema deve gerar automaticamente as parcelas nos meses seguintes com rótulo "1/5", "2/5" etc.
6. Como usuário, quero filtrar despesas variáveis por categoria e por mês.
7. Como usuário, quero ver o card de resumo "Despesas" e "Saldo" atualizados conforme lanço gastos.
8. Como usuário, quero ver um gráfico de % de gasto por categoria.

## Critérios de aceite

- Dado que crio a categoria "Casa" com cor azul, quando eu abro o formulário de despesa fixa, então "Casa" aparece na lista de categorias selecionáveis.
- Dado que lanço uma despesa fixa de R$1.330 (aluguel, vencimento dia 10, categoria Casa), quando eu vejo o card "Despesas", então ele reflete esse valor somado às demais despesas fixas do mês.
- Dado que lanço uma despesa variável de R$89 (café da manhã, categoria Mercado, data 05/09), quando eu vejo a lista de despesas variáveis do mês, então ela aparece ordenada por data.
- Dado que marco uma despesa de R$200 como parcelada em 5x, quando eu salvo, então o sistema cria 5 registros de R$40 cada, um por mês consecutivo a partir da data informada, com label "1/5" a "5/5".
- Dado que tenho despesas em 3 categorias diferentes, quando eu aplico um filtro por categoria "Lazer" no mês atual, então só aparecem as despesas variáveis daquela categoria naquele mês.
- Dado receita R$5.350 e despesas fixas+variáveis totalizando R$3.250, quando vejo o card "Saldo", então ele mostra R$2.100 (receita − despesas, sem considerar investir ainda — isso é Fase 3).
- Nenhuma despesa/categoria deve ser visível para outro usuário (RLS por `user_id`).

## Fora de escopo nesta fase

- Bloco "Investir" e cálculo final de saldo líquido pós-investimento (Fase 3).
- Importação de extrato bancário / Open Finance (fora do escopo do projeto).
