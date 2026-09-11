# Fase 7 — Patrimônio — Requirements

## Contexto

Referência: aba "Patrimônio" do vídeo — soma de liquidez (contas em bancos), investimentos (Fase 6), bens (imóveis, veículos — com valor de veículo sugerido pela Tabela FIPE), menos dívidas/financiamentos vinculados a esses bens.

## User stories

1. Como usuário, quero cadastrar contas de liquidez (ex: "Conta Bradesco", R$500) que representam dinheiro disponível fora de investimentos.
2. Como usuário, quero cadastrar bens do tipo "imóvel" com um valor de mercado estimado.
3. Como usuário, quero cadastrar bens do tipo "veículo", buscando o valor pela Tabela FIPE (marca, modelo, ano).
4. Como usuário, quero cadastrar uma dívida/financiamento vinculado a um bem (ex: financiamento do apartamento) com o saldo devedor atual.
5. Como usuário, quero ver o patrimônio líquido total: liquidez + investimentos + bens − dívidas.
6. Como usuário, quero atualizar o saldo devedor de uma dívida conforme vou pagando (amortizando), refletindo no patrimônio.

## Critérios de aceite

- Dado liquidez total de R$1.572 e investimentos totais de R$135.000 (Fase 6), quando não há bens/dívidas, então o patrimônio mostrado é R$136.572.
- Dado que cadastro um imóvel (terreno) de R$200.000, quando eu vejo o patrimônio, então ele soma R$200.000 ao total.
- Dado que cadastro um apartamento de R$600.000 e uma dívida de financiamento vinculada de R$450.000, quando eu vejo o patrimônio, então o efeito líquido desse bem é +R$150.000 (600.000 − 450.000).
- Dado que amortizo a dívida do apartamento para R$400.000, quando eu salvo, então o patrimônio líquido aumenta em R$50.000.
- Dado que cadastro um veículo Volkswagen Gol 1.0 ano 2014, quando eu busco na Tabela FIPE, então o sistema sugere um valor de mercado (ex: R$31.982) que posso aceitar ou ajustar manualmente.
- O patrimônio total exibido é sempre: `liquidez + investimentos + Σ(valor do bem) − Σ(saldo devedor das dívidas)`.

## Fora de escopo nesta fase

- Integração real e automática com a API da Tabela FIPE (pode ser feita via consulta manual/mock nesta fase — API real fica marcada como melhoria futura, atrás de uma interface `VehiclePricingProvider` para permitir troca de fonte sem reescrever o domínio).
