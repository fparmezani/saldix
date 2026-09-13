import { Injectable } from '@nestjs/common';
import { EmergencyFundContributionsService } from './contributions/emergency-fund-contributions.service';
import { calculateEmergencyFundStatus, EmergencyFundStatus } from './emergency-fund-status.calculator';
import { EmergencyFundSettingsService } from './settings/emergency-fund-settings.service';

@Injectable()
export class EmergencyFundService {
  constructor(
    private readonly settingsService: EmergencyFundSettingsService,
    private readonly contributionsService: EmergencyFundContributionsService,
  ) {}

  async getStatus(userId: string): Promise<EmergencyFundStatus | null> {
    const settings = await this.settingsService.get(userId);
    if (!settings) return null;

    const totalContributed = await this.contributionsService.totalContributed(userId);
    return calculateEmergencyFundStatus(settings, totalContributed);
  }
}
