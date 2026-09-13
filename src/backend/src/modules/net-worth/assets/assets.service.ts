import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  VEHICLE_PRICING_PROVIDER,
  VehiclePricingProvider,
} from '../vehicle-pricing/vehicle-pricing-provider.interface';
import { AssetsRepository } from './assets.repository';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    private readonly repository: AssetsRepository,
    @Inject(VEHICLE_PRICING_PROVIDER) private readonly vehiclePricingProvider: VehiclePricingProvider,
  ) {}

  async listAll(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async total(userId: string): Promise<number> {
    return this.repository.sumByUser(userId);
  }

  async create(userId: string, dto: CreateAssetDto) {
    return this.repository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateAssetDto) {
    try {
      return await this.repository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Asset not found');
    }
  }

  async remove(userId: string, id: string) {
    await this.repository.delete(userId, id);
  }

  async lookupVehicle(brand: string, model: string, year: number) {
    return this.vehiclePricingProvider.searchByBrandModelYear(brand, model, year);
  }
}
