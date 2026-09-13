export const FIRST_MILLION_TARGET = 1_000_000;
export const MAX_PROJECTION_MONTHS = 1_200;
const MONEY_TOLERANCE = 0.005;

export interface ProjectionPoint {
  month: number;
  balance: number;
  invested: number;
  earnings: number;
}

export interface MillionProjection {
  reached: boolean;
  months: number | null;
  balance: number;
  invested: number;
  earnings: number;
  points: ProjectionPoint[];
  milestones: Array<{ target: number; month: number | null }>;
}

export function annualToMonthlyRate(annualRatePercent: number) {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) {
    throw new Error('A rentabilidade deve ser um número maior ou igual a zero.');
  }
  return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
}

export function projectToMillion({
  initial,
  monthlyContribution,
  annualRatePercent,
  target = FIRST_MILLION_TARGET,
  maxMonths = MAX_PROJECTION_MONTHS,
}: {
  initial: number;
  monthlyContribution: number;
  annualRatePercent: number;
  target?: number;
  maxMonths?: number;
}): MillionProjection {
  if (![initial, monthlyContribution, target].every(Number.isFinite)) {
    throw new Error('Preencha todos os valores da simulação.');
  }
  if (initial < 0 || monthlyContribution < 0 || target <= 0) {
    throw new Error('Os valores não podem ser negativos.');
  }
  const monthlyRate = annualToMonthlyRate(annualRatePercent);
  let balance = initial;
  let invested = initial;
  let month = 0;
  const allPoints: ProjectionPoint[] = [{ month, balance, invested, earnings: balance - invested }];
  const milestoneTargets = [100_000, 250_000, 500_000, 750_000, target].filter(
    (value, index, values) => value <= target && values.indexOf(value) === index,
  );
  const milestoneMonths = new Map<number, number>();
  milestoneTargets.forEach((value) => {
    if (balance >= value) milestoneMonths.set(value, 0);
  });

  const hasReachedTarget = () => balance + MONEY_TOLERANCE >= target;

  while (!hasReachedTarget() && month < maxMonths) {
    month += 1;
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    invested += monthlyContribution;
    milestoneTargets.forEach((value) => {
      if (!milestoneMonths.has(value) && balance + MONEY_TOLERANCE >= value) {
        milestoneMonths.set(value, month);
      }
    });
    if (month % 12 === 0 || hasReachedTarget() || month === maxMonths) {
      allPoints.push({ month, balance, invested, earnings: balance - invested });
    }
  }
  return {
    reached: hasReachedTarget(),
    months: hasReachedTarget() ? month : null,
    balance,
    invested,
    earnings: balance - invested,
    points: allPoints,
    milestones: milestoneTargets.map((value) => ({
      target: value,
      month: milestoneMonths.get(value) ?? null,
    })),
  };
}

export function requiredMonthlyContribution({
  initial,
  annualRatePercent,
  months,
  target = FIRST_MILLION_TARGET,
}: {
  initial: number;
  annualRatePercent: number;
  months: number;
  target?: number;
}) {
  if (!Number.isFinite(initial) || initial < 0 || !Number.isInteger(months) || months <= 0) {
    throw new Error('Informe um prazo válido.');
  }
  const rate = annualToMonthlyRate(annualRatePercent);
  const futureInitial = initial * Math.pow(1 + rate, months);
  if (futureInitial >= target) return 0;
  if (rate === 0) return (target - initial) / months;
  return (target - futureInitial) / ((Math.pow(1 + rate, months) - 1) / rate);
}

export function formatDuration(months: number | null) {
  if (months === null) return 'Mais de 100 anos';
  if (months === 0) return 'Meta já alcançada';
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (remaining) parts.push(`${remaining} ${remaining === 1 ? 'mês' : 'meses'}`);
  return parts.join(' e ');
}
