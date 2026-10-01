import React, { useState } from 'react';
import { InboxIcon } from 'lucide-react';
import type { CustomRequest } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { adminSetRequestStatus } from '../../utils/requestService';
import { destinations } from '../../data/catalog';
import { bookingById, isRequestOpen, providerById, userById } from '../../utils/selectors';
import { requestMeta } from '../../utils/status';
import { formatDate, relativeTime } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ProposalCard } from '../../components/request/ProposalCard';

type Tab = 'open' | 'unresolved' | 'won' | 'closed';

export function AdminRequests() {
  const { state } = useMarketplace();
  const { run, pending } = useAction();
  const [tab, setTab] = useState<Tab>('open');
  const [openId, setOpenId] = useState<string | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);

  const noProposals = (r: CustomRequest) => !state.proposals.some((p) => p.requestId === r.id && p.status === 'sent');
  const ageDays = (r: CustomRequest) => Math.floor((Date.now() - new Date(r.createdAt).getTime()) / 864e5);
  const groups: Record<Tab, CustomRequest[]> = {
    open: state.requests.filter(isRequestOpen),
    unresolved: state.requests.filter((r) => isRequestOpen(r) && noProposals(r) && ageDays(r) >= 3),
    won: state.requests.filter((r) => ['accepted', 'booking_created', 'completed'].includes(r.status)),
    closed: state.requests.filter((r) => ['cancelled', 'closed'].includes(r.status))
  };
  const list = groups[tab].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const r = state.requests.find((x) => x.id === openId);
  const proposals = r ? state.proposals.filter((p) => p.requestId === r.id) : [];
  const booking = r ? bookingById(state, r.bookingId) : undefined;

  const close = async () => {
    if (!r) return;
    const res = await run(adminSetRequestStatus, { requestId: r.id, status: 'closed' }, { success: 'Request closed — traveller notified' });
    if (res.ok) setCloseOpen(false);
  };

  return (
    <div>
      <PageHeader title="Custom requests" description="Monitor matching between travellers and providers, and step in when requests stall." />
      <Tabs<Tab> value={tab} onChange={setTab} items={[{ value: 'open', label: 'Open', count: groups.open.length }, { value: 'unresolved', label: 'No proposals 3+ days', count: groups.unresolved.length }, { value: 'won', label: 'Accepted & booked', count: groups.won.length }, { value: 'closed', label: 'Cancelled / closed', count: groups.closed.length }]} />
      <div className="mt-4">
        {list.length === 0 ?
        <EmptyState icon={<InboxIcon className="h-5 w-5" />} title="Nothing here" message={tab === 'unresolved' ? 'Every open request has at least one proposal or is less than 3 days old.' : 'Requests appear here as their status changes.'} /> :

        <div className="overflow-x-auto rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line bg-sand-50 text-xs text-ink-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Request</th>
                  <th scope="col" className="px-4 py-3 font-medium">Traveller</th>
                  <th scope="col" className="px-4 py-3 font-medium">Destination</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Budget</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Proposals</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((x) =>
              <tr key={x.id} onClick={() => setOpenId(x.id)} className="cursor-pointer hover:bg-sand-50">
                    <td className="max-w-[260px] px-4 py-3"><button onClick={(e) => {e.stopPropagation();setOpenId(x.id);}} className="block max-w-full truncate text-left font-medium text-ink hover:underline first-letter:uppercase">{x.title}</button></td>
                    <td className="px-4 py-3 text-ink-700">{userById(state, x.travellerId)?.name}</td>
                    <td className="px-4 py-3 text-ink-700">{destinations.find((d) => d.id === x.destination)?.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-700">{formatZAR(x.budgetMax)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-700">{state.proposals.filter((p) => p.requestId === x.id).length}</td>
                    <td className="px-4 py-3"><StatusBadge tone={requestMeta[x.status].tone} label={requestMeta[x.status].label} /></td>
                    <td className={`px-4 py-3 ${isRequestOpen(x) && ageDays(x) >= 3 && noProposals(x) ? 'font-medium text-clay-700' : 'text-ink-500'}`}>{ageDays(x)}d</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
      </div>

      <Drawer
        open={!!r}
        onClose={() => setOpenId(null)}
        title={r ? r.title.charAt(0).toUpperCase() + r.title.slice(1) : ''}
        subtitle={r && <StatusBadge tone={requestMeta[r.status].tone} label={requestMeta[r.status].label} />}
        footer={r && isRequestOpen(r) ?
        <>
            {r.status === 'submitted' && <Button variant="secondary" loading={pending} onClick={() => run(adminSetRequestStatus, { requestId: r.id, status: 'under_review' }, { success: 'Marked under review — traveller notified' })}>Mark under review</Button>}
            <Button variant="ghost" className="text-danger hover:bg-danger-bg" onClick={() => setCloseOpen(true)}>Close request</Button>
          </> :
        undefined}>
        
        {r &&
        <div className="space-y-6">
            <dl className="divide-y divide-line text-sm">
              {[
            ['Traveller', `${userById(state, r.travellerId)?.name} · ${userById(state, r.travellerId)?.email}`],
            ['Destination', destinations.find((d) => d.id === r.destination)?.name],
            ['Dates', `${formatDate(r.startDate)} – ${formatDate(r.endDate)}`],
            ['Group / budget', `${r.guestCount} · ${r.budgetMin ? `${formatZAR(r.budgetMin)}–` : 'up to '}${formatZAR(r.budgetMax)}`],
            ['Interests', r.interests.join(', ')],
            ['Interested', r.interestedProviderIds.map((id) => providerById(state, id)?.businessName).join(', ') || 'None yet'],
            ['Linked booking', booking ? `${booking.reference} · ${booking.bookingStatus.replace('_', ' ')}` : '—'],
            ['Submitted', relativeTime(r.createdAt)]].
            map(([k, v]) => <div key={k} className="grid grid-cols-[120px_1fr] gap-3 py-2.5"><dt className="text-ink-500">{k}</dt><dd className="text-ink">{v}</dd></div>)}
            </dl>
            {r.requirements && <p className="rounded-xl bg-sand-50 p-4 text-sm leading-relaxed text-ink-700">{r.requirements}</p>}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Proposals ({proposals.length})</h3>
              {proposals.length ? <div className="space-y-3">{proposals.map((p) => <ProposalCard key={p.id} proposal={p} />)}</div> : <p className="text-sm text-ink-500">No proposals yet.</p>}
            </div>
          </div>
        }
      </Drawer>
      <ConfirmDialog open={closeOpen} onClose={() => setCloseOpen(false)} onConfirm={close} loading={pending} tone="danger" title="Close this request?" confirmLabel="Close request">
        <p className="text-sm text-ink-700">Open proposals are withdrawn and the traveller is notified. Closed requests can’t receive new proposals.</p>
      </ConfirmDialog>
    </div>);

}