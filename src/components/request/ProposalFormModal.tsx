import React, { useEffect, useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import type { CustomRequest, ItineraryItem } from '../../types/marketplace';
import { useAction } from '../../hooks/useAction';
import { submitProposal, validateProposal } from '../../utils/requestService';
import { dateFromToday } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Textarea } from '../ui/FormControls';

function daysBetween(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5) + 1);
}

export function ProposalFormModal({ request, onClose }: {request: CustomRequest | null;onClose: () => void;}) {
  const { run, pending } = useAction();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState(0);
  const [notes, setNotes] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!request) return;
    const n = daysBetween(request.startDate, request.endDate);
    setTitle('');
    setDate(request.startDate > dateFromToday(0) ? request.startDate : dateFromToday(7));
    setDuration(n === 1 ? '1 day' : `${n} days`);
    setPrice(Math.round(((request.budgetMin || request.budgetMax * 0.7) + request.budgetMax) / 2 / 100) * 100);
    setNotes('');
    setAvailabilityNote('Available on your preferred dates.');
    setItinerary(Array.from({ length: Math.min(n, 7) }, (_, i) => ({ day: i + 1, title: '', detail: '' })));
    setErrors({});
  }, [request]);

  if (!request) return <Modal open={false} onClose={onClose} title="">{null}</Modal>;

  const updateDay = (i: number, patch: Partial<ItineraryItem>) => setItinerary((list) => list.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const submit = async () => {
    const payload = { requestId: request.id, title, itinerary, price, date, duration, notes, availabilityNote };
    const errs = validateProposal(payload);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const res = await run(submitProposal, payload, { success: 'Proposal sent — the traveller has been notified', latency: 700 });
    if (res.ok) onClose();
  };

  const overBudget = price > request.budgetMax;

  return (
    <Modal
      open={!!request}
      onClose={onClose}
      size="lg"
      title="Send a proposal"
      description={`${request.guestCount} travellers · budget ${request.budgetMin ? `${formatZAR(request.budgetMin)}–` : 'up to '}${formatZAR(request.budgetMax)}`}
      footer={<><Button variant="secondary" onClick={onClose} disabled={pending}>Cancel</Button><Button variant="accent" onClick={submit} loading={pending}>Send proposal</Button></>}>
      
      <div className="space-y-5">
        <Field label="Proposal title" error={errors.title}>{(p) => <Input {...p} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cape Town Through the Lens: 4 Days of Light, Trails & Tables" />}</Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Start date" error={errors.date}>{(p) => <Input {...p} type="date" min={dateFromToday(1)} value={date} onChange={(e) => setDate(e.target.value)} />}</Field>
          <Field label="Duration" error={errors.duration}>{(p) => <Input {...p} value={duration} onChange={(e) => setDuration(e.target.value)} />}</Field>
          <Field label="Total price (R)" error={errors.price} hint={overBudget ? 'Above the traveller’s budget — explain why in your notes' : 'For the whole group'}>{(p) => <Input {...p} type="number" min={100} step={100} value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} />}</Field>
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-ink">Itinerary</legend>
          {errors.itinerary && <p className="mt-1 text-xs font-medium text-danger" role="alert">{errors.itinerary}</p>}
          <ol className="mt-2 space-y-3">
            {itinerary.map((it, i) =>
            <li key={i} className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-ink-500">Day {it.day}</span>
                  {itinerary.length > 1 &&
                <button type="button" onClick={() => setItinerary((l) => l.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, day: idx + 1 })))} className="rounded p-1 text-ink-500 hover:text-danger" aria-label={`Remove day ${it.day}`}>
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </button>
                }
                </div>
                <Input className="mt-2" placeholder="Title, e.g. Sunrise on Lion’s Head" value={it.title} onChange={(e) => updateDay(i, { title: e.target.value })} aria-label={`Day ${it.day} title`} />
                <Textarea className="mt-2 min-h-[64px]" rows={2} placeholder="What you’ll do, timings, meals" value={it.detail} onChange={(e) => updateDay(i, { detail: e.target.value })} aria-label={`Day ${it.day} details`} />
              </li>
            )}
          </ol>
          <Button size="sm" variant="ghost" className="mt-2" onClick={() => setItinerary((l) => [...l, { day: l.length + 1, title: '', detail: '' }])} icon={<PlusIcon className="h-3.5 w-3.5" />}>Add day</Button>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Notes for the traveller" optional>{(p) => <Textarea {...p} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What’s included, transport, meals" />}</Field>
          <Field label="Availability" optional>{(p) => <Textarea {...p} rows={3} value={availabilityNote} onChange={(e) => setAvailabilityNote(e.target.value)} />}</Field>
        </div>
      </div>
    </Modal>);

}