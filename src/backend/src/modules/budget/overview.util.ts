/**
 * Gera os últimos `count` meses terminando em `anchorMonth` (inclusive), em ordem cronológica.
 */
export function buildMonthRange(count: number, anchorMonth: string): string[] {
  const [year, month] = anchorMonth.split('-').map(Number);
  const months: string[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(Date.UTC(year, month - 1 - i, 1));
    months.push(
      `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`,
    );
  }

  return months;
}

export function currentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;
}
