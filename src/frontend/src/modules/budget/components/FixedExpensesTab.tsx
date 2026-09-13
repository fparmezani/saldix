'use client';

import { useState } from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useCategories } from '../hooks/useCategories';
import { useDeleteFixedExpense, useFixedExpenses } from '../hooks/useFixedExpenses';
import { CategoriesManager } from './CategoriesManager';
import { ExpensesByCategoryChart } from './ExpensesByCategoryChart';
import { NewFixedExpenseModal } from './NewFixedExpenseModal';

interface FixedExpensesTabProps {
  month: string;
}

export function FixedExpensesTab({ month }: FixedExpensesTabProps) {
  const { data: expenses, isLoading } = useFixedExpenses(month);
  const { data: categories } = useCategories();
  const deleteExpense = useDeleteFixedExpense(month);
  const [newExpenseOpen, setNewExpenseOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; description: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]));
  const totalsByCategory = new Map<string, number>();
  for (const expense of expenses ?? []) {
    totalsByCategory.set(
      expense.categoryId,
      (totalsByCategory.get(expense.categoryId) ?? 0) + expense.amount,
    );
  }
  const totalAmount = [...totalsByCategory.values()].reduce((sum, amount) => sum + amount, 0);
  const chartEntries = [...totalsByCategory.entries()].map(([categoryId, amount]) => ({
    categoryId,
    categoryName: categoryById.get(categoryId)?.name ?? 'Sem categoria',
    categoryColor: categoryById.get(categoryId)?.color ?? '#6b7280',
    amount,
    percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
  }));

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteExpense.mutateAsync(pendingDelete.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível excluir a despesa.');
    }
    setPendingDelete(null);
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
      <section className="flex min-w-0 flex-col gap-6 rounded-xl2 border border-surface-border bg-surface-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Despesa Fixa</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCategoriesOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm text-gray-200 hover:border-brand hover:text-brand-light"
            >
              <Tag size={16} />
              Categorias
            </button>
            <button
              type="button"
              onClick={() => setNewExpenseOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-black hover:bg-brand-dark"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <ul className="divide-y divide-surface-border">
          {expenses?.map((expense) => {
            const category = categoryById.get(expense.categoryId);
            return (
              <li key={expense.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  {category && (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-100">{expense.description}</p>
                    <p className="text-xs text-gray-500">
                      Vence dia {expense.dueDay} · {category?.name ?? 'Sem categoria'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-rose-400">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    type="button"
                    aria-label="Excluir despesa"
                    onClick={() =>
                      setPendingDelete({ id: expense.id, description: expense.description })
                    }
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
          {expenses?.length === 0 && (
            <p className="py-4 text-sm text-gray-500">Nenhuma despesa fixa cadastrada neste mês.</p>
          )}
        </ul>
      </section>
      <section className="flex min-w-0 flex-col gap-6 rounded-xl2 border border-surface-border bg-surface-card p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-white">Despesas por categoria</h2>
          <p className="mt-1 text-sm text-gray-400">Composição das despesas fixas do mês</p>
        </div>
        <div className="flex min-h-[280px] items-center justify-center">
          {isLoading ? (
            <p className="text-sm text-gray-400">Carregando...</p>
          ) : chartEntries.length ? (
            <ExpensesByCategoryChart entries={chartEntries} />
          ) : (
            <p className="text-center text-sm text-gray-400">
              Adicione uma despesa para visualizar a distribuição.
            </p>
          )}
        </div>
      </section>

      <NewFixedExpenseModal
        month={month}
        open={newExpenseOpen}
        onClose={() => setNewExpenseOpen(false)}
      />
      <CategoriesManager open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir despesa fixa"
        description={
          pendingDelete ? `Tem certeza que deseja excluir "${pendingDelete.description}"?` : ''
        }
        confirmLabel="Excluir"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
