import React, { useState } from 'react';
import { toast } from 'sonner';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { updateSettings } from '../../utils/accountService';
import { PageHeader } from '../../components/ui/PageHeader';
import { Field, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatZAR } from '../../utils/format';

export function AdminSettings() {
  const { state, resetDemo } = useMarketplace();
  const { run, pending } = useAction();
  const [form, setForm] = useState(state.settings);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Marketplace-wide configuration. Changes apply to new bookings and proposals only." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(updateSettings, form, { success: 'Settings saved' });
        }}
        className="space-y-6 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60 sm:p-8"
        noValidate>
        
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Traveller service fee (%)" hint={`On a ${formatZAR(1000)} booking the traveller pays ${formatZAR(1000 + 1000 * form.serviceFeePercent / 100)}`}>
            {(p) => <Input {...p} type="number" min={0} max={25} step={0.5} value={form.serviceFeePercent} onChange={(e) => setForm({ ...form, serviceFeePercent: Number(e.target.value) })} />}
          </Field>
          <Field label="Proposal validity (days)" hint="How long a traveller has to accept a proposal">
            {(p) => <Input {...p} type="number" min={1} max={30} value={form.proposalValidityDays} onChange={(e) => setForm({ ...form, proposalValidityDays: Number(e.target.value) })} />}
          </Field>
        </div>
        <label className="flex items-start gap-3 rounded-xl bg-sand-50 p-4">
          <input type="checkbox" checked={form.simulateNetworkErrors} onChange={(e) => setForm({ ...form, simulateNetworkErrors: e.target.checked })} className="mt-0.5 h-4 w-4 accent-ink" />
          <span>
            <span className="block text-sm font-medium text-ink">Simulate unreliable network (QA)</span>
            <span className="block text-xs text-ink-500">1 in 4 actions fails with a connection error so you can test error states and retries. Prototype only.</span>
          </span>
        </label>
        <div className="flex justify-end border-t border-line pt-6">
          <Button type="submit" loading={pending}>Save settings</Button>
        </div>
      </form>

      <section className="rounded-2xl border border-danger/30 bg-surface p-6">
        <h2 className="text-sm font-semibold text-ink">Demo data</h2>
        <p className="mt-1 text-sm text-ink-600">Restore all providers, experiences, bookings, requests and reviews to the original seed. This can’t be undone.</p>
        <Button variant="danger" className="mt-4" onClick={() => setResetOpen(true)}>Reset demo data</Button>
      </section>
      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        tone="danger"
        title="Reset all demo data?"
        confirmLabel="Reset data"
        onConfirm={() => {
          resetDemo();
          setResetOpen(false);
          setForm({ serviceFeePercent: 8, proposalValidityDays: 7, simulateNetworkErrors: false });
          toast.success('Demo data reset');
        }}>
        
        <p className="text-sm text-ink-700">Everything created during this session will be removed.</p>
      </ConfirmDialog>
    </div>);

}