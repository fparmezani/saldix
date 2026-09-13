export interface CardSection {
  cardIndex: number;
  lastDigits: string | null;
  suggestedName: string;
  text: string;
}

const CARD_MARKER_PATTERN = /(?:cart[aã]o\s*(?:final|n[uú]mero)?|final)[\s:-]*\*{0,4}\s*(\d{4})/i;

/**
 * Tenta dividir o texto da fatura em blocos por cartão, procurando marcadores
 * tipo "Cartão final 1234". Sem marcador confiável, devolve o texto inteiro
 * como um único cartão — nunca falha, só degrada para "1 cartão só".
 */
export function detectCardSections(rawText: string): CardSection[] {
  const lines = rawText.split('\n');
  const markers: { lineIndex: number; lastDigits: string }[] = [];

  lines.forEach((line, index) => {
    const match = line.match(CARD_MARKER_PATTERN);
    if (match) {
      markers.push({ lineIndex: index, lastDigits: match[1] });
    }
  });

  if (markers.length === 0) {
    return [{ cardIndex: 0, lastDigits: null, suggestedName: 'Cartão 1', text: rawText }];
  }

  return markers.map((marker, i) => {
    const start = marker.lineIndex;
    const end = i + 1 < markers.length ? markers[i + 1].lineIndex : lines.length;
    return {
      cardIndex: i,
      lastDigits: marker.lastDigits,
      suggestedName: `Cartão final ${marker.lastDigits}`,
      text: lines.slice(start, end).join('\n'),
    };
  });
}
