import React, { useRef, useState } from 'react';
import { UploadIcon, XIcon, CheckIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { imageLibrary } from '../../data/catalog';
import { cn } from '../../utils/cn';

const MAX_MB = 5;

/** Simulated image upload: validates type/size, then attaches. Also offers a stock library. */
export function ImagePicker({ value, onChange, error }: {value: string[];onChange: (v: string[]) => void;error?: string;}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return toast.error('Use a JPG, PNG or WebP image.');
    if (file.size > MAX_MB * 1024 * 1024) return toast.error(`Images must be under ${MAX_MB} MB.`);
    setUploading(true);
    setTimeout(() => {
      onChange([...value, URL.createObjectURL(file)]);
      setUploading(false);
      toast.success('Photo uploaded (stored for this session only in the prototype)');
    }, 900);
  };

  const toggle = (src: string) => onChange(value.includes(src) ? value.filter((x) => x !== src) : [...value, src]);

  return (
    <div>
      <p className="text-sm font-medium text-ink">Photos</p>
      <p className="text-xs text-ink-500">The first photo is your cover image. Add at least one before publishing.</p>
      {value.length > 0 &&
      <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((src, i) =>
        <li key={src} className="relative">
              <img src={src} alt={`Selected photo ${i + 1}`} className="h-20 w-28 rounded-lg object-cover" />
              {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 text-[10px] font-medium text-white">Cover</span>}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== src))} className="absolute -right-1.5 -top-1.5 rounded-full bg-surface p-1 shadow-card ring-1 ring-line" aria-label={`Remove photo ${i + 1}`}>
                <XIcon className="h-3 w-3" />
              </button>
            </li>
        )}
        </ul>
      }
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg border border-dashed border-sand-300 bg-sand-50 px-4 py-2.5 text-sm font-medium text-ink-700 hover:border-ink-400 disabled:opacity-60">
          {uploading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : <UploadIcon className="h-4 w-4" aria-hidden />}
          {uploading ? 'Uploading…' : 'Upload photo'}
        </button>
        <span className="text-xs text-ink-500">JPG, PNG or WebP · max {MAX_MB} MB</span>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} tabIndex={-1} aria-hidden />
      </div>
      <p className="mt-4 text-xs font-medium text-ink-600">Or choose from the Veld photo library</p>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {imageLibrary.map((src) => {
          const on = value.includes(src);
          return (
            <button key={src} type="button" onClick={() => toggle(src)} aria-pressed={on} className={cn('relative overflow-hidden rounded-lg ring-2 transition-[box-shadow] duration-150 ease-out', on ? 'ring-ink' : 'ring-transparent hover:ring-sand-300')} aria-label={on ? 'Remove library photo' : 'Add library photo'}>
              <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
              {on && <span className="absolute right-1 top-1 rounded-full bg-ink p-0.5 text-white"><CheckIcon className="h-3 w-3" aria-hidden /></span>}
            </button>);

        })}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger" role="alert">{error}</p>}
    </div>);

}