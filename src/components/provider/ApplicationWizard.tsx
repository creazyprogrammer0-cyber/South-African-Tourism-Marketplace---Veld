import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CameraIcon, CheckIcon } from 'lucide-react';
import type { ProviderProfile } from '../../types/marketplace';
import { useAction } from '../../hooks/useAction';
import { ApplicationDraft, saveApplication, submitApplication, validateApplication } from '../../utils/providerService';
import { destinations, documentTypes, languageOptions, specialtyOptions } from '../../data/catalog';
import { Field, Input, Textarea } from '../ui/FormControls';
import { ChipGroup } from '../ui/ChipGroup';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Alert } from '../ui/Alert';
import { DocumentUpload } from './DocumentUpload';
import { cn } from '../../utils/cn';

const STEPS = ['Business & contact', 'Coverage', 'Experience', 'Photo & documents', 'Review & submit'];
const stepKeys: string[][] = [
['businessName', 'contactName', 'phone'],
['destinations', 'languages', 'specialties'],
['bio', 'background'],
['photo', ...documentTypes.map((d) => `doc_${d.type}`)],
[]];


export function ApplicationWizard({ provider }: {provider: ProviderProfile;}) {
  const { run, pending } = useAction();
  const photoRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [d, setD] = useState<ApplicationDraft>({
    businessName: provider.businessName,
    contactName: provider.contactName,
    phone: provider.phone,
    bio: provider.bio,
    background: provider.background,
    yearsExperience: provider.yearsExperience,
    destinations: provider.destinations,
    languages: provider.languages,
    specialties: provider.specialties,
    photo: provider.photo,
    verificationDocuments: provider.verificationDocuments
  });
  const set = <K extends keyof ApplicationDraft,>(k: K, v: ApplicationDraft[K]) => setD((x) => ({ ...x, [k]: v }));

  const saveAndNext = async () => {
    const all = validateApplication(d);
    const errs = Object.fromEntries(Object.entries(all).filter(([k]) => stepKeys[step].includes(k)));
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const res = await run(saveApplication, d, { latency: 350 });
    if (res.ok) setStep((s) => s + 1);
  };

  const submit = async () => {
    const all = validateApplication(d);
    setErrors(all);
    if (Object.keys(all).length) return;
    await run(submitApplication, d, { success: 'Application submitted for review', latency: 900 });
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) return setErrors((x) => ({ ...x, photo: 'Choose an image file.' }));
    set('photo', URL.createObjectURL(f));
    setErrors((x) => ({ ...x, photo: '' }));
  };

  const allErrors = step === 4 ? validateApplication(d) : {};
  const docFor = (t: string) => d.verificationDocuments.find((x) => x.type === t);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Application steps">
        <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {STEPS.map((s, i) =>
          <li key={s}>
              <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              aria-current={i === step ? 'step' : undefined}
              className={cn('flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm', i === step ? 'bg-ink text-white' : i < step ? 'text-ink-700 hover:bg-sand-100' : 'text-ink-400')}>
              
                <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold', i === step ? 'bg-white text-ink' : i < step ? 'bg-olive text-white' : 'bg-sand-200 text-ink-500')}>
                  {i < step ? <CheckIcon className="h-3 w-3" aria-hidden /> : i + 1}
                </span>
                {s}
              </button>
            </li>
          )}
        </ol>
      </nav>

      <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60 sm:p-8">
        {provider.verificationStatus === 'changes_requested' && provider.adminNote && step === 0 &&
        <Alert tone="warning" title="Our team requested changes" className="mb-6">{provider.adminNote}</Alert>
        }
        <h2 className="text-lg font-semibold text-ink">{STEPS[step]}</h2>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }} className="mt-6 space-y-5">
            {step === 0 &&
            <>
                <Field label="Business or trading name" error={errors.businessName}>{(p) => <Input {...p} value={d.businessName} onChange={(e) => set('businessName', e.target.value)} />}</Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Main contact (as on ID)" error={errors.contactName}>{(p) => <Input {...p} value={d.contactName} onChange={(e) => set('contactName', e.target.value)} />}</Field>
                  <Field label="Mobile number" error={errors.phone} hint="Shared with travellers only after they book">{(p) => <Input {...p} type="tel" value={d.phone} placeholder="+27 82 000 0000" onChange={(e) => set('phone', e.target.value)} />}</Field>
                </div>
              </>
            }
            {step === 1 &&
            <>
                <ChipGroup label="Destinations you guide in" options={destinations.map((x) => ({ value: x.id, label: x.name }))} value={d.destinations} onChange={(v) => set('destinations', v)} error={errors.destinations} />
                <ChipGroup label="Guiding languages" options={languageOptions.map((x) => ({ value: x, label: x }))} value={d.languages} onChange={(v) => set('languages', v)} error={errors.languages} />
                <ChipGroup label="Specialties" options={specialtyOptions.map((x) => ({ value: x, label: x }))} value={d.specialties} onChange={(v) => set('specialties', v)} error={errors.specialties} />
              </>
            }
            {step === 2 &&
            <>
                <Field label="Years guiding" className="sm:w-40">{(p) => <Input {...p} type="number" min={0} max={60} value={d.yearsExperience} onChange={(e) => set('yearsExperience', Number(e.target.value))} />}</Field>
                <Field label="Public bio" error={errors.bio} hint={`${d.bio.trim().length} characters · minimum 60. Shown on your profile.`}>{(p) => <Textarea {...p} rows={5} value={d.bio} onChange={(e) => set('bio', e.target.value)} />}</Field>
                <Field label="Qualifications & background" error={errors.background} hint="Registrations, first aid, permits, relevant experience. Reviewed by our trust team.">{(p) => <Textarea {...p} rows={4} value={d.background} onChange={(e) => set('background', e.target.value)} />}</Field>
              </>
            }
            {step === 3 &&
            <>
                <div className="flex items-center gap-4">
                  <Avatar name={d.contactName || 'You'} src={d.photo} size="xl" />
                  <div>
                    <p className="text-sm font-medium text-ink">Profile photo</p>
                    <p className="text-xs text-ink-500">A clear, friendly photo of your face. {d.photo?.startsWith('simulated:') && 'portrait.jpg uploaded.'}</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => photoRef.current?.click()} icon={<CameraIcon className="h-3.5 w-3.5" />}>{d.photo ? 'Replace photo' : 'Upload photo'}</Button>
                      {!d.photo && <Button size="sm" variant="ghost" onClick={() => {set('photo', 'simulated:portrait.jpg');setErrors((x) => ({ ...x, photo: '' }));}}>Simulate upload</Button>}
                    </div>
                    <input ref={photoRef} type="file" accept="image/*" className="sr-only" onChange={onPhoto} tabIndex={-1} aria-hidden />
                    {errors.photo && <p className="mt-1 text-xs font-medium text-danger" role="alert">{errors.photo}</p>}
                  </div>
                </div>
                <div className="space-y-3 border-t border-line pt-5">
                  <p className="text-sm font-medium text-ink">Verification documents</p>
                  <p className="text-xs text-ink-500">Documents are only visible to the Veld trust team and are never shown to travellers.</p>
                  {documentTypes.map((t) =>
                <DocumentUpload
                  key={t.type}
                  {...t}
                  doc={docFor(t.type)}
                  error={errors[`doc_${t.type}`]}
                  onChange={(doc) => {
                    set('verificationDocuments', [...d.verificationDocuments.filter((x) => x.type !== t.type), ...(doc ? [doc] : [])]);
                    setErrors((x) => ({ ...x, [`doc_${t.type}`]: '' }));
                  }} />

                )}
                </div>
              </>
            }
            {step === 4 &&
            <>
                <dl className="divide-y divide-line text-sm">
                  {[
                ['Business', d.businessName],
                ['Contact', `${d.contactName} · ${d.phone}`],
                ['Destinations', d.destinations.map((x) => destinations.find((y) => y.id === x)?.name).join(', ')],
                ['Languages', d.languages.join(', ')],
                ['Specialties', d.specialties.join(', ')],
                ['Experience', `${d.yearsExperience} years`],
                ['Documents', `${d.verificationDocuments.length} uploaded`]].
                map(([k, v]) =>
                <div key={k} className="grid grid-cols-[120px_1fr] gap-3 py-2.5"><dt className="text-ink-500">{k}</dt><dd className="text-ink">{v || '—'}</dd></div>
                )}
                </dl>
                {Object.keys(allErrors).length > 0 &&
              <Alert tone="warning" title="A few things are missing">
                    <ul className="list-disc pl-4">{Object.values(allErrors).map((e) => <li key={e}>{e}</li>)}</ul>
                  </Alert>
              }
                <label className="flex items-start gap-3 text-sm text-ink-700">
                  <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-0.5 h-4 w-4 accent-ink" />
                  I confirm this information is accurate and I hold the registrations and permits required to guide these experiences.
                </label>
              </>
            }
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || pending}>Back</Button>
          {step < 4 ?
          <Button onClick={saveAndNext} loading={pending}>Save & continue</Button> :

          <Button variant="accent" onClick={submit} loading={pending} disabled={!confirm || Object.keys(allErrors).length > 0}>{provider.verificationStatus === 'changes_requested' ? 'Resubmit application' : 'Submit application'}</Button>
          }
        </div>
      </div>
    </div>);

}