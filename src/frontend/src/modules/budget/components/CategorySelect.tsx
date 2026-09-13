'use client';

import { useCategories } from '../hooks/useCategories';

interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando categorias...</p>;
  }

  if (!categories || categories.length === 0) {
    return (
      <p className="text-sm text-amber-400">
        Nenhuma categoria cadastrada ainda. Crie uma em &quot;Categorias&quot; antes de continuar.
      </p>
    );
  }

  return (
    <select
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
    >
      <option value="" disabled>
        Selecione uma categoria
      </option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
