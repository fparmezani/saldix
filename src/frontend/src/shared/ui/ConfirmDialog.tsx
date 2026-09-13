'use client';
import { ModalFrame } from './ModalFrame';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <ModalFrame onClose={onCancel}>
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-gray-400">{description}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-surface-border px-4 py-2 text-gray-200 hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 font-medium ${
              danger
                ? 'bg-rose-600 text-[#ffffff] hover:bg-rose-700'
                : 'bg-brand text-black hover:bg-brand-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}
