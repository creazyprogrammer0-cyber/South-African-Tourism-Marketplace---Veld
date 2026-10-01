import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MinusIcon, PlusIcon, LockIcon, RotateCcwIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Experience } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { bookableSlots, futureSlots, priceBreakdown, slotRemaining } from '../../utils/selectors';
import { formatDate } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { freeCancellationLabel } from '../../utils/policies';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export function BookingPanel({ experience: e, preview }: {experience: Experience;preview?: boolean;}) {
  const { state, currentUser } = useMarketplace();
  const navigate = useNavigate();
  const slots = bookableSlots(state, e.id);
  const allFuture = futureSlots(state, e.id);
  const dates = useMemo(() => Array.from(new Set(allFuture.map((s) => s.date))), [allFuture]);
  const firstOpenDate = slots.find((s) => slotRemaining(s) > 0)?.date ?? '';
  const [date, setDate] = useState(firstOpenDate);
  const [showAll, setShowAll] = useState(false);
  const [guests, setGuests] = useState(2);
  const daySlots = allFuture.filter((s) => s.date === date);
  const [slotId, setSlotId] = useState<string>('');
  const selected = daySlots.find((s) => s.id === slotId) ?? daySlots.find((s) => s.status === 'open' && slotRemaining(s) > 0);
  const remaining = selected ? slotRemaining(selected) : 0;
  const maxSelectable = Math.max(1, Math.min(e.maxGuests, 12));
  const tooMany = !!selected && guests > remaining;
  const price = priceBreakdown(e.price * guests, state.settings.serviceFeePercent);
  const visibleDates = showAll ? dates : dates.slice(0, 8);

  const dateState = (d: string) => {
    const ds = allFuture.filter((s) => s.date === d);
    if (ds.every((s) => s.status === 'blocked')) return 'blocked';
    const max = Math.max(0, ...ds.filter((s) => s.status === 'open').map(slotRemaining));
    if (max === 0) return 'full';
    if (max <= 2) return 'low';
    return 'open';
  };

  const book = () => {
    if (!selected) return;
    const target = `/checkout?slot=${selected.id}&guests=${guests}`;
    if (!currentUser) {
      navigate(`/login?next=${encodeURIComponent(target)}`);
      return;
    }
    if (currentUser.role !== 'traveller') {
      toast.error('Bookings are made from a traveller account. Switch to Sarah from the Demo menu to book.');
      return;
    }
    navigate(target);
  };

  if (!dates.length) {
    return (
      <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60">
        <p className="text-lg font-semibold text-ink">{formatZAR(e.price)} <span className="text-sm font-normal text-ink-500">/ person</span></p>
        <p className="mt-3 text-sm text-ink-600">There are no upcoming dates for this experience right now. Check back soon, or ask local providers for a custom proposal.</p>
        <Button variant="secondary" block className="mt-4" to="/account/requests/new">Request a Custom Experience</Button>
      </div>);

  }

  return (
    <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line/60 sm:p-6">
      <p className="text-2xl font-semibold text-ink">
        {formatZAR(e.price)} <span className="text-sm font-normal text-ink-500">/ person</span>
      </p>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-ink">Date</legend>
        <div className="grid grid-cols-4 gap-1.5">
          {visibleDates.map((d) => {
            const st = dateState(d);
            const disabled = st === 'full' || st === 'blocked';
            const active = d === date;
            return (
              <button
                key={d}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                aria-label={`${formatDate(d)}${disabled ? st === 'full' ? ', fully booked' : ', unavailable' : st === 'low' ? ', few spots left' : ''}`}
                onClick={() => {
                  setDate(d);
                  setSlotId('');
                }}
                className={cn(
                  'flex flex-col items-center rounded-lg border py-1.5 text-xs transition-colors duration-150 ease-out',
                  active ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink-400',
                  disabled && 'cursor-not-allowed border-dashed bg-sand-50 text-ink-400 line-through hover:border-line'
                )}>
                
                <span className={active ? 'text-white/80' : 'text-ink-500'}>{formatDate(d, 'EEE')}</span>
                <span className="font-semibold">{formatDate(d, 'd MMM')}</span>
                {st === 'low' && !active && <span className="text-[10px] font-medium text-clay-700 no-underline">Few left</span>}
                {st === 'full' && <span className="text-[10px] no-underline">Full</span>}
              </button>);

          })}
        </div>
        {dates.length > 8 &&
        <button type="button" onClick={() => setShowAll((s) => !s)} className="mt-2 text-xs font-medium text-clay hover:underline">
            {showAll ? 'Show fewer dates' : `Show all ${dates.length} dates`}
          </button>
        }
      </fieldset>

      {date &&
      <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-medium text-ink">Start time</legend>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((s) => {
            const rem = slotRemaining(s);
            const disabled = s.status === 'blocked' || rem === 0;
            const active = selected?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => setSlotId(s.id)}
                className={cn('rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ease-out', active ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink-400', disabled && 'cursor-not-allowed bg-sand-50 text-ink-400')}>
                
                  <span className="font-semibold">{s.time}</span>
                  <span className={cn('ml-2 text-xs', active ? 'text-white/80' : 'text-ink-500')}>{s.status === 'blocked' ? 'Unavailable' : rem === 0 ? 'Full' : `${rem} of ${s.capacity} left`}</span>
                </button>);

          })}
          </div>
        </fieldset>
      }

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Travellers</p>
          <p className="text-xs text-ink-500">Max {e.maxGuests} per booking</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-ink disabled:opacity-40" aria-label="Fewer travellers">
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-base font-semibold tabular-nums" aria-live="polite">{guests}</span>
          <button type="button" onClick={() => setGuests((g) => Math.min(maxSelectable, g + 1))} disabled={guests >= maxSelectable} className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-ink disabled:opacity-40" aria-label="More travellers">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {tooMany &&
      <p className="mt-3 rounded-lg bg-warning-bg px-3 py-2 text-xs font-medium text-warning" role="alert">
          Only {remaining} spot{remaining === 1 ? '' : 's'} left at {selected?.time} on {formatDate(date, 'd MMM')}. Reduce your group or choose another time.
        </p>
      }

      <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
        <div className="flex justify-between text-ink-600">
          <dt>{formatZAR(e.price)} × {guests} traveller{guests > 1 ? 's' : ''}</dt>
          <dd>{formatZAR(price.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-ink-600">
          <dt>Service fee ({state.settings.serviceFeePercent}%)</dt>
          <dd>{formatZAR(price.fees)}</dd>
        </div>
        <div className="flex justify-between pt-1.5 text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd>{formatZAR(price.total)}</dd>
        </div>
      </dl>

      <Button variant="accent" size="lg" block className="mt-4" disabled={!selected || tooMany || preview} onClick={book}>
        {preview ? 'Preview — booking disabled' : 'Book Experience'}
      </Button>
      <div className="mt-4 space-y-1.5 text-xs text-ink-600">
        <p className="flex items-center gap-2"><RotateCcwIcon className="h-3.5 w-3.5 shrink-0" aria-hidden /> {freeCancellationLabel(e.cancellationPolicy)}</p>
        <p className="flex items-center gap-2"><LockIcon className="h-3.5 w-3.5 shrink-0" aria-hidden /> Secure payment. You won’t be charged until you confirm.</p>
      </div>
    </div>);

}