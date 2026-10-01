import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FlaskConicalIcon, RotateCcwIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { login, logout } from '../../utils/accountService';
import { homeForRole } from '../../utils/permissions';
import { Avatar } from '../ui/Avatar';
import { demoAccounts } from '../../data/demoAccounts';

export function DemoSwitcher() {
  const { currentUser, resetDemo } = useMarketplace();
  const { run } = useAction();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const switchTo = async (userId: string, role: 'traveller' | 'provider' | 'admin', name: string) => {
    setOpen(false);
    const res = await run(login, { userId }, { latency: 150 });
    if (res.ok) {
      toast.success(`Signed in as ${name}`);
      navigate(homeForRole(role));
    }
  };

  return (
    <div ref={ref} className="fixed bottom-20 left-4 z-40 lg:bottom-4">
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="absolute bottom-14 left-0 w-[300px] origin-bottom-left rounded-2xl border border-line bg-surface p-2 shadow-pop"
          role="menu"
          aria-label="Demo accounts">
          
            <p className="px-3 pb-1 pt-2 text-xs font-medium text-ink-500">Switch demo account</p>
            {demoAccounts.map((a) => {
            const active = currentUser?.id === a.userId;
            return (
              <button key={a.userId} role="menuitem" onClick={() => switchTo(a.userId, a.role, a.name)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-sand-50">
                  <Avatar name={a.name} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{a.name}</span>
                    <span className="block truncate text-xs text-ink-500">{a.description}</span>
                  </span>
                  {active && <CheckIcon className="h-4 w-4 text-olive" aria-label="Current account" />}
                </button>);

          })}
            <div className="my-1 border-t border-line" />
            {currentUser &&
          <button
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await run(logout, undefined, { latency: 100 });
              navigate('/');
            }}
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-ink-700 hover:bg-sand-50">
            
                Browse as guest (sign out)
              </button>
          }
            <button
            role="menuitem"
            onClick={() => {
              resetDemo();
              setOpen(false);
              toast.success('Demo data reset to the original seed');
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-ink-700 hover:bg-sand-50">
            
              <RotateCcwIcon className="h-4 w-4" aria-hidden /> Reset demo data
            </button>
          </motion.div>
        }
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-11 items-center gap-2 rounded-full bg-ink pl-3 pr-4 text-sm font-medium text-white shadow-pop transition-transform duration-150 ease-out hover:bg-ink-700 active:scale-[0.97]">
        
        <FlaskConicalIcon className="h-4 w-4" aria-hidden />
        <span>Demo</span>
        {currentUser && <span className="hidden max-w-[120px] truncate text-white/70 sm:inline">· {currentUser.name.split(' ')[0]}</span>}
      </button>
    </div>);

}