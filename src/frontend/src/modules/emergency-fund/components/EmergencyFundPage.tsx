'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import type { ProtectionType } from '@saldix/shared-types';
import { AppShell } from '@/shared/ui/AppShell';
import {
  useEmergencyFundSettings,
  useEmergencyFundStatus,
  useUpdateEmergencyFundSettings,
} from '../hooks/useEmergencyFund';
import { ContributionsList } from './ContributionsList';
import { NewContributionModal } from './NewContributionModal';
import { ProgressShield } from './ProgressShield';
import { ProtectionTypeSelector } from './ProtectionTypeSelector';

export function EmergencyFundPage() {
  const {
    data: settings,
    isLoading: settingsLoading,
    isError: settingsError,
  } = useEmergencyFundSettings();
  const { data: status } = useEmergencyFundStatus();
  const updateSettings = useUpdateEmergencyFundSettings();

  const [editing, setEditing] = useState(false);
  const [protectionType, setProtectionType] = useState<ProtectionType>('basic');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newContributionOpen, setNewContributionOpen] = useState(false);

  useEffect(() => {
    if (settings) {
      setProtectionType(settings.protectionType);
      setMonthlyCost(String(settings.monthlyEssentialCost));
    }
  }, [settings]);

  async function handleSaveSettings(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await updateSettings.mutateAsync({
        protectionType,
        monthlyEssentialCost: Number(monthlyCost),
      });
      setEditing(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.');
    }
  }

  const showSetupForm = !settingsLoading && !settingsError && (!settings || editing);

  return (
    <AppShell title="Reserva de emergência" greeting="Olá">
      <div className="flex flex-col gap-6">
        {settingsLoading && (
          <p role="status" className="text-gray-400">
            Carregando sua reserva...
          </p>
        )}
        {showSetupForm && (
          <form
            onSubmit={handleSaveSettings}
            className="flex flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">Tipo de proteção</h2>
              <p className="text-sm text-gray-400">Escolha com base na sua fonte de renda.</p>
            </div>
            <ProtectionTypeSelector value={protectionType} onChange={setProtectionType} />

            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Custo mensal essencial (aluguel, contas, transporte, escola, saúde — sem lazer)
<CurrencyInput
                required
                
                min="0.01"
                step="0.01"
                value={monthlyCost}
                onValueChange={setMonthlyCost}
                className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
              />
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              {settings && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-surface-border px-4 py-2 text-gray-200 hover:bg-white/5"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={updateSettings.isPending}
                className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
              >
                Salvar
              </button>
            </div>
          </form>
        )}

        {settings && !editing && status && (
          <>
            <div className="flex items-center justify-between rounded-xl2 border border-surface-border bg-surface-card px-6 py-4">
              <div>
                <p className="text-sm text-gray-400">
                  Proteção {status.protectionType === 'basic' ? 'Básica' : 'Blindada'} · custo
                  essencial mensal informado
                  {settings.monthlyEssentialCost > 0 && (
                    <>
                      {' '}
                      ·{' '}
                      {(status.totalContributed / settings.monthlyEssentialCost).toLocaleString(
                        'pt-BR',
                        { maximumFractionDigits: 1 },
                      )}{' '}
                      meses cobertos
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-sm text-brand-light hover:underline"
              >
                Editar
              </button>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <ProgressShield
                targetAmount={status.targetAmount}
                totalContributed={status.totalContributed}
                progressPercentage={status.progressPercentage}
              />

              <div className="flex flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Aportes</h2>
                  <button
                    type="button"
                    onClick={() => setNewContributionOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-black hover:bg-brand-dark"
                  >
                    <Plus size={16} />
                    Aportar
                  </button>
                </div>
                <ContributionsList />
              </div>
            </div>
          </>
        )}
      </div>

      <NewContributionModal
        open={newContributionOpen}
        onClose={() => setNewContributionOpen(false)}
      />
    </AppShell>
  );
}
