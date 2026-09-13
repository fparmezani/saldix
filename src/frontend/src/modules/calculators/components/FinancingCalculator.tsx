'use client';

import { Landmark } from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { formatCurrency } from '@/shared/lib/formatters';
import { compareFinancing } from '../lib/financial-calculators';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

export function FinancingCalculator() {
  const [principal, setPrincipal] = useState('300000');
  const [rate, setRate] = useState('10');
  const [months, setMonths] = useState('360');
  const [result, setResult] = useState(() => compareFinancing(300000, 10, 360));
  const [error, setError] = useState<string | null>(null);
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setResult(
        compareFinancing(Number(principal), Number(rate.replace(',', '.')), Number(months)),
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
      title="Financiamento SAC × Price"
      description="Compare os dois sistemas com a mesma taxa, prazo e valor financiado."
      icon={Landmark}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Valor financiado</span>
            <CurrencyInput
              required
              min="0.01"
              value={principal}
              onValueChange={setPrincipal}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Taxa efetiva ao ano</span>
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
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Prazo</span>
            <div className="relative">
              <input
                required
                type="number"
                min="1"
                max="600"
                step="1"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className={`${inputClass} pr-20`}
              />
              <span className="absolute right-4 top-3 text-gray-400">meses</span>
            </div>
          </label>
          {error && (
            <p role="alert" className="text-sm text-rose-400">
              {error}
            </p>
          )}
          <button className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-black">
            Comparar financiamento
          </button>
        </form>
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric
              featured={result.priceInterest < result.sacInterest}
              label="Price · prestação fixa"
              value={formatCurrency(result.pricePayment)}
              hint={`Total: ${formatCurrency(result.priceTotal)} · Juros: ${formatCurrency(result.priceInterest)}`}
            />
            <Metric
              featured={result.sacInterest < result.priceInterest}
              label="SAC · primeira prestação"
              value={formatCurrency(result.sacFirstPayment)}
              hint={`Última: ${formatCurrency(result.sacLastPayment)} · Juros: ${formatCurrency(result.sacInterest)}`}
            />
          </div>
          <article className={panelClass}>
            <h2 className="text-lg font-semibold">Evolução do saldo devedor</h2>
            <p className="mb-5 mt-1 text-sm text-gray-400">
              No SAC o saldo cai linearmente; na Price, a amortização cresce ao longo do prazo.
            </p>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={result.schedule}>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgb(var(--border))"
                    strokeDasharray="3 6"
                  />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(v) => `${v}m`}
                    tick={{ fill: 'rgb(var(--muted))' }}
                  />
                  <YAxis width={72} tickFormatter={compact} tick={{ fill: 'rgb(var(--muted))' }} />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      formatCurrency(v),
                      name === 'priceBalance' ? 'Price' : 'SAC',
                    ]}
                  />
                  <Line
                    dataKey="priceBalance"
                    name="Price"
                    stroke="rgb(var(--warning))"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    dataKey="sacBalance"
                    name="SAC"
                    stroke="rgb(var(--positive))"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      </div>
      <Assumptions>
        a taxa anual é convertida para sua equivalente mensal. Seguros, tarifas, indexadores,
        entrada e CET não estão incluídos; compare sempre com a proposta oficial da instituição.
      </Assumptions>
    </CalculatorScaffold>
  );
}
