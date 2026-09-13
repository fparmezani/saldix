'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { AppShell } from '@/shared/ui/AppShell';

export function CalculatorScaffold({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <AppShell title={title} greeting="Calculadoras">
      <Link
        href="/calculadoras"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-light"
      >
        <ArrowLeft size={16} />
        Todas as calculadoras
      </Link>
      <header className="mb-6 flex max-w-3xl items-start gap-3">
        <span className="rounded-xl bg-brand/10 p-3 text-brand-light">
          <Icon aria-hidden="true" size={24} />
        </span>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">{description}</p>
        </div>
      </header>
      {children}
    </AppShell>
  );
}

export const panelClass = 'rounded-xl2 border border-surface-border bg-surface-card p-5 sm:p-6';
export const inputClass =
  'w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-gray-100';

export function Metric({
  label,
  value,
  hint,
  featured = false,
}: {
  label: string;
  value: string;
  hint?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`min-w-0 rounded-xl2 border p-5 ${featured ? 'border-brand/60 bg-brand/10' : 'border-surface-border bg-surface-card'}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p
        className={`mt-2 break-words font-bold ${featured ? 'text-2xl text-brand-light sm:text-3xl' : 'text-xl text-white'}`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs leading-5 text-gray-400">{hint}</p>}
    </article>
  );
}

export function Assumptions({ children }: { children: React.ReactNode }) {
  return (
    <aside className="mt-6 rounded-xl border border-surface-border bg-surface-card p-5 text-sm leading-6 text-gray-400">
      <strong className="text-gray-200">Sobre esta simulação: </strong>
      {children}
    </aside>
  );
}
