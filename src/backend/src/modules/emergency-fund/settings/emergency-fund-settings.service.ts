import { Injectable } from '@nestjs/common';
import { EmergencyFundSettingsRepository } from './emergency-fund-settings.repository';
import { UpdateEmergencyFundSettingsDto } from './dto/update-emergency-fund-settings.dto';
import { EmergencyFundSettings } from './entities/emergency-fund-settings.entity';

@Injectable()
export class EmergencyFundSettingsService {
  constructor(private readonly repository: EmergencyFundSettingsRepository) {}

  async get(userId: string): Promise<EmergencyFundSettings | null> {
    return this.repository.find(userId);
  }

  async upsert(userId: string, dto: UpdateEmergencyFundSettingsDto): Promise<EmergencyFundSettings> {
    return this.repository.upsert(userId, dto);
  }
}
