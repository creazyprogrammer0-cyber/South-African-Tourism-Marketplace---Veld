import React from 'react';
import { cn } from '../../utils/cn';

export function EmptyState({ icon, title, message, action, className }: {icon?: React.ReactNode;title: string;message: string;action?: React.ReactNode;className?: string;}) {
  return (
    <div className={cn('flex flex-col items-center rounded-2xl border border-dashed border-sand-300 bg-sand-50 px-6 py-12 text-center', className)}>
      {icon && <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink-600 shadow-card">{icon}</div>}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>);

}