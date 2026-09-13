export interface GoalStatusResult {
  monthlyRequired: number;
  totalContributed: number;
  progressPercentage: number;
  isOverdue: boolean;
}

/**
 * Meses restantes até a data alvo, arredondado pra cima (qualquer dia excedente
 * conta como mais um mês inteiro de economia), com piso de 1 mês.
 */
function monthsBetween(fromDate: string, toDate: string): number {
  const [fromYear, fromMonth, fromDay] = fromDate.split('-').map(Number);
  const [toYear, toMonth, toDay] = toDate.split('-').map(Number);

  let months = (toYear - fromYear) * 12 + (toMonth - fromMonth);
  if (toDay > fromDay) {
    months += 1;
  }
  return months;
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function calculateGoalStatus(params: {
  targetAmount: number;
  targetDate: string;
  totalContributed: number;
  today: string;
}): GoalStatusResult {
  const { targetAmount, targetDate, totalContributed, today } = params;

  const monthsRemaining = Math.max(1, monthsBetween(today, targetDate));
  const monthlyRequired = targetAmount / monthsRemaining;
  const progressPercentage =
    targetAmount > 0 ? Math.min(100, roundToOneDecimal((totalContributed / targetAmount) * 100)) : 0;
  const isOverdue = targetDate < today && progressPercentage < 100;

  return { monthlyRequired, totalContributed, progressPercentage, isOverdue };
}
