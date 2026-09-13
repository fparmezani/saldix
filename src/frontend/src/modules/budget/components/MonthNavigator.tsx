'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function shiftMonth(month: string, delta: number): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

export function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return `${MONTH_LABELS[monthNumber - 1]} de ${year}`;
}

interface MonthNavigatorProps {
  month: string;
  onChange: (month: string) => void;
}

export function MonthNavigator({ month, onChange }: MonthNavigatorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-2 py-1.5">
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, -1))}
        className="rounded p-1 text-gray-300 hover:bg-white/5 hover:text-white"
        aria-label="Mês anterior"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-[9rem] text-center text-sm font-medium text-gray-100">
        {formatMonthLabel(month)}
      </span>
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, 1))}
        className="rounded p-1 text-gray-300 hover:bg-white/5 hover:text-white"
        aria-label="Próximo mês"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
