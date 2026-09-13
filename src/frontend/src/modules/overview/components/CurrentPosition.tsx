'use client';

import Link from 'next/link';
import { useInvestmentsSummary } from '@/modules/investments/hooks/useInvestments';
import { useEmergencyFundStatus } from '@/modules/emergency-fund/hooks/useEmergencyFund';
import { useGoals } from '@/modules/goals/hooks/useGoals';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';

export function CurrentPosition() {
  const investments = useInvestmentsSummary();
  const reserve = useEmergencyFundStatus();
  const goals = useGoals();
  const activeGoals = goals.data?.filter((goal) => goal.status === 'active') ?? [];
  const state = (loading: boolean, error: boolean) =>
    loading ? 'Carregando…' : error ? 'Não foi possível carregar.' : 'Ainda não configurado.';
  const card = 'flex flex-col gap-3 rounded-xl2 border border-surface-border bg-surface-card p-5';
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">Seu patrimônio e objetivos</h2>
      <p className="mb-4 mt-1 text-sm text-gray-400">
        Posição atual registrada · independente do período selecionado acima.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className={card}>
          <h3 className="text-sm text-gray-300">Investimentos</h3>
          {investments.data ? (
            <>
              <p className="text-2xl font-semibold">
                {formatCurrency(investments.data.totalCurrent)}
              </p>
              <p className="text-sm text-gray-400">
                Aplicado: {formatCurrency(investments.data.totalInvested)}
              </p>
              <p
                className={
                  'text-sm ' +
                  (investments.data.totalGainAmount < 0 ? 'text-rose-400' : 'text-emerald-400')
                }
              >
                Ganho/perda: {formatCurrency(investments.data.totalGainAmount)} (
                {formatPercentage(investments.data.totalGainPercentage)})
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              {state(investments.isLoading, investments.isError)}
            </p>
          )}
          <Link className="mt-auto pt-2 text-sm font-medium text-brand-light" href="/investimentos">
            Ver investimentos →
          </Link>
        </article>
        <article className={card}>
          <h3 className="text-sm text-gray-300">Reserva de emergência</h3>
          {reserve.data ? (
            <>
              <p className="text-2xl font-semibold">
                {formatCurrency(reserve.data.totalContributed)}
              </p>
              <p className="text-sm text-gray-400">
                Objetivo: {formatCurrency(reserve.data.targetAmount)}
              </p>
              <progress
                aria-label="Progresso da reserva"
                className="h-2 w-full accent-green-600"
                max={100}
                value={Math.max(0, Math.min(100, reserve.data.progressPercentage))}
              />
              <p className="text-sm text-gray-400">
                {formatPercentage(reserve.data.progressPercentage)} do objetivo
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">{state(reserve.isLoading, reserve.isError)}</p>
          )}
          <Link
            className="mt-auto pt-2 text-sm font-medium text-brand-light"
            href="/reserva-emergencia"
          >
            Ver reserva →
          </Link>
        </article>
        <article className={card}>
          <h3 className="text-sm text-gray-300">Metas</h3>
          {goals.data ? (
            <>
              <p className="text-2xl font-semibold">
                {activeGoals.length} {activeGoals.length === 1 ? 'meta ativa' : 'metas ativas'}
              </p>
              {activeGoals.length ? (
                <ul className="space-y-2 text-sm text-gray-300">
                  {[...activeGoals]
                    .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
                    .slice(0, 3)
                    .map((goal) => (
                      <li className="flex justify-between gap-3" key={goal.id}>
                        <span className="truncate">{goal.name}</span>
                        <span>{formatPercentage(goal.progressPercentage)}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Defina seu próximo objetivo.</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">{state(goals.isLoading, goals.isError)}</p>
          )}
          <Link className="mt-auto pt-2 text-sm font-medium text-brand-light" href="/metas">
            Ver metas →
          </Link>
        </article>
      </div>
    </section>
  );
}
