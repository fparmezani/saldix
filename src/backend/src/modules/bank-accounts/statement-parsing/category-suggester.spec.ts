import { suggestCategory } from './category-suggester';

const CATEGORIES = [
  { id: 'cat-transporte', name: 'Transporte' },
  { id: 'cat-assinaturas', name: 'Assinaturas' },
  { id: 'cat-saude', name: 'Saúde' },
];

describe('suggestCategory', () => {
  it('suggests the matching category when a known keyword is found', () => {
    expect(suggestCategory('UBER *TRIP', CATEGORIES)).toBe('cat-transporte');
  });

  it('matches keywords case-insensitively', () => {
    expect(suggestCategory('netflix.com', CATEGORIES)).toBe('cat-assinaturas');
  });

  it('matches category names with accents regardless of accent in the stored name', () => {
    expect(suggestCategory('DROGARIA SAO PAULO', CATEGORIES)).toBe('cat-saude');
  });

  it('returns null when no keyword matches', () => {
    expect(suggestCategory('LOJA DESCONHECIDA XYZ', CATEGORIES)).toBeNull();
  });

  it('never invents a category the user does not have', () => {
    const withoutTransporte = CATEGORIES.filter((c) => c.name !== 'Transporte');
    expect(suggestCategory('UBER *TRIP', withoutTransporte)).toBeNull();
  });
});
