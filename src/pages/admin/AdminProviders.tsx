import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, UsersIcon } from 'lucide-react';
import type { ProviderProfile } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { setProviderSuspended } from '../../utils/providerService';
import { destinations } from '../../data/catalog';
import { providerRating, userById } from '../../utils/selectors';
import { verificationMeta } from '../../utils/status';
import { formatZAR } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Avatar } from '../../components/ui/Avatar';

export function AdminProviders() {
  const { state } = useMarketplace();
  const { run, pending } = useAction();
  const [q, setQ] = useState('');
  const [target, setTarget] = useState<ProviderProfile | null>(null);
  const term = q.trim().toLowerCase();
  const list = state.providers.
  filter((p) => p.verificationStatus === 'approved').
  filter((p) => !term || `${p.businessName} ${p.contactName}`.toLowerCase().includes(term));
  const suspended = target ? userById(state, target.userId)?.status === 'suspended' : false;

  const toggle = async () => {
    if (!target) return;
    const res = await run(setProviderSuspended, { providerId: target.id, suspended: !suspended }, { success: suspended ? 'Provider reinstated' : 'Provider suspended — listings hidden' });
    if (res.ok) setTarget(null);
  };

  return (
    <div>
      <PageHeader title="Providers" description={`${list.length} verified providers. Applications in progress are under Applications.`} />
      <div className="relative mb-4 max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search providers" aria-label="Search providers" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/30" />
      </div>
      {list.length === 0 ?
      <EmptyState icon={<UsersIcon className="h-5 w-5" />} title="No providers found" message="Try a different search." /> :

      <div className="overflow-x-auto rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-sand-50 text-xs text-ink-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Provider</th>
                <th scope="col" className="px-4 py-3 font-medium">Destinations</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Rating</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Live listings</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Paid bookings</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((p) => {
              const user = userById(state, p.userId);
              const r = providerRating(state, p.id);
              const live = state.experiences.filter((e) => e.providerId === p.id && e.status === 'published').length;
              const paid = state.bookings.filter((b) => b.providerId === p.id && b.paymentStatus === 'paid');
              const isSusp = user?.status === 'suspended';
              return (
                <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.contactName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{p.businessName}</p>
                          <p className="truncate text-xs text-ink-500">{p.contactName} · {user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-700">{p.destinations.map((d) => destinations.find((x) => x.id === d)?.name).join(', ')}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-700">{r.count ? `${r.average.toFixed(1)} (${r.count})` : '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-700">{live}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-700">{paid.length}<span className="block text-xs text-ink-500">{formatZAR(paid.reduce((a, b) => a + b.subtotal, 0))}</span></td>
                    <td className="px-4 py-3">{isSusp ? <StatusBadge tone="danger" label="Suspended" /> : <StatusBadge tone={verificationMeta.approved.tone} label="Verified · active" />}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {!isSusp && <Link to={`/providers/${p.id}`} className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-700 hover:bg-sand-100">Profile</Link>}
                        <Button size="sm" variant="ghost" className={isSusp ? '' : 'text-danger hover:bg-danger-bg'} onClick={() => setTarget(p)}>{isSusp ? 'Reinstate' : 'Suspend'}</Button>
                      </div>
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      }
      <ConfirmDialog open={!!target} onClose={() => setTarget(null)} onConfirm={toggle} loading={pending} tone={suspended ? 'primary' : 'danger'} title={suspended ? `Reinstate ${target?.businessName}?` : `Suspend ${target?.businessName}?`} confirmLabel={suspended ? 'Reinstate' : 'Suspend provider'}>
        <p className="text-sm text-ink-700">{suspended ? 'Their published experiences will reappear in discovery.' : 'Their experiences are hidden from discovery and they can’t take new bookings. Existing confirmed bookings remain and should be reviewed separately.'}</p>
      </ConfirmDialog>
    </div>);

}