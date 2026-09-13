import { detectCardSections } from './card-section-detector';

describe('detectCardSections', () => {
  it('falls back to a single section when no card marker is found', () => {
    const text = '05/09  UBER *TRIP  25,00\n06/09  IFOOD *IFOOD  45,90';

    const result = detectCardSections(text);

    expect(result).toHaveLength(1);
    expect(result[0].cardIndex).toBe(0);
    expect(result[0].lastDigits).toBeNull();
    expect(result[0].text).toBe(text);
  });

  it('attributes everything to one card when a single marker is present', () => {
    const text = ['Cartão final 1234', '05/09  UBER *TRIP  25,00'].join('\n');

    const result = detectCardSections(text);

    expect(result).toHaveLength(1);
    expect(result[0].lastDigits).toBe('1234');
    expect(result[0].suggestedName).toBe('Cartão final 1234');
  });

  it('splits the text into two sections when two card markers are present', () => {
    const text = [
      'Cartão final 1234',
      '05/09  UBER *TRIP  25,00',
      'Cartão final 5678',
      '06/09  IFOOD *IFOOD  45,90',
    ].join('\n');

    const result = detectCardSections(text);

    expect(result).toHaveLength(2);
    expect(result[0].lastDigits).toBe('1234');
    expect(result[0].text).toContain('UBER *TRIP');
    expect(result[0].text).not.toContain('IFOOD');
    expect(result[1].lastDigits).toBe('5678');
    expect(result[1].text).toContain('IFOOD *IFOOD');
  });

  it('matches the marker case-insensitively', () => {
    const result = detectCardSections('CARTAO FINAL 9999\n05/09  X  10,00');

    expect(result[0].lastDigits).toBe('9999');
  });
});
