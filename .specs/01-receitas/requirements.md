# Fase 1 — Receitas (Orçamento > Receita) — Requirements

## Contexto

Referência: vídeo Multicap (`docs/Multicap/Tanscript.txt`, screenshots do bloco "Orçamento > Receita"). É a primeira aba dentro do módulo Orçamento: cadastro da renda principal, rendas extras e recebimentos futuros, com navegação mês a mês.

## User stories

1. Como usuário, quero cadastrar minha renda principal (ex: salário) para um mês, para saber quanto entra de receita naquele período.
2. Como usuário, quero adicionar rendas extras (ex: venda de bolo de pote) além da renda principal, para que a planilha calcule a % de cada tipo de renda sobre o total.
3. Como usuário, quero lançar um "recebimento futuro" (data ainda não chegou), para me planejar sem que ele conte na receita atual até ser confirmado.
4. Como usuário, quero marcar um recebimento futuro como "recebido" quando o dinheiro efetivamente entrar, para que ele passe a contar na receita do mês.
5. Como usuário, quero poder reagendar a data de um recebimento futuro não confirmado, para casos em que a pessoa atrasa o pagamento.
6. Como usuário, quero navegar entre meses (anterior/próximo) na tela de Orçamento, para ver/cadastrar receitas de qualquer período.
7. Como usuário, quero ver um gráfico de pizza/rosca com a % de cada tipo de renda (principal vs. extra) sobre o total do mês.
8. Como usuário, quero cadastrar uma renda como **recorrente**, informando um dia fixo do mês (ex: dia 5) e o valor, para não precisar lançar manualmente todo mês.
9. Como usuário que recebe uma mesma fonte de renda em mais de uma parcela por mês (ex: 2x por mês, dias 1 e 15), quero poder cadastrar duas rendas recorrentes separadas (uma por dia), para que cada uma seja lançada corretamente sem depender de datas absolutas que possam "vazar" para o mês seguinte.
10. Como usuário, quero poder desativar uma renda recorrente (sem apagar o histórico já gerado), para parar de receber uma fonte de renda que acabou.

## Critérios de aceite

- Dado que cadastro uma renda principal de R$5.000 em um mês, quando eu abro a tela de Orçamento daquele mês, então o card "Receita" mostra R$5.000 e o gráfico mostra 100% para "Renda Principal".
- Dado que já tenho R$5.000 de renda principal, quando eu adiciono uma renda extra de R$350, então o card "Receita" passa a mostrar R$5.350 e o gráfico mostra ~93%/7%.
- Dado que crio um recebimento futuro de R$200 com data 01/10, quando eu estou vendo o mês de setembro, então esse valor **não** soma na receita de setembro.
- Dado um recebimento futuro pendente no mês vigente, quando a data chega, então ele aparece marcado com um indicador visual (ex: ícone de "pendente") até ser confirmado.
- Dado um recebimento futuro pendente, quando eu marco como "recebido", então o valor passa a contar na receita do mês da data confirmada.
- Dado um recebimento futuro pendente, quando eu altero a data prevista, então ele passa a aparecer no novo mês, mantendo o status "pendente".
- Dado que estou no mês de setembro, quando eu clico em "próximo mês", então a tela mostra os dados de outubro (vazios se nada cadastrado).
- Nenhuma renda deve ser visível para outro usuário além do autenticado (RLS por `user_id`).
- Dado que cadastro uma renda recorrente com dia 5 e valor R$1.200, quando eu visito o mês de outubro (mesmo sem nunca ter aberto essa tela antes), então uma renda de R$1.200 aparece automaticamente com `referenceMonth` = outubro.
- Dado uma renda recorrente com dia 31, quando o mês visitado tem menos de 31 dias (ex: fevereiro), então a renda é gerada no último dia daquele mês (ex: 28/02), sem erro.
- Dado uma renda recorrente ativa, quando eu a desativo, então nenhuma nova ocorrência é gerada nos meses seguintes, mas as ocorrências já geradas em meses passados continuam visíveis.
- Dado que uma renda recorrente já gerou a ocorrência do mês corrente, quando o backend processa novamente aquele mês, então a ocorrência não é duplicada (idempotência).

## Fora de escopo nesta fase

- Despesas (Fase 2), cálculo de saldo final (depende de despesas), investir % (Fase 3).
