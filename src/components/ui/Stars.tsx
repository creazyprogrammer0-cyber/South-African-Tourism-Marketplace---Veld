import React from 'react';
import { StarIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Stars({ value, size = 'sm' }: {value: number;size?: 'sm' | 'md';}) {
  const dim = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) =>
      <StarIcon key={i} className={cn(dim, i <= Math.round(value) ? 'fill-clay text-clay' : 'fill-sand-200 text-sand-200')} aria-hidden />
      )}
    </span>);

}

export function StarInput({ value, onChange, error }: {value: number;onChange: (v: number) => void;error?: boolean;}) {
  const labels = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
  return (
    <div role="radiogroup" aria-label="Rating" aria-invalid={error || undefined} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) =>
      <button
        key={i}
        type="button"
        role="radio"
        aria-checked={value === i}
        aria-label={`${i} star${i > 1 ? 's' : ''} — ${labels[i - 1]}`}
        onClick={() => onChange(i)}
        className="rounded-md p-1 transition-transform duration-100 ease-out active:scale-90">
        
          <StarIcon className={cn('h-7 w-7', i <= value ? 'fill-clay text-clay' : 'fill-transparent text-sand-300')} aria-hidden />
        </button>
      )}
      {value > 0 && <span className="ml-2 text-sm text-ink-600">{labels[value - 1]}</span>}
    </div>);

}