import React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChipGroupProps {
  label: string;
  options: {value: string;label: string;}[];
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
  single?: boolean;
}

/** Accessible multi- or single-select chip set. */
export function ChipGroup({ label, options, value, onChange, error, single }: ChipGroupProps) {
  const toggle = (v: string) => {
    if (single) onChange([v]);else
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 ease-out',
                on ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink-700 hover:border-ink-400'
              )}>
              
              {on && <CheckIcon className="h-3.5 w-3.5" aria-hidden />}
              {o.label}
            </button>);

        })}
      </div>
      {error &&
      <p className="mt-1.5 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      }
    </fieldset>);

}