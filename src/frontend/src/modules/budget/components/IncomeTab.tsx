'use client';

import { useState } from 'react';
import { CalendarClock, Plus, Repeat, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useToggleIncomeSchedule } from '../hooks/useIncomeSchedules';
import { useDeleteIncome, useIncomes } from '../hooks/useIncomes';
import { FutureReceivablesList } from './FutureReceivablesList';
import { IncomeDonutChart } from './IncomeDonutChart';
import { NewFutureReceivableModal } from './NewFutureReceivableModal';
import { NewIncomeModal } from './NewIncomeModal';

interface IncomeTabProps {
  month: string;
}

interface PendingDelete {
  id: string;
  description: string;
  incomeScheduleId: string | null;
}

export function IncomeTab({ month }: IncomeTabProps) {
  const { data, isLoading } = useIncomes(month);
  const deleteIncome = useDeleteIncome(month);
  const toggleSchedule = useToggleIncomeSchedule();
  const [newIncomeOpen, setNewIncomeOpen] = useState(false);
  const [newReceivableOpen, setNewReceivableOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;

    try {
      if (pendingDelete.incomeScheduleId) {
        await toggleSchedule.mutateAsync({ id: pendingDelete.incomeScheduleId, active: false });
      }
      await deleteIncome.mutateAsync(pendingDelete.id);
    } catch (cause) {
      setDeleteError(
        cause instanceof Error ? cause.message : 'Não foi possível excluir a receita.',
      );
    }
    setPendingDelete(null);
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
      <section className="flex min-w-0 flex-col gap-6 rounded-xl2 border border-surface-border bg-surface-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Receita</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewReceivableOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm text-gray-200 hover:border-brand hover:text-brand-light"
            >
              <CalendarClock size={16} />
              Recebimento futuro
            </button>
            <button
              type="button"
              onClick={() => setNewIncomeOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-black hover:bg-brand-dark"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {deleteError && (
          <p role="alert" className="text-sm text-red-400">
            {deleteError}
          </p>
        )}

        {data && (
          <div className="min-w-0">
            <ul className="flex-1 divide-y divide-surface-border">
              {data.incomes.map((income) => (
                <li key={income.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="flex items-center gap-1.5 font-medium text-gray-100">
                      {income.description}
                      {income.incomeScheduleId && (
                        <Repeat
                          size={13}
                          className="text-brand-light"
                          aria-label="Renda recorrente"
                        />
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {income.type === 'main' ? 'Renda Principal' : 'Renda Extra'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-emerald-400">
                      {formatCurrency(income.amount)}
                    </span>
                    <button
                      type="button"
                      aria-label={
                        income.incomeScheduleId ? 'Parar renda recorrente' : 'Excluir receita'
                      }
                      onClick={() => {
                        setDeleteError(null);
                        setPendingDelete({
                          id: income.id,
                          description: income.description,
                          incomeScheduleId: income.incomeScheduleId,
                        });
                      }}
                      disabled={deleteIncome.isPending || toggleSchedule.isPending}
                      className="text-gray-500 hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
              {data.incomes.length === 0 && (
                <p className="py-4 text-sm text-gray-500">Nenhuma receita cadastrada neste mês.</p>
              )}
            </ul>
          </div>
        )}

        <FutureReceivablesList month={month} />
      </section>

      <section className="flex min-w-0 flex-col gap-6 rounded-xl2 border border-surface-border bg-surface-card p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-white">Composição da receita</h2>
          <p className="mt-1 text-sm text-gray-400">Participação de cada fonte no mês</p>
        </div>
        <div className="flex min-h-[280px] items-center justify-center">
          {isLoading ? (
            <p className="text-sm text-gray-400">Carregando...</p>
          ) : data?.incomes.length ? (
            <IncomeDonutChart percentageByType={data.percentageByType} />
          ) : (
            <p className="text-center text-sm text-gray-400">
              Adicione uma receita para visualizar a distribuição.
            </p>
          )}
        </div>
      </section>

      <NewIncomeModal month={month} open={newIncomeOpen} onClose={() => setNewIncomeOpen(false)} />
      <NewFutureReceivableModal
        month={month}
        open={newReceivableOpen}
        onClose={() => setNewReceivableOpen(false)}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete?.incomeScheduleId ? 'Parar renda recorrente' : 'Excluir receita'}
        description={
          pendingDelete
            ? pendingDelete.incomeScheduleId
              ? `Isso desativa a recorrência de "${pendingDelete.description}" e remove esta ocorrência do mês. Ocorrências de meses anteriores já lançadas continuam no histórico.`
              : `Tem certeza que deseja excluir "${pendingDelete.description}"?`
            : ''
        }
        confirmLabel={pendingDelete?.incomeScheduleId ? 'Parar' : 'Excluir'}
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
