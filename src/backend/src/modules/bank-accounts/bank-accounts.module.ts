import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsRepository } from './bank-accounts.repository';
import { BankAccountsService } from './bank-accounts.service';
import { CardsRepository } from './cards/cards.repository';
import { CardsService } from './cards/cards.service';
import { PdfTextExtractor } from './statement-parsing/pdf-text-extractor';
import { StatementConfirmService } from './statement-parsing/statement-confirm.service';
import { StatementPreviewService } from './statement-parsing/statement-preview.service';

@Module({
  imports: [CategoriesModule, ExpensesModule],
  controllers: [BankAccountsController],
  providers: [
    BankAccountsService,
    BankAccountsRepository,
    CardsService,
    CardsRepository,
    PdfTextExtractor,
    StatementPreviewService,
    StatementConfirmService,
  ],
})
export class BankAccountsModule {}
