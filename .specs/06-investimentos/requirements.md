# Fase 6 — Investimentos — Requirements

## Contexto

Referência: aba "Investimentos" do vídeo — cadastro de ativos/caixinhas (ex: "Caixinha Nubank", Renda Fixa), com valor investido (aportado) vs. valor atual (com rendimento), calculando rentabilidade em % e R$.

## User stories

1. Como usuário, quero cadastrar um investimento com nome, tipo (ex: Renda Fixa, Ações, Cripto) e valor investido inicial.
2. Como usuário, quero atualizar periodicamente o "valor atual" de um investimento conforme ele rende.
3. Como usuário, quero ver, para cada investimento, quanto ele rendeu em R$ e em %.
4. Como usuário, quero aumentar o "valor investido" quando fizer um novo aporte no mesmo investimento (sem perder o histórico do que já tinha rendido).
5. Como usuário, quero ver a soma total de todos os meus investimentos.

## Critérios de aceite

- Dado que cadastro "Caixinha Nubank", Renda Fixa, valor investido R$2.000, valor atual R$2.000, quando eu salvo, então a rentabilidade mostrada é 0% / R$0.
- Dado que atualizo o valor atual para R$2.400 (mantendo valor investido em R$2.000), quando eu vejo a lista, então a rentabilidade mostra +20% / +R$400.
- Dado que faço um novo aporte de R$500 nesse investimento (valor investido passa a R$2.500), quando eu salvo sem alterar o valor atual, então a rentabilidade recalcula proporcionalmente (ex: se valor atual ainda não foi atualizado, mostra com base nos R$2.500 investidos vs valor atual informado).
- Dado 3 investimentos cadastrados com valores atuais R$4.900, R$135.000 e R$300, quando eu vejo o resumo, então o total é a soma dos 3 valores atuais.
- Nenhum investimento deve ser visível para outro usuário (RLS).

## Fora de escopo nesta fase

- Integração automática com B3/Open Finance (mencionada no vídeo como "em teste") — fora do escopo do projeto.
- Cálculo de rentabilidade anualizada ou comparação com índices (CDI, Ibovespa) — não mostrado no vídeo, não faz parte do MVP.
