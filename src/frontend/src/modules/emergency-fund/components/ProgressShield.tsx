'use client';

import { useId } from 'react';
import { formatCurrency } from '@/shared/lib/formatters';

interface ProgressShieldProps {
  targetAmount: number;
  totalContributed: number;
  progressPercentage: number;
}

export function ProgressShield({
  targetAmount,
  totalContributed,
  progressPercentage,
}: ProgressShieldProps) {
  const protected100 = progressPercentage >= 100;
  const id = useId().replace(/:/g, '');
  const progress = Math.max(0, Math.min(100, progressPercentage));
  const shieldPath = 'M160 18 L280 66 V176 C280 256 229 318 160 346 C91 318 40 256 40 176 V66 Z';

  return (
    <div className="flex flex-col items-center gap-5 overflow-hidden rounded-xl2 border border-surface-border bg-surface-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
        Sua proteção financeira
      </p>
      <p className="text-center text-lg font-medium text-gray-100">
        {protected100
          ? 'Você está protegido!'
          : progressPercentage === 0
            ? 'Hora de começar a se proteger'
            : 'Continue guardando, você está no caminho certo'}
      </p>
      <div className="relative w-full max-w-[300px]">
        <svg viewBox="0 0 320 370" className="w-full" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#334155" />
              <stop offset="0.5" stopColor="#18252d" />
              <stop offset="1" stopColor="#0d171e" />
            </linearGradient>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#065f46" />
            </linearGradient>
            <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#a7f3d0" />
              <stop offset="0.45" stopColor="#475569" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
            <clipPath id={`${id}-clip`}>
              <path d={shieldPath} />
            </clipPath>
          </defs>
          <ellipse cx="160" cy="350" rx="78" ry="10" fill="#000" opacity="0.2" />
          <path d={shieldPath} fill={`url(#${id}-shell)`} />
          <g clipPath={`url(#${id}-clip)`}>
            <rect
              x="40"
              y={346 - progress * 3.28}
              width="240"
              height={progress * 3.28}
              fill={`url(#${id}-fill)`}
            />
            {progress > 0 && progress < 100 && (
              <path d={`M40 ${346 - progress * 3.28} H280`} stroke="#6ee7b7" strokeWidth="2" />
            )}
            <path d="M160 18 L280 66 V176 C280 256 229 318 160 346 Z" fill="#fff" opacity="0.035" />
          </g>
          <path d={shieldPath} fill="none" stroke={`url(#${id}-edge)`} strokeWidth="3" />
          <path
            d="M160 33 L266 76 V176 C266 246 222 303 160 331 C98 303 54 246 54 176 V76 Z"
            fill="none"
            stroke="#94a3b8"
            strokeOpacity="0.18"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-5 text-[#ffffff] [text-shadow:0_2px_8px_#000]">
          <p className="text-5xl font-bold tabular-nums tracking-tight">
            {progressPercentage.toLocaleString('pt-BR')}%
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]">da meta atingida</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 border-t border-surface-border pt-5 text-center">
        <div>
          <p className="text-xs text-gray-400">Reserva atual</p>
          <p className="mt-1 font-semibold text-emerald-300">{formatCurrency(totalContributed)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Meta de proteção</p>
          <p className="mt-1 font-semibold text-gray-100">{formatCurrency(targetAmount)}</p>
        </div>
      </div>
      {!protected100 && (
        <p className="text-sm text-gray-400">
          Faltam{' '}
          <span className="font-semibold text-white">
            {formatCurrency(Math.max(0, targetAmount - totalContributed))}
          </span>{' '}
          para atingir sua meta.
        </p>
      )}
    </div>
  );
}
