import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import type { Booking } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { providerById } from '../../utils/selectors';
import { bookingDisplayKey, bookingDisplayMeta, paymentMeta } from '../../utils/status';
import { formatDate } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { StatusBadge } from '../ui/StatusBadge';

/** Responsive bookings list: table on desktop, stacked rows on mobile. */
export function BookingsTable({ bookings, onOpen, showProvider, amount = 'total' }: {bookings: Booking[];onOpen: (b: Booking) => void;showProvider?: boolean;amount?: 'total' | 'subtotal';}) {
  const { state } = useMarketplace();
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b border-line bg-sand-50 text-xs font-medium text-ink-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Booking</th>
            <th scope="col" className="px-4 py-3 font-medium">Date</th>
            <th scope="col" className="px-4 py-3 font-medium">Traveller</th>
            {showProvider && <th scope="col" className="px-4 py-3 font-medium">Provider</th>}
            <th scope="col" className="px-4 py-3 text-right font-medium">Guests</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">{amount === 'subtotal' ? 'Payout' : 'Total'}</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="w-8 px-2"><span className="sr-only">Open</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {bookings.map((b) => {
            const meta = bookingDisplayMeta[bookingDisplayKey(b)];
            const pay = paymentMeta[b.paymentStatus];
            return (
              <tr key={b.id} onClick={() => onOpen(b)} className="cursor-pointer transition-colors duration-150 ease-out hover:bg-sand-50">
                <td className="max-w-[280px] px-4 py-3">
                  <button onClick={(e) => {e.stopPropagation();onOpen(b);}} className="block max-w-full truncate text-left font-medium text-ink hover:underline">{b.title}</button>
                  <span className="text-xs text-ink-500">{b.reference}{b.customRequestId ? ' · custom' : ''}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-700">{formatDate(b.date, 'd MMM yyyy')}<span className="block text-xs text-ink-500">{b.time}</span></td>
                <td className="px-4 py-3 text-ink-700">{b.contact.name}</td>
                {showProvider && <td className="px-4 py-3 text-ink-700">{providerById(state, b.providerId)?.businessName}</td>}
                <td className="px-4 py-3 text-right tabular-nums text-ink-700">{b.guestCount}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-ink">{formatZAR(amount === 'subtotal' ? b.subtotal : b.total)}</td>
                <td className="px-4 py-3"><div className="flex flex-col items-start gap-1"><StatusBadge tone={meta.tone} label={meta.label} />{b.paymentStatus !== 'paid' && <StatusBadge tone={pay.tone} label={pay.label} />}</div></td>
                <td className="px-2"><ChevronRightIcon className="h-4 w-4 text-ink-400" aria-hidden /></td>
              </tr>);

          })}
        </tbody>
      </table>
      <ul className="divide-y divide-line md:hidden">
        {bookings.map((b) => {
          const meta = bookingDisplayMeta[bookingDisplayKey(b)];
          return (
            <li key={b.id}>
              <button onClick={() => onOpen(b)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <div className="min-w-0 flex-1">
                  <StatusBadge tone={meta.tone} label={meta.label} />
                  <p className="mt-1 truncate text-sm font-semibold text-ink">{b.title}</p>
                  <p className="text-xs text-ink-600">{formatDate(b.date, 'd MMM')} · {b.time} · {b.guestCount} guests · {b.contact.name}</p>
                </div>
                <p className="text-sm font-medium text-ink">{formatZAR(amount === 'subtotal' ? b.subtotal : b.total)}</p>
              </button>
            </li>);

        })}
      </ul>
    </div>);

}