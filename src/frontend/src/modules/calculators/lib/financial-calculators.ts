import { annualToMonthlyRate, type ProjectionPoint } from './first-million';

export function compareCashAndInstallments(input: {
  cashPrice: number;
  installmentAmount: number;
  installments: number;
  annualOpportunityRate: number;
}) {
  const { cashPrice, installmentAmount, installments, annualOpportunityRate } = input;
  if (
    ![cashPrice, installmentAmount, installments, annualOpportunityRate].every(Number.isFinite) ||
    cashPrice <= 0 ||
    installmentAmount <= 0 ||
    !Number.isInteger(installments) ||
    installments <= 0
  ) {
    throw new Error('Informe preços e quantidade de parcelas válidos.');
  }
  const rate = annualToMonthlyRate(annualOpportunityRate);
  const installmentTotal = installmentAmount * installments;
  const presentValue =
    rate === 0
      ? installmentTotal
      : (installmentAmount * (1 - Math.pow(1 + rate, -installments))) / rate;
  const advantage = Math.abs(presentValue - cashPrice);
  return {
    installmentTotal,
    nominalDifference: installmentTotal - cashPrice,
    presentValue,
    advantage,
    recommendation: cashPrice <= presentValue ? ('cash' as const) : ('installments' as const),
  };
}

export interface DebtPlan {
  possible: boolean;
  months: number | null;
  totalPaid: number;
  totalInterest: number;
  schedule: Array<{ month: number; balance: number }>;
}

export function calculateDebtPlan(
  balance: number,
  monthlyRatePercent: number,
  monthlyPayment: number,
): DebtPlan {
  if (
    ![balance, monthlyRatePercent, monthlyPayment].every(Number.isFinite) ||
    balance <= 0 ||
    monthlyRatePercent < 0 ||
    monthlyPayment <= 0
  )
    throw new Error('Informe valores válidos para a dívida.');
  const rate = monthlyRatePercent / 100;
  if (monthlyPayment <= balance * rate)
    return { possible: false, months: null, totalPaid: 0, totalInterest: 0, schedule: [] };
  let remaining = balance;
  let totalPaid = 0;
  let totalInterest = 0;
  const schedule = [{ month: 0, balance }];
  for (let month = 1; month <= 1200; month += 1) {
    const interest = remaining * rate;
    const payment = Math.min(monthlyPayment, remaining + interest);
    remaining = Math.max(0, remaining + interest - payment);
    totalInterest += interest;
    totalPaid += payment;
    if (month % 6 === 0 || remaining === 0) schedule.push({ month, balance: remaining });
    if (remaining === 0)
      return { possible: true, months: month, totalPaid, totalInterest, schedule };
  }
  return { possible: false, months: null, totalPaid, totalInterest, schedule };
}

export interface FinancingSchedulePoint {
  month: number;
  priceBalance: number;
  sacBalance: number;
}

export function compareFinancing(principal: number, annualRatePercent: number, months: number) {
  if (
    ![principal, annualRatePercent, months].every(Number.isFinite) ||
    principal <= 0 ||
    annualRatePercent < 0 ||
    !Number.isInteger(months) ||
    months <= 0
  ) {
    throw new Error('Informe valor, taxa e prazo válidos.');
  }
  const rate = annualToMonthlyRate(annualRatePercent);
  const pricePayment =
    rate === 0 ? principal / months : (principal * rate) / (1 - Math.pow(1 + rate, -months));
  const sacAmortization = principal / months;
  let priceBalance = principal;
  let sacBalance = principal;
  let priceInterest = 0;
  let sacInterest = 0;
  let sacFirstPayment = 0;
  let sacLastPayment = 0;
  const schedule: FinancingSchedulePoint[] = [{ month: 0, priceBalance, sacBalance }];
  for (let month = 1; month <= months; month += 1) {
    const priceMonthInterest = priceBalance * rate;
    priceBalance = Math.max(0, priceBalance - (pricePayment - priceMonthInterest));
    priceInterest += priceMonthInterest;
    const sacMonthInterest = sacBalance * rate;
    const sacPayment = sacAmortization + sacMonthInterest;
    if (month === 1) sacFirstPayment = sacPayment;
    if (month === months) sacLastPayment = sacPayment;
    sacBalance = Math.max(0, sacBalance - sacAmortization);
    sacInterest += sacMonthInterest;
    if (month % Math.max(1, Math.ceil(months / 24)) === 0 || month === months)
      schedule.push({ month, priceBalance, sacBalance });
  }
  return {
    pricePayment,
    priceInterest,
    priceTotal: principal + priceInterest,
    sacFirstPayment,
    sacLastPayment,
    sacInterest,
    sacTotal: principal + sacInterest,
    schedule,
  };
}

