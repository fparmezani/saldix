'use client';

import { useState } from 'react';
import { Clock3 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import { useConfirmFutureReceivable, useFutureReceivables, useRescheduleFutureReceivable } from '../hooks/useFutureReceivables';

interface FutureReceivablesListProps {
  month: string;
}

export function FutureReceivablesList({ month }: FutureReceivablesListProps) {
  const { data: receivables, isLoading } = useFutureReceivables(month);
  const confirmReceivable = useConfirmFutureReceivable(month);
  const rescheduleReceivable = useRescheduleFutureReceivable(month);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  if (isLoading) return <p className="text-sm text-gray-500">Carregando...</p>;
  if (!receivables?.length) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-surface-border pt-4">
      <h3 className="text-sm font-semibold text-gray-400">Recebimentos futuros</h3>
      <ul className="flex flex-col gap-2">
        {receivables.map((receivable) => (
          <li
            key={receivable.id}
            className="flex items-center justify-between rounded-lg border border-surface-border bg-surface px-3 py-2"
          >
            <div className="flex items-center gap-2">
              {receivable.status === 'pending' && (
                <Clock3 size={16} className="text-amber-400" aria-label="pendente" />
              )}
              <div>
                <p className="font-medium text-gray-100">{receivable.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(receivable.expectedDate)} · {formatCurrency(receivable.amount)}
                </p>
              </div>
            </div>

            {receivable.status === 'pending' && (
              <div className="flex items-center gap-2">
                {reschedulingId === receivable.id ? (
                  <>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="rounded border border-surface-border bg-surface-card px-2 py-1 text-sm text-gray-100"
                    />
                    <button
                      type="button"
                      className="text-sm text-brand-light"
                      onClick={async () => {
                        await rescheduleReceivable.mutateAsync({
                          id: receivable.id,
                          input: { newExpectedDate: newDate },
                        });
                        setReschedulingId(null);
                      }}
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-gray-400 underline hover:text-gray-200"
                    onClick={() => {
                      setReschedulingId(receivable.id);
                      setNewDate(receivable.expectedDate);
                    }}
                  >
                    Reagendar
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-lg bg-brand px-3 py-1 text-sm font-medium text-black hover:bg-brand-dark"
                  onClick={() => confirmReceivable.mutate(receivable.id)}
                >
                  Marcar como recebido
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
