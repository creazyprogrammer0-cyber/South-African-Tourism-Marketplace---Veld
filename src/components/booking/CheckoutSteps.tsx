import React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const steps = ['Review', 'Payment', 'Confirmation'];

export function CheckoutSteps({ current }: {current: number;}) {
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Checkout progress">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold', done ? 'bg-olive text-white' : active ? 'bg-ink text-white' : 'bg-sand-200 text-ink-600')}>
              {done ? <CheckIcon className="h-3.5 w-3.5" aria-hidden /> : i + 1}
            </span>
            <span className={cn('font-medium', active ? 'text-ink' : 'text-ink-500', !active && 'hidden sm:inline')}>{s}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-line sm:w-10" aria-hidden />}
          </li>);

      })}
    </ol>);

}