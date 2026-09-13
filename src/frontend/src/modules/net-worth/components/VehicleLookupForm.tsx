'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { VehicleLookupResult } from '@saldix/shared-types';
import { lookupVehicle } from '../api/net-worth';

interface VehicleLookupFormProps {
  onResult: (result: VehicleLookupResult) => void;
}

export function VehicleLookupForm({ onResult }: VehicleLookupFormProps) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!brand || !model || !year) return;
    setLoading(true);
    setError(null);
    try {
      const result = await lookupVehicle(brand, model, Number(year));
      onResult(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível buscar na FIPE.');
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-surface-border bg-surface p-3">
      <p className="text-xs text-gray-400">Buscar valor sugerido na Tabela FIPE</p>
      <div className="grid min-w-0 grid-cols-1 gap-3">
        <input
          aria-label="Marca"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Marca"
          className="min-w-0 w-full rounded-lg border border-surface-border bg-surface-card px-2 py-1.5 text-sm text-gray-100"
        />
        <input
          aria-label="Modelo"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Modelo"
          className="min-w-0 w-full rounded-lg border border-surface-border bg-surface-card px-2 py-1.5 text-sm text-gray-100"
        />
        <input
          aria-label="Ano"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Ano"
          className="min-w-0 w-full rounded-lg border border-surface-border bg-surface-card px-2 py-1.5 text-sm text-gray-100"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center justify-center rounded-lg bg-brand px-3 py-1.5 text-black hover:bg-brand-dark disabled:opacity-50"
        >
          <Search size={14} />
          <span className="ml-2">Consultar FIPE</span>
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
