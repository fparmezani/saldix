'use client';

import { useCategories } from '../hooks/useCategories';

interface ExpensesFilterBarProps {
  categoryId: string | undefined;
  onChange: (categoryId: string | undefined) => void;
}

export function ExpensesFilterBar({ categoryId, onChange }: ExpensesFilterBarProps) {
  const { data: categories } = useCategories();

  return (
    <select
      value={categoryId ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
    >
      <option value="">Todas as categorias</option>
      {categories?.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
