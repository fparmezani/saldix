import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { CreateEmergencyFundContributionDto } from './contributions/dto/create-emergency-fund-contribution.dto';
import { EmergencyFundContributionsService } from './contributions/emergency-fund-contributions.service';
import { EmergencyFundService } from './emergency-fund.service';
import { UpdateEmergencyFundSettingsDto } from './settings/dto/update-emergency-fund-settings.dto';
import { EmergencyFundSettingsService } from './settings/emergency-fund-settings.service';

@UseGuards(SupabaseAuthGuard)
@Controller('emergency-fund')
export class EmergencyFundController {
  constructor(
    private readonly emergencyFundService: EmergencyFundService,
    private readonly settingsService: EmergencyFundSettingsService,
    private readonly contributionsService: EmergencyFundContributionsService,
  ) {}

  @Get('settings')
  getSettings(@Req() req: AuthenticatedRequest) {
    return this.settingsService.get(req.user.id);
  }

  @Put('settings')
  updateSettings(@Req() req: AuthenticatedRequest, @Body() dto: UpdateEmergencyFundSettingsDto) {
    return this.settingsService.upsert(req.user.id, dto);
  }

  @Get('status')
  getStatus(@Req() req: AuthenticatedRequest) {
    return this.emergencyFundService.getStatus(req.user.id);
  }

  @Get('contributions')
  listContributions(@Req() req: AuthenticatedRequest) {
    return this.contributionsService.listAll(req.user.id);
  }

  @Post('contributions')
  createContribution(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateEmergencyFundContributionDto,
  ) {
    return this.contributionsService.create(req.user.id, dto);
  }
}
