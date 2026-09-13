/**
 * Resolve o dia real de ocorrência de uma renda recorrente dentro de um mês,
 * limitando ao último dia do mês quando `recurrenceDay` excede a quantidade de dias
 * (ex: dia 31 em fevereiro vira 28 ou 29).
 */
export function resolveOccurrenceDate(recurrenceDay: number, referenceMonth: string): string {
  const [year, month] = referenceMonth.split('-').map(Number);
  const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(recurrenceDay, lastDayOfMonth);
  return `${referenceMonth.slice(0, 7)}-${String(day).padStart(2, '0')}`;
}
