import { Injectable } from '@nestjs/common';
import { VehiclePriceResult, VehiclePricingProvider } from './vehicle-pricing-provider.interface';

function normalizeKey(brand: string, model: string): string {
  return `${brand.trim().toLowerCase()}|${model.trim().toLowerCase()}`;
}

const KNOWN_EXAMPLES: Record<string, Record<number, VehiclePriceResult>> = {
  'volkswagen|gol 1.0': {
    2014: { fipeCode: '005340-6', estimatedValue: 31982 },
  },
};

/** Gera um valor plausível e determinístico quando não há um exemplo conhecido cadastrado. */
function estimateFallback(brand: string, model: string, year: number): VehiclePriceResult {
  const key = normalizeKey(brand, model);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const basePrice = 35000 + (hash % 60000);
  const age = Math.max(0, new Date().getFullYear() - year);
  const estimatedValue = Math.round(basePrice * Math.pow(0.93, age));

  return {
    fipeCode: `MOCK-${key.replace(/[^a-z0-9]/g, '').toUpperCase()}-${year}`,
    estimatedValue,
  };
}

/**
 * Implementação placeholder do VehiclePricingProvider (Adapter). A integração real com
 * a API pública da Tabela FIPE fica fora de escopo do projeto — esta classe existe só
 * para que o domínio (AssetsService) nunca dependa diretamente de uma fonte externa,
 * podendo ser trocada por um FipeApiProvider real no futuro sem tocar no resto do código.
 */
@Injectable()
export class MockFipeProvider implements VehiclePricingProvider {
  async searchByBrandModelYear(
    brand: string,
    model: string,
    year: number,
  ): Promise<VehiclePriceResult> {
    const known = KNOWN_EXAMPLES[normalizeKey(brand, model)]?.[year];
    return known ?? estimateFallback(brand, model, year);
  }
}