export function calculateCompoundInterest(
  initial: number,
  monthlyContribution: number,
  annualRatePercent: number,
  months: number,
) {
  if (
    ![initial, monthlyContribution, annualRatePercent, months].every(Number.isFinite) ||
    initial < 0 ||
    monthlyContribution < 0 ||
    annualRatePercent < 0 ||
    !Number.isInteger(months) ||
    months <= 0
  ) {
    throw new Error('Informe valores válidos para a simulação.');
  }
  const rate = annualToMonthlyRate(annualRatePercent);
  let balance = initial;
  let invested = initial;
  const points: ProjectionPoint[] = [{ month: 0, balance, invested, earnings: 0 }];
  for (let month = 1; month <= months; month += 1) {
    balance = balance * (1 + rate) + monthlyContribution;
    invested += monthlyContribution;
    if (month % 12 === 0 || month === months)
      points.push({ month, balance, invested, earnings: balance - invested });
  }
  return { balance, invested, earnings: balance - invested, points };
}

export function calculateInflation(value: number, annualInflationPercent: number, years: number) {
  if (
    ![value, annualInflationPercent, years].every(Number.isFinite) ||
    value <= 0 ||
    annualInflationPercent < 0 ||
    years <= 0
  )
    throw new Error('Informe valor, inflação e prazo válidos.');
  const factor = Math.pow(1 + annualInflationPercent / 100, years);
  return {
    futureCost: value * factor,
    futurePurchasingPower: value / factor,
    purchasingPowerLoss: value - value / factor,
    accumulatedInflationPercent: (factor - 1) * 100,
  };
}

export type AmortizationSystem = 'price' | 'sac';

interface LoanPlan {
  months: number;
  firstPayment: number;
  lastPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: Array<{ month: number; balance: number }>;
}

function buildLoanPlan(
  principal: number,
  monthlyRate: number,
  system: AmortizationSystem,
  months: number,
  fixedPayment?: number,
  fixedAmortization?: number,
): LoanPlan {
  if (principal <= 0) {
    return {
      months: 0,
      firstPayment: 0,
      lastPayment: 0,
      totalInterest: 0,
      totalPaid: 0,
      schedule: [{ month: 0, balance: 0 }],
    };
  }
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  let firstPayment = 0;
  let lastPayment = 0;
  const schedule = [{ month: 0, balance }];
  const pricePayment =
    fixedPayment ??
    (monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)));
  const sacAmortization = fixedAmortization ?? principal / months;
  let elapsed = 0;
  while (balance > 0.005 && elapsed < 1200) {
    elapsed += 1;
    const interest = balance * monthlyRate;
    const plannedPayment =
      system === 'price' ? pricePayment : Math.min(sacAmortization, balance) + interest;
    const payment = Math.min(plannedPayment, balance + interest);
    const amortized = Math.max(0, payment - interest);
    if (amortized <= 0) throw new Error('A prestação informada não reduz o saldo devedor.');
    balance = Math.max(0, balance - amortized);
    totalInterest += interest;
    totalPaid += payment;
    if (elapsed === 1) firstPayment = payment;
    lastPayment = payment;
    schedule.push({ month: elapsed, balance });
    if (fixedPayment === undefined && fixedAmortization === undefined && elapsed >= months) break;
  }
  return { months: elapsed, firstPayment, lastPayment, totalInterest, totalPaid, schedule };
}

export function compareAmortization(input: {
  balance: number;
  annualRatePercent: number;
  remainingMonths: number;
  extraPayment: number;
  system: AmortizationSystem;
}) {
  const { balance, annualRatePercent, remainingMonths, extraPayment, system } = input;
  if (
    ![balance, annualRatePercent, remainingMonths, extraPayment].every(Number.isFinite) ||
    balance <= 0 ||
    annualRatePercent < 0 ||
    !Number.isInteger(remainingMonths) ||
    remainingMonths <= 0 ||
    extraPayment <= 0 ||
    extraPayment > balance ||
    !['price', 'sac'].includes(system)
  ) {
    throw new Error('Informe saldo, taxa, prazo e amortização válidos.');
  }
  const rate = annualToMonthlyRate(annualRatePercent);
  const baseline = buildLoanPlan(balance, rate, system, remainingMonths);
  const reducedBalance = Math.max(0, balance - extraPayment);
  const reducePayment = buildLoanPlan(reducedBalance, rate, system, remainingMonths);
  const reduceTerm =
    system === 'price'
      ? buildLoanPlan(reducedBalance, rate, system, remainingMonths, baseline.firstPayment)
      : buildLoanPlan(
          reducedBalance,
          rate,
          system,
          remainingMonths,
          undefined,
          balance / remainingMonths,
        );
  return {
    system,
    reducedBalance,
    baseline,
    reducePayment,
    reduceTerm,
    paymentSavings: baseline.totalInterest - reducePayment.totalInterest,
    termSavings: baseline.totalInterest - reduceTerm.totalInterest,
    eliminatedMonths: baseline.months - reduceTerm.months,
  };
}
