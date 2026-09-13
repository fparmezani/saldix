'use client';

import { House } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '@/shared/lib/formatters';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { compareAmortization, type AmortizationSystem } from '../lib/financial-calculators';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

function formatTerm(months: number) {
  if (months === 0) return 'Financiamento quitado';
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (remainder) parts.push(`${remainder} ${remainder === 1 ? 'mês' : 'meses'}`);
  return parts.join(' e ');
}

export function AmortizationCalculator() {
  const [system, setSystem] = useState<AmortizationSystem>('sac');
  const [balance, setBalance] = useState('300000');
  const [extraPayment, setExtraPayment] = useState('30000');
  const [rate, setRate] = useState('10');
  const [months, setMonths] = useState('300');
  const [result, setResult] = useState(() =>
    compareAmortization({
      balance: 300000,
      extraPayment: 30000,
      annualRatePercent: 10,
      remainingMonths: 300,
      system: 'sac',
    }),
  );
  const [error, setError] = useState<string | null>(null);

  const chartData = useMemo(
    () =>
      result.baseline.schedule.map(({ month, balance: originalBalance }) => ({
        month,
        originalBalance,
        reducedTermBalance: result.reduceTerm.schedule[month]?.balance ?? 0,
        reducedPaymentBalance: result.reducePayment.schedule[month]?.balance ?? 0,
      })),
    [result],
  );
  const chartTicks = useMemo(() => {
    const lastMonth = result.baseline.months;
    return [...new Set([0, 0.25, 0.5, 0.75, 1].map((part) => Math.round(lastMonth * part)))];
  }, [result.baseline.months]);

  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setResult(
        compareAmortization({
          balance: Number(balance),
          extraPayment: Number(extraPayment),
          annualRatePercent: Number(rate.replace(',', '.')),
          remainingMonths: Number(months),
          system,
        }),
      );
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }

  const compact = (value: number) =>
    `R$\u00a0${Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    })
      .format(value)
      .replaceAll(' ', '\u00a0')}`;

  return (
    <CalculatorScaffold
      title="Amortização habitacional"
      description="Compare o efeito de um pagamento extra ao reduzir o prazo ou recalcular a prestação."
      icon={House}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(19rem,.72fr)_minmax(0,1.28fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Sistema de amortização</legend>
            <div className="grid grid-cols-2 rounded-lg border border-surface-border bg-surface p-1">
              {(['sac', 'price'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={system === option}
                  onClick={() => setSystem(option)}
                  className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    system === option
                      ? 'bg-brand text-black'
                      : 'text-gray-300 hover:bg-surface-card'
                  }`}
                >
                  {option === 'sac' ? 'SAC' : 'Price'}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Saldo devedor atual</span>
            <CurrencyInput
              required
              min="0.01"
              value={balance}
              onValueChange={setBalance}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Valor extra para amortizar</span>
            <CurrencyInput
              required
              min="0.01"
              value={extraPayment}
              onValueChange={setExtraPayment}
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
                onChange={(event) => setRate(event.target.value)}
                className={`${inputClass} pr-12`}
              />
              <span className="absolute right-4 top-3 text-gray-400">%</span>
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Parcelas restantes</span>
            <div className="relative">
              <input
                required
                type="number"
                min="1"
                max="600"
                step="1"
                value={months}
                onChange={(event) => setMonths(event.target.value)}
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
            Comparar amortização
          </button>
        </form>

        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric
              featured
              label="Novo saldo após amortizar"
              value={formatCurrency(result.reducedBalance)}
              hint={`Saldo anterior: ${formatCurrency(result.baseline.schedule[0].balance)}`}
            />
            <Metric
              label="Prestação atual estimada"
              value={formatCurrency(result.baseline.firstPayment)}
              hint={`${result.system === 'sac' ? 'Primeira prestação SAC' : 'Prestação Price'} calculada sem seguros e tarifas`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className={`${panelClass} border-brand/50`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">
                Opção 1 · Reduzir prazo
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                {formatTerm(result.reduceTerm.months)}
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                {result.reduceTerm.months === 0
                  ? 'Quitação imediata do saldo'
                  : `${result.eliminatedMonths} parcelas a menos`}
              </p>
              <dl className="mt-5 space-y-3 border-t border-surface-border pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400">Economia estimada de juros</dt>
                  <dd className="font-semibold text-brand-light">
                    {formatCurrency(result.termSavings)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400">Próxima prestação estimada</dt>
                  <dd className="font-semibold">
                    {formatCurrency(result.reduceTerm.firstPayment)}
                  </dd>
                </div>
              </dl>
            </article>
            <article className={panelClass}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Opção 2 · Reduzir prestação
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                {formatCurrency(result.reducePayment.firstPayment)}
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                Redução inicial estimada de{' '}
                {formatCurrency(result.baseline.firstPayment - result.reducePayment.firstPayment)}
              </p>
              <dl className="mt-5 space-y-3 border-t border-surface-border pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400">Prazo mantido</dt>
                  <dd className="font-semibold">{formatTerm(result.reducePayment.months)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400">Economia estimada de juros</dt>
                  <dd className="font-semibold text-brand-light">
                    {formatCurrency(result.paymentSavings)}
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <article id="evolucao-saldo" className={`${panelClass} scroll-mt-6`}>
            <h2 className="text-lg font-semibold">Evolução estimada do saldo</h2>
            <p className="mb-5 mt-1 text-sm text-gray-400">
              Compare o contrato sem amortização com as duas formas de aplicar o valor extra.
            </p>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgb(var(--border))"
                    strokeDasharray="3 6"
                  />
                  <XAxis
                    dataKey="month"
                    ticks={chartTicks}
                    interval={0}
                    minTickGap={18}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}m`}
                    tick={{ fill: 'rgb(var(--muted))' }}
                  />
                  <YAxis
                    width={92}
                    tickMargin={10}
                    tickFormatter={compact}
                    tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        originalBalance: 'Sem amortização',
                        reducedTermBalance: 'Reduzir prazo',
                        reducedPaymentBalance: 'Reduzir prestação',
                      };
                      return [formatCurrency(value), labels[name] ?? name];
                    }}
                    labelFormatter={(value) => `Mês ${value}`}
                  />
                  <Line
                    dataKey="originalBalance"
                    stroke="rgb(var(--muted))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    dataKey="reducedTermBalance"
                    stroke="rgb(var(--positive))"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    dataKey="reducedPaymentBalance"
                    stroke="rgb(var(--warning))"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-300">
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-5 bg-gray-400" /> Sem amortização
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-5 bg-emerald-400" /> Reduzir prazo
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-5 bg-amber-400" /> Reduzir prestação
              </span>
            </div>
          </article>
        </section>
      </div>

      <Assumptions>
        esta é uma estimativa independente. A taxa anual é convertida para sua equivalente mensal;
        TR, IPCA, seguros, tarifas, vencimentos e regras específicas do contrato não estão
        incluídos. Confirme os valores e execute a operação no{' '}
        <a
          href="https://www.caixa.gov.br/atendimento/aplicativos/habitacao/Paginas/default.aspx"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-light underline underline-offset-2"
        >
          canal oficial da instituição
        </a>
        .
      </Assumptions>
    </CalculatorScaffold>
  );
}
