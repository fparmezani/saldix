import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { AssetsService } from './assets/assets.service';
import { CreateAssetDto } from './assets/dto/create-asset.dto';
import { UpdateAssetDto } from './assets/dto/update-asset.dto';
import { CreateDebtDto } from './debts/dto/create-debt.dto';
import { UpdateDebtDto } from './debts/dto/update-debt.dto';
import { DebtsService } from './debts/debts.service';
import { CreateLiquidAccountDto } from './liquid-accounts/dto/create-liquid-account.dto';
import { UpdateLiquidAccountDto } from './liquid-accounts/dto/update-liquid-account.dto';
import { LiquidAccountsService } from './liquid-accounts/liquid-accounts.service';
import { NetWorthSummaryService } from './net-worth-summary.service';

@UseGuards(SupabaseAuthGuard)
@Controller('net-worth')
export class NetWorthController {
  constructor(
    private readonly liquidAccountsService: LiquidAccountsService,
    private readonly assetsService: AssetsService,
    private readonly debtsService: DebtsService,
    private readonly summaryService: NetWorthSummaryService,
  ) {}

  @Get('summary')
  getSummary(@Req() req: AuthenticatedRequest) {
    return this.summaryService.getSummary(req.user.id);
  }

  // Liquidez
  @Get('liquid-accounts')
  listLiquidAccounts(@Req() req: AuthenticatedRequest) {
    return this.liquidAccountsService.listAll(req.user.id);
  }

  @Post('liquid-accounts')
  createLiquidAccount(@Req() req: AuthenticatedRequest, @Body() dto: CreateLiquidAccountDto) {
    return this.liquidAccountsService.create(req.user.id, dto);
  }

  @Patch('liquid-accounts/:id')
  updateLiquidAccount(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateLiquidAccountDto,
  ) {
    return this.liquidAccountsService.update(req.user.id, id, dto);
  }

  @Delete('liquid-accounts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLiquidAccount(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.liquidAccountsService.remove(req.user.id, id);
  }

  // Bens
  @Get('assets')
  listAssets(@Req() req: AuthenticatedRequest) {
    return this.assetsService.listAll(req.user.id);
  }

  @Post('assets')
  createAsset(@Req() req: AuthenticatedRequest, @Body() dto: CreateAssetDto) {
    return this.assetsService.create(req.user.id, dto);
  }

  @Patch('assets/:id')
  updateAsset(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAssetDto,
  ) {
    return this.assetsService.update(req.user.id, id, dto);
  }

  @Delete('assets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAsset(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.assetsService.remove(req.user.id, id);
  }

  @Get('vehicle-lookup')
  lookupVehicle(
    @Query('brand') brand: string,
    @Query('model') model: string,
    @Query('year') year: string,
  ) {
    return this.assetsService.lookupVehicle(brand, model, Number(year));
  }

  // Dívidas
  @Get('debts')
  listDebts(@Req() req: AuthenticatedRequest) {
    return this.debtsService.listAll(req.user.id);
  }

  @Post('debts')
  createDebt(@Req() req: AuthenticatedRequest, @Body() dto: CreateDebtDto) {
    return this.debtsService.create(req.user.id, dto);
  }

  @Patch('debts/:id')
  updateDebt(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateDebtDto,
  ) {
    return this.debtsService.update(req.user.id, id, dto);
  }

  @Delete('debts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeDebt(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.debtsService.remove(req.user.id, id);
  }
}
