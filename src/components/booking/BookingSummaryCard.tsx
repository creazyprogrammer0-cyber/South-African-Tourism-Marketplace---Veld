import React from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon, BadgeCheckIcon } from 'lucide-react';
import type { CancellationPolicy } from '../../types/marketplace';
import { formatDate } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { cancellationPolicies } from '../../utils/policies';
import { SafeImage } from '../ui/SafeImage';

interface Props {
  title: string;
  image?: string;
  providerName?: string;
  date: string;
  time: string;
  guests: number;
  meetingPoint: string;
  unitLabel: string;
  subtotal: number;
  fees: number;
  total: number;
  feePercent: number;
  policy: CancellationPolicy;
}

export function BookingSummaryCard(p: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
      <div className="flex gap-4 border-b border-line p-5">
        <SafeImage src={p.image} alt="" className="h-20 w-24 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p className="line-clamp-2 font-semibold leading-snug text-ink">{p.title}</p>
          {p.providerName &&
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-600">
              <BadgeCheckIcon className="h-3.5 w-3.5 text-olive" aria-hidden /> {p.providerName}
            </p>
          }
        </div>
      </div>
      <dl className="space-y-2.5 border-b border-line p-5 text-sm">
        <div className="flex items-center gap-2.5 text-ink-700"><CalendarIcon className="h-4 w-4 text-ink-500" aria-hidden /><dt className="sr-only">Date</dt><dd>{formatDate(p.date)}</dd></div>
        <div className="flex items-center gap-2.5 text-ink-700"><ClockIcon className="h-4 w-4 text-ink-500" aria-hidden /><dt className="sr-only">Time</dt><dd>{p.time}</dd></div>
        <div className="flex items-center gap-2.5 text-ink-700"><UsersIcon className="h-4 w-4 text-ink-500" aria-hidden /><dt className="sr-only">Guests</dt><dd>{p.guests} traveller{p.guests > 1 ? 's' : ''}</dd></div>
        <div className="flex items-start gap-2.5 text-ink-700"><MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" aria-hidden /><dt className="sr-only">Meeting point</dt><dd>{p.meetingPoint}</dd></div>
      </dl>
      <dl className="space-y-1.5 p-5 text-sm">
        <div className="flex justify-between text-ink-600"><dt>{p.unitLabel}</dt><dd>{formatZAR(p.subtotal)}</dd></div>
        <div className="flex justify-between text-ink-600"><dt>Service fee ({p.feePercent}%)</dt><dd>{formatZAR(p.fees)}</dd></div>
        <div className="flex justify-between border-t border-line pt-2.5 text-base font-semibold text-ink"><dt>Total (ZAR)</dt><dd>{formatZAR(p.total)}</dd></div>
        <p className="pt-2 text-xs leading-relaxed text-ink-500">{cancellationPolicies[p.policy].text}</p>
      </dl>
    </div>);

}