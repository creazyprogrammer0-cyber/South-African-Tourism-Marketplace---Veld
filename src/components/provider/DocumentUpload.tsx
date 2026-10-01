import React, { useRef, useState } from 'react';
import { FileTextIcon, UploadIcon, XIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import type { DocumentType, VerificationDocument } from '../../types/marketplace';
import { simulatedDocument } from '../../utils/providerService';

const MAX_MB = 10;
const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png'];

/** Simulated secure document upload with client-side type/size validation. */
export function DocumentUpload({ type, label, hint, required, doc, onChange, error }: {type: DocumentType;label: string;hint: string;required: boolean;doc?: VerificationDocument;onChange: (d: VerificationDocument | null) => void;error?: string;}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const attach = (fileName: string, sizeKb: number) => {
    setBusy(true);
    setTimeout(() => {
      onChange(simulatedDocument(type, fileName, sizeKb));
      setBusy(false);
    }, 800);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!ACCEPT.includes(f.type)) return toast.error('Upload a PDF, JPG or PNG file.');
    if (f.size > MAX_MB * 1024 * 1024) return toast.error(`Files must be under ${MAX_MB} MB.`);
    attach(f.name.replace(/[^\w.\- ]/g, ''), Math.round(f.size / 1024));
  };

  return (
    <div className={`rounded-xl border p-4 ${error ? 'border-danger' : 'border-line'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">{label} {!required && <span className="font-normal text-ink-500">(optional)</span>}</p>
          <p className="text-xs text-ink-500">{hint}</p>
        </div>
        {doc ?
        <div className="flex items-center gap-2 rounded-lg bg-sand-50 px-3 py-2 text-sm">
            <FileTextIcon className="h-4 w-4 text-olive" aria-hidden />
            <span className="max-w-[180px] truncate text-ink">{doc.fileName}</span>
            <span className="text-xs text-ink-500">{doc.sizeKb} KB</span>
            <button type="button" onClick={() => onChange(null)} className="rounded p-1 text-ink-500 hover:text-danger" aria-label={`Remove ${label}`}>
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div> :

        <div className="flex gap-2">
            <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink-700 hover:border-ink-400 disabled:opacity-60">
              {busy ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : <UploadIcon className="h-4 w-4" aria-hidden />} {busy ? 'Uploading…' : 'Choose file'}
            </button>
            <button type="button" onClick={() => attach(`${type.replace('_', '-')}.pdf`, 640)} disabled={busy} className="rounded-lg px-3 py-2 text-xs font-medium text-clay hover:bg-clay-50 disabled:opacity-60">
              Simulate upload
            </button>
          </div>
        }
        <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={onFile} tabIndex={-1} aria-hidden />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-danger" role="alert">{error}</p>}
    </div>);

}