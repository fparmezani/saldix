'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppShell } from '@/shared/ui/AppShell';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useDeleteGoal, useGoals } from '../hooks/useGoals';
import { AddContributionModal } from './AddContributionModal';
import { GoalCard } from './GoalCard';
import { NewGoalModal } from './NewGoalModal';

export function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const deleteGoal = useDeleteGoal();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributingGoal, setContributingGoal] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  return (
    <AppShell
      title="Metas"
      greeting="Olá"
      headerRight={
        <button
          type="button"
          onClick={() => setNewGoalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-black hover:bg-brand-dark"
        >
          <Plus size={16} />
          Nova meta
        </button>
      }
    >
      {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}

      {goals && goals.length === 0 && (
        <div className="rounded-xl2 border border-dashed border-surface-border p-10 text-center text-sm text-gray-500">
          Nenhuma meta cadastrada ainda. Crie a primeira para começar a planejar.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals?.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onAddContribution={() => setContributingGoal({ id: goal.id, name: goal.name })}
            onDelete={() => setPendingDelete({ id: goal.id, name: goal.name })}
          />
        ))}
      </div>

      <NewGoalModal open={newGoalOpen} onClose={() => setNewGoalOpen(false)} />
      <AddContributionModal
        goalId={contributingGoal?.id ?? null}
        goalName={contributingGoal?.name ?? null}
        onClose={() => setContributingGoal(null)}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir meta"
        description={
          pendingDelete
            ? `Tem certeza que deseja excluir "${pendingDelete.name}"? Os aportes registrados nela também serão removidos.`
            : ''
        }
        confirmLabel="Excluir"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteGoal.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </AppShell>
  );
}
