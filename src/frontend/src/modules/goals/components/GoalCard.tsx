'use client';

import { AlertTriangle, CheckCircle2, PlusCircle, Trash2 } from 'lucide-react';
import type { GoalWithStatus } from '@saldix/shared-types';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';

interface GoalCardProps {
  goal: GoalWithStatus;
  onAddContribution: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, onAddContribution, onDelete }: GoalCardProps) {
  const completed = goal.status === 'completed';

  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-surface-border bg-surface-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{goal.name}</h3>
            {completed && (
              <span className="flex items-center gap-1 rounded-full bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand-light">
                <CheckCircle2 size={12} />
                Concluída
              </span>
            )}
            {goal.isOverdue && !completed && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
                <AlertTriangle size={12} />
                Atrasada
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">Meta para {formatDate(goal.targetDate)}</p>
        </div>
        <button
          type="button"
          aria-label="Excluir meta"
          onClick={onDelete}
          className="text-gray-500 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full ${completed ? 'bg-brand' : 'bg-blue-500'}`}
          style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {formatCurrency(goal.totalContributed)} de {formatCurrency(goal.targetAmount)}
        </span>
        <span className="font-semibold text-white">{goal.progressPercentage}%</span>
      </div>

      {!completed && (
        <p className="font-medium text-white">Faltam {formatCurrency(Math.max(0, goal.targetAmount - goal.totalContributed))}</p>
      )}
      {!completed && (
        <p className="text-xs text-gray-500">
          Guardar {formatCurrency(goal.monthlyRequired)}/mês para chegar lá
        </p>
      )}

      {!completed && (
        <button
          type="button"
          onClick={onAddContribution}
          className="flex items-center justify-center gap-2 rounded-lg border border-surface-border py-2 text-sm text-gray-200 hover:border-brand hover:text-brand-light"
        >
          <PlusCircle size={16} />
          Aportar
        </button>
      )}
    </div>
  );
}
