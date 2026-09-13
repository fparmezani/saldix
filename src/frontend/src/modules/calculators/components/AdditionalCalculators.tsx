'use client';

import {
  BadgeDollarSign,
  Banknote,
  CalendarClock,
  CreditCard,
  Home,
  LineChart as LineChartIcon,
  Plus,
  Scale,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { formatDuration } from '../lib/first-million';
import {
  calculateFinancialIndependence,
  calculateNetSalary2026,
  calculateRetirementPlan,
  compareCreditOptions,
  compareDebtStrategies,
  compareInvestments,
  compareRentAndBuy,
  correctValueByMonthlyRates,
  type DebtItem,
  type InvestmentOption,
} from '../lib/planning-calculators';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

function CurrencyField({
  label,
  value,
  setValue,
  hint,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <CurrencyInput
        required
        min="0"
        value={value}
        onValueChange={setValue}
        className={inputClass}
      />
      {hint && <span className="mt-2 block text-xs leading-5 text-gray-400">{hint}</span>}
    </label>
  );
}

function NumberField({
  label,
  value,
  setValue,
  suffix,
  min = 0,
  max,
  step = 'any',
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <div className="relative">
        <input
          required
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={`${inputClass} ${suffix ? 'pr-16' : ''}`}
        />
        {suffix && <span className="absolute right-4 top-3 text-gray-400">{suffix}</span>}
      </div>
    </label>
  );
}

function ErrorMessage({ error }: { error: string | null }) {
  return error ? (
    <p
      role="alert"
      className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm text-rose-400"
    >
      {error}
    </p>
  ) : null;
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-black">
      {children}
    </button>
  );
}

