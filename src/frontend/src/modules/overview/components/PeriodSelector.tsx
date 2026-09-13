'use client';

const PERIODS = [
  { label: 'Mês atual', months: 1 },
  { label: '3 meses', months: 3 },
  { label: '6 meses', months: 6 },
  { label: '12 meses', months: 12 },
];

interface PeriodSelectorProps {
  months: number;
  onChange: (months: number) => void;
}

export function PeriodSelector({ months, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-surface-border bg-surface-card p-1">
      {PERIODS.map((period) => (
        <button
          key={period.months}
          type="button"
          aria-pressed={months === period.months}
          onClick={() => onChange(period.months)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            months === period.months
              ? 'bg-brand text-black'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
