'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Calculator,
  CreditCard,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  LineChart,
  PiggyBank,
  Settings,
  ShieldCheck,
  Target,
  Wallet2,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/visao-geral', label: 'Visão geral', icon: LayoutGrid },
  { href: '/orcamento', label: 'Orçamento', icon: Wallet2 },
  { href: '/contas', label: 'Contas Bancárias', icon: CreditCard },
  { href: '/reserva-emergencia', label: 'Reserva de emergência', icon: ShieldCheck },
  { href: '/metas', label: 'Metas', icon: Target },
  { href: '/investimentos', label: 'Investimentos', icon: LineChart },
  { href: '/patrimonio', label: 'Patrimônio', icon: PiggyBank },
  { href: '/calculadoras', label: 'Calculadoras', icon: Calculator },
  { href: '/ajuda', label: 'Ajuda', icon: HelpCircle, disabled: true },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="shrink-0 border-b border-surface-border bg-surface-panel px-4 py-3 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-6">
      <button
        type="button"
        className="mb-2 flex w-full items-center justify-between lg:hidden"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="main-navigation"
      >
        <span className="font-semibold">SALDIX · Menu</span>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className="mb-8 hidden items-center gap-2 px-2 lg:flex">
        <img src="/logo.png" alt="Saldix" className="h-8 w-8 rounded-lg" />
        <span className="text-lg font-bold tracking-tight text-white">SALDIX</span>
      </div>

      <nav
        id="main-navigation"
        aria-label="Navegação principal"
        className={`${open ? 'flex' : 'hidden'} flex-1 flex-col gap-1 lg:flex`}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon, disabled }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
          if (disabled) {
            return (
              <span
                key={href}
                title="Disponível em uma próxima fase"
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500"
              >
                <Icon size={18} />
                {label}
              </span>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand/15 text-brand-light'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
