'use client';

import { BriefcaseBusiness, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/shared/lib/formatters';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { compareEmploymentOffers, type EmploymentBenefit } from '../lib/employment-comparison';
import { Assumptions, CalculatorScaffold, inputClass, Metric, panelClass } from './CalculatorUi';

interface BenefitField extends EmploymentBenefit {
  id: number;
  monthlyValueText: string;
}

const initialBenefits: BenefitField[] = [
  { id: 1, name: 'Vale-alimentação/refeição', monthlyValue: 800, monthlyValueText: '800' },
  { id: 2, name: 'Plano de saúde', monthlyValue: 500, monthlyValueText: '500' },
  { id: 3, name: 'Vale-transporte', monthlyValue: 250, monthlyValueText: '250' },
];

function CurrencyField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <CurrencyInput
        required
        min="0"
        value={value}
        onValueChange={onChange}
        className={inputClass}
      />
      {hint && <span className="mt-2 block text-xs leading-5 text-gray-400">{hint}</span>}
    </label>
  );
}

export function EmploymentComparisonCalculator() {
  const [cltGross, setCltGross] = useState('8000');
  const [dependents, setDependents] = useState('0');
  const [benefits, setBenefits] = useState(initialBenefits);
  const [benefitDeductions, setBenefitDeductions] = useState('0');
  const [plr, setPlr] = useState('8000');
  const [otherAnnual, setOtherAnnual] = useState('0');
  const [pjRevenue, setPjRevenue] = useState('12000');
  const [pjTax, setPjTax] = useState('10');
  const [pjFixedCosts, setPjFixedCosts] = useState('500');
  const [pjPersonalBenefits, setPjPersonalBenefits] = useState('1000');
  const [pjVacationDays, setPjVacationDays] = useState('30');
  const [nextBenefitId, setNextBenefitId] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const buildInput = () => ({
    cltGrossMonthly: Number(cltGross),
    dependents: Number(dependents),
    benefits: benefits.map(({ name, monthlyValueText }) => ({
      name: name.trim() || 'Outro benefício',
      monthlyValue: Number(monthlyValueText),
    })),
    benefitDeductionsMonthly: Number(benefitDeductions),
    plrAnnual: Number(plr),
    otherAnnualNet: Number(otherAnnual),
    pjMonthlyRevenue: Number(pjRevenue),
    pjTaxPercent: Number(pjTax.replace(',', '.')),
    pjFixedCostsMonthly: Number(pjFixedCosts),
    pjPersonalBenefitsMonthly: Number(pjPersonalBenefits),
    pjUnpaidVacationDays: Number(pjVacationDays),
  });

  const [result, setResult] = useState(() => compareEmploymentOffers(buildInput()));

  function calculate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setResult(compareEmploymentOffers(buildInput()));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível comparar as ofertas.');
    }
  }

  function addBenefit() {
    setBenefits((current) => [
      ...current,
      { id: nextBenefitId, name: 'Outro benefício', monthlyValue: 0, monthlyValueText: '0' },
    ]);
    setNextBenefitId((id) => id + 1);
  }

  function updateBenefit(id: number, patch: Partial<BenefitField>) {
    setBenefits((current) =>
      current.map((benefit) => (benefit.id === id ? { ...benefit, ...patch } : benefit)),
    );
  }

  const chartData = [
    {
      offer: 'CLT',
      renda: result.clt.salaryNetAnnual + result.clt.plrNet,
      beneficios: result.clt.benefitsAnnual,
      fgts: result.clt.fgtsAnnual,
      custos: 0,
    },
    {
      offer: 'PJ',
      renda: result.pj.netAnnual,
      beneficios: 0,
      fgts: 0,
      custos: result.pj.costsAnnual + result.pj.taxesAnnual,
    },
  ];
  const compact = (value: number) =>
    `R$\u00a0${Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })
      .format(value)
      .replaceAll(' ', '\u00a0')}`;

  return (
    <CalculatorScaffold
      title="CLT ou PJ"
      description="Compare propostas pelo valor anual equivalente, incluindo benefícios, descanso e custos que não aparecem no salário mensal."
      icon={BriefcaseBusiness}
    >
      <form onSubmit={calculate} className="space-y-6">
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <section className={`${panelClass} space-y-5`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">
                Proposta CLT
              </p>
              <h2 className="mt-1 text-xl font-semibold">Salário e benefícios</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CurrencyField label="Salário bruto mensal" value={cltGross} onChange={setCltGross} />
              <label>
                <span className="mb-2 block text-sm font-medium">Dependentes no IR</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={dependents}
                  onChange={(event) => setDependents(event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <fieldset>
              <div className="mb-3 flex items-center justify-between gap-3">
                <legend className="text-sm font-semibold">Benefícios mensais</legend>
                <button
                  type="button"
                  onClick={addBenefit}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand/40 px-3 py-2 text-xs font-semibold text-brand-light"
                >
                  <Plus size={15} /> Adicionar benefício
                </button>
              </div>
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit.id} className="grid grid-cols-[minmax(0,1fr)_9rem_auto] gap-2">
                    <input
                      aria-label="Nome do benefício"
                      value={benefit.name}
                      onChange={(event) => updateBenefit(benefit.id, { name: event.target.value })}
                      className={inputClass}
                    />
                    <CurrencyInput
                      aria-label={`Valor mensal de ${benefit.name}`}
                      min="0"
                      value={benefit.monthlyValueText}
                      onValueChange={(monthlyValueText) =>
                        updateBenefit(benefit.id, { monthlyValueText })
                      }
                      className={inputClass}
                    />
                    <button
                      type="button"
                      aria-label={`Remover ${benefit.name}`}
                      onClick={() =>
                        setBenefits((current) => current.filter((item) => item.id !== benefit.id))
                      }
                      className="rounded-lg border border-surface-border p-3 text-gray-400 hover:text-rose-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>

            <CurrencyField
              label="Descontos mensais dos benefícios"
              value={benefitDeductions}
              onChange={setBenefitDeductions}
              hint="Ex.: participação no vale-transporte, coparticipação médica ou refeição."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <CurrencyField label="PLR anual bruta" value={plr} onChange={setPlr} />
              <CurrencyField
                label="Outros bônus anuais líquidos"
                value={otherAnnual}
                onChange={setOtherAnnual}
              />
            </div>
          </section>

          <section className={`${panelClass} space-y-5`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                Proposta PJ
              </p>
              <h2 className="mt-1 text-xl font-semibold">Faturamento e custos</h2>
            </div>
            <CurrencyField label="Valor mensal da nota" value={pjRevenue} onChange={setPjRevenue} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-medium">Impostos sobre a nota</span>
                <div className="relative">
                  <input
                    required
                    inputMode="decimal"
                    value={pjTax}
                    onChange={(event) => setPjTax(event.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <span className="absolute right-4 top-3 text-gray-400">%</span>
                </div>
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">Dias sem faturar por ano</span>
                <div className="relative">
                  <input
                    required
                    type="number"
                    min="0"
                    max="365"
                    step="1"
                    value={pjVacationDays}
                    onChange={(event) => setPjVacationDays(event.target.value)}
                    className={`${inputClass} pr-14`}
                  />
                  <span className="absolute right-4 top-3 text-gray-400">dias</span>
                </div>
              </label>
            </div>
            <CurrencyField
              label="Custos fixos mensais da empresa"
              value={pjFixedCosts}
              onChange={setPjFixedCosts}
              hint="Contabilidade, banco, emissão de notas, equipamentos e outros custos operacionais."
            />
            <CurrencyField
              label="Benefícios e proteções pagos por você"
              value={pjPersonalBenefits}
              onChange={setPjPersonalBenefits}
              hint="Plano de saúde, previdência, seguros, alimentação e transporte."
            />
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-gray-300">
              A alíquota PJ é configurável porque depende do regime tributário, atividade,
              pró-labore e fator R. Confirme-a com sua contabilidade.
            </div>
          </section>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm text-rose-400"
          >
            {error}
          </p>
        )}
        <button className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-black sm:w-auto sm:min-w-72">
          Comparar propostas
        </button>
      </form>

      <section aria-live="polite" className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            featured={result.winner === 'clt'}
            label="Pacote CLT anual"
            value={formatCurrency(result.clt.totalPackageAnnual)}
            hint={`${formatCurrency(result.clt.totalPackageAnnual / 12)}/mês equivalente, incluindo FGTS`}
          />
          <Metric
            featured={result.winner === 'pj'}
            label="PJ líquido anual"
            value={formatCurrency(result.pj.netAnnual)}
            hint={`${formatCurrency(result.pj.netAnnual / 12)}/mês equivalente após custos`}
          />
          <Metric
            label="Diferença anual"
            value={formatCurrency(Math.abs(result.differenceAnnual))}
            hint={`Vantagem estimada para ${result.winner === 'clt' ? 'CLT' : 'PJ'}`}
          />
          <Metric
            label="PJ mensal para empatar"
            value={formatCurrency(result.pjBreakEvenMonthly)}
            hint="Valor aproximado da nota mensal nas mesmas condições"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,.9fr)]">
          <article className={panelClass}>
            <h2 className="text-lg font-semibold">Comparação anual equivalente</h2>
            <p className="mb-5 mt-1 text-sm text-gray-400">
              Benefícios e FGTS ficam separados do dinheiro líquido para a comparação não esconder a
              composição de cada proposta.
            </p>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgb(var(--border))"
                    strokeDasharray="3 6"
                  />
                  <XAxis dataKey="offer" tick={{ fill: 'rgb(var(--muted))' }} />
                  <YAxis width={86} tickFormatter={compact} tick={{ fill: 'rgb(var(--muted))' }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar
                    dataKey="renda"
                    name="Renda líquida"
                    stackId="total"
                    fill="rgb(var(--positive))"
                  />
                  <Bar dataKey="beneficios" name="Benefícios" stackId="total" fill="#38bdf8" />
                  <Bar
                    dataKey="fgts"
                    name="FGTS"
                    stackId="total"
                    fill="#a78bfa"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-300">
              <span>
                <i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" />
                Renda líquida
              </span>
              <span>
                <i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-sky-400" />
                Benefícios
              </span>
              <span>
                <i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-violet-400" />
                FGTS
              </span>
            </div>
          </article>

          <article className={`${panelClass} space-y-5`}>
            <div>
              <h2 className="text-lg font-semibold">Como chegamos ao resultado</h2>
              <p className="mt-1 text-sm text-gray-400">Valores anuais estimados.</p>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ['CLT · salários, 13º e férias líquidos', result.clt.salaryNetAnnual],
                ['CLT · benefícios após descontos', result.clt.benefitsAnnual],
                ['CLT · PLR líquida', result.clt.plrNet],
                ['CLT · FGTS', result.clt.fgtsAnnual],
                ['PJ · faturamento no ano', result.pj.revenueAnnual],
                ['PJ · impostos', -result.pj.taxesAnnual],
                ['PJ · custos e proteções', -result.pj.costsAnnual],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex justify-between gap-4 border-b border-surface-border pb-3 last:border-0"
                >
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="whitespace-nowrap font-semibold">
                    {formatCurrency(Number(value))}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      <Assumptions>
        cálculo estimado com tabelas de INSS e IRRF de 2026, desconto simplificado quando mais
        vantajoso, tributação exclusiva da PLR e depósito de FGTS de 8%. Convenções coletivas,
        adicionais, deduções específicas, distribuição de lucros, pró-labore e direitos em uma
        rescisão não estão incluídos. Benefícios foram valorizados pelo valor informado, embora não
        sejam dinheiro de livre uso.
      </Assumptions>
    </CalculatorScaffold>
  );
}
