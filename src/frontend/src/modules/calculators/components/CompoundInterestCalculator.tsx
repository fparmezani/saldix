'use client';

import { Calculator } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';
import { calculateCompoundInterest } from '../lib/financial-calculators';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

export function CompoundInterestCalculator() {
  const [initial, setInitial] = useState('10000');
  const [monthly, setMonthly] = useState('500');
  const [rate, setRate] = useState('8');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState(() => calculateCompoundInterest(10000, 500, 8, 120));
  const [error, setError] = useState<string | null>(null);
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      const months = Math.round(Number(years.replace(',', '.')) * 12);
      setResult(
        calculateCompoundInterest(
          Number(initial),
          Number(monthly),
          Number(rate.replace(',', '.')),
          months,
        ),
      );
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  const compact = (value: number) =>
    `R$ ${Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;
  return (
    <CalculatorScaffold
      title="Juros compostos"
      description="Projete quanto seu dinheiro pode acumular com aportes mensais e uma taxa constante."
      icon={Calculator}
    >
      <form onSubmit={calculate} className={`${panelClass} grid gap-5 md:grid-cols-2`}>
        <label>
          <span className="mb-2 block text-sm font-medium">Valor inicial</span>
          <CurrencyInput
            required
            min="0"
            value={initial}
            onValueChange={setInitial}
            className={inputClass}
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Aporte mensal</span>
          <CurrencyInput
            required
            min="0"
            value={monthly}
            onValueChange={setMonthly}
            className={inputClass}
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Rentabilidade ao ano</span>
          <div className="relative">
            <input
              required
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className={`${inputClass} pr-12`}
            />
            <span className="absolute right-4 top-3 text-gray-400">%</span>
          </div>
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Período</span>
          <div className="relative">
            <input
              required
              inputMode="decimal"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className={`${inputClass} pr-16`}
            />
            <span className="absolute right-4 top-3 text-gray-400">anos</span>
          </div>
        </label>
        {error && (
          <p role="alert" className="text-sm text-rose-400 md:col-span-2">
            {error}
          </p>
        )}
        <button className="rounded-lg bg-brand px-5 py-3 font-semibold text-black md:col-span-2">
          Simular crescimento
        </button>
      </form>
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric featured label="Valor final" value={formatCurrency(result.balance)} />
        <Metric label="Total investido" value={formatCurrency(result.invested)} />
        <Metric
          label="Rendimentos"
          value={formatCurrency(result.earnings)}
          hint={`${formatPercentage(result.balance ? (result.earnings / result.balance) * 100 : 0)} do resultado`}
        />
      </section>
      <article className={`${panelClass} mt-6`}>
        <h2 className="text-lg font-semibold">Evolução no tempo</h2>
        <div className="mt-5 h-80">
          <ResponsiveContainer>
            <AreaChart data={result.points}>
              <defs>
                <linearGradient id="compound" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="rgb(var(--positive))" stopOpacity={0.35} />
                  <stop offset="1" stopColor="rgb(var(--positive))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgb(var(--border))" strokeDasharray="3 6" />
              <XAxis
                dataKey="month"
                tickFormatter={(v) => `${Math.round(v / 12)}a`}
                tick={{ fill: 'rgb(var(--muted))' }}
              />
              <YAxis width={72} tickFormatter={compact} tick={{ fill: 'rgb(var(--muted))' }} />
              <Tooltip
                labelFormatter={(v) => `${Number(v) / 12} anos`}
                formatter={(v: number, name: string) => [
                  formatCurrency(v),
                  name === 'balance' ? 'Total acumulado' : 'Valor investido',
                ]}
              />
              <Area
                dataKey="balance"
                name="Total acumulado"
                stroke="rgb(var(--positive))"
                fill="url(#compound)"
                strokeWidth={3}
              />
              <Area
                dataKey="invested"
                name="Valor investido"
                stroke="rgb(var(--secondary))"
                fill="transparent"
                strokeDasharray="5 4"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
      <Assumptions>
        aportes são feitos no fim de cada mês e a rentabilidade permanece constante. Impostos,
        taxas, inflação e oscilações não foram descontados.
      </Assumptions>
    </CalculatorScaffold>
  );
}
