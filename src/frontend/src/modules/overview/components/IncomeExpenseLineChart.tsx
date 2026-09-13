'use client';

import { useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { OverviewPoint } from '@saldix/shared-types';
import { formatCurrency, formatMonthShort } from '@/shared/lib/formatters';

export function IncomeExpenseLineChart({ points }: { points: OverviewPoint[] }) {
  const [mode, setMode] = useState<'bars' | 'lines'>('bars');
  const now = new Date();
  const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const data = points.map((point) => ({
    month: formatMonthShort(point.month),
    partial: point.month.slice(0, 7) === currentMonth,
    income: point.totalIncome,
    expenses: point.totalExpenses,
  }));
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-5 text-sm text-gray-300">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--positive))]" />
            Receitas
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[rgb(var(--negative))]" />
            Despesas
          </span>
        </div>
        <div
          className="flex rounded-lg border border-surface-border p-1"
          aria-label="Visualização do gráfico"
        >
          {(['bars', 'lines'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
              className={
                'rounded-md px-4 text-sm ' +
                (mode === value ? 'bg-brand/15 text-brand-light' : 'text-gray-400')
              }
            >
              {value === 'bars' ? 'Barras' : 'Linhas'}
            </button>
          ))}
        </div>
      </div>
      <div
        className="h-72 w-full sm:h-80"
        aria-label="Receitas e despesas por mês. Valores disponíveis na tabela abaixo."
      >
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 8 }} barGap={6}>
            <CartesianGrid
              vertical={false}
              stroke="rgb(var(--border))"
              strokeDasharray="3 6"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }}
              width={72}
              tickFormatter={(value) =>
                'R$ ' +
                new Intl.NumberFormat('pt-BR', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <Tooltip
              cursor={{ fill: 'rgb(var(--muted) / 0.07)', stroke: 'rgb(var(--border))' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as (typeof data)[number];
                return (
                  <div className="min-w-56 rounded-xl border border-surface-border bg-surface-card p-4 text-sm shadow-xl">
                    <p className="mb-3 font-semibold">
                      {point.month}
                      {point.partial ? ' · em andamento' : ''}
                    </p>
                    <p className="flex justify-between gap-6 text-emerald-400">
                      <span>Receitas</span>
                      <strong>{formatCurrency(point.income)}</strong>
                    </p>
                    <p className="mt-2 flex justify-between gap-6 text-rose-400">
                      <span>Despesas</span>
                      <strong>{formatCurrency(point.expenses)}</strong>
                    </p>
                    <p className="mt-3 flex justify-between gap-6 border-t border-surface-border pt-3">
                      <span>Resultado</span>
                      <strong>{formatCurrency(point.income - point.expenses)}</strong>
                    </p>
                  </div>
                );
              }}
            />
            {mode === 'bars' ? (
              <>
                <Bar
                  dataKey="income"
                  fill="rgb(var(--positive))"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={48}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="expenses"
                  fill="rgb(var(--negative))"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={48}
                  isAnimationActive={false}
                />
              </>
            ) : (
              <>
                <Line
                  type="linear"
                  dataKey="income"
                  stroke="rgb(var(--positive))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'rgb(var(--card))', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
                <Line
                  type="linear"
                  dataKey="expenses"
                  stroke="rgb(var(--negative))"
                  strokeWidth={3}
                  strokeDasharray="5 4"
                  dot={{ r: 4, fill: 'rgb(var(--card))', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {data.every((point) => point.expenses === 0) && (
        <p className="mt-4 text-sm text-gray-400">Nenhuma despesa registrada no período.</p>
      )}
      {data.some((point) => point.partial) && (
        <p className="mt-2 text-xs text-gray-400">
          Mês atual em andamento: valores parciais, sem projeção de fechamento.
        </p>
      )}
      <details className="mt-5 border-t border-surface-border pt-4">
        <summary className="cursor-pointer text-sm text-gray-300">Ver valores por mês</summary>
        <div className="overflow-x-auto">
          <table className="mt-4 w-full text-right text-sm">
            <caption className="sr-only">Valores registrados por mês</caption>
            <thead>
              <tr>
                <th className="py-2 text-left">Mês</th>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.month} className="border-t border-surface-border">
                  <th className="py-3 text-left font-normal">
                    {point.month}
                    {point.partial ? ' (parcial)' : ''}
                  </th>
                  <td>{formatCurrency(point.income)}</td>
                  <td>{formatCurrency(point.expenses)}</td>
                  <td>{formatCurrency(point.income - point.expenses)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
