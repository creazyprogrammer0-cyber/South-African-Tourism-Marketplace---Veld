import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheckIcon, StarIcon, ChevronDownIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import type { Proposal } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { isProposalExpired, providerById, providerRating } from '../../utils/selectors';
import { proposalMeta } from '../../utils/status';
import { formatDate } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { StatusBadge } from '../ui/StatusBadge';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

export function ProposalCard({ proposal: p, actions, defaultOpen }: {proposal: Proposal;actions?: React.ReactNode;defaultOpen?: boolean;}) {
  const { state } = useMarketplace();
  const [open, setOpen] = useState(!!defaultOpen);
  const provider = providerById(state, p.providerId);
  const rating = provider ? providerRating(state, provider.id) : null;
  const expired = isProposalExpired(p);
  const meta = proposalMeta[expired ? 'expired' : p.status];

  return (
    <article className={cn('overflow-hidden rounded-2xl bg-surface shadow-card ring-1', p.status === 'accepted' ? 'ring-olive' : 'ring-line/60')}>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {provider &&
          <div className="flex items-center gap-3">
              <Avatar name={provider.contactName} src={provider.photo} />
              <div>
                <Link to={`/providers/${provider.id}`} className="flex items-center gap-1 text-sm font-semibold text-ink hover:underline">
                  {provider.businessName} <BadgeCheckIcon className="h-4 w-4 text-olive" aria-label="Verified" />
                </Link>
                {rating && rating.count > 0 &&
              <p className="flex items-center gap-1 text-xs text-ink-500"><StarIcon className="h-3 w-3 fill-clay text-clay" aria-hidden />{rating.average.toFixed(1)} · {rating.count} reviews</p>
              }
              </div>
            </div>
          }
          <StatusBadge tone={meta.tone} label={meta.label} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-600">
          <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" aria-hidden />Starts {formatDate(p.date, 'EEE d MMM')}</span>
          <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" aria-hidden />{p.duration}</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-ink-500">Total for your group</p>
            <p className="text-2xl font-semibold text-ink">{formatZAR(p.price)}</p>
          </div>
          {p.status === 'sent' && <p className="text-right text-xs text-ink-500">{expired ? 'Expired' : 'Valid until'} {formatDate(p.validUntil, 'd MMM')}</p>}
        </div>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-4 flex items-center gap-1 text-sm font-medium text-clay hover:underline">
          {open ? 'Hide itinerary' : `View itinerary (${p.itinerary.length} ${p.itinerary.length === 1 ? 'part' : 'days'})`}
          <ChevronDownIcon className={cn('h-4 w-4 transition-transform duration-200 ease-out', open && 'rotate-180')} aria-hidden />
        </button>
        <AnimatePresence initial={false}>
          {open &&
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
              <ol className="mt-4 space-y-4 border-l border-line pl-5">
                {p.itinerary.map((it) =>
              <li key={it.day} className="relative">
                    <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-clay" aria-hidden />
                    <p className="text-xs font-medium text-ink-500">Day {it.day}</p>
                    <p className="text-sm font-semibold text-ink">{it.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-700">{it.detail}</p>
                  </li>
              )}
              </ol>
              {(p.notes || p.availabilityNote) &&
            <dl className="mt-5 space-y-2 rounded-xl bg-sand-50 p-4 text-sm">
                  {p.notes && <div><dt className="font-medium text-ink">Notes</dt><dd className="text-ink-700">{p.notes}</dd></div>}
                  {p.availabilityNote && <div><dt className="font-medium text-ink">Availability</dt><dd className="text-ink-700">{p.availabilityNote}</dd></div>}
                </dl>
            }
            </motion.div>
          }
        </AnimatePresence>
      </div>
      {actions && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-sand-50 px-5 py-3">{actions}</div>}
    </article>);

}