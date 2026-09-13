const VARIANT_CLASSES = {
  neutral: 'bg-surface-card border border-surface-border text-gray-100',
  positive:
    'bg-surface-card border border-surface-border border-t-2 border-t-emerald-500 text-emerald-400',
  negative:
    'bg-surface-card border border-surface-border border-t-2 border-t-rose-500 text-rose-400',
};

interface StatCardProps {
  label: string;
  value: string;
  variant?: keyof typeof VARIANT_CLASSES;
  hint?: string;
}

export function StatCard({ label, value, variant = 'neutral', hint }: StatCardProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-xl2 p-5 shadow-sm ${VARIANT_CLASSES[variant]}`}>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
      {hint && <span className="text-xs opacity-80">{hint}</span>}
    </div>
  );
}
