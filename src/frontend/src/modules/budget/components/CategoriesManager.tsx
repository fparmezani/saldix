'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks/useCategories';

const PRESET_COLORS = [
  '#22c55e',
  '#3b82f6',
  '#eab308',
  '#a855f7',
  '#ec4899',
  '#f97316',
  '#14b8a6',
  '#ef4444',
];

interface CategoriesManagerProps {
  open: boolean;
  onClose: () => void;
}

export function CategoriesManager({ open, onClose }: CategoriesManagerProps) {
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createCategory.mutateAsync({ name: name.trim(), color });
      setName('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar a categoria.');
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteCategory.mutateAsync(pendingDelete.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível excluir a categoria.');
    }
    setPendingDelete(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl2 border border-surface-border bg-surface-card">
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Categorias</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            Fechar
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-4">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categories?.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-surface-border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-100">{category.name}</span>
                </div>
                <button
                  type="button"
                  aria-label="Excluir categoria"
                  onClick={() => setPendingDelete({ id: category.id, name: category.name })}
                  className="text-gray-500 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
            {categories?.length === 0 && (
              <p className="col-span-full text-sm text-gray-500">
                Nenhuma categoria cadastrada ainda.
              </p>
            )}
          </ul>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 border-t border-surface-border pt-4"
          >
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Nova categoria
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Casa, Lazer, Mercado"
                className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  aria-label={`Cor ${preset}`}
                  className={`h-6 w-6 rounded-full ${color === preset ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={createCategory.isPending}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
            >
              <Plus size={16} />
              Adicionar categoria
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir categoria"
        description={
          pendingDelete
            ? `Tem certeza que deseja excluir "${pendingDelete.name}"? Só é possível se nenhuma despesa estiver usando ela.`
            : ''
        }
        confirmLabel="Excluir"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
