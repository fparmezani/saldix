import { describe, expect, it } from 'vitest';
import {
  BLANK_INVESTMENT_DRAFT,
  computeGain,
  computeResultValue,
  computeWeightPercentage,
  draftFromInvestment,
  validateInvestmentDraft,
} from './investment-row-math';

describe('computeGain', () => {
  it('computes zero gain when invested equals current', () => {
    expect(computeGain(100, 100)).toEqual({ gainAmount: 0, gainPercentage: 0 });
  });

  it('computes a positive gain', () => {
    expect(computeGain(1000, 1200)).toEqual({ gainAmount: 200, gainPercentage: 20 });
  });

  it('avoids division by zero when investedAmount is 0', () => {
    expect(computeGain(0, 50)).toEqual({ gainAmount: 50, gainPercentage: 0 });
  });
});

describe('computeResultValue', () => {
  it('returns null when either field is blank', () => {
    expect(computeResultValue('', '10')).toBeNull();
    expect(computeResultValue('10', '')).toBeNull();
  });

  it('multiplies quantity by market price', () => {
    expect(computeResultValue('100', '10.5')).toBe(1050);
  });
});

describe('computeWeightPercentage', () => {
  it('returns null when totalCurrent is undefined or zero', () => {
    expect(computeWeightPercentage(100, undefined)).toBeNull();
    expect(computeWeightPercentage(100, 0)).toBeNull();
  });

  it('computes the share of the category total', () => {
    expect(computeWeightPercentage(250, 1000)).toBe(25);
  });
});

describe('validateInvestmentDraft', () => {
  it('requires a name', () => {
    expect(validateInvestmentDraft(BLANK_INVESTMENT_DRAFT, false)).toMatch(/nome/);
  });

  it('requires a valid invested amount', () => {
    const draft = { ...BLANK_INVESTMENT_DRAFT, name: 'X' };
    expect(validateInvestmentDraft(draft, false)).toMatch(/valor investido/);
  });

  it('requires ticker/quantity/price only for share-based categories', () => {
    const draft = { ...BLANK_INVESTMENT_DRAFT, name: 'X', investedAmount: '10' };
    expect(validateInvestmentDraft(draft, false)).toBeNull();
    expect(validateInvestmentDraft(draft, true)).toMatch(/ticker/);
  });

  it('accepts a fully filled share-based draft', () => {
    const draft = {
      ...BLANK_INVESTMENT_DRAFT,
      name: 'MXRF11',
      ticker: 'MXRF11',
      quantity: '100',
      marketPricePerUnit: '10.5',
      investedAmount: '1050',
    };
    expect(validateInvestmentDraft(draft, true)).toBeNull();
  });
});

describe('draftFromInvestment', () => {
  it('converts null numeric fields to empty strings', () => {
    const draft = draftFromInvestment({
      name: 'Tesouro Selic',
      ticker: null,
      marketPricePerUnit: null,
      quantity: null,
      investedAmount: 1000,
      currentAmount: 1050,
      targetPercentage: null,
    });
    expect(draft).toEqual({
      name: 'Tesouro Selic',
      ticker: '',
      marketPricePerUnit: '',
      quantity: '',
      investedAmount: '1000',
      currentAmount: '1050',
      targetPercentage: '',
    });
  });

  it('converts populated numeric fields to strings', () => {
    const draft = draftFromInvestment({
      name: 'MXRF11',
      ticker: 'MXRF11',
      marketPricePerUnit: 10.5,
      quantity: 100,
      investedAmount: 1050,
      currentAmount: 1100,
      targetPercentage: 50,
    });
    expect(draft.marketPricePerUnit).toBe('10.5');
    expect(draft.quantity).toBe('100');
    expect(draft.targetPercentage).toBe('50');
  });
});
