import { Module } from '@nestjs/common';
import { EmergencyFundContributionsRepository } from './contributions/emergency-fund-contributions.repository';
import { EmergencyFundContributionsService } from './contributions/emergency-fund-contributions.service';
import { EmergencyFundController } from './emergency-fund.controller';
import { EmergencyFundService } from './emergency-fund.service';
import { EmergencyFundSettingsRepository } from './settings/emergency-fund-settings.repository';
import { EmergencyFundSettingsService } from './settings/emergency-fund-settings.service';

@Module({
  controllers: [EmergencyFundController],
  providers: [
    EmergencyFundService,
    EmergencyFundSettingsService,
    EmergencyFundSettingsRepository,
    EmergencyFundContributionsService,
    EmergencyFundContributionsRepository,
  ],
})
export class EmergencyFundModule {}
