import { Test } from '@nestjs/testing';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: { isReferencedByExpenses: jest.Mock; delete: jest.Mock };

  beforeEach(async () => {
    repository = {
      isReferencedByExpenses: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [CategoriesService, { provide: CategoriesRepository, useValue: repository }],
    }).compile();

    service = moduleRef.get(CategoriesService);
  });

  it('deletes a category with no expenses linked', async () => {
    repository.isReferencedByExpenses.mockResolvedValue(false);

    await service.remove('user-1', 'cat-1');

    expect(repository.delete).toHaveBeenCalledWith('user-1', 'cat-1');
  });

  it('blocks deletion when the category is referenced by an expense', async () => {
    repository.isReferencedByExpenses.mockResolvedValue(true);

    await expect(service.remove('user-1', 'cat-1')).rejects.toThrow(
      'Esta categoria está em uso por despesas existentes e não pode ser excluída.',
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
