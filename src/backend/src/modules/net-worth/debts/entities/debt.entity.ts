export interface Debt {
  id: string;
  userId: string;
  assetId: string | null;
  name: string;
  outstandingBalance: number;
  createdAt: string;
}
