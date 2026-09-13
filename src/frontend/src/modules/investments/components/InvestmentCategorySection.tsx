'use client';

import { useEffect, useState } from 'react';
import {
  isShareBasedCategory,
  type InvestmentCategory,
  type InvestmentCategorySummary,
  type InvestmentWithGain,
} from '@saldix/shared-types';
import { formatPercentage } from '@/shared/lib/formatters';
import { INVESTMENT_CATEGORY_LABELS } from '../constants';
import { InvestmentRow } from './InvestmentRow';

interface InvestmentCategorySectionProps {
  category: InvestmentCategory;
  investments: InvestmentWithGain[];
  allocation?: InvestmentCategorySummary;
  editingId: string | null;
  onStartEdit: (id: string) => void;
  onStopEditing: () => void;
  onDelete: (investment: InvestmentWithGain) => void;
}

export function InvestmentCategorySection({
  category,
  investments,
  allocation,
  editingId,
  onStartEdit,
  onStopEditing,
  onDelete,
}: InvestmentCategorySectionProps) {
  const shareBased = isShareBasedCategory(category);
  const allocated = allocation?.allocatedPercentage ?? 0;
  const onTarget = Math.abs(allocated - 100) < 0.01;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setError(null), [editingId]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-gray-400">
          {INVESTMENT_CATEGORY_LABELS[category]}
        </h2>
        {shareBased && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              onTarget ? 'bg-brand/15 text-brand-light' : 'bg-amber-500/15 text-amber-400'
            }`}
          >
            {formatPercentage(allocated)} alocado de 100%
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-surface-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-xs uppercase text-gray-500">
              {shareBased && <th className="px-3 py-2">Ticker</th>}
              <th className="px-3 py-2">Nome</th>
              {shareBased && <th className="px-3 py-2">Preço de mercado</th>}
              {shareBased && <th className="px-3 py-2">Quantidade</th>}
              {shareBased && <th className="px-3 py-2">Resultado</th>}
              <th className="px-3 py-2">Valor investido</th>
              <th className="px-3 py-2">Valor atual</th>
              <th className="px-3 py-2">Ganho</th>
              {shareBased && <th className="px-3 py-2">Peso atual %</th>}
              {shareBased && <th className="px-3 py-2">Meta %</th>}
              <th className="px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment) => (
              <InvestmentRow
                key={investment.id}
                category={category}
                investment={investment}
                isEditing={editingId === investment.id}
                allocation={allocation}
                onStartEdit={onStartEdit}
                onStopEditing={onStopEditing}
                onDelete={onDelete}
                onError={setError}
              />
            ))}
            <InvestmentRow
              key={`new-${category}`}
              category={category}
              investment={null}
              isEditing={false}
              allocation={allocation}
              onStartEdit={() => {}}
              onStopEditing={() => {}}
              onDelete={() => {}}
              onError={setError}
            />
          </tbody>
        </table>
      </div>
    </section>
  );
}
