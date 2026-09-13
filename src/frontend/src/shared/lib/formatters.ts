const brlCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value: number): string {
  return brlCurrencyFormatter.format(value);
}

export function formatDate(value: string): string {
  const parts = value.slice(0, 10).split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
}

export function formatPercentage(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

const SHORT_MONTH_LABELS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function formatMonthShort(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return `${SHORT_MONTH_LABELS[monthNumber - 1]}/${String(year).slice(2)}`;
}
