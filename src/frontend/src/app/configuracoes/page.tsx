'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { AppShell } from '@/shared/ui/AppShell';
import { useTheme } from '@/shared/providers/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <AppShell title="Configurações">
      <section className="max-w-3xl rounded-xl2 border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">Aparência</h2>
        <p className="mt-2 text-sm text-gray-400">
          Escolha o tema mais confortável para você. A preferência é salva neste navegador.
        </p>
        <fieldset className="mt-6 grid gap-3 sm:grid-cols-3">
          <legend className="sr-only">Tema da aplicação</legend>
          {(
            [
              { value: 'light', label: 'Claro', Icon: Sun },
              { value: 'dark', label: 'Escuro', Icon: Moon },
              { value: 'system', label: 'Automático', Icon: Monitor },
            ] as const
          ).map(({ value, label, Icon }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-5 ${theme === value ? 'border-brand bg-brand/10' : 'border-surface-border'}`}
            >
              <input
                type="radio"
                name="theme"
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
                className="accent-green-600"
              />
              <Icon size={20} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <p className="mt-4 text-sm text-gray-400" role="status">
          {theme === 'system'
            ? 'Acompanha o tema do seu dispositivo.'
            : `Tema ${theme === 'dark' ? 'escuro' : 'claro'} selecionado.`}
        </p>
      </section>
    </AppShell>
  );
}
