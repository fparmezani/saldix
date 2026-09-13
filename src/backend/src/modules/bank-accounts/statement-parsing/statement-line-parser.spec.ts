import { parseTransactionLines } from './statement-line-parser';

describe('parseTransactionLines', () => {
  it('extracts a simple transaction line', () => {
    const result = parseTransactionLines('05/09  UBER *TRIP  25,00', 2026);

    expect(result).toEqual([
      {
        date: '2026-09-05',
        description: 'UBER *TRIP',
        amount: 25,
        installmentNumber: null,
        installmentTotal: null,
      },
    ]);
  });

  it('detects an installment suffix and strips it from the description', () => {
    const result = parseTransactionLines('05/09  FARMACIA SAO JOAO 5/12  45,00', 2026);

    expect(result[0].description).toBe('FARMACIA SAO JOAO');
    expect(result[0].installmentNumber).toBe(5);
    expect(result[0].installmentTotal).toBe(12);
  });

  it('parses amounts with a thousands separator correctly', () => {
    const result = parseTransactionLines('05/09  COMPRA GRANDE  1.234,56', 2026);

    expect(result[0].amount).toBe(1234.56);
  });

  it('ignores negative amounts (credits/payments)', () => {
    const result = parseTransactionLines('05/09  ESTORNO LOJA X  -50,00', 2026);

    expect(result).toHaveLength(0);
  });

  it('ignores known non-transaction keywords even if they match the line pattern', () => {
    const result = parseTransactionLines(
      '01/09  SALDO ANTERIOR  100,00\n05/09  PAGAMENTO EFETUADO  100,00',
      2026,
    );

    expect(result).toHaveLength(0);
  });

  it('ignores lines that do not match the date+description+amount pattern', () => {
    const result = parseTransactionLines('Fatura de Setembro 2026\nVencimento: 10/10/2026', 2026);

    expect(result).toHaveLength(0);
  });

  it('uses the explicit year in the date when present instead of the reference year', () => {
    const result = parseTransactionLines('05/09/2025  ASSINATURA X  19,90', 2026);

    expect(result[0].date).toBe('2025-09-05');
  });

  it('parses multiple valid lines from a multi-line statement', () => {
    const text = ['05/09  UBER *TRIP  25,00', '06/09  IFOOD *IFOOD  45,90', '07/09  NETFLIX.COM  39,90'].join(
      '\n',
    );

    const result = parseTransactionLines(text, 2026);

    expect(result).toHaveLength(3);
    expect(result.map((r) => r.description)).toEqual(['UBER *TRIP', 'IFOOD *IFOOD', 'NETFLIX.COM']);
  });
});
