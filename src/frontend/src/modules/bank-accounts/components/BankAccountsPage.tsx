'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppShell } from '@/shared/ui/AppShell';
import { useBankAccounts } from '../hooks/useBankAccounts';
import { BankAccountCard } from './BankAccountCard';
import { NewBankAccountModal } from './NewBankAccountModal';

export function BankAccountsPage() {
  const { data: accounts, isLoading } = useBankAccounts();
  const [newAccountOpen, setNewAccountOpen] = useState(false);

  return (
    <AppShell
      title="Contas Bancárias"
      greeting="Olá"
      headerRight={
        <button
          type="button"
          onClick={() => setNewAccountOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-black hover:bg-brand-dark"
        >
          <Plus size={16} />
          Nova conta
        </button>
      }
    >
      {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}

      {accounts && accounts.length === 0 && (
        <div className="rounded-xl2 border border-dashed border-surface-border p-10 text-center text-sm text-gray-500">
          Nenhuma conta cadastrada ainda. Cadastre sua conta bancária ou de investimento para
          começar a importar faturas e extratos.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {accounts?.map((account) => (
          <BankAccountCard key={account.id} account={account} />
        ))}
      </div>

      <NewBankAccountModal open={newAccountOpen} onClose={() => setNewAccountOpen(false)} />
    </AppShell>
  );
}
