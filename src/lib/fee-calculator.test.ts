import { describe, expect, it } from 'vitest';
import { calculateFee } from './fee-calculator';

describe('calculateFee', () => {
  it('returns null for invalid case value', () => {
    expect(calculateFee({ caseValueEur: -1, action: 'tuzba' })).toBeNull();
  });

  it('returns null when action is missing', () => {
    expect(calculateFee({ caseValueEur: 100 })).toBeNull();
  });

  it('returns null when case value is out of range', () => {
    expect(calculateFee({ caseValueEur: 500, action: 'tuzba' })).toBeNull();
  });

  it('returns null for unsupported action', () => {
    expect(calculateFee({ caseValueEur: 100, action: 'zalba' })).toBeNull();
  });

  it('calculates fee for supported action and base range', () => {
    expect(calculateFee({ caseValueEur: 100, action: 'tuzba' })).toEqual({
      net: 50,
      vat: 12.5,
      total: 62.5,
      points: 25,
      pointValueEur: 2,
    });
  });
});