export function CreditCardCalculator() {
  const [balance, setBalance] = useState('10000');
  const [payment, setPayment] = useState('1000');
  const [cardRate, setCardRate] = useState('14');
  const [alternativeRate, setAlternativeRate] = useState('3');
  const [error, setError] = useState<string | null>(null);
  const makeResult = () =>
    compareCreditOptions({
      balance: Number(balance),
      monthlyPayment: Number(payment),
      cardMonthlyRate: Number(cardRate.replace(',', '.')),
      alternativeMonthlyRate: Number(alternativeRate.replace(',', '.')),
    });
  const [result, setResult] = useState(makeResult);
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setResult(makeResult());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  return (
    <CalculatorScaffold
      title="Custo do cartão de crédito"
      description="Compare manter uma dívida no cartão com transferi-la para uma linha de crédito mais barata."
      icon={CreditCard}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(19rem,.7fr)_minmax(0,1.3fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <CurrencyField label="Saldo da fatura ou dívida" value={balance} setValue={setBalance} />
          <CurrencyField label="Quanto pode pagar por mês" value={payment} setValue={setPayment} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Juros do cartão"
              value={cardRate}
              setValue={setCardRate}
              suffix="% a.m."
            />
            <NumberField
              label="Juros da alternativa"
              value={alternativeRate}
              setValue={setAlternativeRate}
              suffix="% a.m."
            />
          </div>
          <ErrorMessage error={error} />
          <SubmitButton>Comparar custos</SubmitButton>
        </form>
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric
              featured
              label="Juros com crédito alternativo"
              value={
                result.alternative.possible
                  ? formatCurrency(result.alternative.totalInterest)
                  : 'Pagamento insuficiente'
              }
              hint={
                result.alternative.months
                  ? `Quitação em ${formatDuration(result.alternative.months)}`
                  : undefined
              }
            />
            <Metric
              label="Juros mantendo no cartão"
              value={
                result.card.possible
                  ? formatCurrency(result.card.totalInterest)
                  : 'Dívida crescente'
              }
              hint={
                result.card.months ? `Quitação em ${formatDuration(result.card.months)}` : undefined
              }
            />
            <Metric
              label="Economia potencial"
              value={result.interestSavings === null ? '—' : formatCurrency(result.interestSavings)}
            />
            <Metric
              label="Tempo economizado"
              value={result.monthsSaved === null ? '—' : formatDuration(result.monthsSaved)}
            />
          </div>
          <div className={`${panelClass} text-sm leading-6 text-gray-300`}>
            A comparação mantém o mesmo pagamento mensal nas duas opções. Assim, a diferença vem
            somente da taxa informada.
          </div>
        </section>
      </div>
      <Assumptions>
        taxas constantes, sem IOF, tarifas, seguros ou novas compras. Compare o CET da proposta
        antes de trocar uma dívida por outra.
      </Assumptions>
    </CalculatorScaffold>
  );
}

interface InvestmentField extends InvestmentOption {
  id: number;
  rateText: string;
  taxText: string;
  feeText: string;
}
export function InvestmentComparisonCalculator() {
  const [initial, setInitial] = useState('10000');
  const [monthly, setMonthly] = useState('1000');
  const [years, setYears] = useState('5');
  const [inflation, setInflation] = useState('5');
  const [options, setOptions] = useState<InvestmentField[]>([
    {
      id: 1,
      name: 'CDB',
      annualRatePercent: 12,
      incomeTaxPercent: 15,
      annualFeePercent: 0,
      rateText: '12',
      taxText: '15',
      feeText: '0',
    },
    {
      id: 2,
      name: 'Tesouro',
      annualRatePercent: 11.8,
      incomeTaxPercent: 15,
      annualFeePercent: 0.2,
      rateText: '11.8',
      taxText: '15',
      feeText: '0.2',
    },
    {
      id: 3,
      name: 'Poupança',
      annualRatePercent: 7,
      incomeTaxPercent: 0,
      annualFeePercent: 0,
      rateText: '7',
      taxText: '0',
      feeText: '0',
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const build = () =>
    compareInvestments({
      initial: Number(initial),
      monthlyContribution: Number(monthly),
      years: Number(years),
      inflationPercent: Number(inflation.replace(',', '.')),
      options: options.map((item) => ({
        name: item.name,
        annualRatePercent: Number(item.rateText.replace(',', '.')),
        incomeTaxPercent: Number(item.taxText.replace(',', '.')),
        annualFeePercent: Number(item.feeText.replace(',', '.')),
      })),
    });
  const [result, setResult] = useState(build);
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setResult(build());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível comparar.');
    }
  }
  const update = (id: number, patch: Partial<InvestmentField>) =>
    setOptions((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  return (
    <CalculatorScaffold
      title="Comparador de investimentos"
      description="Compare alternativas pelo saldo líquido e pelo poder de compra, usando as taxas oferecidas a você."
      icon={TrendingUp}
    >
      <form onSubmit={calculate} className="space-y-6">
        <section className={`${panelClass} space-y-5`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CurrencyField label="Valor inicial" value={initial} setValue={setInitial} />
            <CurrencyField label="Aporte mensal" value={monthly} setValue={setMonthly} />
            <NumberField label="Prazo" value={years} setValue={setYears} suffix="anos" min={0.1} />
            <NumberField
              label="Inflação estimada"
              value={inflation}
              setValue={setInflation}
              suffix="% a.a."
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-400">
                <tr>
                  <th className="pb-3">Investimento</th>
                  <th className="pb-3">Rentabilidade anual</th>
                  <th className="pb-3">IR sobre ganhos</th>
                  <th className="pb-3">Taxa anual</th>
                </tr>
              </thead>
              <tbody>
                {options.map((item) => (
                  <tr key={item.id} className="border-t border-surface-border">
                    <td className="py-3 pr-3">
                      <input
                        aria-label="Nome do investimento"
                        value={item.name}
                        onChange={(e) => update(item.id, { name: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        aria-label={`Rentabilidade de ${item.name}`}
                        value={item.rateText}
                        onChange={(e) => update(item.id, { rateText: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        aria-label={`IR de ${item.name}`}
                        value={item.taxText}
                        onChange={(e) => update(item.id, { taxText: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3 pl-3">
                      <input
                        aria-label={`Taxa de ${item.name}`}
                        value={item.feeText}
                        onChange={(e) => update(item.id, { feeText: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ErrorMessage error={error} />
          <SubmitButton>Comparar investimentos</SubmitButton>
        </section>
      </form>
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {result.map((item, index) => (
          <article
            key={item.name}
            className={`${panelClass} ${index === 0 ? 'border-brand/60 bg-brand/10' : ''}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {index === 0 ? 'Maior saldo líquido' : `Posição ${index + 1}`}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{item.name}</h2>
            <p className="mt-3 text-2xl font-bold text-brand-light">
              {formatCurrency(item.netBalance)}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Total investido</dt>
                <dd>{formatCurrency(item.invested)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Imposto estimado</dt>
                <dd>{formatCurrency(item.tax)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Valor real</dt>
                <dd>{formatCurrency(item.realBalance)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
      <Assumptions>
        rentabilidades constantes e imposto cobrado apenas no final sobre os ganhos. Informe taxas
        compatíveis com o produto e o prazo; liquidez, risco, come-cotas, IOF e marcação a mercado
        podem alterar o resultado.
      </Assumptions>
    </CalculatorScaffold>
  );
}

export function RentBuyCalculator() {
  const [values, setValues] = useState({
    price: '500000',
    down: '100000',
    acquisition: '5',
    financeRate: '10',
    financeMonths: '360',
    rent: '2500',
    rentAdjustment: '5',
    appreciation: '5',
    investment: '8',
    maintenance: '1',
    horizon: '10',
  });
  const [error, setError] = useState<string | null>(null);
  const set = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const build = () =>
    compareRentAndBuy({
      propertyPrice: Number(values.price),
      downPayment: Number(values.down),
      acquisitionCostPercent: Number(values.acquisition),
      financingAnnualRate: Number(values.financeRate),
      financingMonths: Number(values.financeMonths),
      monthlyRent: Number(values.rent),
      annualRentAdjustment: Number(values.rentAdjustment),
      annualPropertyAppreciation: Number(values.appreciation),
      annualInvestmentReturn: Number(values.investment),
      annualMaintenancePercent: Number(values.maintenance),
      horizonYears: Number(values.horizon),
    });
  const [result, setResult] = useState(build);
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setResult(build());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível comparar.');
    }
  }
  return (
    <CalculatorScaffold
      title="Alugar ou comprar"
      description="Compare o patrimônio projetado das duas decisões, incluindo o custo de oportunidade da entrada."
      icon={Home}
    >
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,.65fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <CurrencyField label="Preço do imóvel" value={values.price} setValue={set('price')} />
            <CurrencyField label="Entrada" value={values.down} setValue={set('down')} />
            <CurrencyField label="Aluguel mensal" value={values.rent} setValue={set('rent')} />
            <NumberField
              label="Custos de aquisição"
              value={values.acquisition}
              setValue={set('acquisition')}
              suffix="%"
            />
            <NumberField
              label="Juros do financiamento"
              value={values.financeRate}
              setValue={set('financeRate')}
              suffix="% a.a."
            />
            <NumberField
              label="Prazo do financiamento"
              value={values.financeMonths}
              setValue={set('financeMonths')}
              suffix="meses"
              step="1"
            />
            <NumberField
              label="Reajuste do aluguel"
              value={values.rentAdjustment}
              setValue={set('rentAdjustment')}
              suffix="% a.a."
            />
            <NumberField
              label="Valorização do imóvel"
              value={values.appreciation}
              setValue={set('appreciation')}
              suffix="% a.a."
            />
            <NumberField
              label="Retorno dos investimentos"
              value={values.investment}
              setValue={set('investment')}
              suffix="% a.a."
            />
            <NumberField
              label="Manutenção do imóvel"
              value={values.maintenance}
              setValue={set('maintenance')}
              suffix="% a.a."
            />
            <NumberField
              label="Horizonte da comparação"
              value={values.horizon}
              setValue={set('horizon')}
              suffix="anos"
              min={1}
            />
          </div>
          <ErrorMessage error={error} />
          <SubmitButton>Comparar decisões</SubmitButton>
        </form>
        <section className="space-y-4">
          <Metric
            featured={result.winner === 'buy'}
            label="Patrimônio de quem compra"
            value={formatCurrency(result.buyerNetWorth)}
            hint={`Imóvel: ${formatCurrency(result.propertyValue)} · saldo: ${formatCurrency(result.mortgageBalance)}`}
          />
          <Metric
            featured={result.winner === 'rent'}
            label="Patrimônio de quem aluga"
            value={formatCurrency(result.renterNetWorth)}
            hint="Entrada e diferenças mensais mantidas investidas"
          />
          <Metric
            label="Diferença projetada"
            value={formatCurrency(result.difference)}
            hint={`Cenário favorável a ${result.winner === 'buy' ? 'comprar' : 'alugar'}`}
          />
          <Metric
            label="Prestação inicial estimada"
            value={formatCurrency(result.mortgagePayment)}
          />
        </section>
      </div>
      <Assumptions>
        financiamento Price, taxas constantes e aportes mensais da diferença entre os custos.
        Condomínio, impostos, reformas, corretagem na venda e fatores pessoais não estão incluídos.
      </Assumptions>
    </CalculatorScaffold>
  );
}

export function FinancialIndependenceCalculator() {
  const [values, setValues] = useState({
    cost: '6000',
    coverage: '100',
    withdrawal: '4',
    current: '100000',
    monthly: '2000',
    realReturn: '5',
  });
  const [error, setError] = useState<string | null>(null);
  const set = (key: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));
  const build = () =>
    calculateFinancialIndependence({
      monthlyCost: Number(values.cost),
      coveragePercent: Number(values.coverage),
      withdrawalRatePercent: Number(values.withdrawal),
      currentInvestments: Number(values.current),
      monthlyContribution: Number(values.monthly),
      annualRealReturnPercent: Number(values.realReturn),
    });
  const [result, setResult] = useState(build);
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResult(build());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  return (
    <CalculatorScaffold
      title="Independência financeira"
      description="Transforme seu custo de vida em uma meta de patrimônio e descubra o caminho até ela."
      icon={BadgeDollarSign}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(19rem,.7fr)_minmax(0,1.3fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <CurrencyField label="Custo de vida mensal" value={values.cost} setValue={set('cost')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Quanto deseja cobrir"
              value={values.coverage}
              setValue={set('coverage')}
              suffix="%"
              max={100}
            />
            <NumberField
              label="Taxa anual de retirada"
              value={values.withdrawal}
              setValue={set('withdrawal')}
              suffix="%"
            />
          </div>
          <CurrencyField
            label="Investimentos atuais"
            value={values.current}
            setValue={set('current')}
          />
          <CurrencyField label="Aporte mensal" value={values.monthly} setValue={set('monthly')} />
          <NumberField
            label="Retorno real esperado"
            value={values.realReturn}
            setValue={set('realReturn')}
            suffix="% a.a."
          />
          <ErrorMessage error={error} />
          <SubmitButton>Calcular independência</SubmitButton>
        </form>
        <section className="grid gap-4 sm:grid-cols-2">
          <Metric
            featured
            label="Patrimônio-alvo"
            value={formatCurrency(result.target)}
            hint={`Renda desejada: ${formatCurrency(result.desiredMonthlyIncome)}/mês`}
          />
          <Metric
            label="Tempo estimado"
            value={
              result.projection.months
                ? formatDuration(result.projection.months)
                : result.gap === 0
                  ? 'Meta alcançada'
                  : 'Mais de 100 anos'
            }
          />
          <Metric label="Quanto falta acumular" value={formatCurrency(result.gap)} />
          <Metric
            label="Regra de retirada"
            value={formatPercentage(Number(values.withdrawal))}
            hint="Percentual anual informado por você"
          />
        </section>
      </div>
      <Assumptions>
        valores em poder de compra de hoje, retorno real constante e taxa de retirada definida pelo
        usuário. Não é garantia de rentabilidade ou duração do patrimônio.
      </Assumptions>
    </CalculatorScaffold>
  );
}

interface DebtField extends DebtItem {
  id: number;
  balanceText: string;
  rateText: string;
  minimumText: string;
}
export function MultipleDebtsCalculator() {
  const [debts, setDebts] = useState<DebtField[]>([
    {
      id: 1,
      name: 'Cartão',
      balance: 5000,
      monthlyRatePercent: 10,
      minimumPayment: 500,
      balanceText: '5000',
      rateText: '10',
      minimumText: '500',
    },
    {
      id: 2,
      name: 'Empréstimo',
      balance: 15000,
      monthlyRatePercent: 2,
      minimumPayment: 700,
      balanceText: '15000',
      rateText: '2',
      minimumText: '700',
    },
  ]);
  const [extra, setExtra] = useState('500');
  const [nextId, setNextId] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const build = () =>
    compareDebtStrategies(
      debts.map((d) => ({
        name: d.name,
        balance: Number(d.balanceText),
        monthlyRatePercent: Number(d.rateText),
        minimumPayment: Number(d.minimumText),
      })),
      Number(extra),
    );
  const [result, setResult] = useState(build);
  const update = (id: number, patch: Partial<DebtField>) =>
    setDebts((items) => items.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResult(build());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar o plano.');
    }
  }
  return (
    <CalculatorScaffold
      title="Estratégia para múltiplas dívidas"
      description="Compare quitar primeiro a maior taxa (avalanche) ou o menor saldo (bola de neve)."
      icon={Scale}
    >
      <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Suas dívidas</h2>
          <button
            type="button"
            onClick={() => {
              setDebts((d) => [
                ...d,
                {
                  id: nextId,
                  name: 'Nova dívida',
                  balance: 0,
                  monthlyRatePercent: 0,
                  minimumPayment: 0,
                  balanceText: '0',
                  rateText: '0',
                  minimumText: '0',
                },
              ]);
              setNextId((id) => id + 1);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-brand/40 px-3 py-2 text-sm text-brand-light"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-gray-400">
              <tr>
                <th className="pb-3">Dívida</th>
                <th>Saldo</th>
                <th>Juros/mês</th>
                <th>Pagamento mínimo</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => (
                <tr key={debt.id} className="border-t border-surface-border">
                  <td className="py-3 pr-2">
                    <input
                      aria-label="Nome da dívida"
                      value={debt.name}
                      onChange={(e) => update(debt.id, { name: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="p-2">
                    <CurrencyInput
                      aria-label={`Saldo de ${debt.name}`}
                      value={debt.balanceText}
                      onValueChange={(balanceText) => update(debt.id, { balanceText })}
                      className={inputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      aria-label={`Juros de ${debt.name}`}
                      value={debt.rateText}
                      onChange={(e) => update(debt.id, { rateText: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="p-2">
                    <CurrencyInput
                      aria-label={`Pagamento de ${debt.name}`}
                      value={debt.minimumText}
                      onValueChange={(minimumText) => update(debt.id, { minimumText })}
                      className={inputClass}
                    />
                  </td>
                  <td className="pl-2">
                    <button
                      type="button"
                      aria-label={`Remover ${debt.name}`}
                      onClick={() => setDebts((items) => items.filter((d) => d.id !== debt.id))}
                      className="rounded-lg border border-surface-border p-3 text-gray-400 hover:text-rose-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="max-w-sm">
          <CurrencyField label="Valor extra disponível por mês" value={extra} setValue={setExtra} />
        </div>
        <ErrorMessage error={error} />
        <SubmitButton>Comparar estratégias</SubmitButton>
      </form>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          featured
          label="Avalanche · prazo"
          value={
            result.avalanche.months ? formatDuration(result.avalanche.months) : 'Plano insuficiente'
          }
          hint="Prioriza a maior taxa"
        />
        <Metric label="Avalanche · juros" value={formatCurrency(result.avalanche.totalInterest)} />
        <Metric
          label="Bola de neve · prazo"
          value={
            result.snowball.months ? formatDuration(result.snowball.months) : 'Plano insuficiente'
          }
          hint="Prioriza o menor saldo"
        />
        <Metric
          label="Bola de neve · juros"
          value={formatCurrency(result.snowball.totalInterest)}
        />
      </section>
      <Assumptions>
        o orçamento mensal total é mantido até a quitação. Ao terminar uma dívida, o pagamento
        liberado é direcionado à próxima. Não inclui multas, renegociações ou novas compras.
      </Assumptions>
    </CalculatorScaffold>
  );
}

export function NetSalaryCalculator() {
  const [gross, setGross] = useState('8000');
  const [extras, setExtras] = useState('0');
  const [dependents, setDependents] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const build = () =>
    calculateNetSalary2026({
      grossSalary: Number(gross),
      taxableExtras: Number(extras),
      dependents: Number(dependents),
      otherDeductions: Number(deductions),
    });
  const [result, setResult] = useState(build);
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResult(build());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  return (
    <CalculatorScaffold
      title="Salário líquido"
      description="Estime o salário após INSS, IRRF e outros descontos usando as tabelas de 2026."
      icon={Banknote}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(19rem,.7fr)_minmax(0,1.3fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <CurrencyField label="Salário bruto" value={gross} setValue={setGross} />
          <CurrencyField
            label="Horas extras e adicionais tributáveis"
            value={extras}
            setValue={setExtras}
          />
          <NumberField
            label="Dependentes no IR"
            value={dependents}
            setValue={setDependents}
            step="1"
          />
          <CurrencyField
            label="Outros descontos"
            value={deductions}
            setValue={setDeductions}
            hint="VT, plano de saúde, pensão, coparticipações e descontos internos."
          />
          <ErrorMessage error={error} />
          <SubmitButton>Calcular salário líquido</SubmitButton>
        </form>
        <section className="grid gap-4 sm:grid-cols-2">
          <Metric featured label="Salário líquido estimado" value={formatCurrency(result.net)} />
          <Metric label="Remuneração tributável" value={formatCurrency(result.taxableGross)} />
          <Metric label="INSS" value={formatCurrency(result.inss)} />
          <Metric label="IRRF" value={formatCurrency(result.irrf)} />
          <Metric label="Outros descontos" value={formatCurrency(result.otherDeductions)} />
          <Metric
            label="Desconto efetivo total"
            value={formatPercentage(result.effectiveDiscountPercent)}
          />
        </section>
      </div>
      <Assumptions>
        tabelas progressivas de INSS e IRRF de 2026, usando entre deduções legais informadas pelo
        modelo e desconto simplificado a alternativa mais vantajosa. Folhas reais podem ter outras
        bases e rubricas.
      </Assumptions>
    </CalculatorScaffold>
  );
}

type IndexKey = 'ipca' | 'selic' | 'cdi';
export function MonetaryCorrectionCalculator() {
  const [value, setValue] = useState('1000');
  const [index, setIndex] = useState<IndexKey>('ipca');
  const [start, setStart] = useState('2025-01');
  const [end, setEnd] = useState('2025-12');
  const [result, setResult] = useState<ReturnType<typeof correctValueByMonthlyRates> | null>(null);
  const [months, setMonths] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function calculate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `/api/financial-indices?index=${index}&start=${start}&end=${end}`,
      );
      const body = (await response.json()) as { rates?: number[]; error?: string };
      if (!response.ok || !body.rates)
        throw new Error(body.error || 'Não foi possível consultar o índice.');
      setResult(correctValueByMonthlyRates(Number(value), body.rates));
      setMonths(body.rates.length);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível corrigir o valor.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <CalculatorScaffold
      title="Correção de valores"
      description="Atualize um valor pela variação mensal histórica de IPCA, Selic ou CDI."
      icon={LineChartIcon}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(19rem,.7fr)_minmax(0,1.3fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <CurrencyField label="Valor original" value={value} setValue={setValue} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Índice</span>
            <select
              value={index}
              onChange={(e) => setIndex(e.target.value as IndexKey)}
              className={inputClass}
            >
              <option value="ipca">IPCA</option>
              <option value="selic">Selic acumulada no mês</option>
              <option value="cdi">CDI acumulado no mês</option>
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium">Mês inicial</span>
              <input
                required
                type="month"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputClass}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Mês final</span>
              <input
                required
                type="month"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
          <ErrorMessage error={error} />
          <SubmitButton>{loading ? 'Consultando Banco Central…' : 'Atualizar valor'}</SubmitButton>
        </form>
        <section className="grid gap-4 sm:grid-cols-2">
          <Metric
            featured
            label="Valor corrigido"
            value={result ? formatCurrency(result.correctedValue) : 'Preencha e calcule'}
          />
          <Metric
            label="Variação acumulada"
            value={result ? formatPercentage(result.accumulatedPercent) : '—'}
          />
          <Metric
            label="Acréscimo no período"
            value={result ? formatCurrency(result.adjustment) : '—'}
          />
          <Metric label="Meses considerados" value={result ? String(months) : '—'} />
        </section>
      </div>
      <Assumptions>
        dados mensais consultados no SGS do Banco Central. São incluídos os meses inicial e final
        disponíveis. A atualização é o produto composto das variações e não inclui impostos ou
        regras contratuais.
      </Assumptions>
    </CalculatorScaffold>
  );
}

export function RetirementCalculator() {
  const [values, setValues] = useState({
    currentAge: '40',
    retirementAge: '65',
    desiredIncome: '8000',
    pension: '3000',
    current: '150000',
    monthly: '2500',
    realReturn: '5',
    withdrawal: '4',
  });
  const set = (key: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));
  const [error, setError] = useState<string | null>(null);
  const build = () =>
    calculateRetirementPlan({
      currentAge: Number(values.currentAge),
      retirementAge: Number(values.retirementAge),
      desiredMonthlyIncome: Number(values.desiredIncome),
      expectedMonthlyPension: Number(values.pension),
      currentInvestments: Number(values.current),
      monthlyContribution: Number(values.monthly),
      annualRealReturnPercent: Number(values.realReturn),
      withdrawalRatePercent: Number(values.withdrawal),
    });
  const [result, setResult] = useState(build);
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResult(build());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível calcular.');
    }
  }
  return (
    <CalculatorScaffold
      title="Planejamento de aposentadoria"
      description="Projete o patrimônio necessário para complementar sua renda na aposentadoria."
      icon={CalendarClock}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(19rem,.75fr)_minmax(0,1.25fr)]">
        <form onSubmit={calculate} className={`${panelClass} space-y-5`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Idade atual"
              value={values.currentAge}
              setValue={set('currentAge')}
              suffix="anos"
              step="1"
            />
            <NumberField
              label="Idade para aposentar"
              value={values.retirementAge}
              setValue={set('retirementAge')}
              suffix="anos"
              step="1"
            />
          </div>
          <CurrencyField
            label="Renda mensal desejada"
            value={values.desiredIncome}
            setValue={set('desiredIncome')}
          />
          <CurrencyField
            label="Benefício mensal estimado do INSS"
            value={values.pension}
            setValue={set('pension')}
          />
          <CurrencyField
            label="Investimentos atuais"
            value={values.current}
            setValue={set('current')}
          />
          <CurrencyField label="Aporte mensal" value={values.monthly} setValue={set('monthly')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Retorno real"
              value={values.realReturn}
              setValue={set('realReturn')}
              suffix="% a.a."
            />
            <NumberField
              label="Taxa de retirada"
              value={values.withdrawal}
              setValue={set('withdrawal')}
              suffix="% a.a."
            />
          </div>
          <ErrorMessage error={error} />
          <SubmitButton>Projetar aposentadoria</SubmitButton>
        </form>
        <section className="grid gap-4 sm:grid-cols-2">
          <Metric
            featured={result.onTrack}
            label={result.onTrack ? 'Plano no caminho' : 'Patrimônio projetado'}
            value={formatCurrency(result.projectedPortfolio)}
            hint={`Aos ${values.retirementAge} anos`}
          />
          <Metric label="Patrimônio necessário" value={formatCurrency(result.requiredPortfolio)} />
          <Metric
            label="Renda sustentável estimada"
            value={formatCurrency(result.sustainableMonthlyIncome)}
            hint="Investimentos + benefício informado"
          />
          <Metric label="Lacuna projetada" value={formatCurrency(result.gap)} />
        </section>
      </div>
      <Assumptions>
        projeção financeira em valores de hoje. O benefício do INSS é informado pelo usuário;
        consulte a estimativa oficial no Meu INSS. Rentabilidade e taxa de retirada não são
        garantidas.
      </Assumptions>
    </CalculatorScaffold>
  );
}
