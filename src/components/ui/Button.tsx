import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  to?: string;
  icon?: React.ReactNode;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-700 disabled:bg-ink-400',
  accent: 'bg-clay text-white hover:bg-clay-700 disabled:bg-clay/50',
  secondary: 'bg-surface text-ink border border-line hover:border-ink-400 hover:bg-sand-50 disabled:text-ink-400',
  ghost: 'text-ink-700 hover:bg-sand-100 disabled:text-ink-400',
  danger: 'bg-danger text-white hover:bg-[#8a2c22] disabled:opacity-50',
  link: 'text-clay underline-offset-4 hover:underline px-0 h-auto'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-xl'
};

export function Button({ variant = 'primary', size = 'md', loading, to, icon, block, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center whitespace-nowrap font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out disabled:cursor-not-allowed active:scale-[0.98]',
    variants[variant],
    variant !== 'link' && sizes[size],
    variant === 'link' && 'text-sm font-medium',
    block && 'w-full',
    className
  );
  const content =
  <>
      {loading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </>;

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>);

  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>);

}