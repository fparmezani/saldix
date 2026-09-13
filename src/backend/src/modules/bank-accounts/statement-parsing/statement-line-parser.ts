export interface RawTransactionLine {
  date: string;
  description: string;
  amount: number;
  installmentNumber: number | null;
  installmentTotal: number | null;
}

const LINE_PATTERN =
  /^(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\s+(.+?)\s+(-?)(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})\s*$/;
const INSTALLMENT_SUFFIX_PATTERN = /\s+(\d{1,2})\/(\d{1,2})\s*$/;

/** Linhas que batem no padrão data+valor mas não são gastos reais (saldo, totais, pagamento). */
const IGNORED_KEYWORDS = [
  'saldo anterior',
  'pagamento efetuado',
  'pagamento recebido',
  'total desta fatura',
  'total da fatura',
  'limite dispon',
  'encargos',
  'juros',
];

/**
 * Extrai lançamentos candidatos de um texto de fatura já extraído do PDF.
 * Heurística de melhor esforço (formatos variam por banco) — falsos negativos/positivos
 * são esperados e corrigidos pelo usuário na tela de revisão antes de qualquer gravação.
 */
export function parseTransactionLines(rawText: string, referenceYear: number): RawTransactionLine[] {
  const results: RawTransactionLine[] = [];

  for (const rawLine of rawText.split('\n')) {
    const trimmed = rawLine.trim();
    const match = trimmed.match(LINE_PATTERN);
    if (!match) continue;

    const [, dateStr, descRaw, negativeSign, amountStr] = match;
    if (negativeSign === '-') continue;

    const lowerDesc = descRaw.toLowerCase();
    if (IGNORED_KEYWORDS.some((keyword) => lowerDesc.includes(keyword))) continue;

    let description = descRaw.trim();
    let installmentNumber: number | null = null;
    let installmentTotal: number | null = null;

    const installmentMatch = description.match(INSTALLMENT_SUFFIX_PATTERN);
    if (installmentMatch) {
      const num = Number(installmentMatch[1]);
      const total = Number(installmentMatch[2]);
      if (num >= 1 && total >= num && total <= 99) {
        installmentNumber = num;
        installmentTotal = total;
        description = description.slice(0, installmentMatch.index).trim();
      }
    }

    if (!description) continue;

    const amount = parseAmount(amountStr);
    if (amount <= 0) continue;

    results.push({
      date: normalizeDate(dateStr, referenceYear),
      description,
      amount,
      installmentNumber,
      installmentTotal,
    });
  }

  return results;
}

function parseAmount(amountStr: string): number {
  return Number(amountStr.replace(/\./g, '').replace(',', '.'));
}

function normalizeDate(dateStr: string, referenceYear: number): string {
  const parts = dateStr.split('/').map(Number);
  const [day, month, yearPart] = parts;
  const year = yearPart === undefined ? referenceYear : yearPart < 100 ? 2000 + yearPart : yearPart;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
