import type { ProjectStatus } from '@/types';

export type StatusLabels = Record<ProjectStatus, string>;

const tone: Record<ProjectStatus, string> = {
  'Client project': 'client',
  'Live application': 'live',
  'Live demo': 'live',
  'In development': 'dev',
  'Local application': 'local',
  'Educational project': 'edu',
  Prototype: 'concept',
  'Design concept': 'concept',
};

export function StatusBadge({ status, labels }: { status?: ProjectStatus; labels: StatusLabels }) {
  if (!status) return null;
  return <span className={`status status-${tone[status]}`}><span aria-hidden="true" />{labels[status]}</span>;
}

export const hasArabic = (value?: string) => Boolean(value && /[؀-ۿ]/.test(value));
