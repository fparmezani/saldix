'use client';

import { formatCurrency } from '@/shared/lib/formatters';
import { useEmergencyFundContributions } from '../hooks/useEmergencyFund';

export function ContributionsList() {
  const { data: contributions, isLoading } = useEmergencyFundContributions();

  if (isLoading) return <p className="text-sm text-gray-500">Carregando...</p>;
  if (!contributions || contributions.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum aporte registrado ainda.</p>;
  }

  return (
    <ul className="divide-y divide-surface-border">
      {contributions.map((contribution) => (
        <li key={contribution.id} className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-100">{contribution.note || 'Aporte'}</p>
            <p className="text-xs text-gray-500">{contribution.contributedAt}</p>
          </div>
          <span className="font-semibold text-brand-light">
            {formatCurrency(contribution.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
