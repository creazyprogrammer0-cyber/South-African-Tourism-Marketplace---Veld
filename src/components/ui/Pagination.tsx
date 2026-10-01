import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Pagination({ page, pageCount, onChange, total, pageSize }: {page: number;pageCount: number;onChange: (p: number) => void;total: number;pageSize: number;}) {
  if (pageCount <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 pt-4">
      <p className="text-sm text-ink-500">
        {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="rounded-lg p-2 text-ink-600 hover:bg-sand-100 disabled:opacity-40" aria-label="Previous page">
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) =>
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn('h-8 min-w-8 rounded-lg px-2 text-sm tabular-nums', p === page ? 'bg-ink text-white' : 'text-ink-600 hover:bg-sand-100')}>
          
            {p}
          </button>
        )}
        <button onClick={() => onChange(page + 1)} disabled={page === pageCount} className="rounded-lg p-2 text-ink-600 hover:bg-sand-100 disabled:opacity-40" aria-label="Next page">
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>);

}