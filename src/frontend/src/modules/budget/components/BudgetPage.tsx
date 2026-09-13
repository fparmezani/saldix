'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { AppShell } from '@/shared/ui/AppShell';
import { StatCard } from '@/shared/ui/StatCard';
import { formatCurrency } from '@/shared/lib/formatters';
import { MonthNavigator } from './MonthNavigator';
import { IncomeTab } from './IncomeTab';
import { FixedExpensesTab } from './FixedExpensesTab';
import { VariableExpensesTab } from './VariableExpensesTab';
import { InvestAdjustModal } from './InvestAdjustModal';
import { useBudgetSummary } from '../hooks/useBudget';

type BudgetTab = 'income' | 'fixed' | 'variable';

const TABS: { key: BudgetTab; label: string }[] = [
  { key: 'income', label: 'Receita' },
  { key: 'fixed', label: 'Despesa Fixa' },
  { key: 'variable', label: 'Despesa Variável' },
];

function currentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

export function BudgetPage() {
  const [month, setMonth] = useState(currentMonth);
  const [tab, setTab] = useState<BudgetTab>('income');
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const { data: summary } = useBudgetSummary(month);
  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const savedMonth = params.get('month');
      const savedTab = params.get('tab');
      if (savedMonth && /^\d{4}-(0[1-9]|1[0-2])-01$/.test(savedMonth)) setMonth(savedMonth);
      if (savedTab === 'income' || savedTab === 'fixed' || savedTab === 'variable')
        setTab(savedTab);
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);
  function updateLocation(nextMonth: string, nextTab: BudgetTab) {
    setMonth(nextMonth);
    setTab(nextTab);
    const url = new URL(window.location.href);
    url.searchParams.set('month', nextMonth);
    url.searchParams.set('tab', nextTab);
    window.history.replaceState(null, '', url);
  }

  return (
    <AppShell
      title="Orçamento"
      greeting="Olá"
      headerRight={
        <MonthNavigator month={month} onChange={(value) => updateLocation(value, tab)} />
      }
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Receita"
            value={summary ? formatCurrency(summary.totalIncome) : '—'}
            variant="positive"
          />
          <div className="relative">
            <StatCard
              label="Planejado para investir"
              value={summary ? formatCurrency(summary.investAmount) : '—'}
              variant="neutral"
            />
            <button
              type="button"
              onClick={() => setInvestModalOpen(true)}
              aria-label="Ajustar investir"
              className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-gray-300 hover:bg-white/20 hover:text-white"
            >
              <Pencil size={14} />
            </button>
          </div>
          <StatCard
            label="Despesas"
            value={summary ? formatCurrency(summary.totalExpenses) : '—'}
            variant="negative"
          />
          <StatCard
            label="Saldo disponível"
            value={summary ? formatCurrency(summary.balance) : '—'}
            variant={summary && summary.balance < 0 ? 'negative' : 'neutral'}
            hint="Após despesas e valor planejado para investir"
          />
        </div>

        <div className="flex gap-2 border-b border-surface-border">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => updateLocation(month, key)}
              aria-pressed={tab === key}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === key
                  ? 'border-b-2 border-brand text-brand-light'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'income' && <IncomeTab month={month} />}
        {tab === 'fixed' && <FixedExpensesTab month={month} />}
        {tab === 'variable' && <VariableExpensesTab month={month} />}
      </div>

      <InvestAdjustModal
        month={month}
        open={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
      />
    </AppShell>
  );
}
