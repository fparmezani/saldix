export interface EmergencyFundContribution {
  id: string;
  userId: string;
  amount: number;
  contributedAt: string;
  note: string | null;
  createdAt: string;
}
