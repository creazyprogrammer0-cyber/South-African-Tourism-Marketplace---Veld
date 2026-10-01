import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import type { Review } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { moderateReview } from '../../utils/reviewService';
import { bookingById, experienceById, providerById, userById } from '../../utils/selectors';
import { relativeTime } from '../../utils/dates';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Stars } from '../../components/ui/Stars';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Field, Textarea } from '../../components/ui/FormControls';
import { StatusBadge } from '../../components/ui/StatusBadge';

type Tab = 'flagged' | 'published' | 'removed';

export function AdminReviews() {
  const { state } = useMarketplace();
  const { run, pending } = useAction();
  const [tab, setTab] = useState<Tab>('flagged');
  const [target, setTarget] = useState<Review | null>(null);
  const [note, setNote] = useState('Contains personal contact details, which our review guidelines don’t allow.');
  const groups: Record<Tab, Review[]> = {
    flagged: state.reviews.filter((r) => r.status === 'flagged'),
    published: state.reviews.filter((r) => r.status === 'published'),
    removed: state.reviews.filter((r) => r.status === 'removed')
  };
  const list = groups[tab].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const remove = async () => {
    if (!target) return;
    const res = await run(moderateReview, { reviewId: target.id, action: 'remove', note }, { success: 'Review removed — ratings recalculated' });
    if (res.ok) setTarget(null);
  };

  return (
    <div>
      <PageHeader title="Reviews" description="Only travellers with a completed booking can review. Removed reviews no longer count toward ratings." />
      <Tabs<Tab> value={tab} onChange={setTab} items={[{ value: 'flagged', label: 'Flagged', count: groups.flagged.length }, { value: 'published', label: 'Published', count: groups.published.length }, { value: 'removed', label: 'Removed', count: groups.removed.length }]} />
      <div className="mt-4">
        {list.length === 0 ?
        <EmptyState icon={<StarIcon className="h-5 w-5" />} title={tab === 'flagged' ? 'No flagged reviews' : 'No reviews here'} message={tab === 'flagged' ? 'Reviews that contain contact details or abusive language are flagged here automatically.' : 'Reviews move here as they’re moderated.'} /> :

        <ul className="space-y-3">
            {list.map((r) => {
            const author = userById(state, r.travellerId);
            const provider = providerById(state, r.providerId);
            const exp = experienceById(state, r.experienceId);
            const booking = bookingById(state, r.bookingId);
            return (
              <li key={r.id} className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line/60">
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars value={r.rating} />
                    <span className="text-sm font-medium text-ink">{author?.name}</span>
                    <span className="text-xs text-ink-500">{relativeTime(r.createdAt)}</span>
                    {r.status === 'flagged' && <StatusBadge tone="warning" label="Flagged" />}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{r.comment}</p>
                  <p className="mt-3 text-xs text-ink-500">
                    {exp ? <Link to={`/experiences/${exp.id}`} className="hover:underline">{exp.title}</Link> : 'Custom experience'} · {provider?.businessName} · booking {booking?.reference ?? r.bookingId} ({booking?.bookingStatus})
                  </p>
                  {r.moderationNote && <p className="mt-1 text-xs text-ink-600">Moderation note: {r.moderationNote}</p>}
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                    {r.status !== 'removed' && <Button size="sm" variant="ghost" className="text-danger hover:bg-danger-bg" onClick={() => setTarget(r)}>Remove review</Button>}
                    {r.status !== 'published' && <Button size="sm" variant="secondary" loading={pending} onClick={() => run(moderateReview, { reviewId: r.id, action: 'restore' }, { success: 'Review published' })}>{r.status === 'flagged' ? 'Approve & publish' : 'Restore'}</Button>}
                  </div>
                </li>);

          })}
          </ul>
        }
      </div>
      <Modal open={!!target} onClose={() => setTarget(null)} size="sm" title="Remove this review?" footer={<><Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button><Button variant="danger" onClick={remove} loading={pending}>Remove review</Button></>}>
        <p className="mb-4 text-sm text-ink-700">It will be hidden from the marketplace and excluded from provider and experience ratings. You can restore it later.</p>
        <Field label="Internal moderation note">{(p) => <Textarea {...p} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />}</Field>
      </Modal>
    </div>);

}