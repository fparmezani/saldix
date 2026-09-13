import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CategoriesService } from '../../categories/categories.service';
import { CardsService } from '../cards/cards.service';
import { detectCardSections } from './card-section-detector';
import { suggestCategory } from './category-suggester';
import { PdfTextExtractor } from './pdf-text-extractor';
import { parseTransactionLines } from './statement-line-parser';

export type StatementSourceType = 'card_invoice' | 'bank_statement';

export interface StatementTransactionPreview {
  lineId: string;
  cardIndex: number;
  description: string;
  amount: number;
  expenseDate: string;
  installmentNumber: number | null;
  installmentTotal: number | null;
  suggestedCategoryId: string | null;
  categoryId: string | null;
  isRecurring: boolean;
  include: boolean;
  linkToExpenseId: string | null;
  linkToExpenseType: 'fixed' | 'variable' | null;
}

export interface DetectedCardPreview {
  cardIndex: number;
  suggestedName: string;
  lastDigits: string | null;
  existingCardId: string | null;
}

export interface StatementImportPreview {
  sourceType: StatementSourceType;
  bankAccountId: string;
  detectedCards: DetectedCardPreview[];
  transactions: StatementTransactionPreview[];
}

@Injectable()
export class StatementPreviewService {
  constructor(
    private readonly pdfTextExtractor: PdfTextExtractor,
    private readonly categoriesService: CategoriesService,
    private readonly cardsService: CardsService,
  ) {}

  async buildPreview(
    userId: string,
    bankAccountId: string,
    sourceType: StatementSourceType,
    fileBuffer: Buffer,
  ): Promise<StatementImportPreview> {
    const rawText = await this.pdfTextExtractor.extractText(fileBuffer);

    // Extrato bancário não tem cartões — o texto inteiro é uma única seção
    // vinculada diretamente à conta, sem separação por cartão.
    const sections =
      sourceType === 'card_invoice'
        ? detectCardSections(rawText)
        : [{ cardIndex: 0, lastDigits: null, suggestedName: '', text: rawText }];

    const [userCategories, existingCards] = await Promise.all([
      this.categoriesService.listAll(userId),
      sourceType === 'card_invoice'
        ? this.cardsService.listByBankAccount(userId, bankAccountId)
        : Promise.resolve([]),
    ]);

    const currentYear = new Date().getFullYear();
    const transactions: StatementTransactionPreview[] = [];

    for (const section of sections) {
      const lines = parseTransactionLines(section.text, currentYear);

      for (const line of lines) {
        const suggestedCategoryId = suggestCategory(line.description, userCategories);
        transactions.push({
          lineId: randomUUID(),
          cardIndex: section.cardIndex,
          description: line.description,
          amount: line.amount,
          expenseDate: line.date,
          installmentNumber: line.installmentNumber,
          installmentTotal: line.installmentTotal,
          suggestedCategoryId,
          categoryId: suggestedCategoryId,
          isRecurring: false,
          include: true,
          linkToExpenseId: null,
          linkToExpenseType: null,
        });
      }
    }

    const detectedCards: DetectedCardPreview[] =
      sourceType === 'card_invoice'
        ? sections.map((section) => {
            const existingCard = section.lastDigits
              ? existingCards.find((card) => card.lastDigits === section.lastDigits)
              : undefined;

            return {
              cardIndex: section.cardIndex,
              suggestedName: existingCard?.name ?? section.suggestedName,
              lastDigits: section.lastDigits,
              existingCardId: existingCard?.id ?? null,
            };
          })
        : [];

    return { sourceType, bankAccountId, detectedCards, transactions };
  }
}
