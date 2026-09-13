'use client';

import { Shield, ShieldCheck } from 'lucide-react';
import type { ProtectionType } from '@saldix/shared-types';

const OPTIONS: {
  type: ProtectionType;
  label: string;
  months: number;
  description: string;
  icon: typeof Shield;
}[] = [
  {
    type: 'basic',
    label: 'Básica',
    months: 6,
    description: 'Recomendada para quem tem renda fixa (CLT) — 6 meses de custos essenciais.',
    icon: Shield,
  },
  {
    type: 'shielded',
    label: 'Blindada',
    months: 12,
    description:
      'Recomendada para renda variável (autônomos/empreendedores) — 12 meses de custos essenciais.',
    icon: ShieldCheck,
  },
];

interface ProtectionTypeSelectorProps {
  value: ProtectionType;
  onChange: (value: ProtectionType) => void;
}

export function ProtectionTypeSelector({ value, onChange }: ProtectionTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const selected = value === option.type;
        return (
          <button
            key={option.type}
            type="button"
            onClick={() => onChange(option.type)}
            className={`flex flex-col items-start gap-2 rounded-xl2 border p-4 text-left transition-colors ${
              selected
                ? 'border-brand bg-brand/10'
                : 'border-surface-border hover:border-gray-600'
            }`}
          >
            <Icon size={24} className={selected ? 'text-brand-light' : 'text-gray-400'} />
            <span className="font-semibold text-white">
              {option.label} · {option.months} meses
            </span>
            <span className="text-xs text-gray-400">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}
