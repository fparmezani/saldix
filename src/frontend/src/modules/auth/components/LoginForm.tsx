'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/shared/lib/supabase-browser';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      setLoading(false);

      if (signInError) {
        setError('Email ou senha inválidos.');
        return;
      }

      const next = searchParams.get('next');
      router.push(
        next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/',
      );
      router.refresh();
    } catch {
      setError('Não foi possível conectar. Confira sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-300">
          Senha
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
        />
      </div>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-pressed={showPassword}
        className="self-start text-sm text-brand-light"
      >
        {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      </button>
      {searchParams.get('reason') === 'session-expired' && !error && (
        <p role="status" className="text-sm text-amber-400">
          Sua sessão expirou. Entre novamente para continuar.
        </p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
