import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, GridIcon } from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';
import { Modal } from '../ui/Modal';

export function Gallery({ images, title }: {images: string[];title: string;}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  if (!images.length) return <SafeImage alt={title} className="aspect-[16/9] w-full rounded-2xl" />;
  const [main, ...rest] = images;
  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  return (
    <>
      <div className="relative grid gap-2 overflow-hidden rounded-2xl md:grid-cols-[2fr_1fr] md:grid-rows-2" style={{ maxHeight: 460 }}>
        <button onClick={() => show(0)} className="relative aspect-[16/10] md:row-span-2 md:aspect-auto md:h-[460px]" aria-label="Open photo 1">
          <SafeImage src={main} alt={title} className="h-full w-full" />
        </button>
        {rest.slice(0, 2).map((src, i) =>
        <button key={src + i} onClick={() => show(i + 1)} className="relative hidden h-[226px] md:block" aria-label={`Open photo ${i + 2}`}>
            <SafeImage src={src} alt="" className="h-full w-full" />
          </button>
        )}
        <button onClick={() => show(0)} className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-surface/95 px-3 py-1.5 text-xs font-medium text-ink shadow-card hover:bg-surface">
          <GridIcon className="h-3.5 w-3.5" aria-hidden /> {images.length} photo{images.length > 1 ? 's' : ''}
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={`${title} · photo ${index + 1} of ${images.length}`} size="lg">
        <div className="relative">
          <SafeImage src={images[index]} alt={`${title}, photo ${index + 1}`} className="aspect-[4/3] w-full rounded-xl" />
          {images.length > 1 &&
          <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
              <button onClick={() => setIndex((index - 1 + images.length) % images.length)} className="rounded-full bg-surface/95 p-2 shadow-card" aria-label="Previous photo">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button onClick={() => setIndex((index + 1) % images.length)} className="rounded-full bg-surface/95 p-2 shadow-card" aria-label="Next photo">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          }
        </div>
      </Modal>
    </>);

}