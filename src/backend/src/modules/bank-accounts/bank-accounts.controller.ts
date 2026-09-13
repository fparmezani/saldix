import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { BankAccountsService } from './bank-accounts.service';
import { CardsService } from './cards/cards.service';
import { CreateCardDto } from './cards/dto/create-card.dto';
import { ConfirmStatementImportDto } from './dto/confirm-statement-import.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { StatementConfirmService } from './statement-parsing/statement-confirm.service';
import {
  StatementPreviewService,
  StatementSourceType,
} from './statement-parsing/statement-preview.service';

const VALID_SOURCE_TYPES: StatementSourceType[] = ['card_invoice', 'bank_statement'];

@UseGuards(SupabaseAuthGuard)
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(
    private readonly bankAccountsService: BankAccountsService,
    private readonly cardsService: CardsService,
    private readonly statementPreviewService: StatementPreviewService,
    private readonly statementConfirmService: StatementConfirmService,
  ) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.bankAccountsService.listAll(req.user.id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBankAccountDto) {
    return this.bankAccountsService.create(req.user.id, dto);
  }

  @Get(':id/cards')
  async listCards(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.bankAccountsService.findByIdOrFail(req.user.id, id);
    return this.cardsService.listByBankAccount(req.user.id, id);
  }

  @Post(':id/cards')
  async createCard(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateCardDto,
  ) {
    await this.bankAccountsService.findByIdOrFail(req.user.id, id);
    return this.cardsService.create(req.user.id, id, dto);
  }

  @Post(':id/statement-preview')
  @UseInterceptors(FileInterceptor('file'))
  async statementPreview(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('sourceType') sourceType: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.bankAccountsService.findByIdOrFail(req.user.id, id);

    if (!file) {
      throw new BadRequestException('file is required');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('file must be a PDF');
    }
    if (!VALID_SOURCE_TYPES.includes(sourceType as StatementSourceType)) {
      throw new BadRequestException('sourceType must be card_invoice or bank_statement');
    }

    return this.statementPreviewService.buildPreview(
      req.user.id,
      id,
      sourceType as StatementSourceType,
      file.buffer,
    );
  }

  @Post(':id/statement-confirm')
  async statementConfirm(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() input: ConfirmStatementImportDto,
  ) {
    await this.bankAccountsService.findByIdOrFail(req.user.id, id);
    await this.statementConfirmService.confirm(req.user.id, { ...input, bankAccountId: id });
    return { success: true };
  }
}
