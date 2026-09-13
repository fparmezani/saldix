export type AssetType = 'real_estate' | 'vehicle' | 'other';

export interface Asset {
  id: string;
  userId: string;
  assetType: AssetType;
  name: string;
  currentValue: number;
  fipeCode: string | null;
  createdAt: string;
}
