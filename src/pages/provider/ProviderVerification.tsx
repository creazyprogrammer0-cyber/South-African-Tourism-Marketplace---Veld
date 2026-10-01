import React from 'react';
import { CheckIcon, ShieldCheckIcon, FileTextIcon } from 'lucide-react';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { documentTypes } from '../../data/catalog';
import { verificationMeta } from '../../utils/status';
import { formatDateTime } from '../../utils/dates';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ApplicationWizard } from '../../components/provider/ApplicationWizard';
import { VerificationBanner } from '../../components/provider/VerificationBanner';
import { cn } from '../../utils/cn';

const FLOW = [
{ key: 'draft', label: 'Application started' },
{ key: 'submitted', label: 'Submitted' },
{ key: 'under_review', label: 'Under review' },
{ key: 'decision', label: 'Decision' }];


export function ProviderVerification() {
  const { provider } = useCurrentProvider();
  if (!provider) return null;
  const meta = verificationMeta[provider.verificationStatus];
  const editable = provider.verificationStatus === 'draft' || provider.verificationStatus === 'changes_requested';
  const idx = { draft: 0, changes_requested: 0, submitted: 1, under_review: 2, approved: 3, rejected: 3 }[provider.verificationStatus];

  return (
    <div>
      <PageHeader title="Verification" description="Every Veld provider is checked by our trust team before they can publish experiences." actions={<StatusBadge tone={meta.tone} label={meta.label} />} />

      {editable ?
      <ApplicationWizard provider={provider} /> :

      <div className="space-y-6">
          <VerificationBanner provider={provider} />
          {provider.verificationStatus === 'approved' &&
        <div className="flex flex-col gap-4 rounded-2xl bg-olive p-6 text-white sm:flex-row sm:items-center">
              <ShieldCheckIcon className="h-8 w-8 shrink-0" aria-hidden />
              <div className="flex-1">
                <p className="font-semibold">You’re a verified provider</p>
                <p className="text-sm text-white/85">Your verified badge appears on your profile and experiences{provider.reviewedAt ? ` · approved ${formatDateTime(provider.reviewedAt)}` : ''}.</p>
              </div>
              <Button variant="secondary" to="/provider/experiences/new" className="border-transparent">Create Experience</Button>
            </div>
        }
          <ol className="grid gap-4 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60 sm:grid-cols-4">
            {FLOW.map((s, i) => {
            const done = i < idx || i === idx && provider.verificationStatus === 'approved';
            const active = i === idx && !done;
            return (
              <li key={s.key} className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold', done ? 'bg-olive text-white' : active ? 'bg-clay text-white' : 'bg-sand-200 text-ink-500')}>{done ? <CheckIcon className="h-4 w-4" aria-hidden /> : i + 1}</span>
                  <span className={cn('text-sm', active ? 'font-semibold text-ink' : 'text-ink-600')}>{i === 3 && provider.verificationStatus === 'rejected' ? 'Not approved' : i === 3 && provider.verificationStatus === 'approved' ? 'Approved' : s.label}</span>
                </li>);

          })}
          </ol>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60">
              <h2 className="text-sm font-semibold text-ink">Submitted information</h2>
              <dl className="mt-3 divide-y divide-line text-sm">
                {[
              ['Business', provider.businessName],
              ['Contact', `${provider.contactName} · ${provider.phone}`],
              ['Languages', provider.languages.join(', ')],
              ['Specialties', provider.specialties.join(', ')],
              ['Submitted', provider.submittedAt ? formatDateTime(provider.submittedAt) : '—']].
              map(([k, v]) => <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2"><dt className="text-ink-500">{k}</dt><dd className="text-ink">{v}</dd></div>)}
              </dl>
            </section>
            <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60">
              <h2 className="text-sm font-semibold text-ink">Documents</h2>
              <ul className="mt-3 space-y-2">
                {provider.verificationDocuments.map((doc) =>
              <li key={doc.id} className="flex items-center gap-2 text-sm text-ink-700"><FileTextIcon className="h-4 w-4 text-ink-500" aria-hidden />{documentTypes.find((t) => t.type === doc.type)?.label}<span className="text-xs text-ink-500">· {doc.fileName}</span></li>
              )}
              </ul>
              <p className="mt-4 text-xs text-ink-500">Only visible to the Veld trust team.</p>
            </section>
          </div>
        </div>
      }
    </div>);

}