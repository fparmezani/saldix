'use client';

import { AppShell } from '@/shared/ui/AppShell';
import { AssetsSection } from './AssetsSection';
import { DebtsSection } from './DebtsSection';
import { LiquidAccountsSection } from './LiquidAccountsSection';
import { NetWorthSummaryCard } from './NetWorthSummaryCard';

export function NetWorthPage() {
  return (
    <AppShell title="Patrimônio" greeting="Olá">
      <div className="flex flex-col gap-6">
        <NetWorthSummaryCard />

        <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          <LiquidAccountsSection />
          <AssetsSection />
          <DebtsSection />
        </div>
      </div>
    </AppShell>
  );
}
