'use client';

import { Percent } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';
import { calculateInflation } from '../lib/financial-calculators';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

export function InflationCalculator() {
  const [value, setValue] = useState('10000');
  const [rate, setRate] = useState('4.5');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState(() => calculateInflation(10000, 4.5, 10));
  const [error, setError] = useState<string | null>(null);
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setResult(
        calculateInflation(
          Number(value),
          Number(rate.replace(',', '.')),
          Number(years.replace(',', '.')),
        ),
      );
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  const chart = [
    { name: 'Hoje', cost: Number(value), power: Number(value) },
    { name: `Em ${years} anos`, cost: result.futureCost, power: result.futurePurchasingPower },
  ];
  return (
    <CalculatorScaffold
      title="Inflação e poder de compra"
      description="Veja quanto algo pode custar no futuro e quanto o mesmo dinheiro poderá comprar."
      icon={Percent}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Valor de hoje</span>
            <CurrencyInput
              required
              min="0.01"
              value={value}
              onValueChange={setValue}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Inflação média esperada ao ano</span>
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
            <p role="alert" className="text-sm text-rose-400">
              {error}
            </p>
          )}
          <button className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-black">
            Calcular impacto
          </button>
        </form>
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric
              featured
              label="Custo equivalente no futuro"
              value={formatCurrency(result.futureCost)}
              hint={`Para comprar o equivalente a ${formatCurrency(Number(value))} hoje`}
            />
            <Metric
              label="Poder de compra futuro"
              value={formatCurrency(result.futurePurchasingPower)}
              hint={`Do mesmo valor nominal de ${formatCurrency(Number(value))}`}
            />
            <Metric
              label="Perda de poder de compra"
              value={formatCurrency(result.purchasingPowerLoss)}
            />
            <Metric
              label="Inflação acumulada estimada"
              value={formatPercentage(result.accumulatedInflationPercent)}
            />
          </div>
          <article className={panelClass}>
            <h2 className="mb-4 text-lg font-semibold">Impacto no valor</h2>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={chart}>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgb(var(--border))"
                    strokeDasharray="3 6"
                  />
                  <XAxis dataKey="name" tick={{ fill: 'rgb(var(--muted))' }} />
                  <YAxis
                    width={72}
                    tickFormatter={(v) =>
                      `R$ ${Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v)}`
                    }
                    tick={{ fill: 'rgb(var(--muted))' }}
                  />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      formatCurrency(v),
                      name === 'cost' ? 'Custo equivalente' : 'Poder de compra',
                    ]}
                  />
                  <Bar
                    dataKey="cost"
                    name="Custo equivalente"
                    fill="rgb(var(--warning))"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="power"
                    name="Poder de compra"
                    fill="rgb(var(--positive))"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      </div>
      <Assumptions>
        a inflação informada é uma hipótese constante. Esta ferramenta não corrige contratos nem
        consulta séries históricas oficiais; para correção legal, use o índice e a metodologia
        previstos no documento.
      </Assumptions>
    </CalculatorScaffold>
  );
}
