export type BankAccountType = 'checking' | 'investment';

export interface BankAccount {
  id: string;
  userId: string;
  type: BankAccountType;
  bankCode: string;
  bankName: string;
  agency: string;
  accountNumber: string;
  createdAt: string;
}
