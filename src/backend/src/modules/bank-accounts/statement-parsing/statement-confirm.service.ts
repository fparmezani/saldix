import { BadRequestException, Injectable } from '@nestjs/common';
import { FixedExpensesService } from '../../expenses/fixed-expenses/fixed-expenses.service';
import { VariableExpensesService } from '../../expenses/variable-expenses/variable-expenses.service';
import { CardsService } from '../cards/cards.service';
import { ConfirmStatementImportDto } from '../dto/confirm-statement-import.dto';
import { buildRemainingInstallments } from './remaining-installments.factory';

function dueDayOf(expenseDate: string): number {
  return Number(expenseDate.split('-')[2]);
}

function referenceMonthOf(expenseDate: string): string {
  return `${expenseDate.slice(0, 7)}-01`;
}

@Injectable()
export class StatementConfirmService {
  constructor(
    private readonly cardsService: CardsService,
    private readonly variableExpensesService: VariableExpensesService,
    private readonly fixedExpensesService: FixedExpensesService,
  ) {}

  async confirm(userId: string, input: ConfirmStatementImportDto): Promise<void> {
    const cardIndexToId = new Map<number, string>();

    if (input.sourceType === 'card_invoice') {
      for (const card of input.cards) {
        if (card.existingCardId) {
          cardIndexToId.set(card.cardIndex, card.existingCardId);
          continue;
        }
        const created = await this.cardsService.create(userId, input.bankAccountId, {
          name: card.name,
          lastDigits: card.lastDigits,
          brand: card.brand ?? 'other',
        });
        cardIndexToId.set(card.cardIndex, created.id);
      }
    }

    for (const transaction of input.transactions) {
      const cardId =
        input.sourceType === 'card_invoice'
          ? cardIndexToId.get(transaction.cardIndex) ?? null
          : null;
      const bankAccountId = input.sourceType === 'bank_statement' ? input.bankAccountId : null;

      // Vincula a uma despesa fixa/variável já existente em vez de criar um
      // registro novo — evita duplicidade quando o usuário só está confirmando
      // que um lançamento já cadastrado manualmente foi pago.
      if (transaction.linkToExpenseId && transaction.linkToExpenseType) {
        const updatePayload = {
          amount: transaction.amount,
          cardId: cardId ?? undefined,
          bankAccountId: bankAccountId ?? undefined,
        };
        if (transaction.linkToExpenseType === 'fixed') {
          await this.fixedExpensesService.update(userId, transaction.linkToExpenseId, updatePayload);
        } else {
          await this.variableExpensesService.update(userId, transaction.linkToExpenseId, updatePayload);
        }
        continue;
      }

      if (!transaction.categoryId) {
        throw new BadRequestException(
          'categoryId is required when creating a new expense from a statement line',
        );
      }

      if (transaction.isRecurring) {
        await this.fixedExpensesService.create(userId, {
          categoryId: transaction.categoryId,
          description: transaction.description,
          amount: transaction.amount,
          dueDay: dueDayOf(transaction.expenseDate),
          referenceMonth: referenceMonthOf(transaction.expenseDate),
          cardId: cardId ?? undefined,
          bankAccountId: bankAccountId ?? undefined,
        });
        continue;
      }

      if (transaction.installmentNumber && transaction.installmentTotal) {
        const records = buildRemainingInstallments({
          categoryId: transaction.categoryId,
          description: transaction.description,
          installmentAmount: transaction.amount,
          expenseDate: transaction.expenseDate,
          currentInstallment: transaction.installmentNumber,
          totalInstallments: transaction.installmentTotal,
          cardId,
          bankAccountId,
        });
        await this.variableExpensesService.createFromInstallmentRecords(userId, records);
        continue;
      }

      await this.variableExpensesService.create(userId, {
        categoryId: transaction.categoryId,
        description: transaction.description,
        amount: transaction.amount,
        expenseDate: transaction.expenseDate,
        cardId: cardId ?? undefined,
        bankAccountId: bankAccountId ?? undefined,
      });
    }
  }
}
