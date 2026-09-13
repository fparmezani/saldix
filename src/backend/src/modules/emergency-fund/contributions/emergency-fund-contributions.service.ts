import { Injectable } from '@nestjs/common';
import { CreateEmergencyFundContributionDto } from './dto/create-emergency-fund-contribution.dto';
import { EmergencyFundContributionsRepository } from './emergency-fund-contributions.repository';

@Injectable()
export class EmergencyFundContributionsService {
  constructor(private readonly repository: EmergencyFundContributionsRepository) {}

  async listAll(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async totalContributed(userId: string): Promise<number> {
    return this.repository.sumByUser(userId);
  }

  async create(userId: string, dto: CreateEmergencyFundContributionDto) {
    return this.repository.create(userId, dto);
  }
}
