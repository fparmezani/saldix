'use client';

import { formatCurrency } from '@/shared/lib/formatters';
import { useNetWorthSummary } from '../hooks/useNetWorth';

export function NetWorthSummaryCard() {
  const { data: summary } = useNetWorthSummary();

  if (!summary) return null;

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-4 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
          Patrimônio líquido total
        </p>
        <p
          className={`break-words text-2xl font-bold sm:text-4xl ${summary.netWorth < 0 ? 'text-rose-400' : 'text-emerald-400'}`}
        >
          {formatCurrency(summary.netWorth)}
        </p>
        <p className="mt-2 text-sm text-gray-400">Liquidez + investimentos + bens − dívidas</p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4 [overflow-wrap:anywhere]">
        <div>
          <p className="text-xs text-white/70">Liquidez</p>
          <p className="font-semibold text-white">{formatCurrency(summary.totalLiquidity)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70">Investimentos</p>
          <p className="font-semibold text-white">{formatCurrency(summary.totalInvestments)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70">Bens</p>
          <p className="font-semibold text-white">{formatCurrency(summary.totalAssets)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70">Dívidas</p>
          <p className="font-semibold text-white">-{formatCurrency(summary.totalDebts)}</p>
        </div>
      </div>
    </div>
  );
}
