import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, MapIcon } from 'lucide-react';
import type { Experience, ExperienceStatus } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { moderateExperience } from '../../utils/experienceService';
import { destinations } from '../../data/catalog';
import { experienceRating, isExperiencePublic, providerById } from '../../utils/selectors';
import { experienceMeta, verificationMeta } from '../../utils/status';
import { formatZAR } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select, Field, Textarea } from '../../components/ui/FormControls';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { SafeImage } from '../../components/ui/SafeImage';

const PAGE = 10;

export function AdminExperiences() {
  const { state } = useMarketplace();
  const { run, pending } = useAction();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'' | ExperienceStatus>('');
  const [dest, setDest] = useState('');
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<Experience | null>(null);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');

  const term = q.trim().toLowerCase();
  const list = state.experiences.filter((e) => (!status || e.status === status) && (!dest || e.destination === dest) && (!term || `${e.title} ${providerById(state, e.providerId)?.businessName}`.toLowerCase().includes(term)));
  const pageCount = Math.ceil(list.length / PAGE);

  const unpublish = async () => {
    if (!target) return;
    if (note.trim().length < 10) return setNoteError('Explain the reason (10+ characters) so the provider can fix it.');
    const res = await run(moderateExperience, { id: target.id, action: 'unpublish', note }, { success: 'Listing unpublished — provider notified' });
    if (res.ok) {setTarget(null);setNote('');}
  };

  return (
    <div>
      <PageHeader title="Experiences" description={`${state.experiences.filter((e) => isExperiencePublic(state, e)).length} visible to travellers · ${state.experiences.length} total listings`} />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px_200px]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
          <input value={q} onChange={(e) => {setQ(e.target.value);setPage(1);}} placeholder="Search title or provider" aria-label="Search experiences" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/30" />
        </div>
        <Select aria-label="Status" value={status} onChange={(e) => {setStatus(e.target.value as ExperienceStatus | '');setPage(1);}}>
          <option value="">All statuses</option><option value="published">Published</option><option value="unpublished">Unpublished</option><option value="draft">Draft</option>
        </Select>
        <Select aria-label="Destination" value={dest} onChange={(e) => {setDest(e.target.value);setPage(1);}}>
          <option value="">All destinations</option>
          {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </Select>
      </div>
      {list.length === 0 ?
      <EmptyState icon={<MapIcon className="h-5 w-5" />} title="No experiences match" message="Adjust the filters or search." /> :

      <>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
            {list.slice((page - 1) * PAGE, page * PAGE).map((e) => {
            const p = providerById(state, e.providerId);
            const r = experienceRating(state, e.id);
            const visible = isExperiencePublic(state, e);
            return (
              <li key={e.id} className="flex flex-col gap-3 px-4 py-3.5 md:flex-row md:items-center">
                  <SafeImage src={e.images[0]} alt="" className="hidden h-12 w-16 shrink-0 rounded-lg md:block" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink" title={e.title}>{e.title}</p>
                    <p className="truncate text-xs text-ink-500">
                      {p?.businessName} {p && p.verificationStatus !== 'approved' && `(${verificationMeta[p.verificationStatus].label.toLowerCase()})`} · {destinations.find((d) => d.id === e.destination)?.name} · {formatZAR(e.price)} pp · {r.count ? `★ ${r.average.toFixed(1)} (${r.count})` : 'no reviews'}
                    </p>
                    {e.moderationNote && <p className="mt-0.5 text-xs text-danger">Moderation: {e.moderationNote}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={experienceMeta[e.status].tone} label={experienceMeta[e.status].label} />
                    {e.status === 'published' && !visible && <StatusBadge tone="warning" label="Hidden · provider inactive" />}
                    <Link to={`/experiences/${e.id}`} className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-700 hover:bg-sand-100">View</Link>
                    {e.status === 'published' && <Button size="sm" variant="ghost" className="text-danger hover:bg-danger-bg" onClick={() => setTarget(e)}>Unpublish</Button>}
                    {e.moderationNote && <Button size="sm" variant="secondary" loading={pending} onClick={() => run(moderateExperience, { id: e.id, action: 'restore', note: '' }, { success: 'Hold lifted — provider can republish' })}>Lift hold</Button>}
                  </div>
                </li>);

          })}
          </ul>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} total={list.length} pageSize={PAGE} />
        </>
      }
      <Modal open={!!target} onClose={() => setTarget(null)} size="sm" title="Unpublish this listing?" description={target?.title} footer={<><Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button><Button variant="danger" onClick={unpublish} loading={pending}>Unpublish listing</Button></>}>
        <p className="mb-4 text-sm text-ink-700">It disappears from discovery immediately and the provider can’t republish until you lift the hold. Existing bookings are kept.</p>
        <Field label="Reason shared with the provider" error={noteError}>{(p) => <Textarea {...p} rows={3} value={note} onChange={(ev) => {setNote(ev.target.value);setNoteError('');}} />}</Field>
      </Modal>
    </div>);

}