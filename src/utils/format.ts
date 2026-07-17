import type { ExperienceLevel, HoursPerWeek, LanguageProficiency } from '../types';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} minutes ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hours ago`;
  const days = Math.floor(diff / DAY);
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function proposalRange(count = 0): string {
  if (count < 5) return 'Fewer than 5';
  const lower = Math.floor(count / 5) * 5;
  return `${lower} to ${lower + 5}`;
}

export function money(amount = 0): string {
  if (amount >= 1000) return `$${Math.floor(amount / 1000)}K+`;
  return `$${amount}`;
}

export function experienceLabel(level: ExperienceLevel): string {
  const map: Record<ExperienceLevel, string> = {
    ENTRY: 'Entry level',
    INTERMEDIATE: 'Intermediate',
    EXPERT: 'Expert',
  };
  return map[level] ?? 'Entry level';
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function monthLabel(value: string | null | undefined): string {
  if (!value) return '';
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1] ?? ''} ${year}`.trim();
}

export const HOURS_LABEL: Record<HoursPerWeek, string> = {
  AS_NEEDED: 'As needed - open to offers',
  LESS_THAN_30: 'Less than 30 hrs/week',
  MORE_THAN_30: 'More than 30 hrs/week',
};

export const PROFICIENCY_LABEL: Record<LanguageProficiency, string> = {
  BASIC: 'Basic',
  CONVERSATIONAL: 'Conversational',
  FLUENT: 'Fluent',
  NATIVE_OR_BILINGUAL: 'Native or Bilingual',
};
