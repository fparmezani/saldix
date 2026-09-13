import { MockFipeProvider } from './mock-fipe-provider';

describe('MockFipeProvider', () => {
  let provider: MockFipeProvider;

  beforeEach(() => {
    provider = new MockFipeProvider();
  });

  it('returns the known example value for a Volkswagen Gol 1.0 2014', async () => {
    const result = await provider.searchByBrandModelYear('Volkswagen', 'Gol 1.0', 2014);
    expect(result.estimatedValue).toBe(31982);
    expect(result.fipeCode).toBeTruthy();
  });

  it('matches known examples case-insensitively', async () => {
    const result = await provider.searchByBrandModelYear('VOLKSWAGEN', 'gol 1.0', 2014);
    expect(result.estimatedValue).toBe(31982);
  });

  it('falls back to a deterministic estimate for unknown vehicles', async () => {
    const first = await provider.searchByBrandModelYear('Toyota', 'Corolla', 2020);
    const second = await provider.searchByBrandModelYear('Toyota', 'Corolla', 2020);

    expect(first.estimatedValue).toBe(second.estimatedValue);
    expect(first.estimatedValue).toBeGreaterThan(0);
  });

  it('returns different estimates for different brand/model combinations', async () => {
    const a = await provider.searchByBrandModelYear('Toyota', 'Corolla', 2020);
    const b = await provider.searchByBrandModelYear('Honda', 'Civic', 2020);

    expect(a.estimatedValue).not.toBe(b.estimatedValue);
  });
});
