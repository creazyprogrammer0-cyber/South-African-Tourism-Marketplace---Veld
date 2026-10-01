import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MapIcon, StarIcon, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import type { Experience } from '../../types/marketplace';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { useAction } from '../../hooks/useAction';
import { deleteExperience, setExperienceStatus } from '../../utils/experienceService';
import { experienceRating, nextAvailable } from '../../utils/selectors';
import { experienceMeta } from '../../utils/status';
import { formatDate } from '../../utils/dates';
import { formatZAR, formatDuration } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SafeImage } from '../../components/ui/SafeImage';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { VerificationBanner } from '../../components/provider/VerificationBanner';

export function ProviderExperiences() {
  const { provider, approved, state } = useCurrentProvider();
  const { run, pending } = useAction();
  const [confirm, setConfirm] = useState<{e: Experience;action: 'unpublish' | 'delete';} | null>(null);
  if (!provider) return null;
  const list = state.experiences.filter((e) => e.providerId === provider.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const publish = (e: Experience) => run(setExperienceStatus, { id: e.id, status: 'published' }, { success: `“${e.title}” is live in the marketplace` });
  const onConfirm = async () => {
    if (!confirm) return;
    const res = confirm.action === 'delete' ?
    await run(deleteExperience, { id: confirm.e.id }, { success: 'Draft deleted' }) :
    await run(setExperienceStatus, { id: confirm.e.id, status: 'unpublished' }, { success: 'Experience unpublished — hidden from discovery' });
    if (res.ok) setConfirm(null);
  };

  return (
    <div>
      <PageHeader title="Experiences" description={`${list.filter((e) => e.status === 'published').length} published · ${list.length} total`} actions={<Button to="/provider/experiences/new" icon={<PlusIcon className="h-4 w-4" />}>Create Experience</Button>} />
      {!approved && <div className="mb-6"><VerificationBanner provider={provider} /></div>}
      {list.length === 0 ?
      <EmptyState icon={<MapIcon className="h-5 w-5" />} title="No experiences yet" message="Create your first experience — add photos, pricing and a weekly schedule. You can save it as a draft and publish once you’re verified." action={<Button to="/provider/experiences/new">Create Experience</Button>} /> :

      <ul className="space-y-3">
          {list.map((e) => {
          const meta = experienceMeta[e.status];
          const rating = experienceRating(state, e.id);
          const next = nextAvailable(state, e.id);
          const bookings = state.bookings.filter((b) => b.experienceId === e.id && b.bookingStatus === 'confirmed').length;
          return (
            <li key={e.id} className="rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line/60">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <SafeImage src={e.images[0]} alt="" className="h-32 w-full shrink-0 rounded-xl md:h-20 md:w-28" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={meta.tone} label={meta.label} />
                      {e.moderationNote && <StatusBadge tone="danger" label="Moderation hold" />}
                    </div>
                    <p className="mt-1.5 line-clamp-1 font-semibold text-ink" title={e.title}>{e.title}</p>
                    <p className="mt-0.5 text-sm text-ink-600">
                      {formatZAR(e.price)} pp · {formatDuration(e.durationHours)} · {bookings} upcoming booking{bookings === 1 ? '' : 's'}
                      {rating.count > 0 && <span className="ml-2 inline-flex items-center gap-0.5"><StarIcon className="h-3.5 w-3.5 fill-clay text-clay" aria-hidden />{rating.average.toFixed(1)} ({rating.count})</span>}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-500">{next ? `Next available ${formatDate(next.date, 'EEE d MMM')}` : 'No open dates — add availability before publishing'}</p>
                    {e.moderationNote && <p className="mt-1 text-xs text-danger">Unpublished by Veld: {e.moderationNote}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="ghost" to={`/experiences/${e.id}`} icon={<EyeIcon className="h-4 w-4" />}>{e.status === 'published' ? 'View' : 'Preview'}</Button>
                    <Button size="sm" variant="secondary" to={`/provider/experiences/${e.id}/edit`} icon={<PencilIcon className="h-4 w-4" />}>Edit</Button>
                    {e.status === 'published' ?
                  <Button size="sm" variant="secondary" onClick={() => setConfirm({ e, action: 'unpublish' })}>Unpublish</Button> :

                  <Button size="sm" onClick={() => publish(e)} disabled={!approved || !!e.moderationNote} loading={pending} title={!approved ? 'Only verified providers can publish' : undefined}>Publish</Button>
                  }
                    {e.status === 'draft' &&
                  <button onClick={() => setConfirm({ e, action: 'delete' })} className="rounded-lg p-2 text-ink-500 hover:bg-danger-bg hover:text-danger" aria-label={`Delete ${e.title}`}>
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                  }
                  </div>
                </div>
                {!approved && e.status === 'draft' && <p className="mt-3 border-t border-line pt-3 text-xs text-ink-500">Publishing unlocks once your provider profile is verified. <Link to="/provider/verification" className="font-medium text-clay hover:underline">Check verification status</Link></p>}
              </li>);

        })}
        </ul>
      }
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={onConfirm}
        loading={pending}
        tone="danger"
        title={confirm?.action === 'delete' ? 'Delete this draft?' : 'Unpublish this experience?'}
        confirmLabel={confirm?.action === 'delete' ? 'Delete draft' : 'Unpublish'}>
        
        <p className="text-sm text-ink-700">
          {confirm?.action === 'delete' ?
          'The draft and its schedule will be permanently removed.' :
          'It will disappear from traveller discovery immediately. Existing bookings are kept and still need to be honoured. You can republish at any time.'}
        </p>
      </ConfirmDialog>
    </div>);

}