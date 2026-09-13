export type CardBrand = 'visa' | 'mastercard' | 'other';

export interface Card {
  id: string;
  userId: string;
  bankAccountId: string;
  name: string;
  lastDigits: string | null;
  brand: CardBrand;
  createdAt: string;
}
