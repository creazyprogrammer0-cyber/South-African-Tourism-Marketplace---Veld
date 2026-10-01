import React, { useId } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const control =
'w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-ink-400 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay disabled:bg-sand-50 disabled:text-ink-500';

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (props: {id: string;'aria-invalid'?: boolean;'aria-describedby'?: string;}) => React.ReactNode;
}

/** Wraps a control with label, hint and an accessible error message. */
export function Field({ label, hint, error, optional, className, children }: FieldProps) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-500">(optional)</span>}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint && !error &&
      <p id={`${id}-hint`} className="text-xs text-ink-500">
          {hint}
        </p>
      }
      {error &&
      <p id={`${id}-error`} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      }
    </div>);

}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cn(control, 'h-10', rest['aria-invalid'] ? 'border-danger' : 'border-line', className)} {...rest} />;
});

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, 'min-h-[96px] py-2.5 leading-relaxed', rest['aria-invalid'] ? 'border-danger' : 'border-line', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(control, 'h-10 appearance-none pr-9', rest['aria-invalid'] ? 'border-danger' : 'border-line', className)} {...rest}>
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
    </div>);

}