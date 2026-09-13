# Fase 10 — Cartões — Requirements

## Contexto

Feature solicitada pelo usuário fora do roteiro original do vídeo Multicap (que só menciona "Open Finance" como integração de banco/cartão, marcada como fora de escopo do projeto). Aqui o cadastro de cartões é manual ou via upload da fatura em PDF, sem integração bancária real.

## Decisões validadas com o usuário

1. **Formato de upload**: apenas PDF com texto selecionável (baixado do site/app do banco). Fotos/imagens escaneadas (que exigiriam OCR) estão fora de escopo.
2. **Sugestão de categoria**: heurística de palavra-chave contra as categorias já cadastradas pelo usuário (Fase 2). Sem IA/LLM externa — sem custo, sem nova dependência paga.
3. **Despesa fixa/recorrente**: o usuário marca manualmente via checkbox na tela de revisão. O sistema não tenta detectar recorrência automaticamente comparando faturas anteriores.
4. **Parcela no meio da série** (ex: fatura mostra "Farmácia 5/12"): registra da parcela atual em diante (5/12 até 12/12) apenas. Parcelas 1 a 4 não são criadas retroativamente — assume-se que já foram tratadas em importações de faturas anteriores, evitando duplicidade.

## User stories

1. Como usuário, quero cadastrar um cartão manualmente (nome + últimos 4 dígitos opcionais).
2. Como usuário, quero fazer upload do PDF de uma fatura e ver o sistema extrair automaticamente os lançamentos.
3. Como usuário, quero que o sistema identifique se a fatura contém mais de um cartão (titular + adicionais) e separe os lançamentos por cartão.
4. Como usuário, quero ver uma tela de revisão grande com todos os lançamentos encontrados antes de qualquer gravação, podendo para cada linha: corrigir a descrição, corrigir o valor, escolher/trocar a categoria sugerida, marcar como despesa recorrente/fixa, ou descartar a linha inteira (ex: "SALDO ANTERIOR" não é um gasto real).
5. Como usuário, quero que lançamentos parcelados detectados (ex: "Farmácia 5/12") gerem automaticamente as parcelas restantes (6/12 a 12/12), sem eu precisar cadastrar uma por uma.
6. Como usuário, quero que nada seja gravado no banco até eu clicar em "Confirmar importação".

## Critérios de aceite

- Dado um PDF de fatura com um lançamento "UBER *TRIP R$ 25,00 05/09", quando eu faço upload, então a tela de revisão mostra essa linha com valor R$25,00, data 05/09, e categoria sugerida "Transporte" (se essa categoria existir no meu cadastro).
- Dado um lançamento sem nenhuma palavra-chave reconhecida, quando o sistema não encontra correspondência, então a categoria sugerida fica em branco e eu escolho manualmente.
- Dado um lançamento "Farmácia 5/12" de R$45,00, quando confirmo a importação, então são criados 8 registros de despesa variável (parcelas 5 a 12), todos de R$45,00, mesmo grupo de parcelamento, em meses consecutivos a partir do mês da fatura.
- Dado que desmarco a caixa "incluir" de uma linha antes de confirmar, quando eu confirmo, então essa linha não gera nenhum registro.
- Dado que marco uma linha como "recorrente", quando eu confirmo, então ela é criada em Despesa Fixa (não Variável).
- Dado que a fatura tem lançamentos de 2 cartões diferentes, quando o sistema detecta os marcadores de separação, então a tela de revisão agrupa os lançamentos por cartão, permitindo nomear cada cartão novo antes de confirmar.
- Dado que o sistema não consegue detectar separação de cartões no texto, quando isso acontece, então todos os lançamentos ficam agrupados como um único cartão (sem erro).
- Nenhum cartão ou despesa deve ser visível para outro usuário (RLS).

## Fora de escopo nesta fase

- OCR de fatura em imagem/foto.
- Detecção automática de recorrência comparando múltiplas faturas.
- Integração real com Open Finance/API de bancos.
- Sugestão de categoria via IA/LLM.
- Suporte a formatos de fatura muito distintos entre bancos — o parser é heurístico e best-effort; a tela de revisão existe justamente para corrigir extrações imperfeitas.
