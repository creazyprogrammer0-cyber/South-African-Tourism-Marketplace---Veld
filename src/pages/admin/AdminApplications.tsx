import React, { useState } from 'react';
import { FileCheck2Icon, FileTextIcon, EyeIcon } from 'lucide-react';
import type { ProviderProfile, VerificationStatus } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { ApplicationDecision, decideApplication, startApplicationReview } from '../../utils/providerService';
import { destinations, documentTypes } from '../../data/catalog';
import { userById } from '../../utils/selectors';
import { verificationMeta } from '../../utils/status';
import { formatDateTime, relativeTime } from '../../utils/dates';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Field, Textarea } from '../../components/ui/FormControls';

type Tab = 'pending' | 'changes_requested' | 'approved' | 'rejected' | 'draft';

export function AdminApplications() {
  const { state } = useMarketplace();
  const { run, pending } = useAction();
  const [tab, setTab] = useState<Tab>('pending');
  const [openId, setOpenId] = useState<string | null>(null);
  const [decision, setDecision] = useState<ApplicationDecision | null>(null);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [docPreview, setDocPreview] = useState<string | null>(null);

  const by = (s: VerificationStatus[]) => state.providers.filter((p) => s.includes(p.verificationStatus));
  const groups: Record<Tab, ProviderProfile[]> = {
    pending: by(['submitted', 'under_review']).sort((a, b) => (a.submittedAt ?? '').localeCompare(b.submittedAt ?? '')),
    changes_requested: by(['changes_requested']),
    approved: by(['approved']),
    rejected: by(['rejected']),
    draft: by(['draft'])
  };
  const list = groups[tab];
  const p = state.providers.find((x) => x.id === openId);

  const decide = async () => {
    if (!p || !decision) return;
    if (decision !== 'approved' && note.trim().length < 10) return setNoteError('Add at least 10 characters so the provider knows what to do next.');
    const copy = { approved: 'Provider approved — they can now publish experiences', changes_requested: 'Changes requested — provider notified', rejected: 'Application rejected — provider notified' };
    const res = await run(decideApplication, { providerId: p.id, decision, note }, { success: copy[decision] });
    if (res.ok) {
      setDecision(null);
      setNote('');
      setOpenId(null);
    }
  };

  const isPending = p && ['submitted', 'under_review'].includes(p.verificationStatus);

  return (
    <div>
      <PageHeader title="Provider applications" description="Verify identity, guiding registration and fit before a provider can publish." />
      <Tabs<Tab> value={tab} onChange={setTab} items={[{ value: 'pending', label: 'Awaiting review', count: groups.pending.length }, { value: 'changes_requested', label: 'Changes requested', count: groups.changes_requested.length }, { value: 'approved', label: 'Approved', count: groups.approved.length }, { value: 'rejected', label: 'Rejected', count: groups.rejected.length }, { value: 'draft', label: 'Drafts', count: groups.draft.length }]} />
      <div className="mt-4">
        {list.length === 0 ?
        <EmptyState icon={<FileCheck2Icon className="h-5 w-5" />} title="No applications here" message={tab === 'pending' ? 'All caught up. New applications appear here as soon as providers submit them.' : 'Applications move here as their status changes.'} /> :

        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
            {list.map((x) => {
            const meta = verificationMeta[x.verificationStatus];
            return (
              <li key={x.id}>
                  <button onClick={() => setOpenId(x.id)} className="flex w-full flex-col gap-3 px-5 py-4 text-left hover:bg-sand-50 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar name={x.contactName} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{x.businessName || 'Untitled business'}</p>
                        <p className="truncate text-sm text-ink-500">{x.contactName} · {x.destinations.map((d) => destinations.find((y) => y.id === d)?.name).join(', ') || 'No destinations yet'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-ink-500">{x.verificationDocuments.length} doc{x.verificationDocuments.length === 1 ? '' : 's'}</span>
                      <span className="text-ink-500">{x.submittedAt ? `Submitted ${relativeTime(x.submittedAt)}` : 'Not submitted'}</span>
                      <StatusBadge tone={meta.tone} label={meta.label} />
                    </div>
                  </button>
                </li>);

          })}
          </ul>
        }
      </div>

      <Drawer
        open={!!p}
        onClose={() => setOpenId(null)}
        title={p?.businessName || 'Application'}
        subtitle={p && <StatusBadge tone={verificationMeta[p.verificationStatus].tone} label={verificationMeta[p.verificationStatus].label} />}
        footer={
        isPending ?
        <>
              {p?.verificationStatus === 'submitted' && <Button variant="ghost" loading={pending} onClick={() => run(startApplicationReview, { providerId: p.id }, { success: 'Marked as under review' })}>Start review</Button>}
              <Button variant="ghost" className="text-danger hover:bg-danger-bg" onClick={() => setDecision('rejected')}>Reject</Button>
              <Button variant="secondary" onClick={() => setDecision('changes_requested')}>Request changes</Button>
              <Button onClick={() => setDecision('approved')}>Approve Provider</Button>
            </> :
        undefined
        }>
        
        {p &&
        <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar name={p.contactName} src={p.photo} size="lg" />
              <div>
                <p className="font-semibold text-ink">{p.contactName}</p>
                <p className="text-sm text-ink-500">{userById(state, p.userId)?.email} · {p.phone || 'No phone'}</p>
                <p className="text-xs text-ink-500">{p.photo ? 'Profile photo provided' : 'No profile photo'}</p>
              </div>
            </div>
            <dl className="divide-y divide-line text-sm">
              {[
            ['Destinations', p.destinations.map((d) => destinations.find((y) => y.id === d)?.name).join(', ')],
            ['Languages', p.languages.join(', ')],
            ['Specialties', p.specialties.join(', ')],
            ['Experience', `${p.yearsExperience} years`],
            ['Background', p.background],
            ['Submitted', p.submittedAt ? formatDateTime(p.submittedAt) : '—']].
            map(([k, v]) => <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2.5"><dt className="text-ink-500">{k}</dt><dd className="text-ink">{v || '—'}</dd></div>)}
            </dl>
            <div>
              <h3 className="text-sm font-semibold text-ink">Bio</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{p.bio || '—'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Documents</h3>
              <ul className="mt-2 space-y-2">
                {documentTypes.map((t) => {
                const doc = p.verificationDocuments.find((x) => x.type === t.type);
                return (
                  <li key={t.type} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-sm">
                      <FileTextIcon className={doc ? 'h-4 w-4 text-olive' : 'h-4 w-4 text-ink-400'} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-ink">{t.label}{t.required && <span className="text-ink-500"> · required</span>}</p>
                        <p className="truncate text-xs text-ink-500">{doc ? `${doc.fileName} · ${doc.sizeKb} KB` : 'Not provided'}</p>
                      </div>
                      {doc && <Button size="sm" variant="ghost" icon={<EyeIcon className="h-3.5 w-3.5" />} onClick={() => setDocPreview(`${t.label} — ${doc.fileName}`)}>View</Button>}
                    </li>);

              })}
              </ul>
            </div>
            {p.adminNote &&
          <div className="rounded-xl bg-sand-50 p-4 text-sm">
                <p className="font-medium text-ink">Last note to provider</p>
                <p className="mt-1 text-ink-700">{p.adminNote}</p>
              </div>
          }
          </div>
        }
      </Drawer>

      <Modal
        open={!!decision}
        onClose={() => {setDecision(null);setNoteError('');}}
        size="sm"
        title={decision === 'approved' ? 'Approve this provider?' : decision === 'rejected' ? 'Reject this application?' : 'Request changes'}
        description={p?.businessName}
        footer={<><Button variant="secondary" onClick={() => setDecision(null)} disabled={pending}>Cancel</Button><Button variant={decision === 'rejected' ? 'danger' : 'primary'} onClick={decide} loading={pending}>{decision === 'approved' ? 'Approve Provider' : decision === 'rejected' ? 'Reject application' : 'Send request'}</Button></>}>
        
        <div className="space-y-4">
          <p className="text-sm text-ink-700">
            {decision === 'approved' && 'They’ll get a verified badge and can publish experiences to the marketplace immediately.'}
            {decision === 'changes_requested' && 'The provider can edit and resubmit. Tell them exactly what’s missing.'}
            {decision === 'rejected' && 'The provider won’t be able to publish. Explain the reason clearly.'}
          </p>
          <Field label={decision === 'approved' ? 'Note to provider' : 'Message to provider'} optional={decision === 'approved'} error={noteError}>
            {(fp) => <Textarea {...fp} rows={4} value={note} onChange={(e) => {setNote(e.target.value);setNoteError('');}} />}
          </Field>
        </div>
      </Modal>

      <Modal open={!!docPreview} onClose={() => setDocPreview(null)} title="Document preview" description={docPreview ?? ''}>
        <div className="flex aspect-[3/4] max-h-[50vh] w-full flex-col items-center justify-center rounded-xl border border-dashed border-sand-300 bg-sand-50 text-center">
          <FileTextIcon className="h-10 w-10 text-ink-400" aria-hidden />
          <p className="mt-3 text-sm font-medium text-ink">Secure document viewer</p>
          <p className="mt-1 max-w-xs text-xs text-ink-500">In production, documents open from encrypted storage with an audit log entry. Simulated files have no content in this prototype.</p>
        </div>
      </Modal>
    </div>);

}