import { Suspense } from 'react';
import { LoginForm } from '@/modules/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface p-8">
      <img src="/logo.png" alt="Saldix" className="h-28 w-28 rounded-2xl" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
