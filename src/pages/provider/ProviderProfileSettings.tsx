import React, { useState } from 'react';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { useAction } from '../../hooks/useAction';
import { updateProviderProfile } from '../../utils/providerService';
import { destinations, languageOptions, specialtyOptions } from '../../data/catalog';
import { PageHeader } from '../../components/ui/PageHeader';
import { Field, Input, Textarea } from '../../components/ui/FormControls';
import { ChipGroup } from '../../components/ui/ChipGroup';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { VerificationBanner } from '../../components/provider/VerificationBanner';

export function ProviderProfileSettings() {
  const { provider, approved } = useCurrentProvider();
  const { run, pending } = useAction();
  const [form, setForm] = useState(() => ({
    businessName: provider?.businessName ?? '',
    phone: provider?.phone ?? '',
    bio: provider?.bio ?? '',
    destinations: provider?.destinations ?? [],
    languages: provider?.languages ?? [],
    specialties: provider?.specialties ?? [],
    photo: provider?.photo
  }));
  if (!provider) return null;

  if (!approved) {
    return (
      <div>
        <PageHeader title="Profile" />
        <VerificationBanner provider={provider} />
        <p className="mt-6 text-sm text-ink-600">Your public profile is created from your application. You can edit it here once you’re verified.</p>
      </div>);

  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Profile" description="This is what travellers see on your public profile and experience pages." actions={<Button variant="secondary" to={`/providers/${provider.id}`}>View public profile</Button>} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(updateProviderProfile, form, { success: 'Profile updated' });
        }}
        className="space-y-6 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60 sm:p-8"
        noValidate>
        
        <div className="flex items-center gap-4">
          <Avatar name={provider.contactName} src={form.photo} size="xl" />
          <div>
            <p className="font-semibold text-ink">{provider.contactName}</p>
            <p className="text-sm text-ink-500">Verified identity · name changes require re-verification</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name">{(p) => <Input {...p} value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />}</Field>
          <Field label="Phone (shared with booked travellers)">{(p) => <Input {...p} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}</Field>
        </div>
        <Field label="Bio" hint={`${form.bio.length} characters · minimum 60`}>{(p) => <Textarea {...p} rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />}</Field>
        <ChipGroup label="Destinations" options={destinations.map((d) => ({ value: d.id, label: d.name }))} value={form.destinations} onChange={(v) => setForm({ ...form, destinations: v })} />
        <ChipGroup label="Languages" options={languageOptions.map((l) => ({ value: l, label: l }))} value={form.languages} onChange={(v) => setForm({ ...form, languages: v })} />
        <ChipGroup label="Specialties" options={specialtyOptions.map((s) => ({ value: s, label: s }))} value={form.specialties} onChange={(v) => setForm({ ...form, specialties: v })} />
        <div className="flex justify-end border-t border-line pt-6">
          <Button type="submit" loading={pending}>Save profile</Button>
        </div>
      </form>
    </div>);

}