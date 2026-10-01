import React from 'react';
import { cn } from '../../utils/cn';
import type { Tone } from '../../utils/status';

const tones: Record<Tone, {box: string;dot: string;}> = {
  neutral: { box: 'bg-sand-100 text-ink-700', dot: 'bg-ink-400' },
  success: { box: 'bg-success-bg text-success', dot: 'bg-success' },
  warning: { box: 'bg-warning-bg text-warning', dot: 'bg-warning' },
  danger: { box: 'bg-danger-bg text-danger', dot: 'bg-danger' },
  info: { box: 'bg-info-bg text-info', dot: 'bg-info' },
  accent: { box: 'bg-clay-100 text-clay-700', dot: 'bg-clay' }
};

export function StatusBadge({ tone, label, className }: {tone: Tone;label: string;className?: string;}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone].box, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', tones[tone].dot)} aria-hidden />
      {label}
    </span>);

}