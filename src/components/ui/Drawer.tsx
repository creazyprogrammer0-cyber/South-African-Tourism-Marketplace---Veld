import React, { useId } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { useDialogBehaviour } from './Modal';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Side panel on desktop, bottom sheet on mobile. */
export function Drawer({ open, onClose, title, subtitle, children, footer }: DrawerProps) {
  const id = useId();
  const panelRef = useDialogBehaviour(open, onClose);
  return createPortal(
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} aria-hidden />
          <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-surface shadow-pop md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[480px] md:rounded-none md:rounded-l-2xl">
          
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-sand-300 md:hidden" aria-hidden />
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
              <div className="min-w-0">
                <h2 id={`${id}-title`} className="truncate text-base font-semibold text-ink">
                  {title}
                </h2>
                {subtitle && <div className="mt-1 text-sm text-ink-500">{subtitle}</div>}
              </div>
              <button data-close onClick={onClose} className="-mr-2 rounded-lg p-2 text-ink-500 hover:bg-sand-100 hover:text-ink" aria-label="Close panel">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}