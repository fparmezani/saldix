'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowLeft, CalendarDays, CircleDollarSign, PiggyBank, Sparkles } from 'lucide-react';
import { AppShell } from '@/shared/ui/AppShell';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';
import {
  FIRST_MILLION_TARGET,
  formatDuration,
  projectToMillion,
  requiredMonthlyContribution,
  type MillionProjection,
} from '../lib/first-million';

type Mode = 'deadline' | 'contribution';

function compactCurrency(value: number) {
  return `R$ ${new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;
}

function targetDate(months: number | null) {
  if (months === null) return 'Fora do horizonte calculado';
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
}

function ResultCard({
  label,
  value,
  hint,
  featured = false,
}: {
  label: string;
  value: string;
  hint?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`min-w-0 rounded-xl2 border p-5 ${featured ? 'border-brand/60 bg-brand/10' : 'border-surface-border bg-surface-card'}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p
        className={`mt-2 break-words font-bold ${featured ? 'text-2xl text-brand-light sm:text-3xl' : 'text-xl text-white'}`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-gray-400">{hint}</p>}
    </article>
  );
}

export function FirstMillionCalculator() {
  const [mode, setMode] = useState<Mode>('deadline');
  const [initial, setInitial] = useState('0');
  const [monthly, setMonthly] = useState('1000');
  const [years, setYears] = useState('20');
  const [annualRate, setAnnualRate] = useState('8');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    projection: MillionProjection;
    contribution: number;
    deadlineMonths: number | null;
  }>(() => ({
    projection: projectToMillion({ initial: 0, monthlyContribution: 1000, annualRatePercent: 8 }),
    contribution: 1000,
    deadlineMonths: null,
  }));

  function runCalculation(selectedMode: Mode) {
    try {
      const initialValue = Number(initial);
      const rate = Number(annualRate.replace(',', '.'));
      if (!Number.isFinite(rate) || rate < 0 || rate > 100)
        throw new Error('Informe uma rentabilidade anual entre 0% e 100%.');
      if (selectedMode === 'deadline') {
        const contribution = Number(monthly);
        const projection = projectToMillion({
          initial: initialValue,
          monthlyContribution: contribution,
          annualRatePercent: rate,
        });
        setResult({ projection, contribution, deadlineMonths: null });
      } else {
        const deadlineYears = Number(years.replace(',', '.'));
        if (!Number.isFinite(deadlineYears) || deadlineYears <= 0 || deadlineYears > 100)
          throw new Error('Informe um prazo entre 1 e 100 anos.');
        const months = Math.round(deadlineYears * 12);
        const contribution = requiredMonthlyContribution({
          initial: initialValue,
          annualRatePercent: rate,
          months,
        });
        const projection = projectToMillion({
          initial: initialValue,
          monthlyContribution: contribution,
          annualRatePercent: rate,
          maxMonths: months,
        });
        setResult({ projection, contribution, deadlineMonths: months });
      }
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular este cenário.');
    }
  }

  function calculate(event: React.FormEvent) {
    event.preventDefault();
    runCalculation(mode);
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    runCalculation(nextMode);
  }

  const displayedMonths = result.deadlineMonths ?? result.projection.months;
  const composition = useMemo(
    () => [
      {
        name: 'Valor investido',
        value: Math.max(0, result.projection.invested),
        color: 'rgb(var(--secondary))',
      },
      {
        name: 'Rendimentos',
        value: Math.max(0, result.projection.earnings),
        color: 'rgb(var(--positive))',
      },
    ],
    [result],
  );

  return (
    <AppShell title="Meu Primeiro Milhão" greeting="Calculadoras">
      <Link
        href="/calculadoras"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-light"
      >
        <ArrowLeft size={16} />
        Todas as calculadoras
      </Link>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-xl2 border border-surface-border bg-surface-card p-5 sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <span className="rounded-xl bg-brand/10 p-3 text-brand-light">
              <CircleDollarSign aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Monte seu plano</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Meta nominal fixa de {formatCurrency(FIRST_MILLION_TARGET)}.
              </p>
            </div>
          </div>
          <div
            className="mb-6 grid grid-cols-2 rounded-xl border border-surface-border bg-surface p-1"
            aria-label="Objetivo do cálculo"
          >
            <button
              type="button"
              aria-pressed={mode === 'deadline'}
              onClick={() => changeMode('deadline')}
              className={`rounded-lg px-3 py-3 text-sm font-medium ${mode === 'deadline' ? 'bg-surface-card text-brand-light shadow-sm' : 'text-gray-400'}`}
            >
              Quando chegarei?
            </button>
            <button
              type="button"
              aria-pressed={mode === 'contribution'}
              onClick={() => changeMode('contribution')}
              className={`rounded-lg px-3 py-3 text-sm font-medium ${mode === 'contribution' ? 'bg-surface-card text-brand-light shadow-sm' : 'text-gray-400'}`}
            >
              Quanto investir?
            </button>
          </div>
          <form onSubmit={calculate} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Quanto você já possui?</span>
              <CurrencyInput
                required
                min="0"
                value={initial}
                onValueChange={setInitial}
                aria-label="Valor inicial"
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-gray-100"
              />
            </label>
            {mode === 'deadline' ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Quanto você investirá por mês?
                </span>
                <CurrencyInput
                  required
                  min="0"
                  value={monthly}
                  onValueChange={setMonthly}
                  aria-label="Aporte mensal"
                  className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-gray-100"
                />
              </label>
            ) : (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Em quantos anos quer chegar?</span>
                <div className="relative">
                  <input
                    required
                    inputMode="decimal"
                    value={years}
                    onChange={(event) => setYears(event.target.value)}
                    aria-label="Prazo em anos"
                    className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 pr-16 text-gray-100"
                  />
                  <span className="pointer-events-none absolute right-4 top-3 text-sm text-gray-400">
                    anos
                  </span>
                </div>
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Rentabilidade esperada ao ano</span>
              <div className="relative">
                <input
                  required
                  inputMode="decimal"
                  value={annualRate}
                  onChange={(event) => setAnnualRate(event.target.value)}
                  aria-label="Rentabilidade anual"
                  className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 pr-12 text-gray-100"
                />
                <span className="pointer-events-none absolute right-4 top-3 text-gray-400">%</span>
              </div>
              <span className="mt-2 block text-xs leading-5 text-gray-400">
                Use uma estimativa líquida e realista. A taxa anual é convertida para sua
                equivalente mensal.
              </span>
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-rose-400/40 bg-rose-400/10 p-3 text-sm text-rose-400"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-black hover:bg-brand-dark"
            >
              Calcular meu plano
            </button>
          </form>
        </section>

        <section aria-live="polite" className="min-w-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              featured
              label={mode === 'deadline' ? 'Tempo estimado' : 'Aporte mensal necessário'}
              value={
                mode === 'deadline'
                  ? formatDuration(result.projection.months)
                  : formatCurrency(result.contribution)
              }
              hint={
                mode === 'deadline'
                  ? targetDate(result.projection.months)
                  : `Prazo de ${formatDuration(result.deadlineMonths)}`
              }
            />
            <ResultCard
              label="Total investido"
              value={formatCurrency(result.projection.invested)}
              hint="Valor inicial + aportes mensais"
            />
            <ResultCard
              label="Rendimentos estimados"
              value={formatCurrency(result.projection.earnings)}
              hint="Resultado da taxa constante informada"
            />
            <ResultCard
              label="Patrimônio projetado"
              value={formatCurrency(result.projection.balance)}
              hint={
                result.projection.reached ? 'Meta alcançada' : 'Meta não alcançada em até 100 anos'
              }
            />
          </div>
          {!result.projection.reached && (
            <p
              role="status"
              className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-400"
            >
              Com estes valores, a meta não é alcançada dentro do limite de 100 anos. Aumente o
              aporte ou revise a taxa.
            </p>
          )}
        </section>
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
        <article className="min-w-0 rounded-xl2 border border-surface-border bg-surface-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Evolução do patrimônio</h2>
            <p className="mt-1 text-sm text-gray-400">
              Capital acumulado e dinheiro efetivamente investido.
            </p>
          </div>
          <div
            className="h-80 w-full"
            aria-label="Gráfico da evolução do patrimônio ao longo dos anos"
          >
            <ResponsiveContainer>
              <AreaChart
                data={result.projection.points}
                margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="millionGrowth" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--positive))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="rgb(var(--positive))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgb(var(--border))" strokeDasharray="3 6" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => `${Math.round(value / 12)}a`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }}
                />
                <YAxis
                  width={72}
                  tickFormatter={compactCurrency}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }}
                />
                <Tooltip
                  labelFormatter={(value) => formatDuration(Number(value))}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'balance' ? 'Patrimônio' : 'Investido',
                  ]}
                />
                <ReferenceLine
                  y={FIRST_MILLION_TARGET}
                  stroke="rgb(var(--warning))"
                  strokeDasharray="6 5"
                  label={{
                    value: 'R$ 1 milhão',
                    fill: 'rgb(var(--warning))',
                    position: 'insideTopLeft',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="rgb(var(--positive))"
                  fill="url(#millionGrowth)"
                  strokeWidth={3}
                  name="Patrimônio"
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="rgb(var(--secondary))"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  name="Investido"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--positive))]" />
              Patrimônio
            </span>
            <span className="flex items-center gap-2">
              <i className="h-0.5 w-5 bg-[rgb(var(--secondary))]" />
              Valor investido
            </span>
            <span className="flex items-center gap-2">
              <i className="h-0.5 w-5 bg-[rgb(var(--warning))]" />
              Meta
            </span>
          </div>
        </article>
        <article className="rounded-xl2 border border-surface-border bg-surface-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">De onde vem o milhão?</h2>
          <div className="mx-auto h-56 max-w-sm">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={composition}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="84%"
                  paddingAngle={2}
                >
                  {composition.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-3">
            {composition.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-gray-400">
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  {item.name}
                </span>
                <strong>
                  {formatPercentage(
                    result.projection.balance > 0
                      ? (item.value / result.projection.balance) * 100
                      : 0,
                  )}
                </strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 rounded-xl2 border border-surface-border bg-surface-card p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="rounded-lg bg-brand/10 p-2 text-brand-light">
            <Sparkles size={20} />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Marcos da jornada</h2>
            <p className="mt-1 text-sm text-gray-400">Uma visão simples das etapas até a meta.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {result.projection.milestones.map((milestone) => (
            <article
              key={milestone.target}
              className="rounded-xl border border-surface-border bg-surface p-4"
            >
              <PiggyBank className="mb-3 text-brand-light" size={20} />
              <p className="font-semibold">{compactCurrency(milestone.target)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <CalendarDays size={13} />
                {milestone.month === null ? 'Ainda não alcançado' : formatDuration(milestone.month)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <aside className="mt-6 rounded-xl border border-surface-border bg-surface-card p-5 text-sm leading-6 text-gray-400">
        <strong className="text-gray-200">Sobre esta simulação:</strong> os valores são nominais, os
        aportes ocorrem ao fim de cada mês e a rentabilidade informada permanece constante.
        Impostos, taxas e inflação não estão descontados. O resultado é uma estimativa educacional,
        não uma promessa de retorno.
      </aside>
    </AppShell>
  );
}
