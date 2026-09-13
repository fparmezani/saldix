import { lookupBankName } from './bank-code-directory';

describe('lookupBankName', () => {
  it('resolves a known COMPE code to its bank name', () => {
    expect(lookupBankName('260')).toBe('Nubank');
    expect(lookupBankName('341')).toBe('Itaú');
  });

  it('pads short codes with leading zeros before lookup', () => {
    expect(lookupBankName('1')).toBe('Banco do Brasil');
  });

  it('falls back to a generic label for an unknown code instead of failing', () => {
    expect(lookupBankName('999')).toBe('Banco não identificado');
  });
});
