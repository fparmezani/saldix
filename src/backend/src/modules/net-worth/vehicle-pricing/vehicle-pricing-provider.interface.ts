export interface VehiclePriceResult {
  fipeCode: string;
  estimatedValue: number;
}

export interface VehiclePricingProvider {
  searchByBrandModelYear(brand: string, model: string, year: number): Promise<VehiclePriceResult>;
}

export const VEHICLE_PRICING_PROVIDER = Symbol('VEHICLE_PRICING_PROVIDER');
