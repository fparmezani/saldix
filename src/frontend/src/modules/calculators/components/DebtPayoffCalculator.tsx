'use client';

import { CreditCard } from 'lucide-react';
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
import { formatDuration } from '../lib/first-million';
import { calculateDebtPlan } from '../lib/financial-calculators';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

export function DebtPayoffCalculator() {
  const [balance, setBalance] = useState('10000');
  const [payment, setPayment] = useState('800');
  const [extra, setExtra] = useState('200');
  const [rate, setRate] = useState('2');
  const initial = () => ({
    base: calculateDebtPlan(10000, 2, 800),
    accelerated: calculateDebtPlan(10000, 2, 1000),
  });
  const [result, setResult] = useState(initial);
  const [scenario, setScenario] = useState({ currentPayment: 800, extraPayment: 200 });
  const [error, setError] = useState<string | null>(null);
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      const currentPayment = Number(payment);
      const extraPayment = Number(extra);
      const base = calculateDebtPlan(
        Number(balance),
        Number(rate.replace(',', '.')),
        currentPayment,
      );
      const accelerated = calculateDebtPlan(
        Number(balance),
        Number(rate.replace(',', '.')),
        currentPayment + extraPayment,
      );
      setResult({ base, accelerated });
      setScenario({ currentPayment, extraPayment });
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  const chart = result.base.schedule.map((point) => ({
    ...point,
    accelerated:
      result.accelerated.schedule.find((item) => item.month === point.month)?.balance ?? 0,
  }));
  const totalMonthlyPayment = scenario.currentPayment + scenario.extraPayment;
  return (
    <CalculatorScaffold
      title="Quitação de dívidas"
      description="Compare seu pagamento atual com um novo plano mensal que inclui um valor adicional."
      icon={CreditCard}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Saldo da dívida</span>
            <CurrencyInput
              required
              min="0.01"
              value={balance}
              onValueChange={setBalance}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Quanto você paga hoje por mês?</span>
            <CurrencyInput
              required
              min="0.01"
              value={payment}
              onValueChange={setPayment}
              className={inputClass}
            />
            <span className="mt-2 block text-xs leading-5 text-gray-400">
              Informe a parcela ou o pagamento mínimo que já sai do seu orçamento.
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Quanto deseja acrescentar por mês?
            </span>
            <CurrencyInput
              required
              min="0"
              value={extra}
              onValueChange={setExtra}
              className={inputClass}
            />
            <span className="mt-2 block text-xs leading-5 text-gray-400">
              Este valor será somado ao pagamento atual, não o substituirá.
            </span>
          </label>
          <div className="rounded-xl border border-brand/30 bg-brand/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">
              Como a comparação funciona
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-200">
              Plano atual: <strong>{formatCurrency(Number(payment) || 0)}/mês</strong>
              <br />
              Novo plano:{' '}
              <strong>{formatCurrency((Number(payment) || 0) + (Number(extra) || 0))}/mês</strong>
              <span className="text-gray-400">
                {' '}
                ({formatCurrency(Number(payment) || 0)} atual + {formatCurrency(Number(extra) || 0)}{' '}
                adicional)
              </span>
            </p>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Juros ao mês</span>
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
          {error && (
            <p role="alert" className="text-sm text-rose-400">
              {error}
            </p>
          )}
          <button className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-black">
            Calcular quitação
          </button>
        </form>
        <section className="space-y-4">
          {!result.accelerated.possible ? (
            <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-5 text-amber-400">
              O pagamento não cobre os juros mensais. A dívida tende a crescer; aumente o pagamento.
            </p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Metric
                  featured
                  label={`Quitação pagando ${formatCurrency(totalMonthlyPayment)}/mês`}
                  value={formatDuration(result.accelerated.months)}
                  hint={`Sem o adicional: ${result.base.possible ? `${formatDuration(result.base.months)} pagando ${formatCurrency(scenario.currentPayment)}/mês` : 'o pagamento atual não reduz a dívida'}`}
                />
                <Metric
                  label="Juros no novo plano"
                  value={formatCurrency(result.accelerated.totalInterest)}
                />
                <Metric
                  label="Tempo economizado"
                  value={
                    result.base.months && result.accelerated.months
                      ? formatDuration(result.base.months - result.accelerated.months)
                      : '—'
                  }
                />
                <Metric
                  label="Juros economizados"
                  value={
                    result.base.possible
                      ? formatCurrency(
                          Math.max(0, result.base.totalInterest - result.accelerated.totalInterest),
                        )
                      : '—'
                  }
                />
              </div>
              <article className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold">Queda do saldo devedor</h2>
                <div className="h-72">
                  <ResponsiveContainer>
                    <LineChart data={chart}>
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
                      <YAxis
                        width={72}
                        tickFormatter={(v) =>
                          `R$ ${Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v)}`
                        }
                        tick={{ fill: 'rgb(var(--muted))' }}
                      />
                      <Tooltip formatter={(v: number) => formatCurrency(v)} />
                      <Line
                        dataKey="balance"
                        name="Plano atual"
                        stroke="rgb(var(--secondary))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        dataKey="accelerated"
                        name="Com extra"
                        stroke="rgb(var(--positive))"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-300">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-0.5 w-5 bg-gray-300" /> Pagando{' '}
                    {formatCurrency(scenario.currentPayment)}/mês
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-0.5 w-5 bg-emerald-400" /> Pagando{' '}
                    {formatCurrency(totalMonthlyPayment)}/mês
                  </span>
                </div>
              </article>
            </>
          )}
        </section>
      </div>
      <Assumptions>
        em cada mês, os juros são aplicados ao saldo e depois o pagamento total é abatido. O valor
        adicional é repetido todos os meses. Multas, impostos e renegociações não estão incluídos.
      </Assumptions>
    </CalculatorScaffold>
  );
}
