import React, { useState } from 'react';
import { InboxIcon, UsersIcon, CalendarIcon, WalletIcon } from 'lucide-react';
import type { CustomRequest } from '../../types/marketplace';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { useAction } from '../../hooks/useAction';
import { expressInterest } from '../../utils/requestService';
import { destinations } from '../../data/catalog';
import { isRequestOpen, requestsForProvider, userById } from '../../utils/selectors';
import { requestMeta } from '../../utils/status';
import { formatDate, relativeTime } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { ProposalCard } from '../../components/request/ProposalCard';
import { ProposalFormModal } from '../../components/request/ProposalFormModal';
import { VerificationBanner } from '../../components/provider/VerificationBanner';

type Tab = 'new' | 'sent' | 'won' | 'closed';

export function ProviderRequests() {
  const { provider, approved, state } = useCurrentProvider();
  const { run, pending } = useAction();
  const [tab, setTab] = useState<Tab>('new');
  const [openId, setOpenId] = useState<string | null>(null);
  const [proposing, setProposing] = useState<CustomRequest | null>(null);
  if (!provider) return null;

  const visible = approved ? requestsForProvider(state, provider) : [];
  const myProposals = state.proposals.filter((p) => p.providerId === provider.id);
  const hasSent = (r: CustomRequest) => myProposals.some((p) => p.requestId === r.id && p.status === 'sent');
  const won = (r: CustomRequest) => myProposals.some((p) => p.requestId === r.id && p.status === 'accepted');
  const groups: Record<Tab, CustomRequest[]> = {
    new: visible.filter((r) => isRequestOpen(r) && !hasSent(r)),
    sent: visible.filter((r) => isRequestOpen(r) && hasSent(r)),
    won: visible.filter(won),
    closed: visible.filter((r) => !isRequestOpen(r) && !won(r))
  };
  const list = groups[tab].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const current = state.requests.find((r) => r.id === openId) ?? null;
  const currentProposals = current ? myProposals.filter((p) => p.requestId === current.id) : [];
  const interested = current?.interestedProviderIds.includes(provider.id);

  return (
    <div>
      <PageHeader title="Custom requests" description={`Personalised trip requests from travellers in ${provider.destinations.map((d) => destinations.find((x) => x.id === d)?.name).join(', ') || 'your destinations'}.`} />
      {!approved ?
      <div className="space-y-6">
          <VerificationBanner provider={provider} />
          <EmptyState icon={<InboxIcon className="h-5 w-5" />} title="Requests unlock after verification" message="Once your profile is approved, you’ll see custom requests for your destinations here and can respond with proposals." />
        </div> :

      <>
          <Tabs<Tab> value={tab} onChange={setTab} items={[{ value: 'new', label: 'Open', count: groups.new.length }, { value: 'sent', label: 'Proposal sent', count: groups.sent.length }, { value: 'won', label: 'Accepted', count: groups.won.length }, { value: 'closed', label: 'Closed', count: groups.closed.length }]} />
          <div className="mt-4">
            {list.length === 0 ?
          <EmptyState icon={<InboxIcon className="h-5 w-5" />} title={tab === 'new' ? 'No open requests right now' : 'Nothing here yet'} message={tab === 'new' ? 'We’ll notify you when a traveller submits a request in your destinations.' : 'Requests move here as you send proposals and travellers respond.'} /> :

          <ul className="grid gap-4 lg:grid-cols-2">
                {list.map((r) => {
              const meta = requestMeta[r.status];
              const competitors = state.proposals.filter((p) => p.requestId === r.id && p.providerId !== provider.id && p.status === 'sent').length;
              const age = Math.floor((Date.now() - new Date(r.createdAt).getTime()) / 864e5);
              return (
                <li key={r.id}>
                      <button onClick={() => setOpenId(r.id)} className="flex h-full w-full flex-col rounded-2xl bg-surface p-5 text-left shadow-card ring-1 ring-line/60 transition-shadow duration-150 ease-out hover:shadow-pop">
                        <div className="flex w-full items-center justify-between gap-2">
                          <StatusBadge tone={meta.tone} label={meta.label} />
                          <span className={age >= 7 && isRequestOpen(r) ? 'text-xs font-medium text-clay-700' : 'text-xs text-ink-500'}>{relativeTime(r.createdAt)}</span>
                        </div>
                        <p className="mt-2 line-clamp-2 font-semibold text-ink first-letter:uppercase">{r.title}</p>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-ink-600">
                          <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" aria-hidden />{formatDate(r.startDate, 'd MMM')}</span>
                          <span className="flex items-center gap-1"><UsersIcon className="h-3.5 w-3.5" aria-hidden />{r.guestCount} guests</span>
                          <span className="flex items-center gap-1"><WalletIcon className="h-3.5 w-3.5" aria-hidden />≤ {formatZAR(r.budgetMax)}</span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-ink-600">{r.requirements || r.interests.join(', ')}</p>
                        <div className="flex-1" />
                        <p className="mt-3 text-xs text-ink-500">{competitors ? `${competitors} other proposal${competitors > 1 ? 's' : ''} received` : 'No other proposals yet'}</p>
                      </button>
                    </li>);

            })}
              </ul>
          }
          </div>
        </>
      }

      <Drawer
        open={!!current}
        onClose={() => setOpenId(null)}
        title={current ? current.title.charAt(0).toUpperCase() + current.title.slice(1) : ''}
        subtitle={current && <StatusBadge tone={requestMeta[current.status].tone} label={requestMeta[current.status].label} />}
        footer={
        current && isRequestOpen(current) && !currentProposals.some((p) => p.status === 'sent') ?
        <>
              {!interested && <Button variant="secondary" loading={pending} onClick={() => run(expressInterest, { requestId: current.id }, { success: 'The traveller knows you’re working on a proposal' })}>I’m interested</Button>}
              <Button variant="accent" onClick={() => setProposing(current)}>Send proposal</Button>
            </> :
        undefined
        }>
        
        {current &&
        <div className="space-y-6">
            <dl className="divide-y divide-line text-sm">
              {[
            ['Traveller', `${userById(state, current.travellerId)?.name.split(' ')[0] ?? 'Traveller'} · contact shared after booking`],
            ['Destination', destinations.find((d) => d.id === current.destination)?.name],
            ['Dates', `${formatDate(current.startDate)} – ${formatDate(current.endDate)}${current.flexibleDates ? ' (flexible)' : ''}`],
            ['Group', `${current.guestCount} travellers`],
            ['Budget', `${current.budgetMin ? `${formatZAR(current.budgetMin)} – ` : 'Up to '}${formatZAR(current.budgetMax)}`],
            ['Interests', current.interests.join(', ')],
            ['Pace', current.pace],
            ['Preferences', current.preferences.join(', ') || '—']].
            map(([k, v]) =>
            <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2.5"><dt className="text-ink-500">{k}</dt><dd className="text-ink first-letter:uppercase">{v}</dd></div>
            )}
            </dl>
            {current.requirements &&
          <div>
                <h3 className="text-sm font-semibold text-ink">In their words</h3>
                <p className="mt-1 rounded-xl bg-sand-50 p-4 text-sm leading-relaxed text-ink-700">{current.requirements}</p>
              </div>
          }
            {!isRequestOpen(current) && currentProposals.length === 0 && <p className="text-sm text-ink-600">This request is {current.status.replace('_', ' ')} and no longer accepts proposals.</p>}
            {currentProposals.length > 0 &&
          <div>
                <h3 className="mb-2 text-sm font-semibold text-ink">Your proposal</h3>
                <div className="space-y-3">{currentProposals.map((p) => <ProposalCard key={p.id} proposal={p} />)}</div>
              </div>
          }
          </div>
        }
      </Drawer>
      <ProposalFormModal request={proposing} onClose={() => setProposing(null)} />
    </div>);

}