'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CurrentPosition } from './CurrentPosition';
import { AppShell } from '@/shared/ui/AppShell';
import { StatCard } from '@/shared/ui/StatCard';
import { formatCurrency } from '@/shared/lib/formatters';
import { useOverview } from '../hooks/useOverview';
import { IncomeExpenseLineChart } from './IncomeExpenseLineChart';
import { PeriodSelector } from './PeriodSelector';

export function OverviewPage() {
  const [months, setMonths] = useState(3);
  const { data, isLoading, isError, refetch } = useOverview(months);
  const income = data?.reduce((sum, point) => sum + point.totalIncome, 0) ?? 0;
  const expenses = data?.reduce((sum, point) => sum + point.totalExpenses, 0) ?? 0;

  return (
    <AppShell
      title="Visão geral"
      greeting="Olá"
      headerRight={<PeriodSelector months={months} onChange={setMonths} />}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Receitas do período"
          value={data ? formatCurrency(income) : '—'}
          variant="positive"
        />
        <StatCard
          label="Despesas do período"
          value={data ? formatCurrency(expenses) : '—'}
          variant="negative"
        />
        <StatCard
          label="Resultado do período"
          value={data ? formatCurrency(income - expenses) : '—'}
          hint="Receitas menos despesas"
          variant={income - expenses < 0 ? 'negative' : 'neutral'}
        />
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-400">Seu resumo financeiro em um só lugar.</p>
        <Link
          href="/orcamento"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-black hover:bg-brand-dark"
        >
          Registrar receita ou despesa →
        </Link>
      </div>
      <div className="rounded-xl2 border border-surface-border bg-surface-card p-4 sm:p-6">
        <h2 className="mb-2 text-lg font-semibold">Evolução de receitas e despesas</h2>
        <p className="mb-6 text-sm text-gray-400">
          Valores registrados nos últimos {months} {months === 1 ? 'mês' : 'meses'}, incluindo o
          atual.
        </p>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {isError && (
          <p role="alert" className="text-sm text-rose-400">
            Não foi possível atualizar o período.{' '}
            <button type="button" onClick={() => refetch()} className="underline">
              Tentar novamente
            </button>
          </p>
        )}
        {data &&
          (income === 0 && expenses === 0 ? (
            <p className="py-12 text-center text-gray-400">
              Ainda não há movimentações neste período. Registre receitas e despesas no Orçamento.
            </p>
          ) : (
            <IncomeExpenseLineChart points={data} />
          ))}
      </div>
      <CurrentPosition />
    </AppShell>
  );
}
