# Fase 4 — Reserva de Emergência — Requirements

## Contexto

Referência: tela "Reserva de Emergência" do vídeo. Escolha entre proteção Básica (6 meses, recomendado CLT/renda fixa) ou Blindada (12 meses, recomendado renda variável/empreendedor), baseada no custo mensal necessário para viver (apenas essenciais, sem lazer).

## User stories

1. Como usuário, quero escolher o tipo de proteção (Básica = 6 meses ou Blindada = 12 meses).
2. Como usuário, quero informar meu custo mensal necessário para viver (só essenciais: aluguel, contas, transporte, escola, saúde — sem lazer).
3. Como usuário, quero que o sistema calcule automaticamente minha meta de reserva (custo mensal × meses de proteção).
4. Como usuário, quero registrar aportes na reserva (ex: depositei R$1.000 na caixinha do Nubank) e ver a % de progresso subir.
5. Como usuário, quero ver visualmente quando atingir 100% (ícone de escudo completo).

## Critérios de aceite

- Dado que escolho proteção Básica e informo custo mensal de R$3.000, quando eu salvo, então a meta calculada é R$18.000 (3.000 × 6).
- Dado que escolho proteção Blindada com o mesmo custo mensal, quando eu salvo, então a meta calculada é R$36.000 (3.000 × 12).
- Dado meta de R$18.000 e nenhum aporte, quando eu abro a tela, então vejo 0% protegido e uma mensagem de incentivo ("hora de começar a se proteger").
- Dado meta de R$18.000, quando eu registro um aporte de R$1.000, então a % de progresso sobe para ~6%.
- Dado que já registrei aportes somando R$18.000, quando eu abro a tela, então vejo 100% e um indicador visual de "protegido" (escudo completo).
- Aportes possuem histórico (data + valor), permitindo ver a evolução ao longo do tempo.
- Alterar o tipo de proteção ou o custo mensal recalcula a meta, mas não afeta os aportes já registrados (o total acumulado permanece).

## Fora de escopo nesta fase

- Vincular os aportes a um investimento específico cadastrado na Fase 6 (aqui é um valor agregado simples, não uma conta de investimento detalhada).
