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

## Redesenho — categorias e ativos com cota (pós-lançamento)

Motivação: o tipo em texto livre não permitia agrupar a carteira por categoria nem planejar alocação — o usuário queria cadastrar FIIs/Ações/Cripto com ticker, quantidade e preço, e acompanhar se cada categoria está com o percentual-alvo batendo 100% entre os ativos que a compõem.

### User stories adicionais

6. Como usuário, quero classificar cada investimento numa categoria fechada (Renda Fixa, FIIs, Ações, Cripto, Outros) em vez de digitar um tipo livre.
7. Como usuário, ao cadastrar um ativo de FIIs/Ações/Cripto, quero informar o ticker, a quantidade de cotas e o preço de mercado do dia, e ver o valor total sugerido automaticamente (quantidade × preço) — mas continuar podendo ajustar esse valor à mão.
8. Como usuário, quero informar um percentual-alvo para cada ativo dentro da sua categoria (ex: 2 FIIs a 50%/50%) e ver quanto já está alocado, sem ser bloqueado caso a soma ainda não feche 100%.
9. Como usuário, quero que Renda Fixa e Outros continuem simples (nome + valor investido + valor atual), sem os campos de cota que não fazem sentido pra eles.

### Critérios de aceite adicionais

- Dado que cadastro um FII "MXRF11" com quantidade 100 e preço de mercado R$10,50, quando abro o formulário, então valor investido e valor atual já vêm sugeridos em R$1.050,00, editáveis.
- Dado que cadastro 2 FIIs com percentual-alvo 50% cada, quando vejo a seção "FIIs", então o indicador mostra "100% alocado de 100%".
- Dado que só um dos 2 FIIs acima está cadastrado (50%), quando vejo a seção "FIIs", então o indicador mostra "50% alocado de 100%" em cor de aviso, e o cadastro do primeiro ativo **não é bloqueado** por isso.
- Dado que cadastro um investimento "Renda Fixa", quando vejo o formulário, então não aparecem campos de ticker/quantidade/preço/percentual.
- Nenhum ativo de categoria fora de {fiis, acoes, cripto} pode ter ticker/quantidade/preço/percentual preenchidos (garantido também por constraint no banco).

### Fora de escopo neste redesenho

- Busca automática de preço de mercado (API de cotações) — o preço é sempre digitado manualmente; ver Design para o porquê de não haver um Adapter aqui.
- Bloqueio duro ao salvar um ativo cuja categoria não soma 100% — é só um indicador informativo, calculado no resumo.
- Editar a categoria de um investimento já cadastrado pela tela de atualização — para trocar de categoria, apaga e recadastra.
