import { Sidebar } from './Sidebar';
import { QueryFeedback } from './QueryFeedback';

interface AppShellProps {
  title: string;
  greeting?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ title, greeting = 'Olá', headerRight, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-gray-100 lg:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface-card focus:p-4"
      >
        Pular para o conteúdo
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border px-4 py-5 sm:px-8">
          <div>
            <p className="text-sm text-gray-400">{greeting}</p>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          {headerRight}
        </header>
        <main id="main-content" className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-8">
          <QueryFeedback />
          {children}
        </main>
      </div>
    </div>
  );
}
