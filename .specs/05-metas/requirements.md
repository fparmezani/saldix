# Fase 5 — Metas — Requirements

## Contexto

Referência: tela "Metas" do vídeo (ex: viagem para a neve, R$25.000, em 2 anos → sistema calcula quanto guardar por mês). Suporta múltiplas metas simultâneas, cada uma com seu próprio progresso.

## User stories

1. Como usuário, quero criar uma meta com nome, valor alvo e data alvo.
2. Como usuário, quero que o sistema calcule automaticamente quanto preciso guardar por mês para atingir a meta na data desejada.
3. Como usuário, quero registrar aportes numa meta específica (ex: aportei R$2.600 na meta "Viagem").
4. Como usuário, quero ver a % de progresso de cada meta.
5. Como usuário, quero editar ou excluir uma meta.
6. Como usuário, quero ter múltiplas metas ao mesmo tempo, cada uma independente.

## Critérios de aceite

- Dado que crio a meta "Viagem para a neve", valor R$25.000, data alvo em 24 meses, quando eu salvo, então o sistema mostra "guardar R$1.041,67/mês" (25000/24, arredondado para cima).
- Dado a meta acima sem aportes, quando eu abro a tela, então vejo 0% de progresso.
- Dado que registro um aporte de R$2.600 nessa meta, quando eu vejo a lista de metas, então o progresso mostra 10,4% (2600/25000).
- Dado duas metas diferentes ("Viagem" e "Carro novo"), quando eu registro um aporte, então preciso selecionar explicitamente em qual meta ele entra — aportes nunca somam automaticamente em todas.
- Dado uma meta cuja data alvo já passou sem ser concluída, quando eu abro a tela, então vejo um indicador de "atrasada" (não bloqueia, é só um alerta visual).
- Dado que uma meta atinge 100% do valor, quando eu vejo a lista, então ela aparece marcada como concluída.

## Fora de escopo nesta fase

- Vínculo direto com contas de investimento específicas (Fase 6) — aqui os aportes de meta são só valores agregados, como na reserva de emergência.
