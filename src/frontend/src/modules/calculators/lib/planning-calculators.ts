import { annualToMonthlyRate } from './first-million';
import { calculateDebtPlan } from './financial-calculators';
import { calculateInss2026, calculateIrrf2026 } from './employment-comparison';

function validate(values: number[], message: string) {
  if (!values.every(Number.isFinite) || values.some((value) => value < 0)) {
    throw new Error(message);
  }
}

export function compareCreditOptions(input: {
  balance: number;
  monthlyPayment: number;
  cardMonthlyRate: number;
  alternativeMonthlyRate: number;
}) {
  validate(Object.values(input), 'Revise os valores da dívida.');
  if (input.balance <= 0 || input.monthlyPayment <= 0)
    throw new Error('Informe saldo e pagamento.');
  const card = calculateDebtPlan(input.balance, input.cardMonthlyRate, input.monthlyPayment);
  const alternative = calculateDebtPlan(
    input.balance,
    input.alternativeMonthlyRate,
    input.monthlyPayment,
  );
  return {
    card,
    alternative,
    interestSavings:
      card.possible && alternative.possible
        ? Math.max(0, card.totalInterest - alternative.totalInterest)
        : null,
    monthsSaved:
      card.months && alternative.months ? Math.max(0, card.months - alternative.months) : null,
  };
}

export interface InvestmentOption {
  name: string;
  annualRatePercent: number;
  incomeTaxPercent: number;
  annualFeePercent: number;
}

export function compareInvestments(input: {
  initial: number;
  monthlyContribution: number;
  years: number;
  inflationPercent: number;
  options: InvestmentOption[];
}) {
  validate(
    [input.initial, input.monthlyContribution, input.years, input.inflationPercent],
    'Revise os valores da simulação.',
  );
  if (input.years <= 0 || input.options.length === 0) throw new Error('Informe prazo e opções.');
  const months = Math.round(input.years * 12);
  const invested = input.initial + input.monthlyContribution * months;
  return input.options
    .map((option) => {
      validate(
        [option.annualRatePercent, option.incomeTaxPercent, option.annualFeePercent],
        `Revise a opção ${option.name}.`,
      );
      const netAnnualRate = Math.max(0, option.annualRatePercent - option.annualFeePercent);
      const monthlyRate = annualToMonthlyRate(netAnnualRate);
      let grossBalance = input.initial;
      for (let month = 1; month <= months; month += 1) {
        grossBalance = grossBalance * (1 + monthlyRate) + input.monthlyContribution;
      }
      const earnings = Math.max(0, grossBalance - invested);
      const tax = earnings * (option.incomeTaxPercent / 100);
      const netBalance = grossBalance - tax;
      const realBalance = netBalance / Math.pow(1 + input.inflationPercent / 100, input.years);
      return { ...option, invested, grossBalance, earnings, tax, netBalance, realBalance };
    })
    .sort((a, b) => b.netBalance - a.netBalance);
}

function fixedPayment(principal: number, annualRatePercent: number, months: number) {
  const rate = annualToMonthlyRate(annualRatePercent);
  return rate === 0 ? principal / months : (principal * rate) / (1 - (1 + rate) ** -months);
}

