import { createSupabaseBrowserClient } from './supabase-browser';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAccessToken(): Promise<string | null> {
  const supabase = createSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

function extractErrorMessage(body: string): string | null {
  try {
    const parsed = JSON.parse(body);
    if (typeof parsed.message === 'string') return parsed.message;
    if (Array.isArray(parsed.message)) return parsed.message.join(', ');
  } catch {
    return body || null;
  }
  return body || null;
}

function sessionExpired(): ApiError {
  if (typeof window !== 'undefined') {
    window.location.assign(`/login?reason=session-expired&next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  }
  return new ApiError('Sua sessão expirou. Entre novamente para continuar.', 401);
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw sessionExpired();
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw sessionExpired();
    }

    const body = await response.text();
    const message = extractErrorMessage(body) || 'Não foi possível concluir a operação.';
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Como apiFetch, mas para upload multipart (FormData) — nunca define Content-Type
 * manualmente, o navegador precisa gerar o boundary sozinho.
 */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw sessionExpired();
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw sessionExpired();
    }

    const body = await response.text();
    const message = extractErrorMessage(body) || 'Não foi possível concluir a operação.';
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
