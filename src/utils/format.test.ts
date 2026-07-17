import { describe, it, expect } from 'vitest';
import { proposalRange, money, monthLabel, experienceLabel, serviceFee, jobRateLabel } from './format';

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

describe('serviceFee', () => {
  it('takes a 10% fee and returns the remainder', () => {
    expect(serviceFee(15)).toEqual({ fee: 1.5, receives: 13.5 });
  });

  it('handles zero', () => {
    expect(serviceFee(0)).toEqual({ fee: 0, receives: 0 });
  });
});

describe('jobRateLabel', () => {
  it('formats an hourly range', () => {
    expect(
      jobRateLabel({ jobType: 'HOURLY', budget: null, hourlyRateMin: 3, hourlyRateMax: 5 }),
    ).toBe('$3.00 - $5.00');
  });

  it('formats a fixed budget', () => {
    expect(jobRateLabel({ jobType: 'FIXED', budget: 300, hourlyRateMin: null, hourlyRateMax: null })).toBe(
      '$300',
    );
  });

  it('falls back when nothing is set', () => {
    expect(jobRateLabel({ jobType: 'FIXED', budget: null, hourlyRateMin: null, hourlyRateMax: null })).toBe(
      'Budget not set',
    );
  });
});
