import type { InvestmentCategory } from '@saldix/shared-types';

export const INVESTMENT_CATEGORY_LABELS: Record<InvestmentCategory, string> = {
  renda_fixa: 'Renda Fixa',
  fiis: 'FIIs',
  acoes: 'Ações',
  cripto: 'Cripto',
  outros: 'Outros',
};

export const INVESTMENT_CATEGORY_ORDER: InvestmentCategory[] = [
  'renda_fixa',
  'fiis',
  'acoes',
  'cripto',
  'outros',
];
