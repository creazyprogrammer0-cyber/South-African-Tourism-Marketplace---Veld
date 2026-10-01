import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, InboxIcon, CalendarClockIcon, FileEditIcon, AlertTriangleIcon, StarIcon, TicketIcon, CreditCardIcon } from 'lucide-react';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { futureSlots, isUpcoming, providerRating, requestsForProvider, slotRemaining } from '../../utils/selectors';
import { formatDate, daysUntil, todayISO } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { VerificationBanner } from '../../components/provider/VerificationBanner';
import { ReviewList } from '../../components/experience/ReviewList';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export function ProviderDashboard() {
  const { provider, approved, state } = useCurrentProvider();
  const { currentUser } = useMarketplace();

  const data = useMemo(() => {
    if (!provider) return null;
    const bookings = state.bookings.filter((b) => b.providerId === provider.id);
    const upcoming = bookings.filter(isUpcoming).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const month = todayISO().slice(0, 7);
    const earnedThisMonth = bookings.filter((b) => b.paymentStatus === 'paid' && b.date.startsWith(month) && b.bookingStatus !== 'cancelled').reduce((a, b) => a + b.subtotal, 0);
    const exps = state.experiences.filter((e) => e.providerId === provider.id);
    const published = exps.filter((e) => e.status === 'published');
    const drafts = exps.filter((e) => e.status === 'draft');
    const requests = approved ? requestsForProvider(state, provider).filter((r) => ['submitted', 'under_review', 'matched', 'proposal_received', 'customer_reviewing'].includes(r.status) && !state.proposals.some((p) => p.requestId === r.id && p.providerId === provider.id)) : [];
    const pendingPayment = bookings.filter((b) => b.bookingStatus === 'pending_payment');
    const nearlyFull = published.flatMap((e) => futureSlots(state, e.id).filter((s) => s.status === 'open' && s.bookedCapacity > 0 && slotRemaining(s) <= 2).slice(0, 1).map((s) => ({ e, s })));
    const awaitingCompletion = bookings.filter((b) => b.bookingStatus === 'confirmed' && b.date < todayISO());
    return { upcoming, earnedThisMonth, exps, published, drafts, requests, pendingPayment, nearlyFull, awaitingCompletion, reviews: state.reviews.filter((r) => r.providerId === provider.id) };
  }, [provider, approved, state]);

  if (!provider || !data) return null;
  const rating = providerRating(state, provider.id);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const actions = [
  ...(data.requests.length ? [{ icon: InboxIcon, text: `${data.requests.length} custom request${data.requests.length > 1 ? 's' : ''} in your area awaiting a proposal`, to: '/provider/requests', cta: 'Respond' }] : []),
  ...(data.awaitingCompletion.length ? [{ icon: TicketIcon, text: `${data.awaitingCompletion.length} past booking${data.awaitingCompletion.length > 1 ? 's' : ''} to mark as completed`, to: '/provider/bookings', cta: 'Review' }] : []),
  ...data.nearlyFull.slice(0, 2).map(({ e, s }) => ({ icon: AlertTriangleIcon, text: `${e.title} on ${formatDate(s.date, 'd MMM')} has ${slotRemaining(s)} spot${slotRemaining(s) === 1 ? '' : 's'} left`, to: '/provider/availability', cta: 'Manage Availability' })),
  ...(data.drafts.length && approved ? [{ icon: FileEditIcon, text: `${data.drafts.length} draft experience${data.drafts.length > 1 ? 's' : ''} ready to finish and publish`, to: '/provider/experiences', cta: 'Open' }] : []),
  ...(data.pendingPayment.length ? [{ icon: CreditCardIcon, text: `${data.pendingPayment.length} booking${data.pendingPayment.length > 1 ? 's' : ''} awaiting traveller payment — spots aren’t held yet`, to: '/provider/bookings', cta: 'View' }] : [])];


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{greeting}, {currentUser?.name.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-ink-500">{provider.businessName || 'Your provider workspace'}</p>
      </div>

      <VerificationBanner provider={provider} />

      {/* Key numbers, derived from live data */}
      <dl className="grid grid-cols-2 divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60 md:grid-cols-4 md:divide-x">
        {[
        { label: 'Upcoming bookings', value: data.upcoming.length, sub: data.upcoming[0] ? `Next: ${formatDate(data.upcoming[0].date, 'd MMM')}` : 'None scheduled' },
        { label: 'Earned this month', value: formatZAR(data.earnedThisMonth), sub: 'Paid bookings, before payout' },
        { label: 'Rating', value: rating.count ? rating.average.toFixed(1) : '—', sub: `${rating.count} review${rating.count === 1 ? '' : 's'}` },
        { label: 'Live experiences', value: `${data.published.length}`, sub: `${data.exps.length} total · ${data.drafts.length} draft` }].
        map((m) =>
        <div key={m.label} className="border-b border-line p-5 md:border-b-0">
            <dt className="text-xs font-medium text-ink-500">{m.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">{m.value}</dd>
            <dd className="mt-0.5 text-xs text-ink-500">{m.sub}</dd>
          </div>
        )}
      </dl>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="up-h">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="up-h" className="text-base font-semibold text-ink">Upcoming bookings</h2>
            <Link to="/provider/bookings" className="flex items-center gap-1 text-sm font-medium text-clay hover:underline">All bookings <ArrowRightIcon className="h-4 w-4" aria-hidden /></Link>
          </div>
          {data.upcoming.length === 0 ?
          <EmptyState icon={<CalendarClockIcon className="h-5 w-5" />} title="No upcoming bookings" message={approved ? 'When travellers book your experiences, they’ll appear here with guest counts and contact details.' : 'Once you’re verified and publish an experience, bookings will appear here.'} /> :

          <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
              {data.upcoming.slice(0, 6).map((b) => {
              const d = daysUntil(b.date);
              return (
                <li key={b.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-xs font-medium uppercase text-ink-500">{formatDate(b.date, 'MMM')}</p>
                      <p className="text-xl font-semibold leading-tight text-ink">{formatDate(b.date, 'd')}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
                      <p className="text-sm text-ink-600">{b.time} · {b.guestCount} guest{b.guestCount > 1 ? 's' : ''} · {b.contact.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-ink">{formatZAR(b.subtotal)}</p>
                      <p className="text-xs text-ink-500">{d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`}</p>
                    </div>
                  </li>);

            })}
            </ul>
          }
        </section>

        <section aria-labelledby="act-h">
          <h2 id="act-h" className="mb-3 text-base font-semibold text-ink">Needs your attention</h2>
          {actions.length === 0 ?
          <p className="rounded-2xl bg-sand-50 px-5 py-6 text-sm text-ink-600">Nothing urgent. Your listings and bookings are in good shape.</p> :

          <ul className="space-y-2">
              {actions.map((a, i) =>
            <li key={i} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-line/60">
                  <a.icon className="h-4 w-4 shrink-0 text-clay" aria-hidden />
                  <p className="flex-1 text-sm text-ink-700">{a.text}</p>
                  <Button size="sm" variant="secondary" to={a.to}>{a.cta}</Button>
                </li>
            )}
            </ul>
          }

          <div className="mb-3 mt-8 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Recent reviews</h2>
            <Link to="/provider/reviews" className="flex items-center gap-1 text-sm font-medium text-clay hover:underline"><StarIcon className="h-3.5 w-3.5" aria-hidden />All</Link>
          </div>
          <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line/60">
            <ReviewList reviews={data.reviews} showExperience pageSize={2} />
          </div>
        </section>
      </div>
    </div>);

}