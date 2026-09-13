'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';
import { compareCashAndInstallments } from '../lib/financial-calculators';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

export function CashOrInstallmentsCalculator() {
  const [cash, setCash] = useState('900');
  const [payment, setPayment] = useState('100');
  const [count, setCount] = useState('10');
  const [rate, setRate] = useState('8');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(() =>
    compareCashAndInstallments({
      cashPrice: 900,
      installmentAmount: 100,
      installments: 10,
      annualOpportunityRate: 8,
    }),
  );
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      const next = compareCashAndInstallments({
        cashPrice: Number(cash),
        installmentAmount: Number(payment),
        installments: Number(count),
        annualOpportunityRate: Number(rate.replace(',', '.')),
      });
      setResult(next);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  const discount =
    result.installmentTotal > 0 ? (result.nominalDifference / result.installmentTotal) * 100 : 0;
  return (
    <CalculatorScaffold
      title="À vista ou parcelado"
      description="Compare o desconto à vista com o valor econômico das parcelas."
      icon={ShoppingCart}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Preço à vista</span>
            <CurrencyInput
              required
              min="0.01"
              value={cash}
              onValueChange={setCash}
              className={inputClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium">Valor da parcela</span>
              <CurrencyInput
                required
                min="0.01"
                value={payment}
                onValueChange={setPayment}
                className={inputClass}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Quantidade</span>
              <input
                required
                type="number"
                min="1"
                step="1"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Rendimento anual do dinheiro</span>
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
            <span className="mt-2 block text-xs text-gray-400">
              Quanto o dinheiro preservado poderia render durante o parcelamento.
            </span>
          </label>
          {error && (
            <p role="alert" className="text-sm text-rose-400">
              {error}
            </p>
          )}
          <button className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-black">
            Comparar opções
          </button>
        </form>
        <section aria-live="polite" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric
              featured
              label="Melhor opção financeira"
              value={result.recommendation === 'cash' ? 'Pagar à vista' : 'Manter parcelado'}
              hint={`Vantagem econômica estimada de ${formatCurrency(result.advantage)}`}
            />
            <Metric
              label="Total das parcelas"
              value={formatCurrency(result.installmentTotal)}
              hint={`${count} pagamentos de ${formatCurrency(Number(payment))}`}
            />
            <Metric
              label="Valor atual das parcelas"
              value={formatCurrency(result.presentValue)}
              hint="Parcelas trazidas para o valor de hoje"
            />
            <Metric
              label="Diferença nominal"
              value={formatCurrency(result.nominalDifference)}
              hint={`Desconto equivalente a ${formatPercentage(discount)}`}
            />
          </div>
          <div className={`${panelClass} text-sm leading-6 text-gray-300`}>
            {result.recommendation === 'cash'
              ? 'O desconto à vista supera o benefício estimado de manter o dinheiro aplicado.'
              : 'Considerando o rendimento informado, preservar o dinheiro e pagar as parcelas tem menor custo econômico.'}
          </div>
        </section>
      </div>
      <Assumptions>
        parcelas iguais vencem ao final de cada mês. A recomendação considera somente os valores
        informados e não avalia liquidez, risco ou tarifas.
      </Assumptions>
    </CalculatorScaffold>
  );
}
