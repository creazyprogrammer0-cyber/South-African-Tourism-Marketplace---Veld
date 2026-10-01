import React, { useState } from 'react';
import { MountainIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/** Image with a graceful fallback for missing or broken sources. */
export function SafeImage({ src, alt, className }: {src?: string;alt: string;className?: string;}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cn('flex items-center justify-center bg-sand-100 text-ink-400', className)} role="img" aria-label={alt || 'No image available'}>
        <MountainIcon className="h-8 w-8" aria-hidden />
      </div>);

  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn('object-cover', className)} />;
}