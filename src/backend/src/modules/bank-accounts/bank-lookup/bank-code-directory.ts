const BANK_CODE_TO_NAME: Record<string, string> = {
  '001': 'Banco do Brasil',
  '033': 'Santander',
  '077': 'Inter',
  '104': 'Caixa Econômica Federal',
  '208': 'BTG Pactual',
  '237': 'Bradesco',
  '260': 'Nubank',
  '336': 'C6 Bank',
  '341': 'Itaú',
  '748': 'Sicredi',
  '756': 'Sicoob',
};

/**
 * Resolve o código COMPE para o nome do banco. Mesmo espírito do
 * `MockFipeProvider` da Fase 7: heurística com fallback, nunca bloqueia
 * o cadastro por não reconhecer o código.
 */
export function lookupBankName(bankCode: string): string {
  const normalized = bankCode.trim().padStart(3, '0');
  return BANK_CODE_TO_NAME[normalized] ?? 'Banco não identificado';
}