export function compareRentAndBuy(input: {
  propertyPrice: number;
  downPayment: number;
  acquisitionCostPercent: number;
  financingAnnualRate: number;
  financingMonths: number;
  monthlyRent: number;
  annualRentAdjustment: number;
  annualPropertyAppreciation: number;
  annualInvestmentReturn: number;
  annualMaintenancePercent: number;
  horizonYears: number;
}) {
  validate(Object.values(input), 'Revise os dados do imóvel.');
  if (
    input.propertyPrice <= 0 ||
    input.downPayment > input.propertyPrice ||
    input.financingMonths <= 0 ||
    input.horizonYears <= 0
  ) {
    throw new Error('Informe preço, entrada e prazos válidos.');
  }
  const financed = input.propertyPrice - input.downPayment;
  const mortgagePayment =
    financed > 0 ? fixedPayment(financed, input.financingAnnualRate, input.financingMonths) : 0;
  const financingRate = annualToMonthlyRate(input.financingAnnualRate);
  const investmentRate = annualToMonthlyRate(input.annualInvestmentReturn);
  const propertyRate = annualToMonthlyRate(input.annualPropertyAppreciation);
  const rentRate = annualToMonthlyRate(input.annualRentAdjustment);
  const acquisitionCost = input.propertyPrice * (input.acquisitionCostPercent / 100);
  let rent = input.monthlyRent;
  let propertyValue = input.propertyPrice;
  let mortgageBalance = financed;
  let renterPortfolio = input.downPayment + acquisitionCost;
  let buyerPortfolio = 0;
  let totalRent = 0;
  let totalBuyCost = input.downPayment + acquisitionCost;
  const horizonMonths = Math.round(input.horizonYears * 12);
  for (let month = 1; month <= horizonMonths; month += 1) {
    rent *= 1 + rentRate;
    propertyValue *= 1 + propertyRate;
    const interest = mortgageBalance * financingRate;
    const payment =
      month <= input.financingMonths ? Math.min(mortgagePayment, mortgageBalance + interest) : 0;
    mortgageBalance = Math.max(0, mortgageBalance + interest - payment);
    const maintenance = (propertyValue * (input.annualMaintenancePercent / 100)) / 12;
    const buyMonthlyCost = payment + maintenance;
    totalRent += rent;
    totalBuyCost += buyMonthlyCost;
    renterPortfolio = renterPortfolio * (1 + investmentRate) + Math.max(0, buyMonthlyCost - rent);
    buyerPortfolio = buyerPortfolio * (1 + investmentRate) + Math.max(0, rent - buyMonthlyCost);
  }
  const buyerNetWorth = propertyValue - mortgageBalance + buyerPortfolio;
  const renterNetWorth = renterPortfolio;
  return {
    mortgagePayment,
    propertyValue,
    mortgageBalance,
    buyerPortfolio,
    renterPortfolio,
    buyerNetWorth,
    renterNetWorth,
    totalRent,
    totalBuyCost,
    winner: buyerNetWorth >= renterNetWorth ? ('buy' as const) : ('rent' as const),
    difference: Math.abs(buyerNetWorth - renterNetWorth),
  };
}

function projectGoal(
  current: number,
  monthlyContribution: number,
  annualRealRate: number,
  target: number,
) {
  const rate = annualToMonthlyRate(annualRealRate);
  let balance = current;
  const schedule = [{ month: 0, balance }];
  for (let month = 1; month <= 1200; month += 1) {
    balance = balance * (1 + rate) + monthlyContribution;
    if (month % 12 === 0 || balance >= target) schedule.push({ month, balance });
    if (balance >= target) return { possible: true, months: month, balance, schedule };
  }
  return { possible: false, months: null, balance, schedule };
}

export function calculateFinancialIndependence(input: {
  monthlyCost: number;
  coveragePercent: number;
  withdrawalRatePercent: number;
  currentInvestments: number;
  monthlyContribution: number;
  annualRealReturnPercent: number;
}) {
  validate(Object.values(input), 'Revise os dados do plano.');
  if (input.monthlyCost <= 0 || input.withdrawalRatePercent <= 0 || input.coveragePercent > 100) {
    throw new Error('Informe custo, cobertura e taxa de retirada válidos.');
  }
  const desiredMonthlyIncome = input.monthlyCost * (input.coveragePercent / 100);
  const target = (desiredMonthlyIncome * 12) / (input.withdrawalRatePercent / 100);
  const projection = projectGoal(
    input.currentInvestments,
    input.monthlyContribution,
    input.annualRealReturnPercent,
    target,
  );
  return {
    desiredMonthlyIncome,
    target,
    projection,
    gap: Math.max(0, target - input.currentInvestments),
  };
}

export interface DebtItem {
  name: string;
  balance: number;
  monthlyRatePercent: number;
  minimumPayment: number;
}

function simulateDebtStrategy(
  debts: DebtItem[],
  extraPayment: number,
  strategy: 'avalanche' | 'snowball',
) {
  const items = debts.map((debt) => ({ ...debt }));
  const monthlyBudget =
    debts.reduce((total, debt) => total + debt.minimumPayment, 0) + extraPayment;
  let totalInterest = 0;
  const schedule = [{ month: 0, balance: items.reduce((total, debt) => total + debt.balance, 0) }];
  for (let month = 1; month <= 1200; month += 1) {
    for (const debt of items) {
      const interest = debt.balance * (debt.monthlyRatePercent / 100);
      debt.balance += interest;
      totalInterest += interest;
    }
    let remainingBudget = monthlyBudget;
    for (const debt of items.filter((item) => item.balance > 0)) {
      const payment = Math.min(debt.minimumPayment, debt.balance, remainingBudget);
      debt.balance -= payment;
      remainingBudget -= payment;
    }
    const ordered = items
      .filter((item) => item.balance > 0)
      .sort((a, b) =>
        strategy === 'avalanche'
          ? b.monthlyRatePercent - a.monthlyRatePercent || a.balance - b.balance
          : a.balance - b.balance || b.monthlyRatePercent - a.monthlyRatePercent,
      );
    for (const debt of ordered) {
      if (remainingBudget <= 0) break;
      const payment = Math.min(remainingBudget, debt.balance);
      debt.balance -= payment;
      remainingBudget -= payment;
    }
    const balance = items.reduce((total, debt) => total + debt.balance, 0);
    if (month % 3 === 0 || balance <= 0.005) schedule.push({ month, balance });
    if (balance <= 0.005) return { possible: true, months: month, totalInterest, schedule };
    if (
      items.every(
        (debt) => debt.minimumPayment <= debt.balance * (debt.monthlyRatePercent / 100),
      ) &&
      extraPayment === 0
    )
      break;
  }
  return { possible: false, months: null, totalInterest, schedule };
}

