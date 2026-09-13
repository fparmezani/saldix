'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function QueryFeedback() {
  const client = useQueryClient();
  const [, refresh] = useState(0);
  useEffect(() => client.getQueryCache().subscribe(() => refresh((n) => n + 1)), [client]);
  const failed = client
    .getQueryCache()
    .getAll()
    .filter((query) => query.isActive() && query.state.status === 'error');
  if (!failed.length) return null;
  return (
    <div
      role="alert"
      className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400"
    >
      <span>
        Não foi possível carregar parte dos dados. Os valores exibidos podem estar incompletos.
      </span>
      <button
        type="button"
        className="rounded-lg border border-current px-3 py-2 font-medium"
        onClick={() =>
          failed.forEach((query) => {
            void client.refetchQueries({ queryKey: query.queryKey, exact: true });
          })
        }
      >
        Tentar novamente
      </button>
    </div>
  );
}
