'use client';

import { useState } from 'react';
import type { InvestmentWithGain } from '@saldix/shared-types';
import { AppShell } from '@/shared/ui/AppShell';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { INVESTMENT_CATEGORY_ORDER } from '../constants';
import { useDeleteInvestment, useInvestments, useInvestmentsSummary } from '../hooks/useInvestments';
import { InvestmentCategorySection } from './InvestmentCategorySection';
import { InvestmentsSummaryCard } from './InvestmentsSummaryCard';

export function InvestmentsPage() {
  const { data: investments, isLoading } = useInvestments();
  const { data: summary } = useInvestmentsSummary();
  const deleteInvestment = useDeleteInvestment();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  return (
    <AppShell title="Investimentos" greeting="Olá">
      <div className="flex flex-col gap-6">
        <InvestmentsSummaryCard />

        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}

        {INVESTMENT_CATEGORY_ORDER.map((category) => (
          <InvestmentCategorySection
            key={category}
            category={category}
            investments={(investments ?? []).filter((investment) => investment.category === category)}
            allocation={summary?.byCategory.find((entry) => entry.category === category)}
            editingId={editingId}
            onStartEdit={setEditingId}
            onStopEditing={() => setEditingId(null)}
            onDelete={(investment: InvestmentWithGain) =>
              setPendingDelete({ id: investment.id, name: investment.name })
            }
          />
        ))}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir investimento"
        description={pendingDelete ? `Tem certeza que deseja excluir "${pendingDelete.name}"?` : ''}
        confirmLabel="Excluir"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteInvestment.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </AppShell>
  );
}
