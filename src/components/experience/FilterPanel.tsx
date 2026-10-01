import React from 'react';
import { categories, destinations } from '../../data/catalog';
import { dateFromToday } from '../../utils/dates';
import { durationBuckets, ExperienceFilters, priceOptions } from '../../utils/experienceFilters';
import { Field, Input, Select } from '../ui/FormControls';
import { cn } from '../../utils/cn';

interface FilterPanelProps {
  filters: ExperienceFilters;
  onChange: (patch: Partial<ExperienceFilters>) => void;
}

export function FilterPanel({ filters: f, onChange }: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <Field label="Destination">
        {(p) =>
        <Select {...p} value={f.destination} onChange={(e) => onChange({ destination: e.target.value })}>
            <option value="">All destinations</option>
            {destinations.map((d) =>
          <option key={d.id} value={d.id}>
                {d.name}
              </option>
          )}
          </Select>
        }
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          {(p) => <Input {...p} type="date" min={dateFromToday(1)} value={f.date} onChange={(e) => onChange({ date: e.target.value })} />}
        </Field>
        <Field label="Travellers">
          {(p) =>
          <Select {...p} value={f.guests} onChange={(e) => onChange({ guests: Number(e.target.value) })}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) =>
            <option key={n} value={n}>
                  {n}
                </option>
            )}
            </Select>
          }
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Category</legend>
        <div className="space-y-1">
          {categories.map((c) => {
            const on = f.categories.includes(c.id);
            return (
              <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-ink-700 hover:bg-sand-50">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onChange({ categories: on ? f.categories.filter((x) => x !== c.id) : [...f.categories, c.id] })}
                  className="h-4 w-4 rounded border-line accent-ink" />
                
                {c.name}
              </label>);

          })}
        </div>
      </fieldset>

      <Field label="Price per person">
        {(p) =>
        <Select {...p} value={f.maxPrice} onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}>
            {priceOptions.map((o) =>
          <option key={o.value} value={o.value}>
                {o.label}
              </option>
          )}
          </Select>
        }
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Duration</legend>
        <div className="grid grid-cols-2 gap-2">
          {durationBuckets.map((d) =>
          <button
            key={d.value}
            type="button"
            aria-pressed={f.duration === d.value}
            onClick={() => onChange({ duration: d.value })}
            className={cn('rounded-lg border px-2 py-2 text-xs font-medium transition-colors duration-150 ease-out', f.duration === d.value ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink-700 hover:border-ink-400')}>
            
              {d.label}
            </button>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Guest rating</legend>
        <div className="flex gap-2">
          {[
          { v: 0, l: 'Any' },
          { v: 4, l: '4.0+' },
          { v: 4.5, l: '4.5+' },
          { v: 4.8, l: '4.8+' }].
          map((r) =>
          <button
            key={r.v}
            type="button"
            aria-pressed={f.minRating === r.v}
            onClick={() => onChange({ minRating: r.v })}
            className={cn('flex-1 rounded-lg border py-2 text-xs font-medium transition-colors duration-150 ease-out', f.minRating === r.v ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink-700 hover:border-ink-400')}>
            
              {r.l}
            </button>
          )}
        </div>
      </fieldset>
    </div>);

}