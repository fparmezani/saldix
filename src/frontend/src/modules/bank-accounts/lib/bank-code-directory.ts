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
 * Preview local (sem round-trip ao backend) do nome do banco enquanto o
 * usuário digita o código. O nome definitivo é resolvido pelo backend na
 * criação — esta cópia só existe para feedback instantâneo no formulário.
 */
export function previewBankName(bankCode: string): string | null {
  const normalized = bankCode.trim().padStart(3, '0');
  if (!/^\d{3}$/.test(normalized)) return null;
  return BANK_CODE_TO_NAME[normalized] ?? 'Banco não identificado';
}

/** Lista de bancos conhecidos para preencher o seletor do formulário, sem o usuário precisar decorar o código. */
export const KNOWN_BANKS: { code: string; name: string }[] = Object.entries(BANK_CODE_TO_NAME)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
