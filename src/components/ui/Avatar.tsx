import React from 'react';
import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

const palette = ['bg-olive-100 text-olive-700', 'bg-clay-100 text-clay-700', 'bg-sand-200 text-ink-700', 'bg-info-bg text-info'];

export function Avatar({ name, src, size = 'md', className }: {name: string;src?: string;size?: 'sm' | 'md' | 'lg' | 'xl';className?: string;}) {
  const dims = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm', xl: 'h-20 w-20 text-xl' }[size];
  const tone = palette[(name.charCodeAt(0) + name.length) % palette.length];
  if (src && /^(https?:|blob:|data:)/.test(src)) return <img src={src} alt="" className={cn('shrink-0 rounded-full object-cover', dims, className)} />;
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', dims, tone, className)} aria-hidden>
      {initials(name) || '?'}
    </span>);

}