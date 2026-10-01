import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import type { RequestStatus } from '../../types/marketplace';
import { REQUEST_FLOW } from '../../utils/status';
import { cn } from '../../utils/cn';

const order: Record<RequestStatus, number> = {
  submitted: 0,
  under_review: 1,
  matched: 2,
  proposal_received: 3,
  customer_reviewing: 3,
  accepted: 4,
  booking_created: 5,
  completed: 6,
  cancelled: -1,
  closed: -1
};

export function RequestTimeline({ status }: {status: RequestStatus;}) {
  const current = order[status];
  if (current < 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-sand-100 px-4 py-3 text-sm text-ink-700">
        <XIcon className="h-4 w-4" aria-hidden /> This request was {status}. It no longer accepts proposals.
      </div>);

  }
  return (
    <ol className="grid gap-3 sm:grid-cols-7 sm:gap-0" aria-label="Request progress">
      {REQUEST_FLOW.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.key} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2" aria-current={active ? 'step' : undefined}>
            <div className="flex w-full items-center">
              <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold', done ? 'bg-olive text-white' : active ? 'bg-clay text-white' : 'bg-sand-200 text-ink-500')}>
                {done ? <CheckIcon className="h-3.5 w-3.5" aria-hidden /> : i + 1}
              </span>
              {i < REQUEST_FLOW.length - 1 && <span className={cn('ml-2 hidden h-px flex-1 sm:block', done ? 'bg-olive' : 'bg-line')} aria-hidden />}
            </div>
            <span className={cn('text-xs', active ? 'font-semibold text-ink' : done ? 'text-ink-700' : 'text-ink-500')}>{s.label}</span>
          </li>);

      })}
    </ol>);

}