import React, { useState } from 'react';
import { TicketIcon, SearchIcon } from 'lucide-react';
import type { Booking } from '../../types/marketplace';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { todayISO } from '../../utils/dates';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { BookingsTable } from '../../components/booking/BookingsTable';
import { BookingDetailDrawer } from '../../components/booking/BookingDetailDrawer';

type Tab = 'upcoming' | 'to_complete' | 'pending' | 'completed' | 'cancelled';
const PAGE = 10;

export function ProviderBookings() {
  const { provider, state } = useCurrentProvider();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Booking | null>(null);
  if (!provider) return null;

  const today = todayISO();
  const mine = state.bookings.filter((b) => b.providerId === provider.id);
  const groups: Record<Tab, Booking[]> = {
    upcoming: mine.filter((b) => b.bookingStatus === 'confirmed' && b.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    to_complete: mine.filter((b) => b.bookingStatus === 'confirmed' && b.date < today),
    pending: mine.filter((b) => b.bookingStatus === 'pending_payment' || b.bookingStatus === 'payment_failed'),
    completed: mine.filter((b) => b.bookingStatus === 'completed').sort((a, b) => b.date.localeCompare(a.date)),
    cancelled: mine.filter((b) => b.bookingStatus === 'cancelled')
  };
  const term = q.trim().toLowerCase();
  const list = groups[tab].filter((b) => !term || `${b.title} ${b.contact.name} ${b.reference}`.toLowerCase().includes(term));
  const pageCount = Math.ceil(list.length / PAGE);

  return (
    <div>
      <PageHeader title="Bookings" description="Everyone booked on your experiences, with contact details and payment status." />
      <div className="relative mb-4 max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
        <input value={q} onChange={(e) => {setQ(e.target.value);setPage(1);}} placeholder="Search traveller, experience or reference" aria-label="Search bookings" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/30" />
      </div>
      <Tabs<Tab>
        value={tab}
        onChange={(t) => {setTab(t);setPage(1);}}
        items={[
        { value: 'upcoming', label: 'Upcoming', count: groups.upcoming.length },
        { value: 'to_complete', label: 'To complete', count: groups.to_complete.length },
        { value: 'pending', label: 'Awaiting payment', count: groups.pending.length },
        { value: 'completed', label: 'Completed', count: groups.completed.length },
        { value: 'cancelled', label: 'Cancelled', count: groups.cancelled.length }]
        } />
      
      <div className="mt-4">
        {list.length === 0 ?
        <EmptyState icon={<TicketIcon className="h-5 w-5" />} title={term ? 'No bookings match your search' : 'No bookings here yet'} message={tab === 'upcoming' ? 'New bookings appear here the moment a traveller’s payment succeeds.' : 'Bookings move here as their status changes.'} /> :

        <>
            <BookingsTable bookings={list.slice((page - 1) * PAGE, page * PAGE)} onOpen={setOpen} amount="subtotal" />
            <Pagination page={page} pageCount={pageCount} onChange={setPage} total={list.length} pageSize={PAGE} />
          </>
        }
      </div>
      <BookingDetailDrawer booking={open} viewer="provider" onClose={() => setOpen(null)} />
    </div>);

}