export function compareDebtStrategies(debts: DebtItem[], extraPayment: number) {
  validate(
    [
      extraPayment,
      ...debts.flatMap((debt) => [debt.balance, debt.monthlyRatePercent, debt.minimumPayment]),
    ],
    'Revise os dados das dívidas.',
  );
  if (debts.length === 0 || debts.some((debt) => debt.balance <= 0 || debt.minimumPayment <= 0)) {
    throw new Error('Cadastre ao menos uma dívida válida.');
  }
  return {
    avalanche: simulateDebtStrategy(debts, extraPayment, 'avalanche'),
    snowball: simulateDebtStrategy(debts, extraPayment, 'snowball'),
    monthlyBudget: debts.reduce((total, debt) => total + debt.minimumPayment, 0) + extraPayment,
  };
}

export function calculateNetSalary2026(input: {
  grossSalary: number;
  taxableExtras: number;
  dependents: number;
  otherDeductions: number;
}) {
  validate(Object.values(input), 'Revise os dados do salário.');
  if (input.grossSalary <= 0 || !Number.isInteger(input.dependents))
    throw new Error('Informe um salário válido.');
  const taxableGross = input.grossSalary + input.taxableExtras;
  const inss = calculateInss2026(taxableGross);
  const irrf = calculateIrrf2026(taxableGross, inss, input.dependents);
  const net = taxableGross - inss - irrf - input.otherDeductions;
  return {
    taxableGross,
    inss,
    irrf,
    otherDeductions: input.otherDeductions,
    net,
    effectiveDiscountPercent: ((taxableGross - net) / taxableGross) * 100,
  };
}

export function correctValueByMonthlyRates(value: number, monthlyRates: number[]) {
  validate([value, ...monthlyRates], 'Não foi possível corrigir o valor.');
  if (value <= 0 || monthlyRates.length === 0) throw new Error('Informe valor e período válidos.');
  const factor = monthlyRates.reduce((current, rate) => current * (1 + rate / 100), 1);
  return {
    originalValue: value,
    correctedValue: value * factor,
    adjustment: value * (factor - 1),
    accumulatedPercent: (factor - 1) * 100,
    factor,
  };
}

export function calculateRetirementPlan(input: {
  currentAge: number;
  retirementAge: number;
  desiredMonthlyIncome: number;
  expectedMonthlyPension: number;
  currentInvestments: number;
  monthlyContribution: number;
  annualRealReturnPercent: number;
  withdrawalRatePercent: number;
}) {
  validate(Object.values(input), 'Revise os dados da aposentadoria.');
  if (input.retirementAge <= input.currentAge || input.withdrawalRatePercent <= 0)
    throw new Error('Informe idades e taxa de retirada válidas.');
  const months = Math.round((input.retirementAge - input.currentAge) * 12);
  const requiredPortfolio =
    (Math.max(0, input.desiredMonthlyIncome - input.expectedMonthlyPension) * 12) /
    (input.withdrawalRatePercent / 100);
  const rate = annualToMonthlyRate(input.annualRealReturnPercent);
  let projectedPortfolio = input.currentInvestments;
  for (let month = 1; month <= months; month += 1)
    projectedPortfolio = projectedPortfolio * (1 + rate) + input.monthlyContribution;
  const sustainableMonthlyIncome =
    (projectedPortfolio * (input.withdrawalRatePercent / 100)) / 12 + input.expectedMonthlyPension;
  return {
    months,
    requiredPortfolio,
    projectedPortfolio,
    sustainableMonthlyIncome,
    gap: Math.max(0, requiredPortfolio - projectedPortfolio),
    onTrack: projectedPortfolio >= requiredPortfolio,
  };
}
