import React, { useMemo, useState } from 'react';
import { CalendarDaysIcon, LockIcon, UnlockIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { useAction } from '../../hooks/useAction';
import { addSlots, deleteSlot, updateSlot } from '../../utils/experienceService';
import { futureSlots, slotRemaining } from '../../utils/selectors';
import { dateFromToday, formatDate, toISODate, weekday } from '../../utils/dates';
import { PageHeader } from '../../components/ui/PageHeader';
import { Field, Input, Select } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { cn } from '../../utils/cn';
import type { AvailabilitySlot } from '../../types/marketplace';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ProviderAvailability() {
  const { provider, state } = useCurrentProvider();
  const { run, pending } = useAction();
  const exps = state.experiences.filter((e) => e.providerId === provider?.id);
  const [expId, setExpId] = useState(exps[0]?.id ?? '');
  const [days, setDays] = useState(21);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<AvailabilitySlot | null>(null);
  const [capacity, setCapacity] = useState(0);
  const exp = exps.find((e) => e.id === expId);

  const [range, setRange] = useState({ start: dateFromToday(1), end: dateFromToday(14), weekdays: [0, 1, 2, 3, 4, 5, 6], time: '09:00', capacity: 8 });

  const slots = exp ? futureSlots(state, exp.id) : [];
  const horizon = dateFromToday(days);
  const grouped = useMemo(() => {
    const m = new Map<string, AvailabilitySlot[]>();
    slots.filter((s) => s.date <= horizon).forEach((s) => m.set(s.date, [...(m.get(s.date) ?? []), s]));
    return Array.from(m.entries());
  }, [slots, horizon]);

  if (!provider) return null;
  if (!exps.length) {
    return (
      <div>
        <PageHeader title="Availability" />
        <EmptyState icon={<CalendarDaysIcon className="h-5 w-5" />} title="Create an experience first" message="Availability is managed per experience. Create one to start adding dates and times." action={<Button to="/provider/experiences/new">Create Experience</Button>} />
      </div>);

  }

  const open = slots.filter((s) => s.status === 'open');
  const booked = slots.reduce((a, s) => a + s.bookedCapacity, 0);
  const capacityTotal = open.reduce((a, s) => a + s.capacity, 0);
  const bookingsFor = (slotId: string) => state.bookings.filter((b) => b.slotId === slotId && b.bookingStatus === 'confirmed');

  const submitAdd = async () => {
    const dates: string[] = [];
    const d = new Date(`${range.start}T00:00:00`);
    const end = new Date(`${range.end}T00:00:00`);
    while (d <= end && dates.length < 120) {
      const iso = toISODate(d);
      if (range.weekdays.includes(weekday(iso))) dates.push(iso);
      d.setDate(d.getDate() + 1);
    }
    const res = await run(addSlots, { experienceId: expId, dates, times: [range.time], capacity: range.capacity });
    if (res.ok) {
      setAddOpen(false);
      setDays((x) => Math.max(x, Math.min(60, Math.ceil((end.getTime() - Date.now()) / 864e5) + 1)));
      toast.success(`${res.data} time slot${res.data === 1 ? '' : 's'} added`);
    }
  };

  const saveCapacity = async () => {
    if (!editing) return;
    const res = await run(updateSlot, { slotId: editing.id, capacity }, { success: 'Capacity updated' });
    if (res.ok) setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Availability" description="Add dates, set capacity and block days. Travellers can only book open slots with enough space." actions={<Button onClick={() => {setRange((r) => ({ ...r, capacity: exp?.maxGuests ?? 8, time: exp?.times[0] ?? '09:00' }));setAddOpen(true);}} icon={<PlusIcon className="h-4 w-4" />}>Add dates</Button>} />

      <div className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line/60 md:flex-row md:items-end">
        <Field label="Experience" className="md:w-96">
          {(p) =>
          <Select {...p} value={expId} onChange={(e) => setExpId(e.target.value)}>
              {exps.map((e) => <option key={e.id} value={e.id}>{e.title}{e.status !== 'published' ? ` (${e.status})` : ''}</option>)}
            </Select>
          }
        </Field>
        <dl className="flex flex-1 flex-wrap gap-x-8 gap-y-2 text-sm md:justify-end">
          <div><dt className="text-xs text-ink-500">Open slots</dt><dd className="font-semibold text-ink">{open.length}</dd></div>
          <div><dt className="text-xs text-ink-500">Guests booked</dt><dd className="font-semibold text-ink">{booked}</dd></div>
          <div><dt className="text-xs text-ink-500">Occupancy (next 45 days)</dt><dd className="font-semibold text-ink">{capacityTotal ? Math.round(booked / capacityTotal * 100) : 0}%</dd></div>
          <div><dt className="text-xs text-ink-500">Max per slot</dt><dd className="font-semibold text-ink">{exp?.maxGuests}</dd></div>
        </dl>
      </div>

      <div className="mt-6">
        {grouped.length === 0 ?
        <EmptyState icon={<CalendarDaysIcon className="h-5 w-5" />} title="No upcoming dates" message="Add dates so travellers can book this experience. Unpublished experiences keep their dates but aren’t visible." action={<Button onClick={() => setAddOpen(true)}>Add dates</Button>} /> :

        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60">
            {grouped.map(([date, ds]) =>
          <li key={date} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start">
                <div className="w-36 shrink-0">
                  <p className="text-sm font-semibold text-ink">{formatDate(date, 'EEE d MMM')}</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ds.map((s) => {
                const rem = slotRemaining(s);
                const pct = s.capacity ? s.bookedCapacity / s.capacity * 100 : 0;
                const bks = bookingsFor(s.id);
                return (
                  <div key={s.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <span className="w-14 text-sm font-medium tabular-nums text-ink">{s.time}</span>
                        <div className="flex flex-1 items-center gap-3">
                          {s.status === 'blocked' ?
                      <StatusBadge tone="neutral" label="Blocked" /> :

                      <>
                              <div className="h-2 w-32 overflow-hidden rounded-full bg-sand-100" role="progressbar" aria-valuenow={s.bookedCapacity} aria-valuemax={s.capacity} aria-label={`${s.bookedCapacity} of ${s.capacity} booked`}>
                                <div className={cn('h-full rounded-full', rem === 0 ? 'bg-clay' : 'bg-olive')} style={{ width: `${pct}%` }} />
                              </div>
                              <span className={cn('text-sm', rem === 0 ? 'font-medium text-clay-700' : 'text-ink-600')}>{s.bookedCapacity}/{s.capacity} booked{rem === 0 ? ' · Full' : ''}</span>
                            </>
                      }
                          {bks.length > 0 && <span className="hidden truncate text-xs text-ink-500 lg:inline">{bks.map((b) => `${b.contact.name} (${b.guestCount})`).join(', ')}</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => {setEditing(s);setCapacity(s.capacity);}} disabled={s.status === 'blocked'}>Capacity</Button>
                          <Button size="sm" variant="ghost" loading={false} disabled={pending || s.status === 'open' && s.bookedCapacity > 0} title={s.bookedCapacity > 0 ? 'Slots with bookings can’t be blocked' : undefined} onClick={() => run(updateSlot, { slotId: s.id, status: s.status === 'open' ? 'blocked' : 'open' }, { success: s.status === 'open' ? 'Date blocked' : 'Date reopened' })} icon={s.status === 'open' ? <LockIcon className="h-3.5 w-3.5" /> : <UnlockIcon className="h-3.5 w-3.5" />}>
                            {s.status === 'open' ? 'Block' : 'Unblock'}
                          </Button>
                          <button onClick={() => run(deleteSlot, { slotId: s.id }, { success: 'Time slot removed' })} disabled={s.bookedCapacity > 0 || pending} className="rounded-lg p-2 text-ink-500 hover:bg-danger-bg hover:text-danger disabled:opacity-30 disabled:hover:bg-transparent" aria-label={`Remove ${s.time} on ${date}`}>
                            <Trash2Icon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>);

              })}
                </div>
              </li>
          )}
          </ul>
        }
        {slots.some((s) => s.date > horizon) &&
        <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={() => setDays((d) => d + 21)}>Show later dates</Button>
          </div>
        }
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add available dates" description={exp?.title} footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={submitAdd} loading={pending}>Add dates</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="From">{(p) => <Input {...p} type="date" min={dateFromToday(1)} value={range.start} onChange={(e) => setRange({ ...range, start: e.target.value })} />}</Field>
            <Field label="To">{(p) => <Input {...p} type="date" min={range.start} value={range.end} onChange={(e) => setRange({ ...range, end: e.target.value })} />}</Field>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">On these days</legend>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map((d, i) => {
                const on = range.weekdays.includes(i);
                return <button key={d} type="button" aria-pressed={on} onClick={() => setRange({ ...range, weekdays: on ? range.weekdays.filter((x) => x !== i) : [...range.weekdays, i] })} className={cn('h-8 w-11 rounded-lg border text-xs font-medium', on ? 'border-ink bg-ink text-white' : 'border-line text-ink-700')}>{d}</button>;
              })}
            </div>
          </fieldset>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start time">{(p) => <Input {...p} type="time" value={range.time} onChange={(e) => setRange({ ...range, time: e.target.value })} />}</Field>
            <Field label="Capacity" hint={`Max ${exp?.maxGuests}`}>{(p) => <Input {...p} type="number" min={1} max={exp?.maxGuests} value={range.capacity} onChange={(e) => setRange({ ...range, capacity: Number(e.target.value) })} />}</Field>
          </div>
          <p className="text-xs text-ink-500">Existing dates at the same time are skipped.</p>
        </div>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} size="sm" title="Change capacity" description={editing ? `${formatDate(editing.date)} · ${editing.time}` : ''} footer={<><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={saveCapacity} loading={pending}>Save</Button></>}>
        {editing &&
        <Field label="Guests" hint={`${editing.bookedCapacity} already booked · max ${exp?.maxGuests}`} error={capacity < editing.bookedCapacity ? `Can’t go below ${editing.bookedCapacity} booked guests.` : undefined}>
            {(p) => <Input {...p} type="number" min={Math.max(1, editing.bookedCapacity)} max={exp?.maxGuests} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />}
          </Field>
        }
      </Modal>
    </div>);

}