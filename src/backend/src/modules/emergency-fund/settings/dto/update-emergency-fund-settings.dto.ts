import { IsIn, IsNumber, IsPositive } from 'class-validator';
import { ProtectionType } from '../entities/emergency-fund-settings.entity';

export class UpdateEmergencyFundSettingsDto {
  @IsIn(['basic', 'shielded'])
  protectionType!: ProtectionType;

  @IsNumber()
  @IsPositive()
  monthlyEssentialCost!: number;
}
