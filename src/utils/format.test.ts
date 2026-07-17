import { describe, it, expect } from 'vitest';
import { proposalRange, money, monthLabel, experienceLabel } from './format';

describe('proposalRange', () => {
  it('buckets small counts', () => {
    expect(proposalRange(0)).toBe('Fewer than 5');
    expect(proposalRange(4)).toBe('Fewer than 5');
  });

  it('buckets larger counts into ranges of five', () => {
    expect(proposalRange(7)).toBe('5 to 10');
    expect(proposalRange(17)).toBe('15 to 20');
  });
});

describe('money', () => {
  it('formats sub-thousand amounts plainly', () => {
    expect(money(340)).toBe('$340');
  });

  it('abbreviates thousands', () => {
    expect(money(1200)).toBe('$1K+');
  });
});

describe('monthLabel', () => {
  it('renders a YYYY-MM value as a readable month', () => {
    expect(monthLabel('2025-06')).toBe('June 2025');
  });

  it('returns an empty string for missing input', () => {
    expect(monthLabel('')).toBe('');
  });
});

describe('experienceLabel', () => {
  it('maps enum values to labels and falls back to Entry level', () => {
    expect(experienceLabel('EXPERT')).toBe('Expert');
    expect(experienceLabel('UNKNOWN')).toBe('Entry level');
  });
});
