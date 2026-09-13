import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async listAll(userId: string) {
    return this.categoriesRepository.findAllByUser(userId);
  }

  async create(userId: string, dto: CreateCategoryDto) {
    return this.categoriesRepository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    try {
      return await this.categoriesRepository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Category not found');
    }
  }

  async remove(userId: string, id: string) {
    const referenced = await this.categoriesRepository.isReferencedByExpenses(userId, id);
    if (referenced) {
      throw new BadRequestException(
        'Esta categoria está em uso por despesas existentes e não pode ser excluída.',
      );
    }

    await this.categoriesRepository.delete(userId, id);
  }
}
