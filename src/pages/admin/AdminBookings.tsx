import React, { useState } from 'react';
import { SearchIcon, TicketIcon } from 'lucide-react';
import type { Booking } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { providerById } from '../../utils/selectors';
import { bookingDisplayKey, BookingDisplayKey, bookingDisplayMeta } from '../../utils/status';
import { PageHeader } from '../../components/ui/PageHeader';
import { Select } from '../../components/ui/FormControls';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { BookingsTable } from '../../components/booking/BookingsTable';
import { BookingDetailDrawer } from '../../components/booking/BookingDetailDrawer';

const PAGE = 12;

export function AdminBookings() {
  const { state } = useMarketplace();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'' | BookingDisplayKey>('');
  const [type, setType] = useState<'' | 'experience' | 'custom'>('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Booking | null>(null);
  const term = q.trim().toLowerCase();
  const list = state.bookings.
  filter((b) => (!status || bookingDisplayKey(b) === status) && (!type || (type === 'custom' ? !!b.customRequestId : !b.customRequestId))).
  filter((b) => !term || `${b.reference} ${b.title} ${b.contact.name} ${b.contact.email} ${providerById(state, b.providerId)?.businessName}`.toLowerCase().includes(term)).
  sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pageCount = Math.ceil(list.length / PAGE);
  const reset = () => setPage(1);

  return (
    <div>
      <PageHeader title="Bookings" description={`${state.bookings.length} bookings including historical completed trips.`} />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_200px_180px]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
          <input value={q} onChange={(e) => {setQ(e.target.value);reset();}} placeholder="Reference, traveller, provider or experience" aria-label="Search bookings" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/30" />
        </div>
        <Select aria-label="Status" value={status} onChange={(e) => {setStatus(e.target.value as BookingDisplayKey | '');reset();}}>
          <option value="">All statuses</option>
          {(Object.keys(bookingDisplayMeta) as BookingDisplayKey[]).map((k) => <option key={k} value={k}>{bookingDisplayMeta[k].label}{k === 'awaiting_completion' ? ' (past date)' : ''}</option>)}
        </Select>
        <Select aria-label="Type" value={type} onChange={(e) => {setType(e.target.value as '' | 'experience' | 'custom');reset();}}>
          <option value="">All types</option><option value="experience">Fixed experiences</option><option value="custom">Custom requests</option>
        </Select>
      </div>
      {list.length === 0 ?
      <EmptyState icon={<TicketIcon className="h-5 w-5" />} title="No bookings match" message="Adjust filters or search by booking reference." /> :

      <>
          <BookingsTable bookings={list.slice((page - 1) * PAGE, page * PAGE)} onOpen={setOpen} showProvider />
          <Pagination page={page} pageCount={pageCount} onChange={setPage} total={list.length} pageSize={PAGE} />
        </>
      }
      <BookingDetailDrawer booking={open} viewer="admin" onClose={() => setOpen(null)} />
    </div>);

}