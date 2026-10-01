import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, XIcon } from 'lucide-react';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { useAction } from '../../hooks/useAction';
import { ExperienceInput, saveExperience, setExperienceStatus, validateExperience } from '../../utils/experienceService';
import { categories, destinations, languageOptions } from '../../data/catalog';
import { cancellationPolicies } from '../../utils/policies';
import { Field, Input, Select, Textarea } from '../../components/ui/FormControls';
import { ChipGroup } from '../../components/ui/ChipGroup';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { ImagePicker } from '../../components/provider/ImagePicker';
import type { CancellationPolicy } from '../../types/marketplace';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Section({ title, description, children }: {title: string;description?: string;children: React.ReactNode;}) {
  return (
    <section className="grid gap-6 border-b border-line py-8 first:pt-0 last:border-0 lg:grid-cols-[240px_1fr]">
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-xs leading-relaxed text-ink-500">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>);

}

export function ExperienceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { provider, approved, state } = useCurrentProvider();
  const { run, pending } = useAction();
  const existing = id ? state.experiences.find((e) => e.id === id) : undefined;

  const [form, setForm] = useState<ExperienceInput>(() =>
  existing ?
  { id: existing.id, title: existing.title, summary: existing.summary, description: existing.description, images: existing.images, destination: existing.destination, category: existing.category, durationHours: existing.durationHours, price: existing.price, maxGuests: existing.maxGuests, meetingPoint: existing.meetingPoint, inclusions: existing.inclusions, exclusions: existing.exclusions, cancellationPolicy: existing.cancellationPolicy, languages: existing.languages, times: existing.times, weekdays: existing.weekdays } :
  { title: '', summary: '', description: '', images: [], destination: provider?.destinations[0] ?? '', category: '', durationHours: 3, price: 0, maxGuests: 8, meetingPoint: '', inclusions: [], exclusions: [], cancellationPolicy: 'flexible', languages: provider?.languages.slice(0, 1) ?? [], times: ['09:00'], weekdays: [1, 2, 3, 4, 5, 6] }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTime, setNewTime] = useState('14:00');
  const set = <K extends keyof ExperienceInput,>(k: K, v: ExperienceInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  if (!provider) return null;
  if (id && (!existing || existing.providerId !== provider.id)) {
    return <EmptyState title="Experience not found" message="This experience doesn’t exist or belongs to another provider." action={<Button to="/provider/experiences">Back to experiences</Button>} />;
  }

  const save = async (publish: boolean) => {
    const errs = validateExperience(form);
    if (publish && form.images.length === 0) errs.images = 'Add at least one photo before publishing.';
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector('[aria-invalid="true"], [role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const res = await run(saveExperience, form, { success: publish ? undefined : existing ? 'Changes saved' : 'Draft saved' });
    if (!res.ok) return;
    if (publish && (!existing || existing.status !== 'published')) {
      const pub = await run(setExperienceStatus, { id: res.data, status: 'published' }, { success: 'Published — now visible to travellers' });
      if (!pub.ok) return;
    }
    navigate('/provider/experiences');
  };

  const lines = (v: string) => v.split('\n').map((s) => s.trim()).filter(Boolean);
  const cats = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="mx-auto max-w-5xl">
      <button onClick={() => navigate('/provider/experiences')} className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink">
        <ChevronLeftIcon className="h-4 w-4" aria-hidden /> Experiences
      </button>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{existing ? 'Edit experience' : 'Create experience'}</h1>
      {!approved &&
      <Alert tone="info" title="You can save drafts while your verification is pending" className="mt-4">Publishing to the marketplace unlocks once your provider profile is approved.</Alert>
      }
      {existing?.moderationNote && <Alert tone="danger" title="Moderation hold" className="mt-4">{existing.moderationNote}</Alert>}

      <div className="mt-6 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60 sm:p-8">
        <Section title="Basics" description="A clear, specific title and summary help travellers decide quickly.">
          <Field label="Title" error={errors.title} hint={`${form.title.length}/110`}>{(p) => <Input {...p} value={form.title} maxLength={110} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Lion’s Head Sunrise Hike" />}</Field>
          <Field label="One-line summary" error={errors.summary}>{(p) => <Input {...p} value={form.summary} maxLength={140} onChange={(e) => set('summary', e.target.value)} />}</Field>
          <Field label="Description" error={errors.description}>{(p) => <Textarea {...p} rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Destination" error={errors.destination}>
              {(p) =>
              <Select {...p} value={form.destination} onChange={(e) => set('destination', e.target.value)}>
                  <option value="">Choose</option>
                  {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
              }
            </Field>
            <Field label="Category" error={errors.category}>
              {(p) =>
              <Select {...p} value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="">Choose</option>
                  {cats.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </Select>
              }
            </Field>
          </div>
        </Section>

        <Section title="Photos">
          <ImagePicker value={form.images} onChange={(v) => set('images', v)} error={errors.images} />
        </Section>

        <Section title="Pricing & group" description="Price is per person in ZAR. Travellers pay an additional service fee at checkout.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price per person (R)" error={errors.price}>{(p) => <Input {...p} type="number" min={50} step={10} value={form.price || ''} onChange={(e) => set('price', Number(e.target.value))} />}</Field>
            <Field label="Duration (hours)" error={errors.durationHours}>{(p) => <Input {...p} type="number" min={0.5} step={0.5} value={form.durationHours} onChange={(e) => set('durationHours', Number(e.target.value))} />}</Field>
            <Field label="Max guests" error={errors.maxGuests}>{(p) => <Input {...p} type="number" min={1} max={40} value={form.maxGuests} onChange={(e) => set('maxGuests', Number(e.target.value))} />}</Field>
          </div>
        </Section>

        <Section title="Schedule" description={existing ? 'Changing days here doesn’t remove existing dates. Fine-tune individual dates on the Availability page.' : 'We’ll create bookable dates for the next 45 days from this weekly pattern. You can adjust individual dates later.'}>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Days you run it</legend>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d, i) => {
                const on = form.weekdays.includes(i);
                return (
                  <button key={d} type="button" aria-pressed={on} onClick={() => set('weekdays', on ? form.weekdays.filter((x) => x !== i) : [...form.weekdays, i].sort())} className={`h-9 w-12 rounded-lg border text-sm font-medium transition-colors duration-150 ease-out ${on ? 'border-ink bg-ink text-white' : 'border-line text-ink-700 hover:border-ink-400'}`}>
                    {d}
                  </button>);

              })}
            </div>
            {errors.weekdays && <p className="mt-1.5 text-xs font-medium text-danger" role="alert">{errors.weekdays}</p>}
          </fieldset>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Start times</p>
            <div className="flex flex-wrap items-center gap-2">
              {form.times.map((t) =>
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-sand-100 py-1 pl-3 pr-1 text-sm text-ink">
                  {t}
                  <button type="button" onClick={() => set('times', form.times.filter((x) => x !== t))} className="rounded-full p-1 hover:bg-sand-200" aria-label={`Remove ${t}`}><XIcon className="h-3 w-3" /></button>
                </span>
              )}
              <div className="flex items-center gap-1">
                <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="h-8 w-28" aria-label="New start time" />
                <Button size="sm" variant="secondary" onClick={() => newTime && !form.times.includes(newTime) && set('times', [...form.times, newTime].sort())} icon={<PlusIcon className="h-3.5 w-3.5" />}>Add</Button>
              </div>
            </div>
            {errors.times && <p className="mt-1.5 text-xs font-medium text-danger" role="alert">{errors.times}</p>}
          </div>
        </Section>

        <Section title="Logistics">
          <Field label="Meeting / pick-up point" error={errors.meetingPoint}>{(p) => <Input {...p} value={form.meetingPoint} onChange={(e) => set('meetingPoint', e.target.value)} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Included" error={errors.inclusions} hint="One item per line">{(p) => <Textarea {...p} rows={4} defaultValue={form.inclusions.join('\n')} onBlur={(e) => set('inclusions', lines(e.target.value))} />}</Field>
            <Field label="Not included" optional hint="One item per line">{(p) => <Textarea {...p} rows={4} defaultValue={form.exclusions.join('\n')} onBlur={(e) => set('exclusions', lines(e.target.value))} />}</Field>
          </div>
          <ChipGroup label="Guiding languages" options={languageOptions.map((l) => ({ value: l, label: l }))} value={form.languages} onChange={(v) => set('languages', v)} error={errors.languages} />
          <Field label="Cancellation policy" hint={cancellationPolicies[form.cancellationPolicy].text}>
            {(p) =>
            <Select {...p} value={form.cancellationPolicy} onChange={(e) => set('cancellationPolicy', e.target.value as CancellationPolicy)}>
                {(Object.keys(cancellationPolicies) as CancellationPolicy[]).map((k) => <option key={k} value={k}>{cancellationPolicies[k].label}</option>)}
              </Select>
            }
          </Field>
        </Section>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-col-reverse gap-2 border-t border-line bg-canvas/95 px-4 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={() => navigate('/provider/experiences')} disabled={pending}>Cancel</Button>
        <Button variant="secondary" onClick={() => save(false)} loading={pending}>{existing ? 'Save changes' : 'Save as draft'}</Button>
        {(!existing || existing.status !== 'published') &&
        <Button onClick={() => save(true)} disabled={!approved || !!existing?.moderationNote || pending} title={!approved ? 'Only verified providers can publish' : undefined}>Save & publish</Button>
        }
      </div>
    </div>);

}