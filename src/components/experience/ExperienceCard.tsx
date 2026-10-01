import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, BadgeCheckIcon, ClockIcon } from 'lucide-react';
import type { Experience } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { categories, destinations } from '../../data/catalog';
import { experienceRating, nextAvailable, providerById, slotRemaining } from '../../utils/selectors';
import { formatDuration, formatZAR } from '../../utils/format';
import { formatDate } from '../../utils/dates';
import { freeCancellationLabel } from '../../utils/policies';
import { SafeImage } from '../ui/SafeImage';

export function ExperienceCard({ experience: e, guests = 1 }: {experience: Experience;guests?: number;}) {
  const { state } = useMarketplace();
  const rating = experienceRating(state, e.id);
  const provider = providerById(state, e.providerId);
  const next = nextAvailable(state, e.id, guests);
  const dest = destinations.find((d) => d.id === e.destination)?.name;
  const cat = categories.find((c) => c.id === e.category)?.name;
  const low = next && slotRemaining(next) <= 2;

  return (
    <Link
      to={`/experiences/${e.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-pop">
      
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage src={e.images[0]} alt={e.title} className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        {cat && <span className="absolute left-3 top-3 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-medium text-ink">{cat}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-ink-500">
          <span className="truncate">{dest}</span>
          {rating.count > 0 ?
          <span className="flex shrink-0 items-center gap-1 font-medium text-ink">
              <StarIcon className="h-3.5 w-3.5 fill-clay text-clay" aria-hidden />
              {rating.average.toFixed(1)}
              <span className="font-normal text-ink-500">({rating.count})</span>
            </span> :

          <span className="shrink-0">New</span>
          }
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{e.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
          <ClockIcon className="h-3.5 w-3.5" aria-hidden />
          {formatDuration(e.durationHours)} · up to {e.maxGuests} guests
        </p>
        {provider &&
        <p className="mt-2 flex items-center gap-1 truncate text-xs text-ink-600">
            <BadgeCheckIcon className="h-3.5 w-3.5 shrink-0 text-olive" aria-label="Verified provider" />
            <span className="truncate">{provider.businessName}</span>
          </p>
        }
        <div className="flex-1" />
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
          <div>
            <p className="text-xs text-ink-500">From</p>
            <p className="text-base font-semibold text-ink">
              {formatZAR(e.price)} <span className="text-xs font-normal text-ink-500">/ person</span>
            </p>
          </div>
          <div className="text-right text-xs">
            {next ?
            <p className={low ? 'font-medium text-clay-700' : 'text-ink-600'}>
                {low ? `${slotRemaining(next)} left · ` : 'Next: '}
                {formatDate(next.date, 'EEE d MMM')}
              </p> :

            <p className="text-ink-500">No dates available</p>
            }
            <p className="mt-0.5 hidden text-ink-500 sm:block">{freeCancellationLabel(e.cancellationPolicy).replace('Free cancellation up to', 'Free cancel')}</p>
          </div>
        </div>
      </div>
    </Link>);

}

export function ExperienceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60" aria-hidden>
      <div className="aspect-[4/3] animate-pulse bg-sand-200/70" />
      <div className="space-y-2.5 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-sand-200/70" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-sand-200/70" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-sand-200/70" />
        <div className="h-8 w-full animate-pulse rounded bg-sand-200/70" />
      </div>
    </div>);

}