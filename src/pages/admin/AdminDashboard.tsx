import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, FileCheck2Icon, FlagIcon, InboxIcon, CreditCardIcon, TicketIcon } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { isProviderLive, isRequestOpen, isUpcoming, publicExperiences } from '../../utils/selectors';
import { todayISO, isoDaysAgo } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { ActivityFeed } from '../../components/admin/ActivityFeed';
import { ReviewList } from '../../components/experience/ReviewList';
import { Button } from '../../components/ui/Button';

export function AdminDashboard() {
  const { state } = useMarketplace();
  const d = useMemo(() => {
    const pendingApps = state.providers.filter((p) => ['submitted', 'under_review'].includes(p.verificationStatus)).sort((a, b) => (a.submittedAt ?? '').localeCompare(b.submittedAt ?? ''));
    const flagged = state.reviews.filter((r) => r.status === 'flagged');
    const openRequests = state.requests.filter(isRequestOpen);
    const stale = openRequests.filter((r) => !state.proposals.some((p) => p.requestId === r.id && p.status === 'sent') && Date.now() - new Date(r.createdAt).getTime() > 3 * 864e5);
    const weekAgo = isoDaysAgo(7);
    const failed = state.bookings.filter((b) => b.bookingStatus === 'payment_failed' && b.createdAt >= weekAgo);
    const toComplete = state.bookings.filter((b) => b.bookingStatus === 'confirmed' && b.date < todayISO());
    const monthAgo = isoDaysAgo(30);
    const gmv = state.bookings.filter((b) => b.paymentStatus === 'paid' && b.createdAt >= monthAgo).reduce((a, b) => a + b.total, 0);
    const fees = state.bookings.filter((b) => b.paymentStatus === 'paid' && b.createdAt >= monthAgo).reduce((a, b) => a + b.fees, 0);
    return {
      pendingApps, flagged, openRequests, stale, failed, toComplete, gmv, fees,
      liveProviders: state.providers.filter((p) => isProviderLive(state, p)).length,
      published: publicExperiences(state).length,
      upcoming: state.bookings.filter(isUpcoming).length
    };
  }, [state]);

  const queue = [
  { show: d.pendingApps.length > 0, icon: FileCheck2Icon, title: `${d.pendingApps.length} provider application${d.pendingApps.length === 1 ? '' : 's'} awaiting review`, sub: d.pendingApps[0] ? `Oldest: ${d.pendingApps[0].businessName}` : '', to: '/admin/applications', cta: 'Review Application' },
  { show: d.flagged.length > 0, icon: FlagIcon, title: `${d.flagged.length} flagged review${d.flagged.length === 1 ? '' : 's'}`, sub: 'Possible contact details or abusive language', to: '/admin/reviews', cta: 'Moderate' },
  { show: d.stale.length > 0, icon: InboxIcon, title: `${d.stale.length} custom request${d.stale.length === 1 ? '' : 's'} with no proposals after 3+ days`, sub: d.stale.map((r) => r.title).slice(0, 1).join(''), to: '/admin/requests', cta: 'View requests' },
  { show: d.failed.length > 0, icon: CreditCardIcon, title: `${d.failed.length} failed payment${d.failed.length === 1 ? '' : 's'} this week`, sub: 'Travellers can retry from My Bookings', to: '/admin/bookings', cta: 'Inspect' },
  { show: d.toComplete.length > 0, icon: TicketIcon, title: `${d.toComplete.length} past booking${d.toComplete.length === 1 ? '' : 's'} not yet marked completed`, sub: 'Reviews unlock once completed', to: '/admin/bookings', cta: 'View' }].
  filter((q) => q.show);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Marketplace overview</h1>
        <p className="mt-1 text-sm text-ink-500">Trust, operations and activity across travellers and providers.</p>
      </div>

      <section aria-labelledby="queue-h">
        <h2 id="queue-h" className="mb-3 text-base font-semibold text-ink">Needs action</h2>
        {queue.length === 0 ?
        <p className="rounded-2xl bg-sand-50 px-5 py-6 text-sm text-ink-600">The queue is clear. Nothing needs admin attention right now.</p> :

        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
            {queue.map((q) =>
          <li key={q.title} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay-100 text-clay-700"><q.icon className="h-4 w-4" aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{q.title}</p>
                  {q.sub && <p className="truncate text-sm text-ink-500 first-letter:uppercase">{q.sub}</p>}
                </div>
                <Button size="sm" variant="secondary" to={q.to}>{q.cta}</Button>
              </li>
          )}
          </ul>
        }
      </section>

      <dl className="grid grid-cols-2 overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60 md:grid-cols-3 xl:grid-cols-6">
        {[
        { label: 'Live providers', value: d.liveProviders, sub: `${state.providers.length} total`, to: '/admin/providers' },
        { label: 'Pending applications', value: d.pendingApps.length, sub: 'Submitted or in review', to: '/admin/applications' },
        { label: 'Published experiences', value: d.published, sub: `${state.experiences.length} total`, to: '/admin/experiences' },
        { label: 'Upcoming bookings', value: d.upcoming, sub: 'Confirmed & paid', to: '/admin/bookings' },
        { label: 'Open custom requests', value: d.openRequests.length, sub: `${d.stale.length} without proposals`, to: '/admin/requests' },
        { label: 'Paid bookings · 30 days', value: formatZAR(d.gmv), sub: `${formatZAR(d.fees)} service fees`, to: '/admin/bookings' }].
        map((m) =>
        <Link key={m.label} to={m.to} className="border-b border-r border-line p-5 transition-colors duration-150 ease-out hover:bg-sand-50">
            <dt className="text-xs font-medium text-ink-500">{m.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{m.value}</dd>
            <dd className="text-xs text-ink-500">{m.sub}</dd>
          </Link>
        )}
      </dl>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line/60">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Recent activity</h2>
            <Link to="/admin/activity" className="flex items-center gap-1 text-sm font-medium text-clay hover:underline">All activity <ArrowRightIcon className="h-4 w-4" aria-hidden /></Link>
          </div>
          <ActivityFeed events={state.activity.slice(0, 9)} />
        </section>
        <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line/60">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Recent reviews</h2>
            <Link to="/admin/reviews" className="text-sm font-medium text-clay hover:underline">Moderate</Link>
          </div>
          <ReviewList reviews={state.reviews} showExperience pageSize={3} />
        </section>
      </div>
    </div>);

}