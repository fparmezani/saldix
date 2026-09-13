import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchCategories() {
  return apiFetch<Category[]>('/categories');
}

export function createCategory(input: CreateCategoryInput) {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateCategory(id: string, input: UpdateCategoryInput) {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: string) {
  return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' });
}
