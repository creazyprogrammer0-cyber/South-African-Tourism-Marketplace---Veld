import React, { useState } from 'react';
import type { NotificationType } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { ActivityFeed } from '../../components/admin/ActivityFeed';
import { cn } from '../../utils/cn';

const filters: {value: '' | NotificationType;label: string;}[] = [
{ value: '', label: 'All' },
{ value: 'booking', label: 'Bookings' },
{ value: 'payment', label: 'Payments' },
{ value: 'request', label: 'Requests' },
{ value: 'proposal', label: 'Proposals' },
{ value: 'application', label: 'Applications' },
{ value: 'experience', label: 'Listings' },
{ value: 'review', label: 'Reviews' },
{ value: 'system', label: 'System' }];


export function AdminActivity() {
  const { state } = useMarketplace();
  const [type, setType] = useState<'' | NotificationType>('');
  const [count, setCount] = useState(30);
  const list = state.activity.filter((a) => !type || a.type === type);
  return (
    <div>
      <PageHeader title="Activity" description="An audit trail of meaningful marketplace events, newest first." />
      <div className="scrollbar-none mb-4 flex gap-2 overflow-x-auto">
        {filters.map((f) =>
        <button key={f.label} onClick={() => setType(f.value)} aria-pressed={type === f.value} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out', type === f.value ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink-700 hover:border-ink-400')}>
            {f.label}
          </button>
        )}
      </div>
      <div className="rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line/60">
        <ActivityFeed events={list.slice(0, count)} />
        {count < list.length &&
        <button onClick={() => setCount((c) => c + 30)} className="mt-2 w-full rounded-lg py-2 text-sm font-medium text-clay hover:bg-sand-50">Load more</button>
        }
      </div>
    </div>);

}