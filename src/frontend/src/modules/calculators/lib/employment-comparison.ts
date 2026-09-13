export interface EmploymentBenefit {
  name: string;
  monthlyValue: number;
}

export interface EmploymentComparisonInput {
  cltGrossMonthly: number;
  dependents: number;
  benefits: EmploymentBenefit[];
  benefitDeductionsMonthly: number;
  plrAnnual: number;
  otherAnnualNet: number;
  pjMonthlyRevenue: number;
  pjTaxPercent: number;
  pjFixedCostsMonthly: number;
  pjPersonalBenefitsMonthly: number;
  pjUnpaidVacationDays: number;
}

const INSS_2026 = [
  { limit: 1621, rate: 0.075 },
  { limit: 2902.84, rate: 0.09 },
  { limit: 4354.27, rate: 0.12 },
  { limit: 8475.55, rate: 0.14 },
] as const;

export function calculateInss2026(gross: number) {
  if (!Number.isFinite(gross) || gross < 0) throw new Error('Salário inválido.');
  let contribution = 0;
  let previousLimit = 0;
  for (const tier of INSS_2026) {
    const taxable = Math.max(0, Math.min(gross, tier.limit) - previousLimit);
    contribution += taxable * tier.rate;
    previousLimit = tier.limit;
    if (gross <= tier.limit) break;
  }
  return contribution;
}

function progressiveIncomeTax(base: number) {
  if (base <= 2428.8) return 0;
  if (base <= 2826.65) return base * 0.075 - 182.16;
  if (base <= 3751.05) return base * 0.15 - 394.16;
  if (base <= 4664.68) return base * 0.225 - 675.49;
  return base * 0.275 - 908.73;
}

export function calculateIrrf2026(gross: number, inss: number, dependents = 0) {
  if (
    ![gross, inss, dependents].every(Number.isFinite) ||
    gross < 0 ||
    inss < 0 ||
    !Number.isInteger(dependents) ||
    dependents < 0
  ) {
    throw new Error('Dados de IRRF inválidos.');
  }
  const legalDeductions = inss + dependents * 189.59;
  const deduction = Math.max(legalDeductions, 607.2);
  const taxBeforeReduction = Math.max(0, progressiveIncomeTax(Math.max(0, gross - deduction)));
  const reduction =
    gross <= 5000 ? taxBeforeReduction : gross <= 7350 ? Math.max(0, 978.62 - 0.133145 * gross) : 0;
  return Math.max(0, taxBeforeReduction - Math.min(taxBeforeReduction, reduction));
}

export function calculatePlrTax2026(plr: number) {
  if (!Number.isFinite(plr) || plr < 0) throw new Error('PLR inválida.');
  if (plr <= 8214.4) return 0;
  if (plr <= 9922.28) return plr * 0.075 - 616.08;
  if (plr <= 13167) return plr * 0.15 - 1360.25;
  if (plr <= 16380.38) return plr * 0.225 - 2347.78;
  return plr * 0.275 - 3166.8;
}

function calculateCltNet(gross: number, dependents: number) {
  const inss = calculateInss2026(gross);
  const irrf = calculateIrrf2026(gross, inss, dependents);
  return { inss, irrf, net: gross - inss - irrf };
}

export function compareEmploymentOffers(input: EmploymentComparisonInput) {
  const numericValues = [
    input.cltGrossMonthly,
    input.dependents,
    input.benefitDeductionsMonthly,
    input.plrAnnual,
    input.otherAnnualNet,
    input.pjMonthlyRevenue,
    input.pjTaxPercent,
    input.pjFixedCostsMonthly,
    input.pjPersonalBenefitsMonthly,
    input.pjUnpaidVacationDays,
    ...input.benefits.map((benefit) => benefit.monthlyValue),
  ];
  if (
    !numericValues.every(Number.isFinite) ||
    numericValues.some((value) => value < 0) ||
    input.cltGrossMonthly <= 0 ||
    input.pjMonthlyRevenue <= 0 ||
    !Number.isInteger(input.dependents) ||
    input.pjTaxPercent >= 100 ||
    input.pjUnpaidVacationDays > 365
  ) {
    throw new Error('Revise os valores das duas propostas.');
  }

  const regular = calculateCltNet(input.cltGrossMonthly, input.dependents);
  const thirteenth = calculateCltNet(input.cltGrossMonthly, input.dependents);
  const vacationMonth = calculateCltNet((input.cltGrossMonthly * 4) / 3, input.dependents);
  const vacationBonusNet = Math.max(0, vacationMonth.net - regular.net);
  const benefitsMonthly = input.benefits.reduce(
    (total, benefit) => total + benefit.monthlyValue,
    0,
  );
  const plrTax = calculatePlrTax2026(input.plrAnnual);
  const plrNet = input.plrAnnual - plrTax;
  const cltSalaryNetAnnual = regular.net * 12 + thirteenth.net + vacationBonusNet;
  const cltBenefitsAnnual = Math.max(0, benefitsMonthly * 12 - input.benefitDeductionsMonthly * 12);
  const cltSpendableAnnual = cltSalaryNetAnnual + cltBenefitsAnnual + plrNet + input.otherAnnualNet;
  const fgtsAnnual = input.cltGrossMonthly * (13 + 1 / 3) * 0.08;
  const cltTotalPackageAnnual = cltSpendableAnnual + fgtsAnnual;

  const productiveMonths = Math.max(0, 12 - input.pjUnpaidVacationDays / 30);
  const pjRevenueAnnual = input.pjMonthlyRevenue * productiveMonths;
  const pjTaxesAnnual = pjRevenueAnnual * (input.pjTaxPercent / 100);
  const pjCostsAnnual = (input.pjFixedCostsMonthly + input.pjPersonalBenefitsMonthly) * 12;
  const pjNetAnnual = Math.max(0, pjRevenueAnnual - pjTaxesAnnual - pjCostsAnnual);
  const monthlyRateAfterTax = 1 - input.pjTaxPercent / 100;
  const pjBreakEvenMonthly =
    productiveMonths > 0 && monthlyRateAfterTax > 0
      ? (cltTotalPackageAnnual + pjCostsAnnual) / productiveMonths / monthlyRateAfterTax
      : Number.POSITIVE_INFINITY;

  return {
    clt: {
      regularNetMonthly: regular.net - input.benefitDeductionsMonthly,
      inssMonthly: regular.inss,
      irrfMonthly: regular.irrf,
      thirteenthNet: thirteenth.net,
      vacationBonusNet,
      benefitsMonthly,
      benefitsAnnual: cltBenefitsAnnual,
      plrNet,
      plrTax,
      salaryNetAnnual: cltSalaryNetAnnual,
      spendableAnnual: cltSpendableAnnual,
      fgtsAnnual,
      totalPackageAnnual: cltTotalPackageAnnual,
    },
    pj: {
      productiveMonths,
      revenueAnnual: pjRevenueAnnual,
      taxesAnnual: pjTaxesAnnual,
      costsAnnual: pjCostsAnnual,
      netAnnual: pjNetAnnual,
    },
    pjBreakEvenMonthly,
    differenceAnnual: pjNetAnnual - cltTotalPackageAnnual,
    winner: pjNetAnnual > cltTotalPackageAnnual ? ('pj' as const) : ('clt' as const),
  };
}
