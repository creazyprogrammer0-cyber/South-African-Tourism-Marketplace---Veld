import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export function Tabs<T extends string>({ items, value, onChange, className }: {items: TabItem<T>[];value: T;onChange: (v: T) => void;className?: string;}) {
  return (
    <div role="tablist" className={cn('scrollbar-none -mx-1 flex gap-1 overflow-x-auto border-b border-line px-1', className)}>
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative -mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-out',
              active ? 'border-ink text-ink' : 'border-transparent text-ink-500 hover:text-ink'
            )}>
            
            {t.label}
            {t.count !== undefined &&
            <span className={cn('rounded-full px-1.5 py-px text-[11px] tabular-nums', active ? 'bg-ink text-white' : 'bg-sand-100 text-ink-600')}>{t.count}</span>
            }
          </button>);

      })}
    </div>);

}